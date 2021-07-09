import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileChatsService {

  public apiUrl: string = environment.apiUrl;
  public mainUrl: string = "MainService.svc";
  public getProfileViewsUrl: string = "GetMyProfileViews";

  constructor(
    private httpClient: HttpClient
  ) { }

  /** get ProfileViews */
  public getProfileViews(token: string, key: string, count: number, startPos: number, searchText: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getProfileViewsUrl}`, {
        params: new HttpParams()
        .set("Command", key)
        .set("CountRecords", count.toString())
        .set("LoginNameMask", searchText)
        .set("StartPos", startPos.toString())
        .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }
}
