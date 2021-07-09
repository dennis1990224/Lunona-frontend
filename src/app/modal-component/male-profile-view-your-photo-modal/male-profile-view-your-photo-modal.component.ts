import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { MaleProfileMyPrivacySetting } from '@app/model/male-profile-my-privacy';
import { ListItem } from '@app/model/list_item';

@Component({
  selector: 'app-male-profile-view-your-photo-modal',
  templateUrl: './male-profile-view-your-photo-modal.component.html',
  styleUrls: ['./male-profile-view-your-photo-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfileViewYourPhotoModalComponent implements OnInit {

  public token: string;
  public modalName: string;
  public myPrivacySettings: MaleProfileMyPrivacySetting;
  
  /** public modal variables */
  public AccessSettings: ListItem[];
  public selectedPublic: number;

  /** private modal variables */
  public selectedPrivate: number;

  /** spicy modal variables */
  public selectedSpicy: number;

  /** chilly modal variables */
  public selectedChilly: number;

  constructor(
    public dialogRef: MatDialogRef<MaleProfileViewYourPhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileInformation,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
  ) {
    this.modalName = this.data.name;
    this.token = this.cookieService.get('LunonaToken');
    this.getMyPrivacySettings();
  }

  ngOnInit(): void {
  }

  /** check modal status */
  public checkModalStatus(): void {
    switch (this.data.name) {
      case "public":
        this.selectedPublic = this.myPrivacySettings.PrivacySettings_PublicPhotosLevelID;
        this.getMediaAccess('public');
        break;
      case "private":
        this.selectedPrivate = this.myPrivacySettings.PrivacySettings_PrivatePhotosLevelID;
        this.getMediaAccess('private');
        break;
      case "spicy":
        this.selectedSpicy = this.myPrivacySettings.PrivacySettings_SpicyPhotosLevelID;
        this.getMediaAccess('spicy');
        break;
      case "chilly":
        this.selectedChilly = this.myPrivacySettings.PrivacySettings_ChillyPhotosLevelID;
        this.getMediaAccess('chilly');
        break;
    }
  }

  /** get Media access */
  public getMediaAccess(category: string): void {
    this.myProfileService.getMediaAccess(this.token, category)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.AccessSettings = res.Data["Item"];
        }
      });
  }

  /** get my privacy settings */
  public getMyPrivacySettings(): void {
    this.myProfileService.getMyPrivacySettings(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myPrivacySettings = res.Data;
          this.checkModalStatus();
        }
      });
  }

  /** update public photo settings */
  public updatePublicSetting(): void {
    this.myProfileService.updatePublicPhotoLevel(this.token, this.selectedPublic)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.getMyPrivacySettings();
          this.dialogRef.close("success");
        }
      });
  }

  /** update chilly photo settings */
  public updateChillySetting(): void {
    this.myProfileService.updateChillyPhotoLevel(this.token, this.selectedChilly)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.getMyPrivacySettings();
          this.dialogRef.close("success");
        }
      });
  }

  /** update private photo settings */
  public updatePrivateSetting(): void {
    this.myProfileService.updatePrivatePhotoLevel(this.token, this.selectedPrivate)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.getMyPrivacySettings();
          this.dialogRef.close("success");
        }
      });
  }

  /** update spicy photo settings */
  public updateSpicySetting(): void {
    this.myProfileService.updateSpicyPhotoLevel(this.token, this.selectedSpicy)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.getMyPrivacySettings();
          this.dialogRef.close("success");
        }
      });
  }

}
