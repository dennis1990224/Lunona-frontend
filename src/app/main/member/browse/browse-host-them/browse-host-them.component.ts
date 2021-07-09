import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BrowseData } from '@app/model/browse.data';
import { MemberItem } from '@app/model/member_item';
import { BrowseService } from '@app/service/browse.service';
import { CookieService } from 'ngx-cookie-service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Options } from 'ng5-slider';
import { CountryInfo } from '@app/model/country_info';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { BrowseSearchData } from '@app/model/browse_search_data';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'app-browse-host-them',
  templateUrl: './browse-host-them.component.html',
  styleUrls: ['./browse-host-them.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrowseHostThemComponent implements OnInit {

  public isLoading: boolean = true;
  public cardLimit: number = -1;
  public token: string;
  public startPos: number = 0;
  public countRecords: number = 75;
  public countryInfo: string;
  public profileInfo: BrowseData;
  public profiles: MemberItem[];
  public command: string = "hostyourcity";
  public isSearch: boolean = false;
  public isCriteria: boolean = true;
  public country = new FormControl();
  public filterCountries: Observable<CountryInfo[]>;
  public allCountriesName: CountryInfo[];
  public countryISO: string;
  public selectedCountry: string;
  public isRowOneClear: boolean = false;
  public isRowTwoClear: boolean = false;
  public isNameText: boolean = false;
  public fromAge: string = "All";
  public toAge: string = "All";
  public fromAgeValue: string[] = [];
  public filterCities: Observable<string[]>;
  public allCities: string[];
  public city = new FormControl();
  public selectedCity: string;
  public socialMinValue: number = 0;
  public socialMaxValue: number = 4;
  public nameSearch: string = "";
  public options: Options = {
    stepsArray: [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 }
    ],
    translate: (value: number): string => {
      return "";
    }
  }

  constructor(
    private browseService: BrowseService,
    private cookieService: CookieService,
    private myProfileService: ProfileMyProfileService,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.countryInfo = this.cookieService.get("CountryISO");
    this.fromAgeValue[0] = this.fromAge;
    for (let i = 18; i < 99; i++) {
      this.fromAgeValue.push(`${i}`);
    }
    this.getBrowseHostThemProfile();
    this.getCountriesInfo();
  }

  ngOnInit(): void {
  }

  /** get browse profile info online */
  public getBrowseHostThemProfile(): void {
    this.isLoading = true;
    let searchData: BrowseSearchData = this.getDefaultSearchValue();
    this.browseService.getBrowseProfileInfo(searchData)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.isLoading = false;
          this.profileInfo = res.Data;
          this.profiles = res.Data.Profiles;
        }
      });
  }

  /** get default search value */
  public getDefaultSearchValue(): BrowseSearchData {
    let searchData: BrowseSearchData = new BrowseSearchData();
    searchData.City = "";
    searchData.Command = this.command;
    searchData.CountRecords = this.countRecords.toString();
    searchData.CountryISO = "";
    searchData.FromAGE = "18";
    searchData.LoginName = "";
    searchData.SocialEnd = "";
    searchData.SocialStart = "";
    searchData.StartPos = this.startPos.toString();
    searchData.ToAGE = "99";
    searchData.Token = this.token;
    return searchData;
  }

  /** get search value */
  public getSearchValue(): BrowseSearchData {
    let searchData: BrowseSearchData = new BrowseSearchData();
    if (this.selectedCity !== undefined) {
      searchData.City = this.selectedCity;
    } else {
      searchData.City = "";
    }
    searchData.Command = this.command;
    searchData.CountRecords = this.countRecords.toString();
    if (this.countryISO !== undefined) {
      searchData.CountryISO = this.countryISO;
    } else {
      searchData.CountryISO = "";
    }
    if (this.fromAge === "All") {
      searchData.FromAGE = "18";
    } else {
      searchData.FromAGE = this.fromAge;
    }
    if (this.toAge === "All") {
      searchData.ToAGE = "99";
    } else {
      searchData.ToAGE = this.toAge;
    }
    if (this.nameSearch !== undefined) {
      searchData.LoginName = this.nameSearch;
    } else {
      searchData.LoginName = "";
    }
    searchData.SocialEnd = this.getSocialStatus(this.socialMaxValue);
    searchData.SocialStart = this.getSocialStatus(this.socialMinValue);
    searchData.StartPos = this.startPos.toString();
    searchData.Token = this.token;
    return searchData;
  }

  /** get social status */
  public getSocialStatus(socialValue: number): string {
    switch (socialValue) {
      case 0:
        return "Normal";
      case 1:
        return "Star";
      case 2:
        return "Diamond";
      case 3:
        return "Princess";
      case 4:
        return "Queen";
    }
  }
  /** get countries information */
  public getCountriesInfo(): void {
    this.browseService.getCountriesInfo()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.allCountriesName = res.Data;
          this.filterCountries = this.country.valueChanges
            .pipe(
              map(value => value ? this._filter(value) : this.allCountriesName.slice())
            )
        }
      })
  }

  /** filter */
  private _filter(value: string): CountryInfo[] {
    this.CountryISO(value);
    if (value.length > 0) {
      this.isRowOneClear = true;
    } else {
      this.isRowOneClear = false;
    }
    const filterValuse = value.toLowerCase();
    return this.allCountriesName.filter(country => country.CountryName.toLowerCase().includes(filterValuse));
  }

  /** clear Text */
  public clearCountryText(): void {
    this.country.setValue("");
    this.isRowOneClear = false;
  }

  /** clear city text */
  public clearCityText(): void {
    this.city.setValue("");
    this.isRowTwoClear = false;
  }

  /** get countryISO with countryName */
  public CountryISO(countryName: string): void {
    this.countryISO = '';
    const found: CountryInfo = this.allCountriesName.find(element => element.CountryName == countryName);
    if (found) {
      this.countryISO = found.CountryISO;
      this.selectedCountry = found.CountryName;
    }
  }

  /** filter city key press event */
  public GetCitiesAndZip(key: string): void {
    if (key.length > 0) {
      this.isRowTwoClear = true;
    } else {
      this.isRowTwoClear = false;
    }
    if (key.length > 2) {
      this.myProfileService.getCitiesAndZip(key, this.countryISO, this.token)
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

  /** scroll down event */
  public onScroll(): void {
    this.startPos = this.startPos + this.countRecords;
    this.countRecords = 50;
    let searchData: BrowseSearchData = this.getSearchValue();
    this.browseService.getBrowseProfileInfo(searchData)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profiles = this.profiles.concat(res.Data.Profiles);
        }
      });
  }

  /** open search field */
  public openSearch(): void {
    this.isSearch = !this.isSearch;
  }

  /** search by criteria */
  public goToCriteria(): void {
    this.isCriteria = true;
  }

  /** search by name */
  public goToSearchByName(): void {
    this.isCriteria = false;
  }

  /** search name text change event */
  public inputText(key: string): void {
    if (key.length > 0) {
      this.isNameText = true;
    } else {
      this.isNameText = false;
    }
  }

  /** clear name text */
  public clearNameText(): void {
    if (this.isNameText) {
      this.nameSearch = "";
      this.isNameText = false;
    }
  }

  /** get default values when click clear all */
  public getDefaultValues(): void {
    this.startPos = 0;
    this.countRecords = 75;
    this.getBrowseHostThemProfile();
    this.openSearch();
  }

  /** get criteria search results */
  public getCriteriaSearch(): void {
    this.countRecords = 75;
    this.startPos = 0;
    let searchData: BrowseSearchData = this.getSearchValue();
    this.browseService.getBrowseProfileInfo(searchData)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileInfo = res.Data;
          this.profiles = res.Data.Profiles;
          this.openSearch();
        }
      });
  }

  /** search by name */
  public searchMemberByName(): void {
    let searchData: BrowseSearchData = this.getSearchValue();
    this.browseService.getBrowseProfileInfo(searchData)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileInfo = res.Data;
          this.profiles = res.Data.Profiles;
          this.openSearch();
        }
      });
  }
}
