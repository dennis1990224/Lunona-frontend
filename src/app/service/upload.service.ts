import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  public apiUrl: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  /** upload photo or video */
  public upload(photo: any, token: string): Observable<any> {
    const url = this.getPhotoUploadUrl(photo);
    if (photo.isVideo) {
      let headers = new HttpHeaders(
        {
          "Content-Range": `bytes ${photo.start}-${photo.end}/${parseInt(photo.size) + 1}`,
          "Content-Type": "application/octet-stream",
          "token": token,
          "IsBase64": "false",
          "Category": this.getCategory(photo).toString(),
          "fileextension": photo.extension && photo.extension.replace('.', ''),
          "FileID": photo.id
        }
      )
      const sendingData = this.getPhotoPayload(photo);
      const options = {
        headers: headers,
        reportProgress: true,
      };
      const req = new HttpRequest('POST', url, sendingData, options);
      return this.httpClient.request(req)
        .pipe(
          map((res: any) => res)
        );
    } else {
      let headers = new HttpHeaders(
        {
          "Content-Type": "application/octet-stream",
          "token": token,
          "IsBase64": photo.isBase64 || "false",
          "Category": this.getCategory(photo).toString(),
          "FileExtension": photo.extension && photo.extension.replace('.', ''),
        }
      )
      const sendingData = this.getPhotoPayload(photo);
      const options = {
        headers: headers,
        reportProgress: true,
      };
      const req = new HttpRequest('POST', url, sendingData, options);
      return this.httpClient.request(req)
        .pipe(
          map((res: any) => res)
        )
    }
  }

  /** get Photo upload url */
  public getPhotoUploadUrl(photo) {
    if (photo.isVideo) {
      return `${this.apiUrl}/UploadService.svc/UploadVideo`;
    }
    return `${this.apiUrl}/UploadService.svc/UploadPhoto`;
  }

  /** get payload */
  public getPhotoPayload(photo) {
    if (!photo.isBase64) {
      return photo.data;
    }
    return photo.data.replace(/data.*?base64,/, '');
  }

  /** get category of the photo */
  public getCategory(photo: any): number {
    switch (photo.category) {
      case 'public': return 0;
      case 'private': return 10;
      case 'spicy': return 20;
      case 'chilly': return 30;
      case 'Profile': return 40;
      case 'Cover': return 50;
      case 'chat': return 60;
      case 'saved': return 80;
    }
  }

}
