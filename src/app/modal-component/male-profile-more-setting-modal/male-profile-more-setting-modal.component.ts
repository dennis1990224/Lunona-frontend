import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileMyPrivacySetting } from '@app/model/male-profile-my-privacy';
import { ListItem } from '@app/model/list_item';

@Component({
  selector: 'app-male-profile-more-setting-modal',
  templateUrl: './male-profile-more-setting-modal.component.html',
  styleUrls: ['./male-profile-more-setting-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfileMoreSettingModalComponent implements OnInit {

  public token: string;
  public modalName: string;
  public myInformation: MaleProfileMyInformation;
  public myPrivacySettings: MaleProfileMyPrivacySetting;

  /** travel modal variavels */
  public selectedCountries: ListItem[] = [];
  public countries: ListItem[] = [];
  public allCountries: ListItem[] = [];

  /** other country modal variables */
  public isTravel: boolean;

  constructor(
    public dialogRef: MatDialogRef<MaleProfileMoreSettingModalComponent>,
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
      case "travel":
        this.getTravelCountries();
        break;
      case "otherCountry":
        this.isTravel = this.myPrivacySettings.More_AllowOnlyMyCountry;
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

  /** get all travel countries */
  public getTravelCountries(): void {
    this.myProfileService.getAllTravelCountries(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.countries = res.Data["Item"];
          this.allCountries = Object.assign(this.countries, {});
          for (let item of this.myPrivacySettings.More_AbleToTravel.split(",")) {
            this.selectedCountries = this.selectedCountries.concat(this.countries.filter(ele => ele.ID === parseInt(item, 10)));
          }
          this.countries = this.countries.filter((ele) => !this.selectedCountries.includes(ele));
        }
      })
  }

  /** remove from countries */
  public removeCountry(removeCountry: ListItem, index: number): void {
    if (this.selectedCountries.length === 1) {
      this.selectedCountries = [];
      this.selectedCountries = this.allCountries.filter(ele => ele.ID === 0);
      this.countries = this.allCountries.filter((ele) => !this.selectedCountries.includes(ele));
    } else {
      this.selectedCountries.splice(index, 1);
      this.countries = [removeCountry].concat(this.countries);
    }
  }

  /** add country */
  public addCountry(addCountry: ListItem, index: number): void {
    if (this.selectedCountries.length === 1 && this.selectedCountries[0].ID === 0) {
      this.countries = this.countries.concat(this.selectedCountries);
      this.selectedCountries = [];
      this.countries.splice(index, 1);
      this.selectedCountries.push(addCountry);
    } else if (addCountry.ID === 0) {
      this.selectedCountries = [];
      this.selectedCountries = this.allCountries.filter(ele => ele.ID === 0);
      this.countries = this.allCountries.filter((ele) => !this.selectedCountries.includes(ele));
    } else {
      this.countries.splice(index, 1);
      this.selectedCountries.push(addCountry);
    }
  }

  /** get Travel countries sending countries */
  public getTravelCountriesValue(): string {
    let travelCountriesIds: string = "";
    for (let i = 0; i < this.selectedCountries.length; i++) {
      if ((i + 1) === this.selectedCountries.length) {
        travelCountriesIds = travelCountriesIds.concat(`${this.selectedCountries[i].ID}`);
      } else {
        travelCountriesIds = travelCountriesIds.concat(`${this.selectedCountries[i].ID},`)
      }
    }
    return travelCountriesIds;
  }

  /** update travel information */
  public updateTravelInfo(): void {
    const travelCountries: string = this.getTravelCountriesValue();
    this.myProfileService.updateTravelCountries(this.token, travelCountries)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
  }

  /** update other country settings */
  public updateOtherCountry(): void {
    let sendingValue: string = "";
    if (this.isTravel === true) {
      sendingValue = "true";
    } else {
      sendingValue = "false";
    }
    this.myProfileService.updateOtherCountrySetting(this.token, sendingValue)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success")
        }
      });
  }
}
