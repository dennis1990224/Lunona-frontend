import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaleProfilePreviewModalComponent } from '@app/modal-component/male-profile-preview-modal/male-profile-preview-modal.component';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { MaleProfileMyPrivacySetting } from '@app/model/male-profile-my-privacy';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { ProfilePhoto } from '@app/model/profile_photo';
import { ProfilePhotoCount } from '@app/model/profile_photo_count';
import { environment } from '@env/environment';
import { DataShareService } from '@app/service/data-share.service';
import { ConversationService } from '@app/service/conversation.service';
import { ChangeProfileCoverModalComponent } from '@app/modal-component/change-profile-cover-modal/change-profile-cover-modal.component';
import { MapModalComponent } from '@app/modal-component/map-modal/map-modal.component';
import { LanguageElement } from '@app/model/language_element';

@Component({
  selector: 'app-profile-my-profile',
  templateUrl: './profile-my-profile.component.html',
  styleUrls: ['./profile-my-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileMyProfileComponent implements OnInit {
  public selectedTabIndex: string = "first-tab";
  public token: string;
  public myInformation: MaleProfileMyInformation;
  public myPrivacySettings: MaleProfileMyPrivacySetting;
  public publicPhotos: ProfilePhoto[] = [];
  public privatePhotos: ProfilePhoto[] = [];
  public spicyPhotos: ProfilePhoto[] = [];
  public chillyPhotos: ProfilePhoto[] = [];
  public savedPhotos: ProfilePhoto[] = [];
  public photoCount: ProfilePhotoCount;
  public serverUrl: string = environment.serverUrl;
  public avatar: string;
  public age: number;
  public loginName: string;
  public profileInfo: any;
  public mouseOverOnAvatar: boolean = false;
  public mouseOverOnCover: boolean = false;
  public languageMemberElements: LanguageElement[];

  constructor(
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private dataShareService: DataShareService,
    private convService: ConversationService,
  ) {
    this.token = this.cookieService.get('LunonaToken');
    this.avatar = this.cookieService.get("Avatar");
    this.loginName = this.cookieService.get("UserName");
    this.getMyProfileInfo();
    this.getMyPrivacySetting();
    this.getMyPhotos();
    this.getProfileBasic();
    this.languageMemberElements = this.dataShareService.getLanguageMemberElements();
  }

  ngOnInit(): void {
    this.dataShareService.changeProfileEvent
      .subscribe((res) => {
        if (res === true) {
          this.getProfileBasic();
          this.getMyPhotos();
          this.dataShareService.changeProfile(false);
        }
      });
    this.dataShareService.changeLanguageEvent
      .subscribe((res) => {
        if (res === true) {
          this.languageMemberElements = this.dataShareService.getLanguageMemberElements();
        }
      });
  }

  /** get profile basic */
  public getProfileBasic(): void {
    this.convService.getPreviewProfileBasic(this.token, this.loginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileInfo = res.Data;
          console.log(this.profileInfo)
        }
      });
  }

  /** get my profile information */
  public getMyProfileInfo(): void {
    this.myProfileService.getMyProfileInfo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myInformation = res.Data;
          this.age = new Date().getUTCFullYear() - this.myInformation.BirthdayYear;
          console.log(this.myInformation)
        }
      });
  }

  /** get my privacy settings */
  public getMyPrivacySetting(): void {
    this.myProfileService.getMyPrivacySettings(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myPrivacySettings = res.Data;
        }
      })
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

  /** open profile preview modal */
  public openProfilePreview(): void {
    const dialogRef = this.dialog.open(MaleProfilePreviewModalComponent, {
      panelClass: 'view-profile-modal'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        console.log("modal closed")
      }
    });
  }

  /** get my all photos */
  public getMyPhotos(): void {
    this.getPublicPhotos();
    this.getPrivatePhotos();
    this.getSpicyPhotos();
    this.getChillyPhotos();
    this.getSavedPhotos();
  }

  /** get my public photos */
  public getPublicPhotos(): void {
    this.myProfileService.getPublicPhotos(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.publicPhotos = [];
          this.photoCount = res.Counters;
          for (const item of res.Data) {
            if (!item.MediaURL.includes("http")) {
              item.MediaURL = `https://lunona.com${item.MediaURL}`;
            }
            this.publicPhotos.push(item);
          }
        }
      });
  }

  /** get my private photos */
  public getPrivatePhotos(): void {
    this.myProfileService.getPrivatePhotos(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.privatePhotos = [];
          for (const item of res.Data) {
            if (!item.MediaURL.includes("http")) {
              item.MediaURL = `https://lunona.com${item.MediaURL}`;
            }
            this.privatePhotos.push(item);
          }
        }
      });
  }

  /** get my spicy photos */
  public getSpicyPhotos(): void {
    this.myProfileService.getSpicyPhotos(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.spicyPhotos = [];
          for (const item of res.Data) {
            if (!item.MediaURL.includes("http")) {
              item.MediaURL = `https://lunona.com${item.MediaURL}`;
            }
            this.spicyPhotos.push(item);
          }
        }
      });
  }

  /** get my chilly photos */
  public getChillyPhotos(): void {
    this.myProfileService.getChillyPhotos(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.chillyPhotos = [];
          for (const item of res.Data) {
            if (!item.MediaURL.includes("http")) {
              item.MediaURL = `https://lunona.com${item.MediaURL}`;
            }
            this.chillyPhotos.push(item);
          }
        }
      });
  }

  /** get my saved photos */
  public getSavedPhotos(): void {
    this.myProfileService.getSavedPhotos(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.savedPhotos = [];
          for (const item of res.Data) {
            if (!item.MediaURL.includes("http")) {
              item.MediaURL = `https://lunona.com${item.MediaURL}`;
            }
            this.savedPhotos.push(item);
          }
        }
      });
  }

  /** change profile or cover photo modal */
  public changePhoto(category: string, profileDefault: boolean): void {
    const dialogRef = this.dialog.open(ChangeProfileCoverModalComponent, {
      panelClass: 'custom-modalbox',
      data: {
        category: category,
        profileDefault: profileDefault
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
      }
    });
  }

  /** open location google map modal */
  public openLocationModal(): void {
    const dialogRef = this.dialog.open(MapModalComponent, {
      data: this.myInformation,
      panelClass: 'map-modalbox'
    });
  }

  /** get translate with keyword */
  public getTranslate(keyword: string): string {
    for (let item of this.languageMemberElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }
}
