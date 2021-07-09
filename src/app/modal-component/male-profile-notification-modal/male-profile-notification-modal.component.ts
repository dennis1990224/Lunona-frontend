import { Component, OnInit, Inject } from '@angular/core';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileMyPrivacySetting } from '@app/model/male-profile-my-privacy';

@Component({
  selector: 'app-male-profile-notification-modal',
  templateUrl: './male-profile-notification-modal.component.html',
  styleUrls: ['./male-profile-notification-modal.component.scss']
})
export class MaleProfileNotificationModalComponent implements OnInit {

  public token: string;
  public modalName: string;
  public myPrivacySettings: MaleProfileMyPrivacySetting;
  public isReceive: boolean;
  public isKisses: boolean;
  public isRate: boolean;
  public isNearBy: boolean;

  constructor(
    public dialogRef: MatDialogRef<MaleProfileNotificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileInformation,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
  ) {
    this.modalName = this.data.name;
    this.token = this.cookieService.get('LunonaToken');
    console.log(this.modalName);
    this.getMyPrivacySettings();
  }

  ngOnInit(): void {
  }

  /** check modal status */
  public checkModalStatus(): void {
    switch (this.data.name) {
      case "message":
        this.isReceive = this.myPrivacySettings.NotificationsSettings_WhenNewMessageReceived;
        break;
      case "kisses":
        this.isKisses = this.myPrivacySettings.NotificationsSettings_WhenWingReceived;
        break;
      case "rate":
        this.isRate = this.myPrivacySettings.NotificationsSettings_WhenNewRateReceived;
        break;
      case "nearyBy":
        this.isNearBy = this.myPrivacySettings.NotificationsSettings_WhenNewMembersNearMe;
        break;
    }
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


  /** update privacy notification settings */
  public updatePrivacyNotificationSetting(modalName: string): void {
    switch (modalName) {
      case "message":
        this.updatePrivacyReceiveSetting();
        break;
      case "kisses":
        this.updatePrivacyKissesSetting();
        break;
      case "rate":
        this.updatePrivacyRateSetting();
        break;
      case "nearyBy":
        this.updatePrivacyNearBySetting();
        break;
    }
  }

  /** update recieve setting */
  public updatePrivacyReceiveSetting(): void {
    this.myProfileService.updatePrivacyRecieveSetting(this.token, this.isReceive)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
  }

  /** update kiss setting */
  public updatePrivacyKissesSetting(): void {
    this.myProfileService.updatePrivacyKissesSetting(this.token, this.isKisses)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** update rate setting */
  public updatePrivacyRateSetting(): void {
    this.myProfileService.updatePrivacyRateSetting(this.token, this.isRate)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
  }

  /** update nearBy settings */
  public updatePrivacyNearBySetting(): void {
    this.myProfileService.updatePrivacyNearBySetting(this.token, this.isNearBy)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
  }
}
