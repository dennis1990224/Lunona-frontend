import { Component, OnInit, ViewEncapsulation, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { CookieService } from 'ngx-cookie-service';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { AvatarImage } from '@app/model/avatar_image';
import { environment } from '@env/environment';
import { noop } from 'rxjs';
import { UploadService } from '@app/service/upload.service';
import { PhotoUploadResponse } from '@app/model/photo_upload_response';
import { FileHandle } from '@app/directive/drag-drop.directive';
import { UploadResponse } from '@app/model/upload_response';
import { DataShareService } from '@app/service/data-share.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadPhotoComponent implements OnInit {

  /** public modal variables */
  public modalName: string;
  public isActive: number;
  public avatars: AvatarImage[];
  public token: string;
  public serverUrl: string;
  public avatarsLoad: boolean[] = [];
  public avatarSelected: boolean[] = [];
  public selectedAvatar: AvatarImage;

  /** modal variables */
  public file: any;
  public start: number;
  public end: number;
  public part: number;
  public size: number;
  public sliceSize: number = 5242880;
  public file_id: string;
  public type: string;
  public extension: string;
  public photos = [];
  public responsePhotos: UploadResponse[] = [];
  public uploadProgress: number = 0;
  public selectedTabIndex: number;

  constructor(
    public dialogRef: MatDialogRef<UploadPhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private uploadService: UploadService,
    private ngZone: NgZone,
    private dataShareService: DataShareService
  ) {
    this.modalName = this.getModalName(this.data);
    this.token = this.cookieService.get('LunonaToken');
    this.serverUrl = environment.serverUrl;
  }

  ngOnInit(): void {
    console.log(this.responsePhotos)
  }

  /** public modal change tab event */
  public OnTabChanged(event): void {
    this.selectedTabIndex = event.index;
    switch (event.index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        this.getAvartarPhoto(38);
        break;
    }
  }

  /** get modal name with category */
  public getModalName(data: string): string {
    switch (data) {
      case "public":
        return "Add More Public Photos";
      case "private":
        return "Add More Private Photos";
      case "spicy":
        return "Add More Spicy Photos";
      case "chilly":
        return "Add More Spicy Photos";
      case "saved":
        return "Add More Spicy Photos";
    }
  }

  /** get eighteen photo */
  public getAvartarPhoto(categoryId: number): void {
    switch (categoryId) {
      case 38:
        this.isActive = 1;
        break;
      case 40:
        this.isActive = 2;
        break;
      case 41:
        this.isActive = 3;
        break;
      case 42:
        this.isActive = 4;
        break;
      case 43:
        this.isActive = 5;
        break;
      case 44:
        this.isActive = 6;
        break;
    }
    this.myProfileService.getAvatarImage(categoryId, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.avatars = res.Data;
          console.log(this.avatars)
          for (let i = 0; i < this.avatars.length; i++) {
            this.avatarsLoad[i] = true;
            this.avatarSelected[i] = false;
          }
        }
      })
  }

  /** select avatar on avatar tab */
  public selectAvatar(avatar: AvatarImage, index: number): void {
    for (let i = 0; i < this.avatars.length; i++) {
      this.avatarSelected[i] = false;
    }
    this.avatarSelected[index] = true;
    this.selectedAvatar = avatar;
  }


  /** upload public photo by click button event */
  public photofileChange($event): void {
    if ($event.target.files && $event.target.files[0]) {
      this.file = $event.target.files[0];
      this.publicUpload(this.file)
    }
  }

  /** public file upload */
  public publicUpload(file): void {
    const file_type_arr: string[] = this.file.type.split("/");
    const file_type: string = file_type_arr[0];
    const file_extension: string = file_type_arr[1] === 'quicktime' ? 'mov' : file_type_arr[1];
    if (file_type === "video") {
      this.chunkFile({ file: this.file, type: file_type, extension: file_extension });
    } else {
      this.photoUpload({ data: this.file, extension: file_extension, type: file_type });
    }
  }

  /** file upload by drag drop */
  public fileDropped(file: FileHandle[]): void {
    this.file = file[0].file;
    this.publicUpload(this.file);
  }

  /** upload only photo */
  public photoUpload({ data, extension, type }): void {
    const reader = new FileReader();
    const file_obj = {
      data: data,
      category: this.data,
      extension: extension,
      isVideo: false
    }
    const that = this;
    reader.onload = function (e) {
      file_obj.data = e.target.result;
      that.photos.push(file_obj);
    }
    this.uploadService.upload(file_obj, this.token)
      .subscribe((res) => {
        console.log(res);
        if (res.type) {
          this.uploadProgress = Math.round(100 * res.loaded / res.total);
          console.log(this.uploadProgress)
        }
        if (res.body) {
          if (res.body.d["ErrorMessage"] === "OK") {
            this.ngZone.run(() => {
              if (res.body.d["VideoUrl"]) {
                let data:  UploadResponse = {
                  mediaGuid: res.body.d["mediaGuid"],
                  ThumbnailUrl: res.body.d["ThumbnailUrl"],
                  VideoUrl: res.body.d["VideoUrl"],
                  isVideo: true
                }
                console.log("here is the video", data);
                this.responsePhotos.push(data);
              } else {
                let data:  UploadResponse = {
                  mediaGuid: res.body.d["EUP_MediaGuid"],
                  ThumbnailUrl: res.body.d["Url_BASE"],
                  VideoUrl: "",
                  isVideo: false
                }
                this.responsePhotos.push(data);
              }
            });
          }
        }
      })
  }

  /** chunk video File */
  public chunkFile({ file, type, extension }): void {
    this.file_id = parseInt(new Date().getTime().toString(), 16).toString();
    this.start = 0;
    this.part = 0;
    this.size = parseInt(file.size) - 1;
    this.uploadVideoLoop(type, extension)
  }

  /** upload file function */
  public fileUploader({ data, fullVideoData, extension, type, start, end, size, id, part, parts_length }) {
    const reader = new FileReader();
    const file_obj = {
      data: data,
      category: this.data,
      extension: extension,
      start: start,
      end: end,
      size: size,
      isVideo: true,
      id: id,
      part: part,
      parts_length: parts_length
    }
    if ((type === "video" && start === 0) || type === "image") {
      const that = this;
      reader.onload = function (e) {
        file_obj.data = e.target.result;
        that.photos.push(file_obj);
      }
      reader.readAsArrayBuffer(type === "video" ? fullVideoData : data);
    }
    return this.uploadService.upload(file_obj, this.token);
  }

  /** upload video loop */
  public uploadVideoLoop(type: string, extension: string): void {
    this.end = this.start + this.sliceSize;
    if (this.size - this.end < 0) {
      this.end = this.size;
    }
    const s = this.getSlice(this.file, this.start, this.end);
    const upload_params = {
      data: s,
      fullVideoData: {},
      extension: extension,
      type: type,
      start: this.start,
      end: this.end,
      size: this.size,
      id: this.file_id,
      part: this.part,
      parts_length: Math.ceil((this.size + 1) / this.sliceSize),
    };
    if (this.start === 0) {
      upload_params.fullVideoData = this.file;
    }
    this.fileUploader(upload_params)
      .subscribe((res) => {
        console.log(res)
        if (res.type) {
          const part_length: number = Math.ceil((this.size + 1) / this.sliceSize);
          if (part_length > 1) {
            if (this.part === 0) {
              this.uploadProgress = Math.floor(Math.round(100 * res.loaded / res.total) / part_length);
            } else {
              this.uploadProgress = Math.floor((this.part * 100 + Math.round(100 * res.loaded / res.total)) / part_length);
            }
          } else {
            this.uploadProgress = Math.round(100 * res.loaded / res.total);
          }
        }
        if (res.body) {
          if (res.body.d["ErrorMessage"] === "OK") {
            this.ngZone.run(() => {
              if (res.body.d["ErrorMessage"] === "OK") {
                this.ngZone.run(() => {
                  if (res.body.d["VideoUrl"]) {
                    let data:  UploadResponse = {
                      mediaGuid: res.body.d["mediaGuid"],
                      ThumbnailUrl: res.body.d["ThumbnailUrl"],
                      VideoUrl: res.body.d["VideoUrl"],
                      isVideo: true
                    }
                    this.responsePhotos.push(data);
                  } else {
                    let data:  UploadResponse = {
                      mediaGuid: res.body.d["EUP_MediaGuid"],
                      ThumbnailUrl: res.body.d["Url_BASE"],
                      VideoUrl: "",
                      isVideo: false
                    }
                    this.responsePhotos.push(data);
                  }
                });
              }
            });
          }
          if (this.end < this.size) {
            console.log("continue upload")
            this.start += this.sliceSize;
            this.part++;
            setTimeout(() => {
              this.uploadVideoLoop(type, extension);
            }, 1)
          }
        }
      })
  }

  /** get slice */
  public getSlice(file: any, start: number, end: number) {
    const slice = file.mozSlice ? file.mozSlice :
      file.webkitSlice ? file.webkitSlice :
        file.slice ? file.slice : noop;
    return slice.bind(file)(start, end);
  }

  /** upload photo by click button event */
  public fileChange($event): boolean {
    if ($event.target.files && $event.target.files[0]) {
      const file = $event.target.files[0];
      const reader = new FileReader();
      reader.onload = (imageFile) => {
        const data = imageFile.target["result"] as string;
      };
      reader.readAsDataURL(file);
      return false;
    }
  }

  /** click done event */
  public uploadDone(): void {
    if (this.selectedTabIndex === 2) {
      if (this.selectedAvatar) {
        this.myProfileService.setProfileWithAvatar(this.token)
          .subscribe((res) => {
            if (res) {
              this.myProfileService.setProfilePhotoWithAvatar(this.selectedAvatar.ID, this.token)
                .subscribe((res) => {
                  if (res.d.ErrorMessage === "OK") {
                    this.dialogRef.close(); 
                  }
                })
            }
          })
      }
    } else {
      this.dataShareService.changeProfile(true);
      this.dialogRef.close();
    }
  }

}
