import { Component, OnInit, HostListener, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';
import { StaticFooterComponent } from '@app/shared-component/static-footer/static-footer.component';

@Component({
  selector: 'app-male-nine',
  templateUrl: './male-nine.component.html',
  styleUrls: ['./male-nine.component.scss']
})
export class MaleNineComponent implements OnInit {

  @ViewChild('landingStaticFooter') landingStaticFooter: StaticFooterComponent;
  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public Title: string = '';
  public DownloadTitle: string = '';
  public DownloadContent: string = '';

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
    this.landingStaticFooter.getFooterLanguage();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.Title = this.getTranslate('Public.Index.Men.MobileApp.Title');
      this.DownloadTitle = this.getTranslate('Public.Index.Men.MobileApp.DownloadTitle');
      this.DownloadContent = this.getTranslate('Public.Index.Men.MobileApp.DownloadContent');
    }
  }

  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.landingStaticFooter.getFooterLanguage();
      this.Title = this.getTranslate('Public.Index.Men.MobileApp.Title');
      this.DownloadTitle = this.getTranslate('Public.Index.Men.MobileApp.DownloadTitle');
      this.DownloadContent = this.getTranslate('Public.Index.Men.MobileApp.DownloadContent');
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
