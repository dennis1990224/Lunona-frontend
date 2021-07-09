import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingFooterComponent } from '@app/shared-component/landing-footer/landing-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-male-five',
  templateUrl: './male-five.component.html',
  styleUrls: ['./male-five.component.scss']
})
export class MaleFiveComponent implements OnInit {

  @ViewChild('landingMaleFooter') landingMaleFooter: LandingFooterComponent;

  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public TopRibbonContent: string = '';
  public GiftsTitle: string = '';
  public GiftsDescription: string = '';
  public TenderTitle: string = '';
  public TenderDescription: string = '';
  public KindTitle: string = '';
  public KindDescription: string = '';
  public ProblemsTitle: string = '';
  public ProblemsDescription: string = '';
  public PrincessTitle: string = '';
  public PrincesDescription: string = '';
  public BeautifulTitle: string = '';
  public BeautifulDescription: string = '';
  public PayTitle: string = '';
  public PayDescription: string = '';
  public FlawlessTitle: string = '';
  public FlawlessDescription: string = '';
  public StrongTitle: string = '';
  public StrongDescription: string = '';
  public FunTitle: string = '';
  public FunDescription: string = '';

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
    this.landingMaleFooter.getFooterLanguage();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.TopRibbonContent = this.getTranslate("Public.Index.Men.Page5.TopRibbonContent");
      this.GiftsTitle = this.getTranslate("Public.Index.Men.Page5.GiftsTitle");
      this.GiftsDescription = this.getTranslate("Public.Index.Men.Page5.GiftsDescription");
      this.TenderTitle = this.getTranslate("Public.Index.Men.Page5.TenderTitle");
      this.TenderDescription = this.getTranslate("Public.Index.Men.Page5.TenderDescription");
      this.KindTitle = this.getTranslate("Public.Index.Men.Page5.KindTitle");
      this.KindDescription = this.getTranslate("Public.Index.Men.Page5.KindDescription");
      this.ProblemsTitle = this.getTranslate("Public.Index.Men.Page5.ProblemsTitle");
      this.ProblemsDescription = this.getTranslate("Public.Index.Men.Page5.ProblemsDescription");
      this.PrincessTitle = this.getTranslate("Public.Index.Men.Page5.PrincessTitle");
      this.PrincesDescription = this.getTranslate("Public.Index.Men.Page5.PrincesDescription");
      this.BeautifulTitle = this.getTranslate("Public.Index.Men.Page5.BeautifulTitle");
      this.BeautifulDescription = this.getTranslate("Public.Index.Men.Page5.BeautifulDescription");
      this.PayTitle = this.getTranslate("Public.Index.Men.Page5.PayTitle");
      this.PayDescription = this.getTranslate("Public.Index.Men.Page5.PayDescription");
      this.FlawlessTitle = this.getTranslate("Public.Index.Men.Page5.FlawlessTitle");
      this.FlawlessDescription = this.getTranslate("Public.Index.Men.Page5.FlawlessDescription");
      this.StrongTitle = this.getTranslate("Public.Index.Men.Page5.StrongTitle");
      this.StrongDescription = this.getTranslate("Public.Index.Men.Page5.StrongDescription");
      this.FunTitle = this.getTranslate("Public.Index.Men.Page5.FunTitle");
      this.FunDescription = this.getTranslate("Public.Index.Men.Page5.FunDescription");
    }
  }
  
  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.landingMaleFooter.getFooterLanguage();
      this.TopRibbonContent = this.getTranslate("Public.Index.Men.Page5.TopRibbonContent");
      this.GiftsTitle = this.getTranslate("Public.Index.Men.Page5.GiftsTitle");
      this.GiftsDescription = this.getTranslate("Public.Index.Men.Page5.GiftsDescription");
      this.TenderTitle = this.getTranslate("Public.Index.Men.Page5.TenderTitle");
      this.TenderDescription = this.getTranslate("Public.Index.Men.Page5.TenderDescription");
      this.KindTitle = this.getTranslate("Public.Index.Men.Page5.KindTitle");
      this.KindDescription = this.getTranslate("Public.Index.Men.Page5.KindDescription");
      this.ProblemsTitle = this.getTranslate("Public.Index.Men.Page5.ProblemsTitle");
      this.ProblemsDescription = this.getTranslate("Public.Index.Men.Page5.ProblemsDescription");
      this.PrincessTitle = this.getTranslate("Public.Index.Men.Page5.PrincessTitle");
      this.PrincesDescription = this.getTranslate("Public.Index.Men.Page5.PrincesDescription");
      this.BeautifulTitle = this.getTranslate("Public.Index.Men.Page5.BeautifulTitle");
      this.BeautifulDescription = this.getTranslate("Public.Index.Men.Page5.BeautifulDescription");
      this.PayTitle = this.getTranslate("Public.Index.Men.Page5.PayTitle");
      this.PayDescription = this.getTranslate("Public.Index.Men.Page5.PayDescription");
      this.FlawlessTitle = this.getTranslate("Public.Index.Men.Page5.FlawlessTitle");
      this.FlawlessDescription = this.getTranslate("Public.Index.Men.Page5.FlawlessDescription");
      this.StrongTitle = this.getTranslate("Public.Index.Men.Page5.StrongTitle");
      this.StrongDescription = this.getTranslate("Public.Index.Men.Page5.StrongDescription");
      this.FunTitle = this.getTranslate("Public.Index.Men.Page5.FunTitle");
      this.FunDescription = this.getTranslate("Public.Index.Men.Page5.FunDescription");
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
