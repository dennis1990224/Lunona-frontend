import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingFooterComponent } from '@app/shared-component/landing-footer/landing-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-male-six',
  templateUrl: './male-six.component.html',
  styleUrls: ['./male-six.component.scss']
})
export class MaleSixComponent implements OnInit {

  @ViewChild('landingMaleFooter') landingMaleFooter: LandingFooterComponent;
  
  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public title: string = '';
  public LunaDialogTitle: string = '';
  public LunaDialogContent: string = '';

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
      this.title = this.getTranslate('Public.Index.Men.Page6.Title');
      this.LunaDialogTitle = this.getTranslate('Public.Index.Men.Page6.LunaDialogTitle');
      this.LunaDialogContent = this.getTranslate('Public.Index.Men.Page6.LunaDialogContent');
    }
  }

  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.landingMaleFooter.getFooterLanguage();
      this.title = this.getTranslate('Public.Index.Men.Page6.Title');
      this.LunaDialogTitle = this.getTranslate('Public.Index.Men.Page6.LunaDialogTitle');
      this.LunaDialogContent = this.getTranslate('Public.Index.Men.Page6.LunaDialogContent');
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
