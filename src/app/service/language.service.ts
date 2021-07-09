import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languageUrl: string = "LanguagesService.svc";
  public apiUrl: string = environment.apiUrl;
  public getLanguageElementUrl: string = "GetLanguageElementsWithToken";
  public SetLanguageUrl: string = "SetLanguage";

  constructor(private httpClient: HttpClient) { }

  /** get site support languages */
  public getSiteSupportLanguage(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.languageUrl}/SiteSupportingLanguages`)
      .pipe(
        map((res: any) => res)
      )
  }

  /** get language element for the landing page */
  public getLanguageElements(languageISO: string, elementMask: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.languageUrl}/GetLanguageElements`, {
        params: new HttpParams().set('LanguageISO', languageISO).set('ElementKeyMask', elementMask)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get language elements on member pages */
  public getLanguageElementsByToken(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.languageUrl}/${this.getLanguageElementUrl}`, {
        params: new HttpParams()
          .set('ElementKeyMask', "")
          .set('LanguageISO', "")
          .set('Token', token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set language on members */
  public setLanguage(languageIso: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.languageUrl}/${this.SetLanguageUrl}`, {
        params: new HttpParams()
        .set('NewLanguageISO', languageIso)
        .set('Token', token)
      })
      .pipe(
        map((res: any) => res)
      )
  }
}
