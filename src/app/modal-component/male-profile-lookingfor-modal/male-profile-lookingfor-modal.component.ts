import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';

@Component({
  selector: 'app-male-profile-lookingfor-modal',
  templateUrl: './male-profile-lookingfor-modal.component.html',
  styleUrls: ['./male-profile-lookingfor-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfileLookingforModalComponent implements OnInit {
  
  public token: string;
  public modalName: string;
  public myInformation: MaleProfileMyInformation;
  public ishaveFun: boolean;
  public isGifts: boolean;
  public isHelpExpenses: boolean;
  public isHelpStudies: boolean;
  public isShopping: boolean;
  public isTravel: boolean;
  public isHelpSecurity: boolean;
  public isWork: boolean;
  public isTravelOthersCountry: boolean;
  public isMindOthersCountry: boolean;
  public isInviteToMyCountry: boolean;

  constructor(
    public dialogRef: MatDialogRef<MaleProfileLookingforModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileInformation,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
  ) {
    this.modalName = this.data.name;
    this.token = this.cookieService.get('LunonaToken');
    console.log(this.modalName);
    this.getMyProfileInfo();
  }

  ngOnInit(): void {
  }

  /** get my profile information again on modal */
  public getMyProfileInfo(): void {
    this.myProfileService.getMyProfileInfo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myInformation = res.Data;
          this.checkModalStatus();
        }
      });
  }

  /** check modal status */
  public checkModalStatus(): void {
    switch (this.data.name) {
      case "haveFun":
        this.ishaveFun = this.myInformation.LookingFor_Fun;
        break;
      case "gifts":
        this.isGifts = this.myInformation.LookingFor_HelpGifts;
        break;
      case "helpExpenses":
        this.isHelpExpenses = this.myInformation.LookingFor_HelpExpenses;
        break;
      case "helpStudies":
        this.isHelpStudies = this.myInformation.LookingFor_HelpStudent;
        break;
      case "shopping":
        this.isShopping = this.myInformation.LookingFor_HelpShopping;
        break;
      case "travel":
        this.isTravel = this.myInformation.LookingFor_HelpTravelling;
        break;
      case "help-security":
        this.isHelpSecurity = this.myInformation.LookingFor_HelpSecurity;
        break;
      case "work":
        this.isWork = this.myInformation.LookingFor_HelpWork;
        break;
      case "travelToOthersCountry":
        this.isTravelOthersCountry = this.myInformation.LookingFor_YouCountryTour;
        break;
      case "inviteToMyCountry":
        this.isInviteToMyCountry = this.myInformation.LookingFor_MyCountryTour;
        break;
      case "mindOthersCountry":
        this.isMindOthersCountry = this.myInformation.LookingFor_NeverMindAnotherCountry;
        break;
    }
  }

  /** update looking for data */
  public updateLookingFor(): void {
    switch (this.data.name) {
      case "haveFun":
        const key_LookingFor_Fun: string = "LookingFor_Fun";
        this.updateLookingForData(key_LookingFor_Fun, this.ishaveFun);
        break;
      case "gifts":
        const key_LookingFor_HelpGifts: string = "LookingFor_HelpGifts";
        this.updateLookingForData(key_LookingFor_HelpGifts, this.isGifts);
        break;
      case "helpExpenses":
        const key_LookingFor_HelpExpenses: string = "LookingFor_HelpExpenses";
        this.updateLookingForData(key_LookingFor_HelpExpenses, this.isHelpExpenses);
        break;
      case "helpStudies":
        const key_LookingFor_HelpStudent: string = "LookingFor_HelpStudent";
        this.updateLookingForData(key_LookingFor_HelpStudent, this.isHelpStudies);
        break;
      case "shopping":
        const key_LookingFor_HelpShopping: string = "LookingFor_HelpShopping";
        this.updateLookingForData(key_LookingFor_HelpShopping, this.isShopping);
        break;
      case "travel":
        const key_LookingFor_HelpTravelling: string = "LookingFor_HelpTravelling";
        this.updateLookingForData(key_LookingFor_HelpTravelling, this.isTravel);
        break;
      case "help-security":
        const key_LookingFor_HelpSecurity: string = "LookingFor_HelpSecurity";
        this.updateLookingForData(key_LookingFor_HelpSecurity, this.isHelpSecurity);
        break;
      case "work":
        const key_LookingFor_HelpWork: string = "LookingFor_HelpWork";
        this.updateLookingForData(key_LookingFor_HelpWork, this.isWork);
        break;
      case "travelToOthersCountry":
        const key_LookingFor_MyCountryTour: string = "LookingFor_MyCountryTour";
        this.updateLookingForData(key_LookingFor_MyCountryTour, this.isTravelOthersCountry);
        break;
      case "inviteToMyCountry":
        const key_LookingFor_YouCountryTour: string = "LookingFor_YouCountryTour";
        this.updateLookingForData(key_LookingFor_YouCountryTour, this.isInviteToMyCountry);
        break;
      case "mindOthersCountry":
        const key_LookingFor_NeverMindAnotherCountry: string = "LookingFor_NeverMindAnotherCountry";
        this.updateLookingForData(key_LookingFor_NeverMindAnotherCountry, this.isMindOthersCountry);
        break;
    }
  }

  /** update looking for data */
  public updateLookingForData(key: string, value: boolean): void {
    this.myProfileService.updateLookingForData(key, value, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }
}
