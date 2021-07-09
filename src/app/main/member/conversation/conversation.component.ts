import { Component, OnInit, ViewEncapsulation, NgZone, Injector, OnDestroy } from '@angular/core';
import { ChatService } from '@app/service/chat.service';
import { CookieService } from 'ngx-cookie-service';
import { ContactMember } from '@app/model/contact_member';
import { DataShareService } from '@app/service/data-share.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberComponent } from '../member.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConversationComponent implements OnInit, OnDestroy {

  public token: string;
  public allContactlist: ContactMember[] = [];
  public onlineContacts: ContactMember[] = [];
  public unreadContacts: ContactMember[] = [];
  public requestContacts: ContactMember[] = [];
  public filterAllContactlist: ContactMember[] = [];
  public filterOnlineContacts: ContactMember[] = [];
  public filterUnreadContacts: ContactMember[] = [];
  public filterRequestContacts: ContactMember[] = [];
  public selectedMember: ContactMember;
  public unreadCount: number = 0;
  public searchKey: string = ""
  public selectedTab: string = "all";
  public contactSubscription: Subscription;
  public roomChangeSubscription: Subscription;
  public selectedProfileId: number;

  constructor(
    private cookieService: CookieService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private dataShareService: DataShareService,
    private router: Router,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
  ) {
    this.token = this.cookieService.get('LunonaToken');
    this.getMemberLists();
    this.getRoomChangeStatus();
    this.updateContact();
    this.activatedRoute.url.subscribe(url => {
      if (url.length > 1) {
        this.selectedProfileId = parseInt(url[1].path, 10);
        this.checkActive(this.selectedProfileId);
        this.getMemberByProfileID(this.selectedProfileId);
      } else {
        this.selectedProfileId = null;
        this.checkActive(this.selectedProfileId);
      }
    })
  }

  ngOnInit(): void {
    this.getUnreadCount();
  }

  /** get profile information by profile ID */
  public getMemberByProfileID(profileID: number): void {
    this.selectedMember = this.allContactlist.filter(item => {
      return (item.ProfileID === profileID);
    })[0];
  }

  /** update contact */
  public updateContact(): void {
    this.chatService.updateContact.subscribe((res) => {
      this.ngZone.run(() => {
        if (res.Status === 'L') {
        } else {
          this.filterAllContactlist = this.allContactlist = this.allContactlist.map(item => {
            if (item.Room === res.Room) {
              item.Status = res.Status;
            }
            return item;
          });
          this.filterUnreadContacts = this.unreadContacts = this.unreadContacts.map(item => {
            if (item.Room === res.Room) {
              item.Status = res.Status;
            }
            return item;
          });
          this.filterOnlineContacts = this.onlineContacts = this.onlineContacts.map(item => {
            if (item.Room === res.Room) {
              item.Status = res.Status;
            }
            return item;
          });
          this.filterRequestContacts = this.requestContacts = this.onlineContacts.map(item => {
            if (item.Room === res.Room) {
              item.Status = res.Status;
            }
            return item;
          });
        }
      });
    });
  }

  /** get unread count */
  public getUnreadCount(): void {
    this.dataShareService.unreadCount.subscribe((res) => {
      this.ngZone.run(() => {
        this.unreadCount = res;
      })
    });
  }

  /** subscrbe to events */
  private getMemberLists(): void {
    this.dataShareService.contactlist.subscribe((contactlist: ContactMember[]) => {
      this.ngZone.run(() => {
        if (this.selectedProfileId) {
          contactlist = contactlist.map(item => {
            item.active = item.ProfileID === this.selectedProfileId;
            return item;
          });
        }
        this.filterAllContactlist = this.allContactlist = contactlist;
        this.filterOnlineContacts = this.onlineContacts = this.allContactlist.filter(item => {
          return (item.IsOnLine === 1);
        });
        this.filterUnreadContacts = this.unreadContacts = this.allContactlist.filter(item => {
          return (item.NewMessages > 0);
        });
        this.filterRequestContacts = this.requestContacts = this.allContactlist.filter(item => {
          return (item.Status === "R");
        });
      })
    });
  }

  /** get Room change status */
  public getRoomChangeStatus(): void {
    this.contactSubscription = this.chatService.contactMemberUpdate.subscribe((res) => {
      this.ngZone.run(() => {
        if (res.ContactID !== this.selectedMember.ContactID) {
          this.unreadCount += 1;
          this.dataShareService.setUnreadCount(this.unreadCount);
          this.filterAllContactlist = this.allContactlist = this.allContactlist.map(item => {
            if (item.Room === res.Room) {
              item.NewMessages += 1;
            }
            return item;
          });
          this.filterUnreadContacts = this.unreadContacts = this.allContactlist.filter(item => {
            return (item.NewMessages > 0);
          });
        } else {
          this.sendReadMeMessage(this.selectedMember);
        }
      });
    });
    this.roomChangeSubscription = this.chatService.roomChangestatus.subscribe((res) => {
      this.ngZone.run(() => {
        this.filterAllContactlist = this.allContactlist = this.allContactlist.map(item => {
          if (item.Room === res.Room) {
            this.unreadCount -= item.NewMessages;
            this.dataShareService.setUnreadCount(this.unreadCount);
            item.NewMessages = 0;
          }
          return item;
        });
      });
    });
  }

  /** ngOnDestroy */
  ngOnDestroy(): void {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }
    if (this.roomChangeSubscription) {
      this.roomChangeSubscription.unsubscribe();
    }
  }

  /** select member */
  public selectMember(member: ContactMember): void {
    let memberComponent = this.injector.get(MemberComponent);
    memberComponent.selectMember(member);
    if (member.NewMessages > 0) {
      this.sendReadMeMessage(member);
      this.sendActRoom(member);
    }
    this.checkActive(member.ProfileID);
  }
  
  /** right click select member */
  public checkActive(ProfileID: number): void {
    this.filterAllContactlist = this.allContactlist = this.allContactlist.map(item => {
      item.active = ProfileID === item.ProfileID;
      return item;
    });
    this.filterOnlineContacts = this.onlineContacts = this.onlineContacts.map(item => {
      item.active = ProfileID === item.ProfileID;
      return item;
    });
    this.filterUnreadContacts = this.unreadContacts = this.unreadContacts.map(item => {
      item.active = ProfileID === item.ProfileID;
      return item;
    });
    this.filterRequestContacts = this.requestContacts = this.requestContacts.map(item => {
      item.active = ProfileID === item.ProfileID;
      return item;
    });
  }

  /** send Read Me message request */
  public sendReadMeMessage(member: ContactMember): void {
    this.chatService.sendReadMeMessage(this.token, member.ProfileID, member.Room);
  }

  /** send ActRoom message request */
  public sendActRoom(member: ContactMember): void {
    this.chatService.sendActRoom(this.token, member.Room);
  }

  /** search member by keyword */
  public searchMember(): void {
    this.filterAllContactlist = this.allContactlist.filter(item => {
      return item.LoginName.toLowerCase().includes(this.searchKey.toLowerCase());
    });
    this.filterOnlineContacts = this.onlineContacts.filter(item => {
      return item.LoginName.toLowerCase().includes(this.searchKey.toLowerCase());
    });
    this.filterUnreadContacts = this.unreadContacts.filter(item => {
      return item.LoginName.toLowerCase().includes(this.searchKey.toLowerCase());
    });
    this.filterRequestContacts = this.requestContacts.filter(item => {
      return item.LoginName.toLowerCase().includes(this.searchKey.toLowerCase());
    });
  }

  /** clear search */
  public clearSearch(): void {
    this.searchKey = "";
    this.searchMember();
  }
}
