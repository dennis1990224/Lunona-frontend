import { Component, OnInit, ViewChild, ContentChild } from '@angular/core';
import { LanguageElement } from '@app/model/language_element';
import { LanguageService } from '@app/service/language.service';
import { CookieService } from 'ngx-cookie-service';
import { DataShareService } from '@app/service/data-share.service';
import { ContactMember } from '@app/model/contact_member';
import { MemberHeaderComponent } from '@app/shared-component/member-header/member-header.component';
import { ConversationChatComponent } from './conversation/conversation-chat/conversation-chat.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  @ViewChild('memberHeader') memberHeader: MemberHeaderComponent;

  public isLoading: boolean = true;
  public languageElement: LanguageElement[];
  constructor(
    private lanService: LanguageService,
    private cookieService: CookieService,
    private dataShareService: DataShareService,
  ) {
  }

  ngOnInit(): void {
    if (this.dataShareService.getLanguageMemberElements()) {
      this.languageElement = this.dataShareService.getLanguageMemberElements()
      this.isLoading = false;
    } else {
      this.getLanguageData();
    }
  }

  /** get language data for members */
  public getLanguageData(): void {
    const token: string = this.cookieService.get('LunonaToken');
    this.lanService.getLanguageElementsByToken(token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.languageElement = res.Data;
          this.isLoading = false;
          this.dataShareService.setLanguageMemberElements(res.Data);
        }
      });
  }

  /** start loading when I get all data */
  public startLoading(): void {
    this.isLoading = true;
  }

  /** finish loading when I get all data */
  public finshLoading(): void {
    this.isLoading = false;
  }

  /** select contact member event */
  public selectMember(member: ContactMember): void {
    this.memberHeader.selectMember(member);
  }

  /** change menu event from header */
  public changeMenuEvent(event: boolean): void {
    this.dataShareService.changeMenuEvent(event);
  }
}
