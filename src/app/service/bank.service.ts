import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  public apiUrl: string = environment.apiUrl;
  public mainUrl: string = "MainService.svc";
  public getPayPacketsUrl: string = "GetPayPackets";
  public getPayMethodUrl: string = "GetPayMethod";
  public getBankTransferDefaultsUrl: string = "GetProfileBankTranferDefauls";
  public getProfileTransactionUrl: string = "GetProfileTransactions";
  public getProfilePowerUrl: string = "GetMyProfilePower";
  public getProfileBankDashboardUrl: string = "GetProfileBankDashboard";
  public getAutoMessageRuleTypeUrl: string = "GetListAllItems";
  public getMyAutoMessagesUrl: string = "GetMyAutomaticMessages";
  public getCountryCityUrl: string = "GetAutocompleteInfoGApi";
  public setAutoMessageUrl: string = "SetMyAutomaticMessage";
  public getExecuteMyAutomaticMessagePreviewUrl: string = "ExecuteMyAutomaticMessagePreview";
  public getPaymentDetailUrl: string = "GetPayMethodDetails_v2";

  constructor(
    private httpClient: HttpClient
  ) { }

  /** get pay packets */
  public getPayPackets(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getPayPacketsUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get pay method */
  public getPayMethod(packID: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getPayMethodUrl}`, {
        params: new HttpParams()
          .set("PackID", packID)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get payment method detail */
  public getPayMentDetail(sendingData: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/${this.mainUrl}/${this.getPaymentDetailUrl}`, sendingData)
      .pipe((res: any) => res)
  }

  /** get bank transfer defaults */
  public getBankTransferDefaults(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getBankTransferDefaultsUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get profile transactions */
  public getProfileTransactions(dayFrom: number, dayTo: number, monthFrom: number, monthTo: number, yearFrom: number, yearTo: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getProfileTransactionUrl}`, {
        params: new HttpParams()
          .set("DayFrom", dayFrom.toString())
          .set("DayTo", dayTo.toString())
          .set("MonthFrom", monthFrom.toString())
          .set("MonthTo", monthTo.toString())
          .set("YearFrom", yearFrom.toString())
          .set("YearTo", yearTo.toString())
          .set("token", token)
      })
      .pipe(
        map((res: any) => res) 
      )
  }

  /** get profile Power */
  public getProfilePower(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getProfilePowerUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get profile dashboard data */
  public getBankProfileDashboard(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getProfileBankDashboardUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get auto messages */
  public getAutoMessageRuleType(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getAutoMessageRuleTypeUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "AutomaticMessagesRuleType")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get automatic messages excution types */
  public getAutomaticMessagesExecutionType(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getAutoMessageRuleTypeUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "AutomaticMessagesExecutionType")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get my auto messages */
  public getMyAutoMessages(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getMyAutoMessagesUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get execute message preview data */
  public getExecuteMessagePreview(token: string, messageID: number): Observable<any> {
    const sendingData = {
      Token: token,
      messageItem: {
        MessageID: messageID
      }
    }
    return this.httpClient
      .post(`${this.apiUrl}/${this.mainUrl}/${this.getExecuteMyAutomaticMessagePreviewUrl}`, sendingData)
      .pipe((res: any) => res)
  }

  /** get county info with api call */
  public getCountryCity(token: string, key: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getCountryCityUrl}`, {
        params: new HttpParams()
          .set("Token", token)
          .set("types", "regions")
          .set("search", key)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set my auto message */
  public setMyAutoMessage(sendingData: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/${this.mainUrl}/${this.setAutoMessageUrl}`, sendingData)
      .pipe((res: any) => res)
  }
}
