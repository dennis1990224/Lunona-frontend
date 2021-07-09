import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { ConversationService } from '@app/service/conversation.service';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-male-profile-preview-modal',
  templateUrl: './male-profile-preview-modal.component.html',
  styleUrls: ['./male-profile-preview-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfilePreviewModalComponent implements OnInit {

  public token: string;
  public selectedTabIndex: string;
  public loginName: string;
  public profileInfo: any;
  public publicImages: any[] = [];
  public privateImages: any[] = [];
  public spicyImages: any[] = [];
  public chillyImages: any[] = [];
  public frames: any[];
  public aboutYouInfo: any[] = [];
  public lookingForInfo: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<MaleProfilePreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileInformation,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private convService: ConversationService
  ) {
    this.loginName = this.cookieService.get("UserName");
    this.token = this.cookieService.get('LunonaToken');
  }

  ngOnInit(): void {
    this.getProfileBasicInfo();
    this.getPreviewProfileInfo();
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
  public getProfileBasicInfo(): void {
    this.convService.getPreviewProfileBasic(this.token, this.loginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileInfo = res.Data;
          this.getImagesByCategory(this.profileInfo);
          console.log("here is the profile information", this.profileInfo)
        }
      });
  }

  /** get preview profile information */
  public getPreviewProfileInfo(): void {
    this.convService.getPreviewProfileInfo(this.token, this.loginName)
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

  /** get images by category */
  public getImagesByCategory(profileInfo: any): void {
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
}
