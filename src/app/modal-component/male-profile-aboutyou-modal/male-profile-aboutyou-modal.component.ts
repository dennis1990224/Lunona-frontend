import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CountryInfo } from '@app/model/country_info';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { startWith, map } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { SiteSupportingLanguage } from '@app/model/site_supporting_language';
import { ListItem } from '@app/model/list_item';

@Component({
  selector: 'app-male-profile-aboutyou-modal',
  templateUrl: './male-profile-aboutyou-modal.component.html',
  styleUrls: ['./male-profile-aboutyou-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfileAboutyouModalComponent implements OnInit {

  public token: string;
  public modalName: string;
  public myInformation: MaleProfileMyInformation;

  /** location modal variables */
  public country = new FormControl();
  public city = new FormControl();
  public filterCountries: Observable<CountryInfo[]>;
  public countryIso: string;
  public allCountriesName: CountryInfo[];
  public filterCities: Observable<string[]>;
  public allCities: string[];
  public selectedCity: string;
  public selectedCountry: string;

  /** birthday modal variables */
  public lastDays: number[];
  public days = [];
  public months = [];
  public years = [];
  public startYear: number;
  public birthdayDay: number;
  public birthdayMonth: number;
  public birthdayYear: number;
  public age: number;

  /** occupation modal variables */
  public occupations: ListItem[];
  public selectedOccupation: number;

  /** spokenLanguages modal variables */
  public selectedSpokenLanguages: ListItem[] = [];
  public spokenLanguages: ListItem[];

  /** nationality modal variables */
  public selectedNationality: number;
  public nationalities: ListItem[];

  /** DisplayLanguage modal variables */
  public selectedDisplayLanguage: string;
  public DisplayLanguages: SiteSupportingLanguage[];
  
  /** height modal variables */
  public height: number;
  public inch: number;

  /** tattoo modal variables */
  public selectedTattoo: number;
  public tattoos: ListItem[];

  /** smoking modal variables */
  public selectedSmoking: number;
  public smokings: ListItem[];

  /** relationship modal variables */
  public selectedRelationShip: number;
  public relationShips: ListItem[];

  /** children modal variables */
  public selectedChild: number;
  public children: ListItem[];

  /** education modal variables */
  public selectedEducation: number;
  public educations: ListItem[];

  constructor(
    public dialogRef: MatDialogRef<MaleProfileAboutyouModalComponent>,
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

  /** check modal status */
  public checkModalStatus(): void {
    switch (this.data.name) {
      case "location":
        this.countryIso = this.myInformation.CountryISO.toLowerCase();
        this.country.setValue(this.myInformation.Country);
        this.city.setValue(this.myInformation.City);
        this.getCountries();
        break;
      case "birthday":
        this.birthdayDay = this.myInformation.BirthdayDay;
        this.birthdayMonth = this.myInformation.BirthdayMonth;
        this.birthdayYear = this.myInformation.BirthdayYear;
        this.getDateAndAge(this.birthdayYear, this.birthdayMonth, this.birthdayDay);
        break;
      case "occupation":
        this.selectedOccupation = this.myInformation.PersonalInfo_BusinessSectorID;
        this.getOccupation();
        break;
      case "spokenLanguages":
        this.getSpokenLanguage();
        break;
      case "nationality":
        this.selectedNationality = this.myInformation.PersonalInfo_NationalityID;
        this.getNationality();
        break;
      case "DisplayLanguage":
        this.selectedDisplayLanguage = this.myInformation.SiteLanguageISO;
        this.getSiteSupportLanguage();
        break;
      case "height":
        this.height = this.myInformation.PersonalInfo_HeightCM;
        if (this.height < 140) {
          this.height = 140;
        }
        this.inch = Math.floor(this.height/35);
        this.setHeight();
        break;
      case "tattoo":
        this.selectedTattoo = this.myInformation.PersonalInfo_BodyArtID;
        this.getTattoo();
        break;
      case "smoking":
        this.selectedSmoking = this.myInformation.PersonalInfo_SmokingID;
        this.getSmokings();
        break;
      case "relationship":
        this.selectedRelationShip = this.myInformation.PersonalInfo_RelationshipStatusID;
        this.getRelationShips();
        break;
      case "children":
        this.selectedChild = this.myInformation.PersonalInfo_ChildrenID;
        this.getChildren();
        break;
      case "education":
        this.selectedEducation = this.myInformation.PersonalInfo_EducationID;
        this.getEducation();
        break;
    }
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

  /** get whole countries */
  public getCountries(): void {
    this.myProfileService.getCountries()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.allCountriesName = res.Data;
          this.filterCountries = this.country.valueChanges
            .pipe(
              startWith(this.myInformation.Country),
              map(value => value ? this._filter(value) : this.allCountriesName.slice())
            )
        }
      });
  }

  /** country filter */
  public _filter(value: string): CountryInfo[] {
    this.CountryIso(value);
    this.selectedCountry = value;
    const filterValue = value.toLowerCase();
    return this.allCountriesName.filter(country => country.CountryName.toLowerCase().includes(filterValue));
  }

  /** get CountryISO with country name */
  public CountryIso(countryName: string): void {
    this.countryIso = '';
    const found: CountryInfo = this.allCountriesName.find(element => element.CountryName == countryName);
    if (found) {
      this.countryIso = found.CountryISO.toLowerCase();
    }
  }

  /** filter city key press event */
  public GetCitiesAndZip(key: string): void {
    if (key.length > 2) {
      this.myProfileService.getCitiesAndZip(key, this.countryIso, this.token)
        .subscribe((res) => {
          if (res.ErrorMessage === "OK") {
            this.allCities = res.Data;
            this.filterCities = this.city.valueChanges
              .pipe(
                startWith(''),
                map(value => value ? this.cityFilter(value) : this.allCities.slice())
              )
          }
        });
    }
  }

  /** city filter */
  public cityFilter(value: string): string[] {
    this.selectedCity = value;
    const filterValues: string = value.toLowerCase();
    return this.allCities.filter(city => city.toLowerCase().includes(filterValues));
  }

  /** update location done event */
  public updateLocation(): void {
    if (this.selectedCity === undefined || this.selectedCity === "") {
      this.selectedCity = this.myInformation.City;
    }
    const selectedCity: string = this.selectedCity;
    const selectedCountry: string = this.selectedCountry;
    const latitude: number = this.myInformation.Latitude;
    const logitude: number = this.myInformation.Longitude;
    this.myProfileService.updateMyProfileLocation(selectedCity, selectedCountry, latitude, logitude, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
  }

  /** get last day month year */
  public getDateAndAge(year: number, month: number, day: number): void {
    this.lastDays = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentYear: number = new Date().getFullYear();
    this.age = currentYear - year;
    this.startYear = currentYear - 100;
    this.years = new Array(88);
    this.months = new Array(12);
    this.days = new Array(this.lastDays[month - 1]);
  }

  /** update birthday */
  public updateBirthday(): void {
    this.myProfileService.updateMyProfileBirthday(this.birthdayDay, this.birthdayMonth, this.birthdayYear, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
  }

  /** get occupation lists */
  public getOccupation(): void {
    this.myProfileService.getOccupationList(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.occupations = res.Data["Item"];
        }
      })
  }

  /** update Occupation */
  public updateOccupation(): void {
    this.myProfileService.updateMyProfileOccupation(this.selectedOccupation, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
  }

  /** get all spoken language */
  public getSpokenLanguage(): void {
    this.myProfileService.getSpokenLanguage(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.spokenLanguages = res.Data["Item"];
          for (let item of this.myInformation.PersonalInfo_SpokenLanguages.split(",")) {
            this.selectedSpokenLanguages = this.selectedSpokenLanguages.concat(this.spokenLanguages.filter(ele => ele.ID === parseInt(item, 10)));
          }
          this.spokenLanguages = this.spokenLanguages.filter((ele) => !this.selectedSpokenLanguages.includes(ele))
        }
      })
  }

  /** remove from spoken */
  public removeSpoken(removeLan: ListItem, index: number): void {
    if (this.selectedSpokenLanguages.length === 1) {
      return;
    }
    this.selectedSpokenLanguages.splice(index, 1);
    this.spokenLanguages = [removeLan].concat(this.spokenLanguages);
  }

  /** add to spoken */
  public addSpoken(addLan: ListItem, index: number): void {
    if (this.spokenLanguages.length === 1) {
      return;
    }
    this.spokenLanguages.splice(index, 1);
    this.selectedSpokenLanguages.push(addLan);
  }

  /** get Spoken language sending value */
  public getSpokenLanguageValue(): string {
    let spokenlanguageIds: string = "";
    for (let i = 0; i < this.selectedSpokenLanguages.length; i++) {
      if ((i + 1) === this.selectedSpokenLanguages.length) {
        spokenlanguageIds = spokenlanguageIds.concat(`${this.selectedSpokenLanguages[i].ID}`);
      } else {
        spokenlanguageIds = spokenlanguageIds.concat(`${this.selectedSpokenLanguages[i].ID},`)
      }
    }
    return spokenlanguageIds;
  }

  /** update spoken language */
  public updateSpokenLanguage(): void {
    const spokenLanguage: string = this.getSpokenLanguageValue();
    this.myProfileService.updateSpokenLanguage(this.token, spokenLanguage)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        } 
      });
  }

  /** get whole nationality lists */
  public getNationality(): void {
    this.myProfileService.getNationalities(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.nationalities = res.Data;
        }
      })
  }

  /** update nationality */
  public updateNationality(): void {
    this.myProfileService.updateMyProfileNationality(this.selectedNationality, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** get site support languages */
  public getSiteSupportLanguage(): void {
    this.myProfileService.getSiteSupportLanguages(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.DisplayLanguages = res.Data;
        }
      })
  }

  /** update site display language */
  public updateDispalyLanguage(): void {
    this.myProfileService.SetLanguage(this.selectedDisplayLanguage, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** set height at the first time */
  public setHeight(): void {
    let height: number = this.height - 140;
    if (height < 0) {
      height = 0;
    }
    (document.querySelector('.left.display.cm') as HTMLElement).style.bottom = `${height * 4.65}px`;
    (document.querySelector('.left.display.arrow') as HTMLElement).style.bottom = `${height * 4.65}px`;
    (document.querySelector('.right.display.inches') as HTMLElement).style.bottom = `${height * 4.65}px`;
    (document.querySelector('.right.display.arrow') as HTMLElement).style.bottom = `${height * 4.65}px`;
  }

  /** change height slider event */
  public sliderOnChange(height: number): void {
    this.height = height;
    this.inch = Math.floor(this.height/35);
    const newHeight: number = height - 140;
    (document.querySelector('.left.display.cm') as HTMLElement).style.bottom = `${newHeight * 4.65}px`;
    (document.querySelector('.left.display.arrow') as HTMLElement).style.bottom = `${newHeight * 4.65}px`;
    (document.querySelector('.right.display.inches') as HTMLElement).style.bottom = `${newHeight * 4.65}px`;
    (document.querySelector('.right.display.arrow') as HTMLElement).style.bottom = `${newHeight * 4.65}px`;
  }

  /** update height */
  public updateHeight(): void {
    this.myProfileService.updateHeight(this.token, this.height)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success")
        }
      })
  }

  /** get tattoo values */
  public getTattoo(): void {
    this.myProfileService.getTattoo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.tattoos = res.Data["Item"];
        }
      });
  }

  /** update tattoo */
  public updateTattoo(): void {
    this.myProfileService.updateTattoo(this.token, this.selectedTattoo)
      .subscribe((res: any) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** get smoking info */
  public getSmokings(): void {
    this.myProfileService.getSmokings(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.smokings = res.Data["Item"];
        }
      })
  }

  /** update smoking info */
  public updateSmoking(): void {
    this.myProfileService.updateSmoking(this.token, this.selectedSmoking)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** get relationships */
  public getRelationShips(): void {
    this.myProfileService.getRelationShips(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.relationShips = res.Data["Item"];
        }
      })
  }

  /** update relationship */
  public updateRelationShip(): void {
    this.myProfileService.updateRelationShip(this.token, this.selectedRelationShip)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** get children info */
  public getChildren(): void {
    this.myProfileService.getChildren(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.children = res.Data["Item"];
        }
      });
  }

  /** updat children info */
  public updateChild(): void {
    this.myProfileService.updateChild(this.token, this.selectedChild)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** get education info */
  public getEducation(): void {
    this.myProfileService.getEducation(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.educations = res.Data["Item"];
        }
      })
  }

  /** update education info */
  public updateEducation(): void {
    this.myProfileService.updateEducation(this.token, this.selectedEducation)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

}
