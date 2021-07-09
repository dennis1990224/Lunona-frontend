import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { ContactMember } from '@app/model/contact_member';
import { MemberItem } from '@app/model/member_item';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  public apiUrl: string = environment.apiUrl;
  public mainUrl: string = "MainService.svc";
  public getProfileBasicUrl: string = "GetPreviewProfileBasic";
  public getPreviewProfileUrl: string = "GetPreviewProfileInformation";
  public getChatMessageUrl: string = "GetMyChatMessages";
  public getReadyMessageCategoryUrl: string = "GetReadyMessagesCategories";
  public getReadyMessageUrl: string = "GetReadyMessages";
  public getStickerCategoryUrl: string = "GetResourceCategories";
  public getStickerMessageUrl: string = "GetResources";
  public getTranslateSettingUrl: string = "GetMyContactTranslateMessagesSettings";
  public getMediaAccessUrl: string = "GetMediaAccess";
  public sendLunsUrl: string = "SetProfileBankTranfer";
  public getMyDatesUrl: string = "GetMyDates";
  public getListAllItemUrl: string = "GetListAllItems";
  public deleteMyDateUrl: string = "DeleteMyDate";
  public addNewDateUrl: string = "AddNewDate";
  public editDateUrl: string = "EditMyDate";

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /** get profile basic information */
  public getPreviewProfileBasic(token: string, loginName: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getProfileBasicUrl}`, {
        params: new HttpParams()
          .set("LoginName", loginName)
          .set("PhotosCategory", "all")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get preview profile information */
  public getPreviewProfileInfo(token: string, loginName: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getPreviewProfileUrl}`, {
        params: new HttpParams()
        .set("LoginName", loginName)
        .set("PhotosCategory", "all")
        .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get my chat message with profileID, room info */
  public getMyChatMessages(profileID: number, room: string, token: string): Observable<any> {
    const countRecords: number = 20;
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getChatMessageUrl}`, {
        params: new HttpParams()
          .set("CountRecords", countRecords.toString())
          .set("PrivateContactID", profileID.toString())
          .set("Room", room)
          .set("token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get my old chat message with profileID, room info, last message */
  public getMyOldChatMessage(member: ContactMember | MemberItem, messageID: number, token: string): Observable<any> {
    const countRecords: number = 20;
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getChatMessageUrl}`, {
        params: new HttpParams()
          .set("CountRecords", countRecords.toString())
          .set("PrivateContactID", member.ProfileID.toString())
          .set("Room", member.Room)
          .set("StartEUP_MessageID", messageID.toString())
          .set("token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get ready message by token */
  public getReadyMessageCategories(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getReadyMessageCategoryUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get ready messages by category */
  public getReadyMessagesByCategory(categoryId: number, token: string): Observable<any> {
    return this.httpClient 
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getReadyMessageUrl}`, {
        params: new HttpParams()
          .set("CategoryID", categoryId.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get sticker categories by token */
  public getStickerCategories(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getStickerCategoryUrl}`, {
        params: new HttpParams()
          .set("ResourceTypeCode", "stikers")
          .set("SubCategory", "")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get stickers by category */
  public getStickersByCategory(token: string, category: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getStickerMessageUrl}`, {
        params: new HttpParams()
          .set("CategoryID", category.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res) 
      )
  }

  /** get my translate settings */
  public getMyTranslateSettings(token: string, contactId: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getTranslateSettingUrl}`, {
        params: new HttpParams()
          .set("ContactID", contactId.toString())
          .set("token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get media access */
  public getMediaAccess(profileID: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getMediaAccessUrl}`, {
        params: new HttpParams()
          .set("ProfileID_TO", profileID.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** send luns to the member */
  public sendLuns(token: string, member: ContactMember, luns: number, message: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.sendLunsUrl}`, {
        params: new HttpParams()
          .set("AccoundNumberOrLoginNameTO", member.LoginName)
          .set("Amount", luns.toString())
          .set("Description", message)
          .set("MoveTypeID", "0")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get my date Data */
  public getMyDates(token, profileId): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getMyDatesUrl}`, {
        params: new HttpParams()
          .set("Token", token)
          .set("otherProfile", profileId.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get lists items on Date modal */
  public getDateListItems(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getListAllItemUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "ProfileDateVote")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** delte my date */
  public deleteMyDate(dateId: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.deleteMyDateUrl}`, {
        params: new HttpParams()
          .set("DateID", dateId.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** add new date */
  public addNewDate(newDate): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/${this.mainUrl}/${this.addNewDateUrl}`, newDate)
      .pipe(
        map((res: any) => res)
      );
  }

  /** edit my date */
  public editMyDate(newDate): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/${this.mainUrl}/${this.editDateUrl}`, newDate)
      .pipe(
        map((res: any) => res)
      );
  }
}
