import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-male-profile-rate-modal',
  templateUrl: './male-profile-rate-modal.component.html',
  styleUrls: ['./male-profile-rate-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfileRateModalComponent implements OnInit {

  public token: string;
  public ratingValue: number;
  public serverUrl: string;
  public memberPhoto: string;

  constructor(
    public dialogRef: MatDialogRef<MaleProfileRateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
  ) {
    this.token = this.cookieService.get('LunonaToken');
    this.serverUrl = environment.serverUrl;
  }

  ngOnInit(): void {
    if (!this.data.ProfilePhotoBase.includes("http")) {
      this.memberPhoto = `https://lunona.com${this.data.ProfilePhotoBase}`.replace("base", "zoom");
    }
  }

  /** set Rate */
  public setRate(): void {
    this.myProfileService.updateRateByProfileID(this.token, this.data.ProfileID, this.ratingValue)
      .subscribe((res) => {
        if (res === "OK") {
          this.dialogRef.close("success")
        }
      });
  }

}
