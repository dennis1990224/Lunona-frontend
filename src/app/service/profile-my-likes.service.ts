import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileMyLikesService {

  public apiUrl: string = environment.apiUrl;
  public mainUrl: string = "MainService.svc";
  public getProfileLikeUrl: string = "GetProfileLikes";
  public setMyProfileLikesUrl: string = "SetMyProfileLikeItem";

  constructor(
    private httpClient: HttpClient
  ) { }

  /** get profile likes */
  public getProfileLikes(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getProfileLikeUrl}`, {
        params: new HttpParams().set('Token', token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set my profile Likes */
  public setMyProfileLikes(key: string , token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyProfileLikesUrl}`, {
        params: new HttpParams()
        .set("Key", key)
        .set("Token", token)
        .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }
}
