import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemberItem } from '@app/model/member_item';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { ConversationService } from '@app/service/conversation.service';

@Component({
  selector: 'app-social-status-modal',
  templateUrl: './social-status-modal.component.html',
  styleUrls: ['./social-status-modal.component.scss']
})
export class SocialStatusModalComponent implements OnInit {

  public photoUrl: string;
  public token: string;

  constructor(
    public dialogRef: MatDialogRef<SocialStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberItem,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private convService: ConversationService
  ) {
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
    if (!this.data.ProfilePhotoBase.includes("http")) {
      this.photoUrl = `https://lunona.com${this.data.ProfilePhotoBase}`.replace("profile_base", "profile_zoom").replace("base", "profile_zoom");
    }
  }

  /** update pin */
  public updatePin(): void {
    this.myProfileService.updatePinInfo(this.token, this.data.ProfileID)
      .subscribe((res) => {
        if (res === "OK") {
          this.getProfileInfo();
        }
      });
  }

  /** get profile basic info again */
  public getProfileInfo(): void {
    this.convService.getPreviewProfileBasic(this.token, this.data.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.data = res.Data;
        }
      });
  }

}
