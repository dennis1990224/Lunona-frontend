import { Component, OnInit, Input } from '@angular/core';
import { DataShareService } from '@app/service/data-share.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileViewYourPhotoModalComponent } from '@app/modal-component/male-profile-view-your-photo-modal/male-profile-view-your-photo-modal.component';
import { MaleProfileNotificationModalComponent } from '@app/modal-component/male-profile-notification-modal/male-profile-notification-modal.component';
import { MaleProfileMoreSettingModalComponent } from '@app/modal-component/male-profile-more-setting-modal/male-profile-more-setting-modal.component';
import { MaleProfileMyPrivacySetting } from '@app/model/male-profile-my-privacy';
import { environment } from '@env/environment';
import { LanguageElement } from '@app/model/language_element';

@Component({
  selector: 'app-male-profile-privacy-tab',
  templateUrl: './male-profile-privacy-tab.component.html',
  styleUrls: ['./male-profile-privacy-tab.component.scss']
})
export class MaleProfilePrivacyTabComponent implements OnInit {

  @Input() public myPrivacySettings: MaleProfileMyPrivacySetting;

  public token: string;
  public serverUrl: string = environment.serverUrl;
  public languageElement: LanguageElement[];

  constructor(
    private dataShareService: DataShareService,
    private dialog: MatDialog,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
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

  /** get my privacy settings */
  public getMyPrivacySettings(): void {
    this.myProfileService.getMyPrivacySettings(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myPrivacySettings = res.Data;
        }
      });
  }

  /** open choose who can view your photo modal */
  public openViewYourPhotoModal(access: string): void {
    const dialogRef = this.dialog.open(MaleProfileViewYourPhotoModalComponent, {
      data: { name: access },
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMyPrivacySettings();
      }
    });
  }

  /** open notification setting modal */
  public openNotificationSettingModal(setting: string): void {
    const dialogRef = this.dialog.open(MaleProfileNotificationModalComponent, {
      data: { name: setting },
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMyPrivacySettings();
      }
    });
  }

  /** open more settings modal */
  public openMoreSettingModal(setting: string): void {
    const dialogRef = this.dialog.open(MaleProfileMoreSettingModalComponent, {
      data: { name: setting },
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMyPrivacySettings();
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
