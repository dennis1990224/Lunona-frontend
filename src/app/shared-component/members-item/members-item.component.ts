import { Component, OnInit, ViewEncapsulation, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { MemberItem } from '@app/model/member_item';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { MaleProfileRateModalComponent } from '@app/modal-component/male-profile-rate-modal/male-profile-rate-modal.component';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatModalComponent } from '@app/modal-component/chat-modal/chat-modal.component';
import { MemberProfileModalComponent } from '@app/modal-component/member-profile-modal/member-profile-modal.component';
import { ConfirmWinkModalComponent } from '@app/modal-component/confirm-wink-modal/confirm-wink-modal.component';
import { ChatService } from '@app/service/chat.service';
import { Subscription } from 'rxjs';
import { ChatMessage } from '@app/model/chat_message';
import { DataShareService } from '@app/service/data-share.service';
import { ConversationService } from '@app/service/conversation.service';
import { SocialStatusModalComponent } from '@app/modal-component/social-status-modal/social-status-modal.component';
import { Router } from '@angular/router';
import { ConfirmUnblockModalComponent } from '@app/modal-component/confirm-unblock-modal/confirm-unblock-modal.component';

@Component({
  selector: 'app-members-item',
  templateUrl: './members-item.component.html',
  styleUrls: ['./members-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MembersItemComponent implements OnInit {

  @Input() public profile: MemberItem;
  @Input() public isBlock: boolean;

  @Output() public checkData: EventEmitter<boolean> = new EventEmitter<boolean>();

  public serverUrl: string;
  public isPin: boolean;
  public token: string;
  public newMessageSubScription: Subscription;
  public isMessage: boolean = false;
  public rateResult: string = "";

  constructor(
    private dialog: MatDialog,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private convService: ConversationService,
    private router: Router,
  ) {
    this.serverUrl = environment.serverUrl;
    this.token = this.cookieService.get('LunonaToken');
  }

  ngOnInit(): void {
    this.subscribeNewMessage();
  }

  /** get profile basic info again */
  public getProfileInfo(): void {
    this.convService.getPreviewProfileBasic(this.token, this.profile.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profile = res.Data;
          this.checkRate();
          console.log(this.profile)
        }
      });
  }

  /** ngOnChange */
  public ngOnChanges(): void {
    if (this.profile !== undefined) {
      if (this.profile.LastMessageAgo !== "") {
        this.isMessage = true;
      }
      this.checkRate();
    }
  }

  /** check rate */
  public checkRate(): void {
    switch (this.profile.Rate) {
      case 1:
        this.rateResult = "Ugly";
        break;
      case 2:
        this.rateResult = "Meh...Boring";
        break;
      case 3:
        this.rateResult = "So-So";
        break;
      case 4:
        this.rateResult = "Good";
        break;
      case 5:
        this.rateResult = "Hot";
        break;
      case 6:
        this.rateResult = "Ideal";
        break;
    }
  }

  /** get wink response */
  public subscribeNewMessage(): void {
    this.newMessageSubScription = this.chatService.newMessage.subscribe((newMessage: ChatMessage) => {
      this.ngZone.run(() => {
        if (newMessage.LoginNameTO === this.profile.LoginName) {
          this.profile.Winked = true;
        }
      });
    });
  }

  /** open rate modal */
  public openRate(profile: MemberItem): void {
    const dialogRef = this.dialog.open(MaleProfileRateModalComponent, {
      data: profile,
      panelClass: 'rate-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        console.log("here");
        this.getProfileInfo();
      }
    })
  }

  /** open chat modal */
  public openChat(profile: MemberItem): void {
    const dialogRef = this.dialog.open(ChatModalComponent, {
      data: profile,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getProfileInfo();
        console.log("here chat modal close result");
      }
    })
  }

  /** update pin informatino by click pin icon */
  public updatePin(): void {
    this.myProfileService.updatePinInfo(this.token, this.profile.ProfileID)
      .subscribe((res) => {
        if (res === "OK") {
          this.getProfileInfo();
        }
      });
  }

  /** open profile preveiw modal */
  public openProfileViewModal(): void {
    const dialogRef = this.dialog.open(MemberProfileModalComponent, {
      data: this.profile,
      panelClass: 'member-profile-modal',
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  /** unblock this user */
  public unblock(): void {
    const dialogRef = this.dialog.open(ConfirmUnblockModalComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.chatService.unblockMember(this.token, this.profile.LoginName);
        this.checkData.emit();
      }
    });
  }

  /** send wink to member */
  public sendWink(): void {
    console.log(this.profile)
    if (this.profile.Winked) {
      const dialogRef = this.dialog.open(ConfirmWinkModalComponent, {
        data: this.profile,
        panelClass: 'custom-modalbox'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === "success") {
          this.getProfileInfo();
        }
      })
    } else {
      this.chatService.sendWink(this.token, this.profile, this.profile.LoginName);
      this.getProfileInfo();
    }
  }

  /** open social status modal */
  public openSocialStatus(): void {
    const dialogRef = this.dialog.open(SocialStatusModalComponent, {
      data: this.profile,
      panelClass: 'rate-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getProfileInfo();
      }
    });
  }

  /** go to preview profile on the new tab */
  public goToProfileNewTab(): void {
    const url = this.router.createUrlTree(["member/view-profile", this.profile.LoginName]);
    console.log(url)
    window.open(url.toString(), '_blank');
  }
}
