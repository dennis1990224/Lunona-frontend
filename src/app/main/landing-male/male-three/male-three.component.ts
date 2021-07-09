import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingFooterComponent } from '@app/shared-component/landing-footer/landing-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-male-three',
  templateUrl: './male-three.component.html',
  styleUrls: ['./male-three.component.scss']
})
export class MaleThreeComponent implements OnInit, AfterViewInit {

  @ViewChild('landingMaleFooter') landingMaleFooter: LandingFooterComponent;

  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public topRibbonContent: string = '';
  public marrigeTitle: string = '';
  public marrigeDescription: string = '';
  public fakeTitle: string = '';
  public fakeDescription: string = '';
  public botTitle: string = '';
  public botDescription: string = '';
  public escortsTitle: string = '';
  public escortsDescription: string = '';
  public administratorsTitle: string = '';
  public administratorsDescription: string = '';
  public uglyTitle: string = '';
  public uglyDescription: string = '';

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
      this.topRibbonContent = this.getTranslate('Public.Index.Men.Page3.TopRibbonContent');
      this.marrigeTitle = this.getTranslate("Public.Index.Men.Page3.MarriageTitle");
      this.marrigeDescription = this.getTranslate("Public.Index.Men.Page3.MarriageDescription");
      this.fakeTitle = this.getTranslate("Public.Index.Men.Page3.FakeTitle");
      this.fakeDescription = this.getTranslate("Public.Index.Men.Page3.FakeDescription");
      this.botTitle = this.getTranslate("Public.Index.Men.Page3.BotTitle");
      this.botDescription = this.getTranslate("Public.Index.Men.Page3.BotDescription");
      this.escortsTitle = this.getTranslate("Public.Index.Men.Page3.EscortsTitle");
      this.escortsDescription = this.getTranslate("Public.Index.Men.Page3.EscortsDescription");
      this.administratorsTitle = this.getTranslate("Public.Index.Men.Page3.AdministratorsTitle");
      this.administratorsDescription = this.getTranslate("Public.Index.Men.Page3.AdministratorsDescription");
      this.uglyTitle = this.getTranslate("Public.Index.Men.Page3.UglyTitle");
      this.uglyDescription = this.getTranslate('Public.Index.Men.Page3.UglyDescription');
    }
  }
  
  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.topRibbonContent = this.getTranslate('Public.Index.Men.Page3.TopRibbonContent');
      this.marrigeTitle = this.getTranslate("Public.Index.Men.Page3.MarriageTitle");
      this.marrigeDescription = this.getTranslate("Public.Index.Men.Page3.MarriageDescription");
      this.fakeTitle = this.getTranslate("Public.Index.Men.Page3.FakeTitle");
      this.fakeDescription = this.getTranslate("Public.Index.Men.Page3.FakeDescription");
      this.botTitle = this.getTranslate("Public.Index.Men.Page3.BotTitle");
      this.botDescription = this.getTranslate("Public.Index.Men.Page3.BotDescription");
      this.escortsTitle = this.getTranslate("Public.Index.Men.Page3.EscortsTitle");
      this.escortsDescription = this.getTranslate("Public.Index.Men.Page3.EscortsDescription");
      this.administratorsTitle = this.getTranslate("Public.Index.Men.Page3.AdministratorsTitle");
      this.administratorsDescription = this.getTranslate("Public.Index.Men.Page3.AdministratorsDescription");
      this.uglyTitle = this.getTranslate("Public.Index.Men.Page3.UglyTitle");
      this.uglyDescription = this.getTranslate('Public.Index.Men.Page3.UglyDescription');
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
