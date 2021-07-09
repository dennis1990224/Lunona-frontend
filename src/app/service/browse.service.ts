import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BrowseSearchData } from '@app/model/browse_search_data';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {

  public apiUrl: string = environment.apiUrl;
  public mainUrl: string = "MainService.svc";
  public getBrowseMenuUrl: string = "GetBrosweMenu";
  public getBrowseDashboardUrl: string = "GetBroswePageDashboard";
  public getBrowseProfileInfoUrl: string = "GetBrowseProfilesNEW";
  public geoUrl: string = "GeoService.svc";
  public getCountriesUrl: string = "GetCountries";

  constructor(
    private httpClient: HttpClient
  ) { }

  /** get Browse Info */
  public getBrowseMenu(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getBrowseMenuUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get browse dashboard Menu */
  public getBrowseDashboardData(token: string): Observable<any> {
    const MaxProfilesPerFrame: number = 6;
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getBrowseDashboardUrl}`, {
        params: new HttpParams()
          .set("MaxProfilesPerFrame", MaxProfilesPerFrame.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get browse profile information */
  public getBrowseProfileInfo(searchData: BrowseSearchData): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getBrowseProfileInfoUrl}`, {
        params: new HttpParams()
          .set("City", `${searchData.City}`)
          .set("Command", `${searchData.Command}`)
          .set("CountRecords", `${searchData.CountRecords}`)
          .set("CountryISO", `${searchData.CountryISO}`)
          .set("FromAGE", `${searchData.FromAGE}`)
          .set("LoginName", `${searchData.LoginName}`)
          .set("SocialEnd", `${searchData.SocialEnd}`)
          .set("SocialStart", `${searchData.SocialStart}`)
          .set("StartPos", `${searchData.StartPos}`)
          .set("ToAGE", `${searchData.ToAGE}`)
          .set("Token", `${searchData.Token}`)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get countries inforamtion */
  public getCountriesInfo(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.geoUrl}/${this.getCountriesUrl}`)
      .pipe(
        map((res: any) => res)
      )
  }
}
