import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { CheckUserName } from '@app/model/check_user_name';
import { ResetPassword } from '@app/model/reset_password_return';
import { LocationInfo } from '@app/model/location_info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = environment.apiUrl;
  geoUrl: string = "GeoService.svc";
  authUrl: string = "MainService.svc";
  checkTokenUrl: string = "CheckToken";
  userNameUrl: string = "CheckEmailOrNickname"
  resetPasswordUrl: string = "ResetPassword";
  setNewPassWithPin: string = "SetNewPasswordWithPin";
  checkEmailFreeUrl: string = "CheckEmailFree";
  checkNickNameFreeUrl: string = "CheckNicknameFree";
  checkPasswordValidUrl: string = 'CheckPasswordValid';
  getLocationUrl: string = "GetLocationInfo";
  getCountriesUrl: string = "GetCountries";
  GetCitiesAndZipUrl: string = "GetCitiesAndZip";
  occupationUrl: string = "GetListAllItemsByLanguage";
  
  constructor(private httpClient: HttpClient) {
  }

  /** check user name api in login page */
  public checkUserName(userName: string, LanguageISO: string): Observable<CheckUserName> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.userNameUrl}`, {
        params: new HttpParams().set('EmailOrLoginName', userName).set('LanguageISO', LanguageISO)
      })
      .pipe(
        map((res: CheckUserName) => res)
      )
  }

  /** login api in login page */
  public login(userName: string, password: string, LanguageISO: string, CookieVisitorUID: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/Login`, {
        params: new HttpParams()
        .set('CookieVisitorUID', CookieVisitorUID)
        .set('LanguageISO', LanguageISO)
        .set('LoginName', userName)
        .set('Password', password)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** check token api call */
  public checkToken(authenticateSessionID: string, lunonaToken: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.checkTokenUrl}`, {
        params: new HttpParams()
        .set("AuthenticateSessionID", authenticateSessionID)
        .set("Token", lunonaToken)
        .set("action", "get")
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** reset password api in forgot password page */
  public resetPassword(userName: string): Observable<ResetPassword> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.resetPasswordUrl}`, {
        params: new HttpParams().set('EmailOrLoginName', userName)
      })
      .pipe(
        map((res: ResetPassword) => res)
      )
  }

  /** set new password with pin */
  public setNewPasswordWithPin(userName: string, newPass: string, pin: string): Observable<ResetPassword> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.setNewPassWithPin}`, {
        params: new HttpParams()
        .set('EmailOrLoginName', userName)
        .set('NewPassword', newPass)
        .set('Pin', pin)
      })
      .pipe(
        map((res: ResetPassword) => res)
      )
  }

  /** check email is free in WS */
  public checkEmailFree(email: string, languageISO: string): Observable<CheckUserName> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.checkEmailFreeUrl}`, {
        params: new HttpParams()
        .set("LanguageISO", languageISO)
        .set('eMail', email)
      })
      .pipe(
        map((res: CheckUserName) => res)
      )
  }

  /** check nick name is free in WS */
  public checkNickNameFree(nickName: string, languageISO: string): Observable<CheckUserName> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.checkNickNameFreeUrl}`, {
        params: new HttpParams()
        .set("LanguageISO", languageISO)
        .set("Nickname", nickName)
      })
      .pipe(
        map((res: CheckUserName) => res)
      )
  }

  /** check password is valid */
  public checkPasswordValid(password: string, languageISO: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.checkPasswordValidUrl}`, {
        params: new HttpParams()
        .set("LanguageISO", languageISO)
        .set("Password", password)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get location information */
  public getLocationInfo(): Observable<LocationInfo> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.geoUrl}/${this.getLocationUrl}`)
      .pipe(
        map((res: any) => res.Data)
      )
  }

  /** get countries */
  public getCountries(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.geoUrl}/${this.getCountriesUrl}`)
      .pipe(
        map((res: any) => res)
      )
  }

  /** get Cities */
  public GetCitiesAndZip(key: string, countryISO: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.geoUrl}/${this.GetCitiesAndZipUrl}`, {
        params: new HttpParams()
        .set("CityOrZip", key)
        .set("Country", countryISO)
        .set("StateISO", "")
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get all occupations */
  public GetOccupations(languageISO: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.authUrl}/${this.occupationUrl}`, {
        params: new HttpParams()
        .set("LanguageISO", languageISO)
        .set("ListTableName", "BusinessSector")
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** register with user basic info */
  public register(basicInfo: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/${this.authUrl}/RegisterUserWithEmail`, basicInfo)
      .pipe(
        map((res: any) => res)
      )
  }

  /** regiter guest man */
  public regiterGuestMan(sendingData: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/${this.authUrl}/RegisterGuestMan`, sendingData)
      .pipe(
        map((res: any) => res)
      )
  }

  /** register guest woman */
  public regiterGuestWoman(sendingData: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/${this.authUrl}/RegisterGuestWoman`, sendingData)
      .pipe(
        map((res: any) => res)
      )
  }
}
