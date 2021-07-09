import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataShareService } from '@app/service/data-share.service';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { UploadPhotoComponent } from '@app/modal-component/upload-photo/upload-photo.component';
import { MaleProfileMyPrivacySetting } from '@app/model/male-profile-my-privacy';
import { MaleProfileViewYourPhotoModalComponent } from '@app/modal-component/male-profile-view-your-photo-modal/male-profile-view-your-photo-modal.component';
import { ProfilePhoto } from '@app/model/profile_photo';
import { environment } from '@env/environment';
import { PreviewImageModalComponent } from '@app/modal-component/preview-image-modal/preview-image-modal.component';
import { SetProfilePromptComponent } from '@app/modal-component/set-profile-prompt/set-profile-prompt.component';
import { SetCoverphotoPromptComponent } from '@app/modal-component/set-coverphoto-prompt/set-coverphoto-prompt.component';
import { DeleteProfilePhotoComponent } from '@app/modal-component/delete-profile-photo/delete-profile-photo.component';
import { ChangePhotoCategoryComponent } from '@app/modal-component/change-photo-category/change-photo-category.component';
import { LanguageElement } from '@app/model/language_element';

@Component({
  selector: 'app-male-profile-public-tab',
  templateUrl: './male-profile-public-tab.component.html',
  styleUrls: ['./male-profile-public-tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfilePublicTabComponent implements OnInit {

  @Input() public myPrivacySettings: MaleProfileMyPrivacySetting;
  @Input() public photos: ProfilePhoto[];

  public token: string;
  public serverUrl: string = environment.serverUrl;
  public languageElement: LanguageElement[];

  constructor(
    private dialog: MatDialog,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private dataShareService: DataShareService,
  ) {
    this.token = this.cookieService.get('LunonaToken');
    this.languageElement = this.dataShareService.getLanguageMemberElements();
  }

  ngOnInit(): void {
    this.dataShareService.changeLanguageEvent
      .subscribe((res) => {
        if (res === true) {
          this.languageElement = this.dataShareService.getLanguageMemberElements();
        }
      });
  }

  ngOnChanges(): void {
    if (this.photos !== undefined) {
      console.log(this.photos)
    }
  }

  /** upload image by modal */
  public openUploadImageModal(): void {
    const dialogRef = this.dialog.open(UploadPhotoComponent, {
      data: 'public',
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
      }
    });
  }

  /** update public photo */
  public updatePublicPhoto(): void {
    const dialogRef = this.dialog.open(MaleProfileViewYourPhotoModalComponent, {
      data: { name: 'public' },
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMyPrivacySettings();
      }
    });
  }

  /** get my privacy settings */
  public getMyPrivacySettings(): void {
    this.myProfileService.getMyPrivacySettings(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myPrivacySettings = res.Data;
        }
      });
  }

  /** open photo preview */
  public openPreviewPhoto(photo: ProfilePhoto): void {
    console.log("here ", photo)
    const dialogRef = this.dialog.open(PreviewImageModalComponent, {
      data: {
        images: [photo],
        category: "",
        index: 0
      },
      panelClass: 'preview-image-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("preview image close result");
    });
  }

  /** set as profile photo */
  public setAsProfile(photo: ProfilePhoto): void {
    const dialogRef = this.dialog.open(SetProfilePromptComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.myProfileService.setProfilePhoto(photo.ID, this.token)
          .subscribe((res) => {
            if (res.d["ErrorMessage"] === "OK") {
              this.cookieService.set("Avatar", res.d["Url_ProfileBase"]);
              this.dataShareService.changeProfile(true);
            }
          })
      }
    });
  }

  /** set as cover photo */
  public setCoverPhoto(photo: ProfilePhoto): void {
    const dialogRef = this.dialog.open(SetCoverphotoPromptComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.myProfileService.setCoverPhoto(photo.ID, this.token)
          .subscribe((res) => {
            if (res.d["ErrorMessage"] === "OK") {
              this.dataShareService.changeProfile(true);
            }
          })
      }
    });
  }

  /** change photo category */
  public changePhotoCategory(photo: ProfilePhoto): void {
    const dialogRef = this.dialog.open(ChangePhotoCategoryComponent, {
      data: photo,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.myProfileService.changePhotoCategory(photo.ID, result.data, this.token)
          .subscribe((res) => {
            if (res.ErrorMessage === "OK") {
              this.dataShareService.changeProfile(true);
            }
          })
      }
    });
  }

  /** open delete photo */
  public deletePhoto(photo: ProfilePhoto): void {
    const dialogRef = this.dialog.open(DeleteProfilePhotoComponent, {
      data: photo,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.myProfileService.deletePhoto(photo.ID, this.token)
          .subscribe((res) => {
            if (res.ErrorMessage === "OK") {
              this.dataShareService.changeProfile(true);
            }
          })
      }
    });
  }

  /** get value of the my information tab title */
  public getTranslate(keyword: string) {
    for (let item of this.languageElement) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }
}
