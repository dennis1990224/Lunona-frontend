import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { environment } from '@env/environment';
import { MaleProfileRateModalComponent } from '@app/modal-component/male-profile-rate-modal/male-profile-rate-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConversationService } from '@app/service/conversation.service';
import { CookieService } from 'ngx-cookie-service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';
import { PreviewImageModalComponent } from '@app/modal-component/preview-image-modal/preview-image-modal.component';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';

@Component({
  selector: 'app-chat-profile-preview',
  templateUrl: './chat-profile-preview.component.html',
  styleUrls: ['./chat-profile-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatProfilePreviewComponent implements OnInit {

  @Input() public basicInfo: any;

  public selectedTabIndex: string;
  public serverUrl: string = environment.serverUrl;
  public publicImages: any[] = [];
  public privateImages: any[] = [];
  public spicyImages: any[] = [];
  public chillyImages: any[] = [];
  public preselectTab: number = 1;
  public token: string;
  public frames: any[];
  public aboutYouInfo: any[] = [];
  public lookingForInfo: any[] = [];
  public rate: string;
  public profilePhotoUrl: string;
  public profileCoverUrl: string;

  constructor(
    private dialog: MatDialog,
    private cookieService: CookieService,
    private convService: ConversationService,
    private myProfileService: ProfileMyProfileService
  ) {
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.basicInfo !== undefined) {
      this.getImageByCategory(this.basicInfo);
      this.getPreviewProfileInfo(this.basicInfo.LoginName);
      this.getRate(this.basicInfo);
      this.getProfilePhoto();
      this.getProfileCover();
    }
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
  public getMemberBasicInfo(profile: any): void {
    this.convService.getPreviewProfileBasic(this.token, profile.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.basicInfo = res.Data;
          this.getProfilePhoto()
          this.getProfileCover();
          this.getImageByCategory(this.basicInfo);
          this.getRate(this.basicInfo);
        }
      });
  }

  /** get profile Photo */
  public getProfilePhoto(): void {
    if (!this.basicInfo.ProfilePhotoBase.includes("http")) {
      this.profilePhotoUrl = `https://lunona.com${this.basicInfo.ProfilePhotoBase}`;
    } else {
      this.profilePhotoUrl = this.basicInfo.ProfilePhotoBase;
    }
  }

  /** get profile cover */
  public getProfileCover(): void {
    if (!this.basicInfo.ProfilePhotoBase.includes("http")) {
      this.profileCoverUrl = `https://lunona.com${this.basicInfo.ProfilePhotoCover}`;
    } else {
      this.profileCoverUrl = this.basicInfo.ProfilePhotoCover;
    }
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

  /** get preview profile information */
  public getPreviewProfileInfo(name: string): void {
    this.convService.getPreviewProfileInfo(this.token, name)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.frames = res.Data["Frames"];
          this.getAboutYouData(this.frames);
          this.getLookingForData(this.frames);
        }
      });
  }

  /** get aboutyou data */
  public getAboutYouData(frames: any[]): void {
    this.aboutYouInfo = [];
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
    this.lookingForInfo = [];
    const middleFrames: any[] = frames.find(item => item.FrameKEY == "LOOKING_FOR")["Items"];
    const fromFrmaes = from(middleFrames);
    const observableFrame = fromFrmaes.pipe(
      groupBy(category => category["CategoryOrder"]),
      mergeMap(group => group.pipe(toArray()))
    )
    const getting = observableFrame.subscribe(val => {
      this.lookingForInfo.push(val);
    });
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

  /** get image by category */
  public getImageByCategory(profileInfo: any): void {
    this.publicImages = [];
    this.privateImages = [];
    this.chillyImages = [];
    this.spicyImages = [];
    for (let item of profileInfo.ProfilePhotos) {
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

  /** rate this user */
  public rateUser(): void {
    console.log(this.basicInfo)
    const dialogRef = this.dialog.open(MaleProfileRateModalComponent, {
      data: this.basicInfo,
      panelClass: 'rate-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMemberBasicInfo(this.basicInfo);
        console.log("here")
      }
    })
  }

  /** update pin informatino by click pin icon */
  public updatePin(): void {
    this.myProfileService.updatePinInfo(this.token, this.basicInfo.ProfileID)
      .subscribe((res) => {
        if (res === "OK") {
          this.getMemberBasicInfo(this.basicInfo);
        }
      });
  }
}
