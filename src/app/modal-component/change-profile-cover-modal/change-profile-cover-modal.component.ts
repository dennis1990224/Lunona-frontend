import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { ProfilePhoto } from '@app/model/profile_photo';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-change-profile-cover-modal',
  templateUrl: './change-profile-cover-modal.component.html',
  styleUrls: ['./change-profile-cover-modal.component.scss']
})
export class ChangeProfileCoverModalComponent implements OnInit {

  public token: string;
  public publicPhotos: ProfilePhoto[] = [];
  public photoCount: number;
  public selectedIndex: number;
  public isPhotoSelect: boolean = false;
  public selectedPhoto: ProfilePhoto;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public viewPortWidth: number;
  public imageCropOption = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  };
  public middleCropper: any;
  public isCropped: boolean = false;
  public imageCropPosition: any;
  public imageRatio: number;
  public isDefault: boolean = false;
  public photoType: string;
  @ViewChild('hdImage', { static: false }) HdImage: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ChangeProfileCoverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService,
    private myProfileService: ProfileMyProfileService,
    private dataShareService: DataShareService
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.getPublicPhotos();
  }

  ngOnInit(): void {
    if (this.data.category === "cover") {
      this.photoType = "COVER";
      this.isPhotoSelect = false;
    } else if (this.data.profileDefault === true) {
      this.photoType = "PROFILE";
      this.isPhotoSelect = true;
      this.isDefault = true;
      this.getProfilePhotoDefault();
    } else {
      this.photoType = "PROFILE";
      this.isPhotoSelect = false;
    }
  }

  /** get my public photos */
  public getPublicPhotos(): void {
    this.myProfileService.getPublicPhotos(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.publicPhotos = [];
          this.photoCount = res.Counters;
          for (const item of res.Data) {
            if (!item.MediaURL.includes("http")) {
              item.MediaURL = `https://lunona.com${item.MediaURL}`;
            }
            this.publicPhotos.push(item);
          }
        }
      });
  }

  /** select photo to crop and set */
  public selectPhoto(index: number): void {
    this.selectedIndex = index;
    this.selectedPhoto = this.publicPhotos[index];
    let imageString: string = this.selectedPhoto.MediaURL.replace("profile_base", "hi");
    imageString = imageString.replace("base", "hi");
    this.imageChangedEvent = imageString;
    this.isPhotoSelect = true;
  }

  /** go back to photo select */
  public goBackPhotoSelect(): void {
    this.isPhotoSelect = false;
  }

  /** check image width */
  public checkImageWidth(width: number, height: number): void {
    this.viewPortWidth = Math.ceil(width * (424 / height));
    if (!this.isDefault) {
      this.getProfilePhotoEdit();
    }
  }

  /** get profile photo default */
  public getProfilePhotoDefault(): void {
    this.myProfileService.getProfilePhotoEdit('Default', this.token, 754, this.photoType)
      .subscribe((res) => {
        if (res.d["ErrorMessage"] === "OK") {
          this.middleCropper = {
            x1: res.d["X"],
            y1: res.d["Y"],
            x2: res.d["X"] + res.d["Width"],
            y2: res.d["Y"] + res.d["Height"]
          }
          this.imageRatio = 0.8;
          this.imageChangedEvent = res.d["Url"];
          this.isCropped = true;
        }
      })
  }

  /** get profile photo edit */
  public getProfilePhotoEdit(): void {
    this.myProfileService.getProfilePhotoEdit(this.selectedPhoto.ID, this.token, this.viewPortWidth, this.photoType)
      .subscribe((res) => {
        if (res.d["ErrorMessage"] === "OK") {
          this.middleCropper = {
            x1: res.d["X"],
            y1: res.d["Y"],
            x2: res.d["X"] + res.d["Width"],
            y2: res.d["Y"] + res.d["Height"]
          }
          this.imageRatio = res.d["Ratio"];
          this.isCropped = true;
        }
      })
  }

  /** image load on crop */
  public imageLoaded(): void {
    setTimeout(() => {
      this.imageCropOption = this.middleCropper;
    }, 100)
  }

  /** image cropped event */
  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.imageCropPosition = event.cropperPosition;
  }

  /** set image with cropped */
  public setImageWithCrop(): void {
    const cropWidth: number = Math.floor(this.imageCropPosition.x2 - this.imageCropPosition.x1);
    const cropHeight: number = Math.floor(this.imageCropPosition.y2 - this.imageCropPosition.y1);
    const cropX: number = Math.floor(this.imageCropPosition.x1);
    const cropY: number = Math.floor(this.imageCropPosition.y1);
    let profileID: string;
    if (this.isDefault) {
      profileID = "Default";
    } else {
      profileID = this.selectedPhoto.ID;
    }
    this.myProfileService.setProfilePhotoCropping(cropHeight, cropWidth, cropX, cropY, profileID, this.token, this.viewPortWidth, this.photoType)
      .subscribe((res) => {
        if (res.d["ErrorMessage"] === "OK") {
          this.cookieService.set("Avatar", res.d["Url"]);
          this.dataShareService.changeProfile(true);
          this.dialogRef.close();
        }
      })
  }

}
