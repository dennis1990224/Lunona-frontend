import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { AuthFooterComponent } from '@app/shared-component/auth-footer/auth-footer.component';
import { DataShareService } from '@app/service/data-share.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '@app/service/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LanguageElement } from '@app/model/language_element';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { LocationInfo } from '@app/model/location_info';
import { CountryInfo } from '@app/model/country_info';
import { DatePipe } from '@angular/common';
import { LoginReturnValue } from '@app/model/login_return';
import { ListItem } from '@app/model/list_item';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('AuthFooter') AuthFooter: AuthFooterComponent;

  public languagePublicElements: LanguageElement[];
  public registerEmailForm: FormGroup;
  public emailErrorMessage: string;
  public isEmailError: boolean = false;
  public selectedEmail: string;
  public selectedName: string;
  public nameErrorMessage: string;
  public isUsernameError: boolean = false;
  public passErrorMessage: string;
  public registerStep: number = 1;
  public userNameForm: FormGroup;
  public passwordForm: FormGroup;
  public isPassError: boolean = false;
  public passwordHide: boolean = true;
  public isMale: boolean = true;
  public gender: string = "male";
  public minDate: Date;
  public maxDate: Date;
  public birthdayDate: Date;
  public selectedBirth: string;
  public country = new FormControl();
  public filterCountries: Observable<CountryInfo[]>;
  public allCountriesName: CountryInfo[];
  public preSelectedCountry: LocationInfo;
  public city = new FormControl();
  public filterCities: Observable<string[]>;
  public allCities: string[];
  public preSelectedCity: string;
  public countryISO: string;
  public selectedCountry: string;
  public selectedCity: string;
  public selectedOccupation: ListItem;
  public selectedOccupationString: string;
  public occupations: ListItem[];
  public lastDays: number[];
  public days = [];
  public months = [];
  public years = [];
  public startYear: number;
  public birthdayDay: number;
  public birthdayMonth: number;
  public birthdayYear: number;
  public age: number;
  public registerResult: LoginReturnValue;

  constructor(
    private dataShareService: DataShareService,
    private cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    public datePipe: DatePipe,
    private router: Router,
  ) {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - 18, 0, 1);
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.birthdayDate = new Date(currentYear - 40, 3, 20);
    this.selectedBirth = this.datePipe.transform(this.birthdayDate, "dd/MM/yyyy") as string;

    /** birthday part set */
    this.birthdayDay = 11;
    this.birthdayMonth = 5;
    this.birthdayYear = 1980;
    this.getDateAndAge(this.birthdayYear, this.birthdayMonth, this.birthdayDay);
  }

  ngOnInit(): void {
    this.registerEmailForm = this._formBuilder.group({
      email: ['', [Validators.required]],
    });
    this.userNameForm = this._formBuilder.group({
      name: ['', [Validators.required]],
    });
    this.passwordForm = this._formBuilder.group({
      password: ['', [Validators.required]],
    });
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
    }
  }

  ngAfterViewInit() {
    this.AuthFooter.getFooterLanguage();
    this.cdr.detectChanges();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      switch (this.registerStep) {
        case 1:
          this.checkEmailFree();
          break;
        case 2:
          this.CheckNicknameFree();
          break;
        case 3:
          this.checkPasswordValid();
          break;
        case 4:
          this.goToBorn();
          break;
        case 5:
          this.getLocationInfo();
        case 6:
          this.goToCityLooking();
          break;
        case 7:
          this.goToOccupation();
          break;
        case 8:
          this.goToFinishStep();
          break;
        case 9:
          this.register();
          break;
      }
    }
  }

  /** check email is free in WS */
  public checkEmailFree(): void {
    this.selectedEmail = this.registerEmailForm.value.email;
    const LanguageISO: string = this.cookieService.get('lunaoLang');
    this.authService.checkEmailFree(this.selectedEmail, LanguageISO)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.registerStep += 1;
        } else {
          this.emailErrorMessage = res.ErrorMessage;
          this.isEmailError = true;
        }
      });
  }

  /** check nick name is free in WS */
  public CheckNicknameFree(): void {
    this.selectedName = this.userNameForm.value.name;
    const LanguageISO: string = this.cookieService.get('lunaoLang');
    this.authService.checkNickNameFree(this.selectedName, LanguageISO)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.registerStep += 1;
        } else {
          this.nameErrorMessage = res.ErrorMessage;
          this.isUsernameError = true;
        }
      });
  }

  /** check password is valid */
  public checkPasswordValid(): void {
    const password: string = this.passwordForm.value.password;
    const LanguageISO: string = this.cookieService.get('lunaoLang');
    this.authService.checkPasswordValid(password, LanguageISO)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.registerStep += 1;
        } else {
          this.passErrorMessage = res.ErrorMessage;
          this.isPassError = true;
        }
      });
  }

  /** get location info */
  public getLocationInfo(): void {
    this.authService.getLocationInfo()
      .subscribe((res) => {
        if (res) {
          this.preSelectedCountry = res;
          this.country.setValue(this.preSelectedCountry.Country);
          this.getCountries();
          this.registerStep += 1;
        }
      });
  }

  /** go to find city */
  public goToCityLooking(): void {
    if (this.countryISO) {
      this.registerStep += 1;
    }
  }

  /** find city key press event */
  public GetCitiesAndZip(key: string): void {
    if (key.length > 2) {
      this.authService.GetCitiesAndZip(key, this.countryISO)
        .subscribe((res) => {
          if (res.ErrorMessage === "OK") {
            this.allCities = res.Data;
            this.filterCities = this.city.valueChanges
              .pipe(
                startWith(''),
                map(value => value ? this.cityFilter(value) : this.allCities.slice())
              )
          }
        })
    }
  }

  /** get countries */
  public getCountries(): void {
    this.authService.getCountries()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.allCountriesName = res.Data;
          this.filterCountries = this.country.valueChanges
            .pipe(
              startWith(this.preSelectedCountry.Country),
              map(value => value ? this._filter(value) : this.allCountriesName.slice())
            );
        }
      });
  }

  /** city filter */
  private cityFilter(value: string): string[] {
    this.selectedCity = value;
    const filterValues: string = value.toLowerCase();
    return this.allCities.filter(city => city.toLowerCase().includes(filterValues));
  }

  /** filter */
  private _filter(value: string): CountryInfo[] {
    this.CountryISO(value);
    const filterValuse = value.toLowerCase();
    return this.allCountriesName.filter(country => country.CountryName.toLowerCase().includes(filterValuse));
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

  /** change Birthday */
  public changeBirthday(): void {
    this.selectedBirth = this.datePipe.transform(this.birthdayDate, "dd/MM/yyyy") as string;
  }

  /** go to occupation step */
  public goToOccupation(): void {
    const LanguageISO: string = this.cookieService.get('lunaoLang');
    this.authService.GetOccupations(LanguageISO)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.occupations = res.Data["Item"];
          this.registerStep += 1;
        }
      });
  }

  /** select Occupation */
  public selectOccupation(): void {
    this.selectedOccupationString = this.selectedOccupation.Title;
  }

  /** go to finish step */
  public goToFinishStep(): void {
    this.registerStep += 1;
  }

  /** change gender */
  public changeGender(gender?: string): void {
    if (gender) {
      this.gender = gender;
    }
    if (this.gender === "male") {
      this.isMale = true;
    } else {
      this.isMale = false;
    }
  }

  /** go to born page */
  public goToBorn(): void {
    this.registerStep += 1;
  }

  /** finish all steps and register */
  public register(): void {
    const sendingData = {
      UserBasicInfo: {
        BirthdayDay: this.birthdayDay,
        BirthdayMonth: this.birthdayMonth,
        BirthdayYear: this.birthdayYear,
        City: this.selectedCity,
        CountryISO: this.countryISO,
        Country: this.selectedCountry,
        StateISO: "",
        Email: this.selectedEmail,
        GenderID: this.gender == 'male' ? 1 : 2,
        LanguageISO: this.cookieService.get('lunaoLang'),
        LoginName: this.selectedName,
        Password: this.passwordForm.value.password,
        BusinessSectorID: this.selectedOccupation.ID,
        CookieVisitorUID: this.cookieService.get('CookieVisitorUID'),
        EUP_ProfileSocialDataGUID: null,
      }
    }
    this.authService.register(sendingData)
      .subscribe(res => {
        if (res.RegisterUserWithEmailResult["ErrorMessage"] === "OK") {
          this.registerResult = res.RegisterUserWithEmailResult["Data"];
          this.cookieService.set("UserName", this.registerResult.LoginName);
          this.cookieService.set("Avatar", this.registerResult.ProfilePhotoUrl);
          this.cookieService.set("Email", this.registerResult.EmailORSocialNameOrSocialID);
          this.cookieService.set("LunonaToken", this.registerResult.Token.toString(), 3600);
          sessionStorage.setItem('AuthenticateSessionID', this.registerResult.AuthenticateSessionID);
          this.router.navigateByUrl('/member/browse/dashboard');
        }
      }, error => {
        console.log(error)
      });
  }

  /** go to back step */
  public goToBackStep(): void {
    if (this.registerStep > 1) {
      this.registerStep -= 1;
    }
    return;
  }

  /** get language element with keyword */
  public getTranslate(keyword: string): string {
    for (let item of this.languagePublicElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  /** get all language and trigger get footer language */
  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.AuthFooter.getFooterLanguage();
    }
  }
}
