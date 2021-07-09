import { Component, OnInit, Input } from '@angular/core';
import { ProfileInformation } from '@app/model/profile_information';
import { MaleInformationAboutYou, MaleInformationLookingFor, MaleInformationWhatYouGot, MaleInformationSetting } from '@app/model/male-profile-information';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { DataShareService } from '@app/service/data-share.service';
import { LanguageElement } from '@app/model/language_element';
import { MatDialog } from '@angular/material/dialog';
import { MaleProfileAboutyouModalComponent } from '@app/modal-component/male-profile-aboutyou-modal/male-profile-aboutyou-modal.component';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileLookingforModalComponent } from '@app/modal-component/male-profile-lookingfor-modal/male-profile-lookingfor-modal.component';
import { MaleProfileWhatYouGotModalComponent } from '@app/modal-component/male-profile-what-you-got-modal/male-profile-what-you-got-modal.component';
import { MaleProfileAccountSettingModalComponent } from '@app/modal-component/male-profile-account-setting-modal/male-profile-account-setting-modal.component';

@Component({
  selector: 'app-male-profile-information-tab',
  templateUrl: './male-profile-information-tab.component.html',
  styleUrls: ['./male-profile-information-tab.component.scss'],
})
export class MaleProfileInformationTabComponent implements OnInit {

  @Input() public myInformation: MaleProfileMyInformation;

  public aboutYoudata: ProfileInformation[] = [];
  public lookingForData: ProfileInformation[] = [];
  public whatYouGotData: ProfileInformation[] = [];
  public accountSettingData: ProfileInformation[] = [];
  public languageElement: LanguageElement[];
  public token: string;

  constructor(
    private dataShareService: DataShareService,
    private dialog: MatDialog,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
  ) {
    this.languageElement = this.dataShareService.getLanguageMemberElements();
    this.token = this.cookieService.get('LunonaToken');
  }

  ngOnInit(): void {
    this.aboutYoudata = MaleInformationAboutYou;
    this.lookingForData = MaleInformationLookingFor;
    this.whatYouGotData = MaleInformationWhatYouGot;
    this.accountSettingData = MaleInformationSetting;
    this.dataShareService.changeLanguageEvent
      .subscribe((res) => {
        if (res === true) {
          this.languageElement = this.dataShareService.getLanguageMemberElements();
        }
      });
  }

  /** get my information value */
  public getValue(value: string) {
    return this.myInformation[value];
  }

  /** get value of the my information tab title */
  public getTranslate(keyword: string) {
    for (let item of this.languageElement) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  /** get and update my information */
  public getMyInforamtion(): void {
    this.myProfileService.getMyProfileInfo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myInformation = res.Data;
        }
      });
  }

  /** open modal when aboutyou click event */
  public openAboutYouModal(data: ProfileInformation): void {
    const dialogRef = this.dialog.open(MaleProfileAboutyouModalComponent, {
      data: data,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMyInforamtion();
      }
    });
  }

  /** open modal when lookingfor click event */
  public openLookingForModal(data: ProfileInformation): void {
    const dialogRef = this.dialog.open(MaleProfileLookingforModalComponent, {
      data: data,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMyInforamtion();
      }
    })
  }

  /** open modal when whatYouGot click event */
  public openWhatYouGot(data: ProfileInformation): void {
    const dialogRef = this.dialog.open(MaleProfileWhatYouGotModalComponent, {
      data: data,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.getMyInforamtion();
      }
    })
  }

  /** open modal when account setting click event */
  public openAccountSetting(data: ProfileInformation): void {
    const dialogRef = this.dialog.open(MaleProfileAccountSettingModalComponent, {
      data: data,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "success") {
        this.getMyInforamtion();
      }
    })
  }

}
