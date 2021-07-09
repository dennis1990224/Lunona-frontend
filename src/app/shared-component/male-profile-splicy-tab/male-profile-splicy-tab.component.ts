import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { DataShareService } from '@app/service/data-share.service';
import { UploadPhotoComponent } from '@app/modal-component/upload-photo/upload-photo.component';
import { MaleProfileMyPrivacySetting } from '@app/model/male-profile-my-privacy';
import { MaleProfileViewYourPhotoModalComponent } from '@app/modal-component/male-profile-view-your-photo-modal/male-profile-view-your-photo-modal.component';
import { ProfilePhoto } from '@app/model/profile_photo';
import { environment } from '@env/environment';
import { PreviewImageModalComponent } from '@app/modal-component/preview-image-modal/preview-image-modal.component';
import { ChangePhotoCategoryComponent } from '@app/modal-component/change-photo-category/change-photo-category.component';
import { DeleteProfilePhotoComponent } from '@app/modal-component/delete-profile-photo/delete-profile-photo.component';
import { LanguageElement } from '@app/model/language_element';

@Component({
  selector: 'app-male-profile-splicy-tab',
  templateUrl: './male-profile-splicy-tab.component.html',
  styleUrls: ['./male-profile-splicy-tab.component.scss']
})
export class MaleProfileSplicyTabComponent implements OnInit {

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

  /** upload image by modal */
  public openUploadImageModal(): void {
    const dialogRef = this.dialog.open(UploadPhotoComponent, {
      data: 'spicy',
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
      }
    });
  }

  /** update splicy photo level */
  public updateSpicyPhoto(): void {
    const dialogRef = this.dialog.open(MaleProfileViewYourPhotoModalComponent, {
      data: { name: 'spicy' },
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
