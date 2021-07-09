import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-male-profile-account-setting-modal',
  templateUrl: './male-profile-account-setting-modal.component.html',
  styleUrls: ['./male-profile-account-setting-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfileAccountSettingModalComponent implements OnInit {

  public token: string;
  public modalName: string;
  public myInformation: MaleProfileMyInformation;

  /** username modal variables */
  public userNameForm: FormGroup;

  /** email modal variables */
  public emailForm: FormGroup;

  /** password modal variables */
  public passwordForm: FormGroup;

  public isError: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MaleProfileAccountSettingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileInformation,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.modalName = this.data.name;
    this.token = this.cookieService.get('LunonaToken');
    console.log(this.modalName);

    this.getMyProfileInfo();
  }

  /** get my profile information again on modal */
  public getMyProfileInfo(): void {
    this.myProfileService.getMyProfileInfo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myInformation = res.Data;
          this.checkModalStatus();
        }
      });
  }

  /** check modal status */
  public checkModalStatus(): void {
    switch (this.data.name) {
      case "username":
        this.makeUserNameForm();
        break;
      case "email":
        this.makeEmailForm();
        break;
      case "password":
        this.makePasswordForm();
        break;
    }
  }

  /** make user name form */
  public makeUserNameForm(): void {
    this.userNameForm = this._formBuilder.group({
      userName: ['', [Validators.required]],
    });
    this.userNameForm.setValue({
      userName: this.myInformation.LoginName,
    });
  }

  /** update user name */
  public updateUserName(): void {

  }

  /** make email form */
  public makeEmailForm(): void {
    this.emailForm = this._formBuilder.group({
      email: ['', [Validators.required]],
    });
    this.emailForm.setValue({
      email: this.myInformation.Email,
    })
  }

  /** update email information */
  public updateEmail(): void {

  }

  /** make password Form */
  public makePasswordForm(): void {
    this.passwordForm = this._formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /** update password */
  public updatePassword(): void {
    console.log(this.passwordForm.value)
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.isError = true;
    } else {
      this.isError = false;
      this.myProfileService.ChangePassword(this.passwordForm.value.newPassword, this.passwordForm.value.newPassword, this.token)
        .subscribe((res) => {
          console.log(res)
        })
    }
    
  }

}
