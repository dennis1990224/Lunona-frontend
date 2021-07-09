import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingFemaleFooterComponent } from '@app/shared-component/landing-female-footer/landing-female-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';
import { LocationInfo } from '@app/model/location_info';
import { FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { CountryInfo } from '@app/model/country_info';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { AuthService } from '@app/service/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-female-eight',
  templateUrl: './female-eight.component.html',
  styleUrls: ['./female-eight.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FemaleEightComponent implements OnInit {

  @ViewChild('landingFemaleFooter') landingFemaleFooter: LandingFemaleFooterComponent;

  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public pubicLikes: any;
  public bodyTypes: any;
  public bodySkins: any;
  public heights: any;
  public ages: any;
  public professions: any;
  public locationInfo: LocationInfo
  public steps: number = 1;
  public likeLevels = [
    {
      id: 3,
      level: "My Dream"
    },
    {
      id: 2,
      level: "Very"
    },
    {
      id: 1,
      level: "So-So"
    },
    {
      id: 0,
      level: "Not for me"
    }
  ];

  public country = new FormControl();
  public city = new FormControl();
  public filterCountries: Observable<CountryInfo[]>;
  public countryIso: string;
  public allCountriesName: CountryInfo[];
  public filterCities: Observable<string[]>;
  public allCities: string[];
  public selectedCity: string;
  public selectedCountry: string;
  public name: string;
  public password: string;
  public email: string;
  public nameErrorMessage: string;
  public isNameError: boolean = false;
  public isNameSuccess: boolean = false;
  public passErrorMessage: string;
  public isPassError: boolean = false;
  public isPassSuccess: boolean = false;
  public isEmailSuccess: boolean = false;
  public emailErrorMessage: string;
  public isEmailError: boolean = false;
  public registerResult: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private animService: AnimateNavigationService,
    private dataShareService: DataShareService,
    private cdr: ChangeDetectorRef,
    private myProfileService: ProfileMyProfileService,
    private authService: AuthService,
    private cookieService: CookieService,
    private _formBuilder: FormBuilder,
  ) {
    this.activatedRoute.parent.url.subscribe(url => {
      this.genderPath = url[0].path;
    })
    this.activatedRoute.url.subscribe(url => {
      this.pagePath = parseInt(url[0].path, 10);
    });
  }

  ngAfterViewInit() {
    this.landingFemaleFooter.getFooterLanguage();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getPublicLikes();
    this.getLocationInfo();
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
    }
  }

  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.landingFemaleFooter.getFooterLanguage();
    }
  }

  public getTranslate(keyword: string): string {
    for (let item of this.languagePublicElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  @HostListener("mousewheel", ["$event"])
  public onMouseWheel(event) {
    if (event.wheelDelta > 0) {
      if (this.pagePath === 1) {
        return;
      }
      const newUrl: string = `${this.genderPath}/${this.pagePath - 1}`;
      this.animService.setCurrentAnimation(4);
      this.router.navigateByUrl(newUrl);
    } else {
      if (this.pagePath === 9) {
        return;
      }
      const newUrl: string = `${this.genderPath}/${this.pagePath + 1}`;
      this.animService.setCurrentAnimation(3);
      this.router.navigateByUrl(newUrl);
    }
  }

  /** get public likes */
  public getPublicLikes(): void {
    this.myProfileService.getPublicLikes()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.pubicLikes = res.DefaultPublicLikes;
          this.ages = this.pubicLikes["GuestMenAge"];
          this.heights = this.pubicLikes["GuestMenHeight"];
          this.professions = this.pubicLikes["GuestManProffession"];
          console.log(this.pubicLikes)
        }
      })
  }

  /** get location info */
  public getLocationInfo(): void {
    this.myProfileService.getLocationLanding()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.locationInfo = res.Data;
          this.countryIso = this.locationInfo.CountryISO.toLowerCase();
          this.country.setValue(this.locationInfo.Country);
          this.city.setValue(this.locationInfo.City);
          this.getCountries();
        }
      })
  }

  /** get whole countries */
  public getCountries(): void {
    this.myProfileService.getCountries()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.allCountriesName = res.Data;
          this.filterCountries = this.country.valueChanges
            .pipe(
              startWith(this.locationInfo.Country),
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
      this.authService.GetCitiesAndZip(key, this.countryIso)
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

  /** go to next step */
  public goToNextStep(): void {
    this.steps = this.steps + 1;
  }

  /** go to back step */
  public goToBackStep(): void {
    this.steps = this.steps - 1;
  }

  /** check name */
  public checkName(name: string): void {
    console.log(name);
    const languageISO: string = this.cookieService.get('lunaoLang');
    if (name.length > 0) {
      this.authService.checkNickNameFree(name, languageISO)
        .subscribe((res) => {
          if (res.ErrorMessage === "OK") {
            this.isNameError = false;
            this.isNameSuccess = true;
          } else {
            this.nameErrorMessage = res.ErrorMessage;
            this.isNameError = true;
            this.isNameSuccess = false;
          }
        });
    } else {
      this.isNameSuccess = false;
      this.isNameError = false;
    }
  }

  /** check password */
  public checkPassword(password: string): void {
    const languageISO: string = this.cookieService.get('lunaoLang');
    this.authService.checkPasswordValid(password, languageISO)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.isPassError = false;
          this.isPassSuccess = true;
        } else {
          this.passErrorMessage = res.ErrorMessage;
          this.isPassError = true;
          this.isPassSuccess = false;
        }
      })
  }

  /** check email */
  public checkEmail(email: string): void {
    console.log(email)
    const languageISO: string = this.cookieService.get('lunaoLang');
    this.authService.checkEmailFree(email, languageISO)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.isEmailSuccess = true;
          this.isEmailError = false;
        } else {
          this.isEmailSuccess = false;
          this.isEmailError = true;
          this.emailErrorMessage = res.ErrorMessage;
        }
      })
  }

  /** register guest man */
  public registerMan(): void {
    const sendingData = {
      UserInfo: {
        City: this.selectedCity,
        CookieVisitorUID: this.cookieService.get('CookieVisitorUID'),
        Country: this.selectedCountry,
        CountryISO: this.countryIso,
        Email: this.email,
        GuestManProffession: {
          Sector11: this.professions.Sector11,
          Sector12: this.professions.Sector12,
          Sector13: this.professions.Sector13,
          Sector14: this.professions.Sector14,
          Sector15: this.professions.Sector15,
        },
        GuestWomanAge: {
          AgeA: this.ages.AgeA,
          AgeB: this.ages.AgeB,
          AgeC: this.ages.AgeC,
          AgeD: this.ages.AgeD,
          AgeE: this.ages.AgeE,
        },
        LanguageISO: this.cookieService.get('lunaoLang'),
        Latitude: 0,
        LoginName: this.name,
        Longitude: 0,
        Password: this.password,
        Region: "",
        StateISO: "",
        StateName: this.selectedCity,
        Zip: "",
        undefined: {},
      }
    }

    this.authService.regiterGuestWoman(sendingData)
      .subscribe((res) => {
        console.log(res)
        if (res.RegisterGuestManResult["ErrorMessage"] === "OK") {
          this.registerResult = res.RegisterGuestManResult["Data"];
          this.cookieService.set("UserName", this.registerResult.LoginName);
          this.cookieService.set("Avatar", this.registerResult.ProfilePhotoUrl);
          this.cookieService.set("Email", this.registerResult.EmailORSocialNameOrSocialID);
          this.cookieService.set("LunonaToken", this.registerResult.Token.toString(), 3600);
          sessionStorage.setItem('AuthenticateSessionID', this.registerResult.AuthenticateSessionID);
          this.router.navigateByUrl('/member/browse/dashboard');
        }
      })
  }
}
