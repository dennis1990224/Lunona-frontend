import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '@env/environment';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { ConversationService } from '@app/service/conversation.service';
import { ChatService } from '@app/service/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';
import { MatDialog } from '@angular/material/dialog';
import { MaleProfileRateModalComponent } from '@app/modal-component/male-profile-rate-modal/male-profile-rate-modal.component';
import { PreviewImageModalComponent } from '@app/modal-component/preview-image-modal/preview-image-modal.component';
import { ConfirmWinkModalComponent } from '@app/modal-component/confirm-wink-modal/confirm-wink-modal.component';
import { ChatModalComponent } from '@app/modal-component/chat-modal/chat-modal.component';
import { BlockUserModalComponent } from '@app/modal-component/block-user-modal/block-user-modal.component';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProfileComponent implements OnInit {

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
  public memberName: string;
  public rate: string;
  public isMessage: boolean = false;

  constructor(
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private convService: ConversationService,
    private chatService: ChatService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get("UserName");
    this.activatedRoute.params.subscribe(params => {
      this.memberName = params["profileName"];
      this.getMemberBasicInfo(this.memberName);
      this.getPreviewProfileInfo(this.memberName);
    })
  }

  ngOnInit(): void {
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
  public getMemberBasicInfo(name: string): void {
    this.convService.getPreviewProfileBasic(this.token, name)
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
  public getPreviewProfileInfo(name: string): void {
    this.convService.getPreviewProfileInfo(this.token, name)
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
    console.log("here is the about you info", this.aboutYouInfo);
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
      data: this.profileInfo,
      panelClass: 'rate-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMemberBasicInfo(this.profileInfo.LoginName);
        console.log("rate modal closed: success");
      }
    })
  }

  /** send wink to member */
  public sendWink(): void {
    if (this.profileInfo.Winked) {
      const dialogRef = this.dialog.open(ConfirmWinkModalComponent, {
        data: this.profileInfo,
        panelClass: 'custom-modalbox'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === "success") {
          this.getMemberBasicInfo(this.profileInfo.LoginName);
          console.log("confirm wink modal closed: success");
        }
      })
    } else {
      this.chatService.sendWink(this.token, this.profileInfo, this.userName);
    }
  }

  /** open Chat modal */
  public openChat(): void {
    const dialogRef = this.dialog.open(ChatModalComponent, {
      data: this.profileInfo,
      panelClass: 'custom-chat-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMemberBasicInfo(this.profileInfo.LoginName);
        console.log("here chat modal close result");
      }
    })
  }

  /** update pin informatino by click pin icon */
  public updatePin(): void {
    this.myProfileService.updatePinInfo(this.token, this.profileInfo.ProfileID)
      .subscribe((res) => {
        if (res === "OK") {
          this.getMemberBasicInfo(this.profileInfo.LoginName);
        }
      });
  }


  /** block this user */
  public blockUser(): void {
    const dialogRef = this.dialog.open(BlockUserModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.profileInfo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.router.navigateByUrl('member/conversation/dashboard');
      }
    });
  }
}
