import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingFemaleFooterComponent } from '@app/shared-component/landing-female-footer/landing-female-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-female-one',
  templateUrl: './female-one.component.html',
  styleUrls: ['./female-one.component.scss']
})
export class FemaleOneComponent implements OnInit, AfterViewInit {

  @ViewChild('landingFemaleFooter') landingFemaleFooter: LandingFemaleFooterComponent;
  
  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public mainContent: string = '';
  public ribonContent: string = '';

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
      this.mainContent = this.getTranslate("Public.Index.Women.Page1.MainContent");
      this.ribonContent = this.getTranslate("Public.Index.Women.Page1.RibbonContent");
    }
  }
  
  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.landingFemaleFooter.getFooterLanguage();
      this.mainContent = this.getTranslate("Public.Index.Women.Page1.MainContent");
      this.ribonContent = this.getTranslate("Public.Index.Women.Page1.RibbonContent");
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
