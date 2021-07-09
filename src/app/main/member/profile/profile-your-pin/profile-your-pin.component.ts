import { Component, OnInit } from '@angular/core';
import { MemberItem } from '@app/model/member_item';
import { ProfileChatsService } from '@app/service/profile-chats.service';
import { CookieService } from 'ngx-cookie-service';
import { DataShareService } from '@app/service/data-share.service';
import { LanguageElement } from '@app/model/language_element';

@Component({
  selector: 'app-profile-your-pin',
  templateUrl: './profile-your-pin.component.html',
  styleUrls: ['./profile-your-pin.component.scss']
})
export class ProfileYourPinComponent implements OnInit {

  public token: string;
  public profiles: MemberItem[];
  public key: string = "ME_PIN_THEM";
  public isExist: boolean;
  public searchText: string = "";
  public count: number = 20;
  public startPos: number = 0;
  public languageElement: LanguageElement[];

  constructor(
    private chatService: ProfileChatsService,
    private cookieService: CookieService,
    private dataShareService: DataShareService
  ) {
    this.token = this.cookieService.get('LunonaToken');
    this.languageElement = this.dataShareService.getLanguageMemberElements();
  }

  ngOnInit(): void {
    this.getProfileViews(this.token, this.count, this.startPos);
  }

  /** get profiles when page load */
  public getProfileViews(token: string, count: number, startPos: number): void {
    this.chatService.getProfileViews(token, this.key, count, startPos, this.searchText)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profiles = res.Data["Profiles"];
          if (this.profiles.length > 0) {
            this.isExist = true;
          } else {
            this.isExist = false;
          }
          console.log(this.profiles)
        }
      })
  }

  /** scroll event get more data */
  public onScroll(): void {
    if (this.profiles.length < (this.startPos + this.count)) {
      return;
    }
    console.log("here is the onScroll event");
    this.startPos = this.startPos + this.count;
    this.count = 10;
    this.chatService.getProfileViews(this.token, this.key, this.count, this.startPos, this.searchText)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profiles = this.profiles.concat(res.Data["Profiles"]);
        }
      });
  }

  /** search contact by click event */
  public searchContacts(): void {
    console.log(this.searchText)
    const count: number = 20;
    const startPos: number = 0;
    this.chatService.getProfileViews(this.token, this.key, count, startPos, this.searchText)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profiles = res.Data["Profiles"];
          if (this.profiles.length > 0) {
            this.isExist = true;
          }
        }
      })
  }

  /** clear search text */
  public clearText(): void {
    this.searchText = "";
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
