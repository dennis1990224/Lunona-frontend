import { Component, OnInit } from '@angular/core';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-profile-help-center',
  templateUrl: './profile-help-center.component.html',
  styleUrls: ['./profile-help-center.component.scss']
})
export class ProfileHelpCenterComponent implements OnInit {


  public isActive: number;
  public languageElement: LanguageElement[];

  constructor(
    private dataShareService: DataShareService
  ) {
    this.languageElement = this.dataShareService.getLanguageMemberElements();
  }

  ngOnInit(): void {
    this.isActive = 1;
    this.dataShareService.changeLanguageEvent
      .subscribe((res) => {
        if (res === true) {
          this.languageElement = this.dataShareService.getLanguageMemberElements();
        }
      });
  }

  /** go to active page */
  public goToActive(index: number): void {
    this.isActive = index;
  }

  /** get value of the my information tab title */
  public getTranslate(keyword: string) {
    for (let item of this.languageElement) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }
}
