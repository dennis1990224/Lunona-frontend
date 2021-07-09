import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfilePhoto } from '@app/model/profile_photo';

@Component({
  selector: 'app-delete-profile-photo',
  templateUrl: './delete-profile-photo.component.html',
  styleUrls: ['./delete-profile-photo.component.scss']
})
export class DeleteProfilePhotoComponent implements OnInit {

  public photoUrl: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteProfilePhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfilePhoto,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      if (this.data.MediaType === "Video") {
        this.photoUrl = `${this.data.MediaURL}.jpg`;
      } else {
        this.photoUrl = this.data.MediaURL;
      }
    }
  }

}
