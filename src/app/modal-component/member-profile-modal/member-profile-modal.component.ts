import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MemberItem } from '@app/model/member_item';
import { ConversationService } from '@app/service/conversation.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';
import { environment } from '@env/environment';
import { PreviewImageModalComponent } from '../preview-image-modal/preview-image-modal.component';
import { MaleProfileRateModalComponent } from '../male-profile-rate-modal/male-profile-rate-modal.component';
import { ChatService } from '@app/service/chat.service';
import { ConfirmWinkModalComponent } from '../confirm-wink-modal/confirm-wink-modal.component';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';
import { BlockUserModalComponent } from '../block-user-modal/block-user-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-profile-modal',
  templateUrl: './member-profile-modal.component.html',
  styleUrls: ['./member-profile-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberProfileModalComponent implements OnInit {

  public token: string;
  public selectedTabIndex: string;
  public preselectTab: number = 1;
  public frames: any[];
  public profileInfo: any;
  public aboutYouInfo: any[] = [];
  public lookingForInfo: any[] = [];
  public serverUrl: string = environment.serverUrl;
  public publicImages: any[] = [];
  public privateImages: any[] = [];
  public spicyImages: any[] = [];
  public chillyImages: any[] = [];
  public userName: string;
  public rate: string;
  public isMessage: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MemberProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberItem,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private convService: ConversationService,
    private dialog: MatDialog,
    private chatService: ChatService,
    private router: Router,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get("UserName");
  }

  ngOnInit(): void {
    this.getMemberBasicInfo(this.data);
    this.getPreviewProfileInfo(this.data);

  }

  /** get index when tab change */
  public onTabChanged($event): void {
    switch ($event.index) {
      case 0:
        this.selectedTabIndex = "first-tab"
        break;
      case 1:
        this.selectedTabIndex = "second-tab"
        break;
      case 2:
        this.selectedTabIndex = "third-tab"
        break;
      case 3:
        this.selectedTabIndex = "fourth-tab"
        break;
      case 4:
        this.selectedTabIndex = "fivth-tab"
        break;
      case 5:
        this.selectedTabIndex = "sixth-tab"
        break;
      case 6:
        this.selectedTabIndex = "seventh-tab"
        break;
    }
  }

  /** get member basic info */
  public getMemberBasicInfo(profile: MemberItem): void {
    this.convService.getPreviewProfileBasic(this.token, profile.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileInfo = res.Data;
          if (!this.profileInfo.ProfilePhotoBase.includes("http")) {
            this.profileInfo.ProfilePhotoBase = `https://lunona.com${this.profileInfo.ProfilePhotoBase}`;
          }
          if (this.profileInfo.LastMessageAgo !== "") {
            this.isMessage = true;
          }
          this.getImagesByCategory(this.profileInfo);
          this.getRate(this.profileInfo);
          console.log("here is the profile information", this.profileInfo)
        }
      });
  }

  /** get Rate */
  public getRate(profileInfo: any): void {
    switch (profileInfo.Rate) {
      case 0:
        this.rate = "Rate me";
        break;
      case 1:
        this.rate = "Ugly";
        break;
      case 2:
        this.rate = "Meh...Boring";
        break;
      case 3:
        this.rate = "So-So";
        break;
      case 4:
        this.rate = "Good";
        break;
      case 5:
        this.rate = "Hot";
        break;
      case 6:
        this.rate = "Ideal";
        break;
    }
  }

  /** get images by category */
  public getImagesByCategory(profileInfo: any): void {
    this.publicImages = [];
    this.privateImages = [];
    this.spicyImages = [];
    this.chillyImages = [];
    for (const item of profileInfo.ProfilePhotos) {
      switch (item["CategoryID"]) {
        case 0:
          if (!item.MediaURL.includes("http")) {
            item.MediaURL = `https://lunona.com${item.MediaURL}`;
          }
          this.publicImages.push(item);
          break;
        case 10:
          if (!item.MediaURL.includes("http")) {
            item.MediaURL = `https://lunona.com${item.MediaURL}`;
          }
          this.privateImages.push(item);
          break;
        case 20:
          if (!item.MediaURL.includes("http")) {
            item.MediaURL = `https://lunona.com${item.MediaURL}`;
          }
          this.spicyImages.push(item);
          break;
        case 30:
          if (!item.MediaURL.includes("http")) {
            item.MediaURL = `https://lunona.com${item.MediaURL}`;
          }
          this.chillyImages.push(item);
          break;
      }
    }
  }

  /** get preview profile information */
  public getPreviewProfileInfo(profile: MemberItem): void {
    this.convService.getPreviewProfileInfo(this.token, profile.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.frames = res.Data["Frames"];
          console.log(this.frames)
          this.getAboutYouData(this.frames);
          this.getLookingForData(this.frames);
        }
      });
  }

  /** get aboutyou data */
  public getAboutYouData(frames: any[]): void {
    const Frames: any[] = frames.find(item => item.FrameKEY == "ABOUTYOU")["Items"];
    const middleFrames: any[] = Frames.filter(frame => frame.Key !== "Location");
    const fromFrmaes = from(middleFrames);
    const observableFrame = fromFrmaes.pipe(
      groupBy(category => category["CategoryOrder"]),
      mergeMap(group => group.pipe(toArray()))
    )
    const getting = observableFrame.subscribe(val => {
      this.aboutYouInfo.push(val.sort((a, b) => a["SortOrder"] > b["SortOrder"] ? 1 : -1));
    });
  }

  /** get looking for data */
  public getLookingForData(frames: any[]): void {
    const middleFrames: any[] = frames.find(item => item.FrameKEY == "LOOKING_FOR")["Items"];
    const fromFrmaes = from(middleFrames);
    const observableFrame = fromFrmaes.pipe(
      groupBy(category => category["CategoryOrder"]),
      mergeMap(group => group.pipe(toArray()))
    )
    const getting = observableFrame.subscribe(val => {
      this.lookingForInfo.push(val);
    });
    console.log("here is the lookingfor info", this.lookingForInfo);
  }

  /** open preview image modal when phtot click */
  public openPreviewImage(images: any[], category: string, index: number): void {
    if (images[index].YouHaveAccess) {
      const dialogRef = this.dialog.open(PreviewImageModalComponent, {
        data: {
          images: images,
          category: category,
          index: index
        },
        panelClass: 'preview-image-modalbox'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("preview image close result");
      });
    }
  }

  /** rate this member */
  public rateMember(): void {
    const dialogRef = this.dialog.open(MaleProfileRateModalComponent, {
      data: this.data,
      panelClass: 'rate-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMemberBasicInfo(this.data);
        console.log("rate modal closed: success");
      }
    })
  }

  /** send wink to member */
  public sendWink(): void {
    if (this.data.Winked) {
      const dialogRef = this.dialog.open(ConfirmWinkModalComponent, {
        data: this.data,
        panelClass: 'custom-modalbox'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === "success") {
          this.getMemberBasicInfo(this.data);
        }
      })
    } else {
      this.chatService.sendWink(this.token, this.data, this.userName);
    }
  }

  /** open Chat modal */
  public openChat(): void {
    const dialogRef = this.dialog.open(ChatModalComponent, {
      data: this.data,
      panelClass: 'custom-chat-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMemberBasicInfo(this.data);
      }
    })
  }

  /** update pin informatino by click pin icon */
  public updatePin(): void {
    this.myProfileService.updatePinInfo(this.token, this.data.ProfileID)
      .subscribe((res) => {
        if (res === "OK") {
          this.getMemberBasicInfo(this.data);
        }
      });
  }

  /** block this user */
  public blockUser(): void {
    const dialogRef = this.dialog.open(BlockUserModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.router.navigateByUrl('member/conversation/dashboard');
      }
    });
  }
}
