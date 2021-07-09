import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactMember } from '@app/model/contact_member';
import { CookieService } from 'ngx-cookie-service';
import { ConversationService } from '@app/service/conversation.service';
import { TranslateLanguage } from '@app/model/translate_language';
import { ChatService } from '@app/service/chat.service';

@Component({
  selector: 'app-translate-setting-modal',
  templateUrl: './translate-setting-modal.component.html',
  styleUrls: ['./translate-setting-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TranslateSettingModalComponent implements OnInit {

  public mineLan: string;
  public token: string;
  public avatar: string;
  public memberLan: string;
  public translateSetting: any;
  public freeText: boolean;
  public preTranslate: boolean;
  public freeTextOption: string;
  public supportLanguages: TranslateLanguage[] = [];
  public userName: string;
  public otherPorfileUrl: string;

  constructor(
    public dialogRef: MatDialogRef<TranslateSettingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public member: ContactMember,
    private cookieService: CookieService,
    private convService: ConversationService,
    private chatService: ChatService,
  ) { 
    this.avatar = this.cookieService.get("Avatar");
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get("UserName");
    this.getMyTranslateSettings();
  }

  ngOnInit(): void {
    this.getMemberPhotoUrl();
  }

  /** get member photoUrl */
  public getMemberPhotoUrl(): void {
    if (!this.member.ProfilePhotoBase.includes("http")) {
      this.otherPorfileUrl = `https://lunona.com${this.member.ProfilePhotoBase}`;
    } else {
      this.otherPorfileUrl = this.member.ProfilePhotoBase;
    }
  }

  /** get my translate settings */
  public getMyTranslateSettings(): void {
    this.convService.getMyTranslateSettings(this.token, this.member.ProfileID)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          console.log(res.Data)
          this.translateSetting = res.Data;
          this.supportLanguages = this.translateSetting["SupportingLagItems"];
          this.mineLan = this.translateSetting["TranslateLagISOMY"];
          this.memberLan = this.translateSetting["TranslateLagISOTO"];
          this.freeText = this.translateSetting["TranslateFreeText"];
          this.preTranslate = this.translateSetting["TranslateReadyMessages"];
          if (this.translateSetting["TranslateFreeTextFromMessagesTO"] === true && this.translateSetting["TranslateFreeTextFromNotifyTO"] === true) {
            this.freeTextOption = "human";
          }
          if (this.translateSetting["TranslateFreeTextFromMessagesTO"] === false && this.translateSetting["TranslateFreeTextFromNotifyTO"] === false) {
            this.freeTextOption = "auto";
          }
        }
      })
  }

  /** update translate settings */
  public updateTranslateSetting(): void {
    this.chatService.updateTranslateSetting(this.token, this.member, this.userName, this.mineLan, this.memberLan, this.freeText, this.preTranslate, this.freeTextOption);
    this.dialogRef.close("success");
  }
}
