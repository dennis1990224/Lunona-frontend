import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfilePhoto } from '@app/model/profile_photo';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-change-photo-category',
  templateUrl: './change-photo-category.component.html',
  styleUrls: ['./change-photo-category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePhotoCategoryComponent implements OnInit {

  public token: string;
  public selectedCategory: string;
  public photoUrl: string;

  constructor(
    public dialogRef: MatDialogRef<ChangePhotoCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfilePhoto,
    private cookieService: CookieService
  ) {
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
    if (this.data) {
      if (this.data.MediaType === "Video") {
        this.photoUrl = `${this.data.MediaURL}.jpg`;
      } else {
        this.photoUrl = this.data.MediaURL;
      }
      this.selectedCategory = this.data.Category;
    }
  }

  /** change photo category */
  public changeCategory(): void {
    this.dialogRef.close({success: true, data: this.selectedCategory});
  }

}
