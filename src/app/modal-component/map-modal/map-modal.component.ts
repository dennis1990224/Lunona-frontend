import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { CookieService } from 'ngx-cookie-service';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit {

  public position: any;
  public mapLabel: any;
  public mapOption: any;
  public token: string;
  public locationInfo: any;

  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MaleProfileMyInformation,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.getLocationInfo();
  }

  /** get location information */
  public getLocationInfo(): void {
    this.myProfileService.getLocationInfo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.locationInfo = res.Data;
          this.position = {
            lat: this.locationInfo.Latitude,
            lng: this.locationInfo.Longitude
          };
        }
      })
  }

  ngOnInit(): void {
    this.mapLabel = {
      color: 'red',
      text: ""
    };
    this.mapOption = {
      animation: google.maps.Animation.BOUNCE
    }
  }

}
