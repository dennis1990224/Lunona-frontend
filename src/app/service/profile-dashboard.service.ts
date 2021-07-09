import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileDashboardService {

  apiUrl: string = environment.apiUrl;
  mainUrl: string = "MainService.svc";
  getProfileDashboardUrl: string = "GetMyProfileDashboard";

  constructor(private httpClient: HttpClient) { }

  /** get the Profile dashboard data */
  public getDashboardData(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getProfileDashboardUrl}`, {
        params: new HttpParams().set('Token', token)
      })
      .pipe(
        map((res: any) => res)
      )
  }
}
