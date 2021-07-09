import { Component, OnInit, HostListener, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingFemaleFooterComponent } from '@app/shared-component/landing-female-footer/landing-female-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-female-two',
  templateUrl: './female-two.component.html',
  styleUrls: ['./female-two.component.scss']
})
export class FemaleTwoComponent implements OnInit, AfterViewInit {

  @ViewChild('landingFemaleFooter') landingFemaleFooter: LandingFemaleFooterComponent;
  
  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public TopRibbonContent: string = '';
  public BottomRibbonContent: string = '';

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
      this.TopRibbonContent = this.getTranslate("Public.Index.Women.Page2.TopRibbonContent");
      this.BottomRibbonContent = this.getTranslate("Public.Index.Women.Page2.BottomRibbonContent");
    }
  }
  
  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.landingFemaleFooter.getFooterLanguage();
      this.TopRibbonContent = this.getTranslate("Public.Index.Women.Page2.TopRibbonContent");
      this.BottomRibbonContent = this.getTranslate("Public.Index.Women.Page2.BottomRibbonContent");
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
