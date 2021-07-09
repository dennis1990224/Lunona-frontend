import { Component, OnInit, Output } from '@angular/core';
import { LandingPage } from '@app/enums/landingPage.enum';
import { LanguageService } from '@app/service/language.service';
import { SplashService } from '@app/service/splash.service';
import { SiteSupportingLanguage } from '@app/model/site_supporting_language';
import { LanguageElement } from '@app/model/language_element';
import { CookieService } from 'ngx-cookie-service';
import { DataShareService } from '@app/service/data-share.service';
import { EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent implements OnInit {

  @Output() public getLanguage: EventEmitter<boolean> = new EventEmitter<boolean>();

  public selectedLanguage: string = LandingPage.ENGLISH.toString().toUpperCase();
  public siteSupportLanguages: SiteSupportingLanguage[];
  public languageRootElements: LanguageElement[];
  public languagePublicElements: LanguageElement[];
  public menuMemberTitle: string = '';
  public menuLoginTitle: string = '';
  public menuRulesTitle: string = '';
  public menuSearchTitle: string = '';
  public genderPath: string;
  public pagePath: number;
  public CookieVisitorUID: Guid;

  constructor(
    private activatedRoute: ActivatedRoute,
    private lanService: LanguageService,
    private splashService: SplashService,
    private cookieService: CookieService,
    private dataShareService: DataShareService,
    private router: Router,
    private animService: AnimateNavigationService,
  ) {
    if (!this.cookieService.get("CookieVisitorUID")) {
      this.CookieVisitorUID = Guid.create();
      this.cookieService.set("CookieVisitorUID", this.CookieVisitorUID.toString(), 3600);
    }
    this.getSiteSupportLanguage();  
    this.getLanguage.emit();
    this.activatedRoute.parent.url.subscribe(url => {
      this.genderPath = url[0].path;
    })
    this.activatedRoute.url.subscribe(url => {
      if (url.length > 0) {
        this.pagePath = parseInt(url[0].path, 10);
      }
    });
  }

  ngOnInit(): void {
    /** check exist language element for landing page and get language element */
    if (!this.dataShareService.getLanguagePublicElements()) {
      this.getLanguageElementsPublicNoSplash(this.cookieService.get('lunaoLang'));
      this.getLanguageElementsRoot(this.cookieService.get('lunaoLang'));
    } else {
      this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
      this.getHeaderLanguage();
    }
    switch (this.cookieService.get('lunaoLang')) {
      case "US":
        this.selectedLanguage = LandingPage.ENGLISH.toString().toUpperCase();
        break;
      case "RU":
        this.selectedLanguage = LandingPage.RUSSIAN.toString().toUpperCase();
        break;
      case "GR":
        this.selectedLanguage = LandingPage.GREEK.toString().toUpperCase();
        break;
      case "BG":
        this.selectedLanguage = LandingPage.BULGARIAN.toString().toUpperCase();
        break;
    }
  }

  /** language change event */
  public selectLanguage(language: SiteSupportingLanguage): void {
    if (this.cookieService.get('lunaoLang') === language.LanguageISO) {
      return;
    }
    this.selectedLanguage = language.LanguageTitleInUS.toUpperCase();
    this.getLanguageElementsPublic(language.LanguageISO);
    this.getLanguageElementsRoot(language.LanguageISO);
  }

  /** get site support languages */
  public getSiteSupportLanguage(): void {
    this.lanService.getSiteSupportLanguage()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.siteSupportLanguages = res.Data;
        }
      }, (err) => {
        console.log(err);
      });
  }

  /** get language element on ngOninit without no splash */
  public getLanguageElementsPublicNoSplash(languageIso: string): void {
    const elementMask: string = 'Public';
    this.lanService.getLanguageElements(languageIso, elementMask)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.languagePublicElements = res.Data;
          this.cookieService.set('lunaoLang', languageIso);
          this.dataShareService.setLanguagePublicElements(this.languagePublicElements);
          this.getHeaderLanguage();
          this.getLanguage.emit();
        }
      }, (err) => {
        console.log(err);
      });
  }

  /** get header language */
  public getHeaderLanguage(): void {
    this.menuMemberTitle = this.getTranslate('Public.Index.Men.Menu.MenuMemberTitle');
    this.menuLoginTitle = this.getTranslate('Public.Index.Men.Menu.MenuLoginTitle');
    this.menuRulesTitle = this.getTranslate('Public.Index.Men.Menu.MenuRulesTitle');
    this.menuSearchTitle = this.getTranslate('Public.Index.Men.Menu.MenuSearchTitle');
  }

  /** get translate with keyword */
  public getTranslate(keyword: string): string {
    for (let item of this.languagePublicElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  /** get language element when chage the language show splash */
  public getLanguageElementsPublic(languageIso: string): void {
    this.splashService.show();
    const elementMask: string = 'Public';
    this.lanService.getLanguageElements(languageIso, elementMask)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.languagePublicElements = res.Data;
          this.cookieService.set('lunaoLang', languageIso);
          this.dataShareService.setLanguagePublicElements(this.languagePublicElements);
          this.getLanguage.emit();
          this.getHeaderLanguage();
          this.splashService.hide();
        }
      }, (err) => {
        console.log(err);
      });
  }

  /** get language element for root */
  public getLanguageElementsRoot(languageIso: string): void {
    const elementMask: string = 'root';
    this.lanService.getLanguageElements(languageIso, elementMask)
      .subscribe((res) => {
        this.languageRootElements = res.Data;
      }, (err) => {
        console.log(err);
      });
  }

  /** go to login page */
  public goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  /** go to register page */
  public goToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  /** go to search page */
  public goToSearch(): void {
    const newUrl: string = `${this.genderPath}/8`;
    if (this.pagePath && this.pagePath < 8) {
      this.animService.setCurrentAnimation(3);
      this.router.navigateByUrl(newUrl);
    }
    if (this.pagePath && this.pagePath > 8) {
      this.animService.setCurrentAnimation(4);
      this.router.navigateByUrl(newUrl);
    }
    if (!this.pagePath) {
      const maleRuleURL: string = `landing-male/8`;
      this.router.navigateByUrl(maleRuleURL);
    }
  }

  /** go to rules page */
  public goToRules(): void {
    const newUrl: string = `${this.genderPath}/5`;
    if (this.pagePath && this.pagePath < 5) {
      this.animService.setCurrentAnimation(3);
      this.router.navigateByUrl(newUrl);
    }
    if (this.pagePath && this.pagePath > 5) {
      this.animService.setCurrentAnimation(4);
      this.router.navigateByUrl(newUrl);
    }
    if (!this.pagePath) {
      const maleRuleURL: string = `landing-male/5`;
      this.router.navigateByUrl(maleRuleURL);
    }
  }

}
