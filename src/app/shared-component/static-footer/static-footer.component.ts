import { Component, OnInit } from '@angular/core';
import { LanguageElement } from '@app/model/language_element';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimateNavigationService } from '@app/service/animate-navigation.service';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-static-footer',
  templateUrl: './static-footer.component.html',
  styleUrls: ['./static-footer.component.scss']
})
export class StaticFooterComponent implements OnInit {

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
    })
    this.activatedRoute.url.subscribe(url => {
      this.pagePath = parseInt(url[0].path, 10);
    });
  }

  ngOnInit(): void {
  }

  public getFooterLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
    }
  }

  public getTranslate(keyword: string): string {
    for (let item of this.languagePublicElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

}
