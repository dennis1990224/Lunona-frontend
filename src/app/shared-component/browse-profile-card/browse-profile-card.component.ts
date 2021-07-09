import { Component, OnInit, Input, OnDestroy, NgZone } from '@angular/core';
import { environment } from '@env/environment';
import { MemberItem } from '@app/model/member_item';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileRateModalComponent } from '@app/modal-component/male-profile-rate-modal/male-profile-rate-modal.component';
import { ChatModalComponent } from '@app/modal-component/chat-modal/chat-modal.component';
import { MemberProfileModalComponent } from '@app/modal-component/member-profile-modal/member-profile-modal.component';
import { ChatService } from '@app/service/chat.service';
import { ChatMessage } from '@app/model/chat_message';
import { Subscription } from 'rxjs';
import { ConfirmWinkModalComponent } from '@app/modal-component/confirm-wink-modal/confirm-wink-modal.component';

@Component({
  selector: 'app-browse-profile-card',
  templateUrl: './browse-profile-card.component.html',
  styleUrls: ['./browse-profile-card.component.scss']
})
export class BrowseProfileCardComponent implements OnInit, OnDestroy {

  @Input() public profile: MemberItem;

  public isOne: boolean = false;
  public serverUrl: string = environment.serverUrl;
  public imgUrl: string;
  public isLoad: boolean = false;
  public token: string;
  public userName: string;
  public newMessageSubScription: Subscription;
  public defaultUrl: string = "assets/img-2/conversation/default-Women.png";

  constructor(
    private dialog: MatDialog,
    private cookieService: CookieService,
    private chatService: ChatService,
    private ngZone: NgZone
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get("UserName");
  }

  ngOnInit(): void {
    this.subscribeNewMessage();
  }

  ngOnDestroy(): void {
    this.newMessageSubScription.unsubscribe();
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

  /** ngOnChanges function (get profile Information) */
  public ngOnChanges(): void {
    if (this.profile !== undefined) {
      this.imgUrl = `${this.serverUrl}/${this.profile.ProfilePhotoBase}`;
    }
  }

  /** update image path to default image Url when image not loaded */
  public updateUrl(): void {
    this.imgUrl = this.defaultUrl;
  }

  /** change style when mouse hover on the card */
  public changeStyle($event): void {
    if ($event.type === "mouseenter") {
      this.isOne = true;
    }
    if ($event.type === "mouseleave") {
      this.isOne = false;
    }
  }

  /** rate this member */
  public rateMember(): void {
    const dialogRef = this.dialog.open(MaleProfileRateModalComponent, {
      data: this.profile,
      panelClass: 'rate-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        console.log("rate modal closed: success");
      }
    })
  }

  /** send wink to member */
  public sendWink(): void {
    console.log(this.profile);
    if (this.profile.Winked) {
      const dialogRef = this.dialog.open(ConfirmWinkModalComponent, {
        data: this.profile,
        panelClass: 'custom-modalbox'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === "success") {
          console.log("confirm wink modal closed: success");
        }
      })
    } else {
      this.chatService.sendWink(this.token, this.profile, this.userName);
    }
  }

  /** open Chat modal */
  public openChat(): void {
    const dialogRef = this.dialog.open(ChatModalComponent, {
      data: this.profile,
      panelClass: 'custom-chat-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        console.log("here chat modal close result");
      }
    })
  }

  /** view profile by click the view profile */
  public viewProfile(): void {
    const dialogRef = this.dialog.open(MemberProfileModalComponent, {
      data: this.profile,
      panelClass: 'member-profile-modal',
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
