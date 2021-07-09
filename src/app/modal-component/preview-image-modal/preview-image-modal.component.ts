import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MemberItem } from '@app/model/member_item';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { ConversationService } from '@app/service/conversation.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-preview-image-modal',
  templateUrl: './preview-image-modal.component.html',
  styleUrls: ['./preview-image-modal.component.scss']
})
export class PreviewImageModalComponent implements OnInit {

  public category: string;
  public images: any[] = [];
  public index: number;
  public serverUrl: string = environment.serverUrl;
  public imageLength: number;
  public isLoad: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PreviewImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private convService: ConversationService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.index = this.data["index"];
    this.imageLength = this.data["images"].length;
    for (const item of this.data["images"]) {
      if (item.MediaType === "Photo") {
        let imageString: string = item.MediaURL.replace("profile_base", "hi");
        imageString = imageString.replace("base", "hi");
        this.images.push({
          isImage: true,
          imageString: imageString
        });
      } else {
        this.images.push({
          isImage: false,
          imageString:item.MediaURL
        });
      }
    }
    this.isLoad = false;
    switch (this.data["category"]) {
      case "public":
        this.category = "PUBLIC PHOTO";
        break;
      case "private":
        this.category = "PRIVATE PHOTO";
        break;
      case "spicy":
        this.category = "SPICY PHOTO";
        break;
      case "chilly":
        this.category = "CHILLY PHOTO";
        break;
    }
  }

  /** go to next image */
  public goToNextImage(): void {
    if (this.index < this.imageLength - 1) {
      this.isLoad = false;
      this.index = this.index + 1;
    }
  }

  /** go to prev image */
  public goToPrevImage(): void {
    if (this.index > 0) {
      this.isLoad = false;
      this.index = this.index - 1;
    }
  }

}
