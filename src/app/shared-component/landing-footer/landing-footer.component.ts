import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { LandingPage } from '@app/enums/landingPage.enum';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss']
})
export class LandingFooterComponent implements OnInit {

  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  public downloadApp: string;
  public changeGenderText: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private animService: AnimateNavigationService,
    private dataShareService: DataShareService
  ) {
    this.activatedRoute.parent.url.subscribe(url => {
      this.genderPath = url[0].path;
    });
    this.activatedRoute.url.subscribe(url => {
      this.pagePath = parseInt(url[0].path, 10);
    });
  }

  ngOnInit(): void {
  }

  public getFooterLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.downloadApp = this.getTranslate("Public.Index.NavigationFooter.DownloadApp");
      this.changeGenderText = this.getTranslate("Public.Index.Men.ChangeGender");
    }
  }

  public changeGender(): void {
    if (this.genderPath === LandingPage.LANDING_MALE.toString()) {
      const newUrl: string = `${LandingPage.LANDING_FEMALE.toString()}/${this.pagePath}`;
      this.animService.setCurrentAnimation(1);
      this.router.navigateByUrl(newUrl);
    }
  }


  public getTranslate(keyword: string): string {
    for (let item of this.languagePublicElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  public goToNextPage(): void {
    if (this.pagePath === 9) {
      return;
    }
    const newUrl: string = `${this.genderPath}/${this.pagePath + 1}`;
    this.animService.setCurrentAnimation(3);
    this.router.navigateByUrl(newUrl);
  }

}
