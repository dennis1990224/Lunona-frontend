import { Component, OnInit } from '@angular/core';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-auth-footer',
  templateUrl: './auth-footer.component.html',
  styleUrls: ['./auth-footer.component.scss']
})
export class AuthFooterComponent implements OnInit {

  public genderPath: string;
  public pagePath: number;
  public languagePublicElements: LanguageElement[];
  
  constructor(
    private dataShareService: DataShareService
  ) { }

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
