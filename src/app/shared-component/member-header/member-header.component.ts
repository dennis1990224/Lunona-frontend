import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '@app/service/language.service';
import { DataShareService } from '@app/service/data-share.service';
import { LanguageElement } from '@app/model/language_element';
import { ContactMember } from '@app/model/contact_member';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { TranslateSettingModalComponent } from '@app/modal-component/translate-setting-modal/translate-setting-modal.component';
import { DeleteConversationModalComponent } from '@app/modal-component/delete-conversation-modal/delete-conversation-modal.component';
import { PhotoAccessModalComponent } from '@app/modal-component/photo-access-modal/photo-access-modal.component';
import { BlockUserModalComponent } from '@app/modal-component/block-user-modal/block-user-modal.component';
import { DonateLunsModalComponent } from '@app/modal-component/donate-luns-modal/donate-luns-modal.component';
import { DateModalComponent } from '@app/modal-component/date-modal/date-modal.component';
import { DeleteContactModalComponent } from '@app/modal-component/delete-contact-modal/delete-contact-modal.component';
import { AuthService } from '@app/service/auth.service';
import { LoginReturnValue } from '@app/model/login_return';
import { ChatService } from '@app/service/chat.service';
import { Updatebalance } from '@app/model/update_balance';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-header',
  templateUrl: './member-header.component.html',
  styleUrls: ['./member-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberHeaderComponent implements OnInit {

  @Output() public startLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public finshLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public changeMenuEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  public iconNumber: number;
  public pagePath: string;
  public genderPath: string;
  public title: string;
  public subTitle: string;
  public languageMemberElements: LanguageElement[];
  public selectedLanguage = {
    language: "English",
    image: "assets/img-2/members/us_125.png"
  };
  public siteSupportLanguages = [
    {
      language: "English",
      image: "assets/img-2/members/us_125.png",
      LanguageISO: "US"
    },
    {
      language: "Russian",
      image: "assets/img-2/members/ru_125.png",
      LanguageISO: "RU"
    },
    {
      language: "Greek",
      image: "assets/img-2/members/gr_125.png",
      LanguageISO: "GR"
    },
    {
      language: "Bulgarian",
      image: "assets/img-2/members/bg_125.png",
      LanguageISO: "BG"
    }
  ];

  public chatSelectMember: ContactMember;
  public isConversation: boolean = false;
  public serverUrl: string = environment.serverUrl;
  public isSticker: boolean = false;
  public isReadyMessage: boolean = true;
  public balance: number;
  public updatedBalance: Updatebalance;
  public unreadCount: number = 0;
  public roomChangeSubscription: Subscription;
  public languageChange: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private lanService: LanguageService,
    private dataShareService: DataShareService,
    private dialog: MatDialog,
    private authService: AuthService,
    private conSevice: ChatService,
    private ngZone: NgZone
  ) {
    this.languageMemberElements = this.dataShareService.getLanguageMemberElements();
    if (this.router.url === "/member/conversation/dashboard") {
      this.isConversation = true;
    }
    this.getOriginalInfo();
    this.updateBalanceInfo();
  }

  ngOnInit(): void {
    this.getUnreadCount();
    this.activatedRoute.parent.url.subscribe(url => {
      this.genderPath = url[0].path;
    });

    this.activatedRoute.url.subscribe(url => {
      if (url.length > 0) {
        this.pagePath = url[0].path;
        this.checkPageStatus()
      }
    });

    switch (this.cookieService.get('lunaoLang')) {
      case "US":
        this.selectedLanguage = this.siteSupportLanguages[0];
        break;
      case "RU":
        this.selectedLanguage = this.siteSupportLanguages[1];
        break;
      case "GR":
        this.selectedLanguage = this.siteSupportLanguages[2];
        break;
      case "BG":
        this.selectedLanguage = this.siteSupportLanguages[3];
        break;
    }
  }

  /** get unread count */
  public getUnreadCount(): void {
    this.dataShareService.unreadCount.subscribe((res) => {
      this.ngZone.run(() => {
        this.unreadCount = res;
      })
    });
  }

  /** get original info */
  public getOriginalInfo(): void {
    const authenticateSessionId: string = sessionStorage.getItem('AuthenticateSessionID');
    const token: string = this.cookieService.get("LunonaToken");
    this.authService.checkToken(authenticateSessionId, token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          const result: LoginReturnValue = res.Data;
          this.balance = result.TotalLUN;
        }
      });
  }

  /** update balance */
  public updateBalanceInfo(): void {
    this.conSevice.updateBalance.subscribe((res) => {
      this.ngZone.run(() => {
        this.updatedBalance = res;
        this.balance = this.updatedBalance.TotalLUN;
      })
    });
  }

  /** check Page Status */
  public checkPageStatus(): void {
    switch (this.pagePath) {
      case "conversation":
        this.iconNumber = 1;
        if (this.dataShareService.getLanguageMemberElements()) {
          this.title = this.getTranslate("Members.Conversations.chatDashboardTitle");
        }
        break;
      case "browse":
        this.iconNumber = 2;
        this.title = this.getTranslate("Members.BrowseMembers.Main.Main");
        this.subTitle = this.getTranslate("Members.BrowseMembers.Main.SubTitle");
        break;
      case "bank":
        this.iconNumber = 3;
        this.title = this.getTranslate("Members.Bank.Main.Title");
        break;
      case "profile":
        this.iconNumber = 4;
        this.title = this.getTranslate("Members.Profile.Main.Title");
        this.subTitle = this.getTranslate("Members.Profile.Main.SubTitle");
        break;
    }
  }

  /** get translate with keyword */
  public getTranslate(keyword: string): string {
    for (let item of this.languageMemberElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  /** select language event */
  public selectLanguage(language: any): void {
    if (this.cookieService.get('lunaoLang') === language) {
      return;
    }
    this.startLoading.emit();
    const token: string = this.cookieService.get('LunonaToken');
    this.lanService.setLanguage(language.LanguageISO, token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.cookieService.set('lunaoLang', language.LanguageISO);
          this.getLanguageData();
          this.selectedLanguage = language;
        }
      }); 
  }

  /** get the whole language element */
  public getLanguageData(): void {
    const token: string = this.cookieService.get('LunonaToken');
    this.lanService.getLanguageElementsByToken(token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.languageMemberElements = res.Data;
          this.dataShareService.setLanguageMemberElements(res.Data);
          this.dataShareService.changeLan(true);
          this.finshLoading.emit();
          this.checkPageStatus();
        }
      });
  }

  /** go to conversation */
  public goToConversation(): void {
    this.iconNumber = 1;
    this.router.navigateByUrl('/member/conversation/dashboard');
  }

  /** go to Browse */
  public goToBrowse(): void {
    this.iconNumber = 2;
    this.router.navigateByUrl('/member/browse/dashboard');
  }

  /** go to Bank */
  public goToBank(): void {
    this.iconNumber = 3;
    this.router.navigateByUrl('/member/bank/dashboard');
  }

  /** go to profile */
  public goToProfile(): void {
    this.iconNumber = 4;
    this.router.navigateByUrl('/member/profile/dashboard');
  }

  /** select member event */
  public selectMember(member: ContactMember): void {
    this.chatSelectMember = member;
  }

  /** change menu when click the profile icon in header */
  public changeMenu(): void {
    this.isSticker = !this.isSticker;
    // this.changeMenuEvent.next(this.isSticker);
    this.dataShareService.readyStickerChange(true);
    this.dataShareService.changeMenuEvent(this.isSticker);
  }

  /** check ready message */
  public checkReadyMessage(): void {
    this.isReadyMessage = true;
    this.dataShareService.readyStickerChange(this.isReadyMessage);
  }
  
  /** check stickers */
  public checkStickers(): void {
    this.isReadyMessage = false;
    this.dataShareService.readyStickerChange(this.isReadyMessage);
  }

  /** open translate modal */
  public openTranslateModal(): void {
    const dialogRef = this.dialog.open(TranslateSettingModalComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open delete conversation modal */
  public openDelConvModal(): void {
    const dialogRef = this.dialog.open(DeleteConversationModalComponent, {
      panelClass: 'delete-conversation',
      data: this.chatSelectMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open photo access modal */
  public openPhotoAccessModal(): void {
    const dialogRef = this.dialog.open(PhotoAccessModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.chatSelectMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open block user modal */
  public openBlockUserModal(): void {
    const dialogRef = this.dialog.open(BlockUserModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.chatSelectMember
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.router.navigateByUrl('member/conversation/dashboard');
      }
    });
  }

  /** open donate modal */
  public openDonateModal(): void {
    const dialogRef = this.dialog.open(DonateLunsModalComponent, {
      panelClass: 'donate-modalbox',
      data: this.chatSelectMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open date modal */
  public openDateModal(): void {
    const dialogRef = this.dialog.open(DateModalComponent, {
      panelClass: 'date-modalbox',
      data: this.chatSelectMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open delete contact modal */
  public openDeleteContact(): void {
    const dialogRef = this.dialog.open(DeleteContactModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.chatSelectMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

}
