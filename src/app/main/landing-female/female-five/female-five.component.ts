import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingFemaleFooterComponent } from '@app/shared-component/landing-female-footer/landing-female-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-female-five',
  templateUrl: './female-five.component.html',
  styleUrls: ['./female-five.component.scss']
})
export class FemaleFiveComponent implements OnInit, AfterViewInit {

  @ViewChild('landingFemaleFooter') landingFemaleFooter: LandingFemaleFooterComponent;
  
  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public TopRibbonContent: string = '';
  public PerfectTitle: string = '';
  public PerfectDescription: string = '';
  public FreeTitle: string = '';
  public FreeDescription: string = '';
  public AppreciateTitle: string = '';
  public AppreciateDescription: string = '';
  public FunTitle: string = '';
  public FunDescription: string = '';
  public UniqueTitle: string = '';
  public UniqueDescription: string = '';
  public JealousyTitle: string = '';
  public JealousyDescription: string = '';
  public DecideTitle: string = '';
  public DecideDescription: string = '';
  public FriendsTitle: string = '';
  public FriendsDescription: string = '';
  public StrongerTitle: string = '';
  public StrongerDescription: string = '';
  public CareTitle: string = '';
  public CareDescription: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private animService: AnimateNavigationService,
    private dataShareService: DataShareService,
    private cdr: ChangeDetectorRef
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
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.TopRibbonContent = this.getTranslate("Public.Index.Women.Page5.TopRibbonContent");
      this.PerfectTitle = this.getTranslate("Public.Index.Women.Page5.PerfectTitle");
      this.PerfectDescription = this.getTranslate("Public.Index.Women.Page5.PerfectDescription");
      this.FreeTitle = this.getTranslate("Public.Index.Women.Page5.FreeTitle");
      this.FreeDescription = this.getTranslate("Public.Index.Women.Page5.FreeDescription");
      this.AppreciateTitle = this.getTranslate("Public.Index.Women.Page5.AppreciateTitle");
      this.AppreciateDescription = this.getTranslate("Public.Index.Women.Page5.AppreciateDescription");
      this.FunTitle = this.getTranslate("Public.Index.Women.Page5.FunTitle");
      this.FunDescription = this.getTranslate("Public.Index.Women.Page5.FunDescription");
      this.UniqueTitle = this.getTranslate("Public.Index.Women.Page5.UniqueTitle");
      this.UniqueDescription = this.getTranslate("Public.Index.Women.Page5.UniqueDescription");
      this.JealousyTitle = this.getTranslate("Public.Index.Women.Page5.JealousyTitle");
      this.JealousyDescription = this.getTranslate("Public.Index.Women.Page5.JealousyDescription");
      this.DecideTitle = this.getTranslate("Public.Index.Women.Page5.DecideTitle");
      this.DecideDescription = this.getTranslate("Public.Index.Women.Page5.DecideDescription");
      this.FriendsTitle = this.getTranslate("Public.Index.Women.Page5.FriendsTitle");
      this.FriendsDescription = this.getTranslate("Public.Index.Women.Page5.FriendsDescription");
      this.StrongerTitle = this.getTranslate("Public.Index.Women.Page5.StrongerTitle");
      this.StrongerDescription = this.getTranslate("Public.Index.Women.Page5.StrongerDescription");
      this.CareTitle = this.getTranslate("Public.Index.Women.Page5.CareTitle");
      this.CareDescription = this.getTranslate("Public.Index.Women.Page5.CareDescription");
    }
  }
  
  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.landingFemaleFooter.getFooterLanguage();
      this.TopRibbonContent = this.getTranslate("Public.Index.Women.Page5.TopRibbonContent");
      this.PerfectTitle = this.getTranslate("Public.Index.Women.Page5.PerfectTitle");
      this.PerfectDescription = this.getTranslate("Public.Index.Women.Page5.PerfectDescription");
      this.FreeTitle = this.getTranslate("Public.Index.Women.Page5.FreeTitle");
      this.FreeDescription = this.getTranslate("Public.Index.Women.Page5.FreeDescription");
      this.AppreciateTitle = this.getTranslate("Public.Index.Women.Page5.AppreciateTitle");
      this.AppreciateDescription = this.getTranslate("Public.Index.Women.Page5.AppreciateDescription");
      this.FunTitle = this.getTranslate("Public.Index.Women.Page5.FunTitle");
      this.FunDescription = this.getTranslate("Public.Index.Women.Page5.FunDescription");
      this.UniqueTitle = this.getTranslate("Public.Index.Women.Page5.UniqueTitle");
      this.UniqueDescription = this.getTranslate("Public.Index.Women.Page5.UniqueDescription");
      this.JealousyTitle = this.getTranslate("Public.Index.Women.Page5.JealousyTitle");
      this.JealousyDescription = this.getTranslate("Public.Index.Women.Page5.JealousyDescription");
      this.DecideTitle = this.getTranslate("Public.Index.Women.Page5.DecideTitle");
      this.DecideDescription = this.getTranslate("Public.Index.Women.Page5.DecideDescription");
      this.FriendsTitle = this.getTranslate("Public.Index.Women.Page5.FriendsTitle");
      this.FriendsDescription = this.getTranslate("Public.Index.Women.Page5.FriendsDescription");
      this.StrongerTitle = this.getTranslate("Public.Index.Women.Page5.StrongerTitle");
      this.StrongerDescription = this.getTranslate("Public.Index.Women.Page5.StrongerDescription");
      this.CareTitle = this.getTranslate("Public.Index.Women.Page5.CareTitle");
      this.CareDescription = this.getTranslate("Public.Index.Women.Page5.CareDescription");
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
}
