import { Injectable } from '@angular/core';
import { LanguageElement } from '@app/model/language_element';
import { ContactMember } from '@app/model/contact_member';
import { BehaviorSubject } from 'rxjs';
import { AutoMessage } from '@app/model/auto_message';
import { BrowseMenu } from '@app/model/browse_menu';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  public languagePublicElements: LanguageElement[];
  public languageMemberElements: LanguageElement[];
  public allContacts: ContactMember[];
  public browseMenu: BrowseMenu[];
  private changeMenu = new BehaviorSubject(false);
  private isReadyMessage = new BehaviorSubject(false);
  public headerEvent = this.changeMenu.asObservable();
  public readyStickerEvent = this.isReadyMessage.asObservable();
  private changeContaclist = new BehaviorSubject([]);
  public contactlist = this.changeContaclist.asObservable();
  private changeUnreadCount = new BehaviorSubject(0);
  public unreadCount = this.changeUnreadCount.asObservable();
  private changeUploadProgress = new BehaviorSubject({member: null, progress: 0});
  public uploadProgress = this.changeUploadProgress.asObservable();
  public changePorfiled = new BehaviorSubject(false);
  public changeProfileEvent = this.changePorfiled.asObservable();
  public autoMessage: AutoMessage = null;
  public changeLanguage = new BehaviorSubject(false);
  public changeLanguageEvent = this.changeLanguage.asObservable();

  constructor() { }

  /** set language public elements */
  public setLanguagePublicElements(languagePublicElements: LanguageElement[]): void {
    this.languagePublicElements = languagePublicElements;
    localStorage.setItem("publicLanguage", JSON.stringify(languagePublicElements));
  }

  /** get language public elements */
  public getLanguagePublicElements(): LanguageElement[] {
    if (this.languagePublicElements) {
      return this.languagePublicElements;
    } else {
      this.languagePublicElements = JSON.parse(localStorage.getItem("publicLanguage"));
      return this.languagePublicElements;
    }
  }

  /** set language member elements */
  public setLanguageMemberElements(languageMemberElements: LanguageElement[]): void {
    this.languageMemberElements = languageMemberElements;
    localStorage.setItem("memberLanguage", JSON.stringify(languageMemberElements));
  }

  /** get language member elements */
  public getLanguageMemberElements(): LanguageElement[] {
    if (this.languageMemberElements) {
      return this.languageMemberElements;
    } else {
      this.languageMemberElements = JSON.parse(localStorage.getItem("memberLanguage"));
      return this.languageMemberElements;
    }
  }

  /** set browse Menu data */
  public setBrowseMenuData(browseMenuData: BrowseMenu[]): void {
    this.browseMenu = browseMenuData;
  }

  /** get browse menu data */
  public getBrowseMenu(): BrowseMenu[] {
    if (this.browseMenu) {
      return this.browseMenu;
    } else {
      return null;
    }
  }

  /** set contact list */
  public setContactList(contactList: ContactMember[]): void {
    this.changeContaclist.next(contactList);
  }

  /** set unread count */
  public setUnreadCount(unreadCount: number): void {
    this.changeUnreadCount.next(unreadCount);
  }

  /** set upload progress with member */
  public setUploadProcess(uploadProgress: any): void {
    this.changeUploadProgress.next(uploadProgress);
  }

  /** set all contacts list */
  public getAllContacts(): ContactMember[] {
    if (this.allContacts) {
      return this.allContacts;
    } else {
      this.allContacts = JSON.parse(localStorage.getItem("allContacts"));
      return this.allContacts;
    }
  }

  /** get all contact list */
  public setAllContacts(allContacts: ContactMember[]): void {
    this.allContacts = allContacts;
    localStorage.setItem("allContacts", JSON.stringify(allContacts));
  }

  /** change menu event */
  public changeMenuEvent(event: boolean): void {
    this.changeMenu.next(event);
  }

  /** change language event */
  public changeLan(event: boolean): void {
    this.changeLanguage.next(event);
  }

  /** change ready or sticker event from member header */
  public readyStickerChange(event: boolean): void {
    this.isReadyMessage.next(event);
  }

  /** set profile event when change on the profile page */
  public changeProfile(event: boolean): void {
    this.changePorfiled.next(event);
  }

  /** set auto message */
  public setAutoMessage(autoMessage: AutoMessage): boolean {
    this.autoMessage = autoMessage;
    return true;
  }

  /** get auto message */
  public getAutoMessage(): AutoMessage {
    if (this.autoMessage) {
      return this.autoMessage;
    }
  }
}
