import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AuthFooterComponent } from '@app/shared-component/auth-footer/auth-footer.component';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {

  @ViewChild('AuthFooter') AuthFooter: AuthFooterComponent;
  
  public languagePublicElements: LanguageElement[];
  public userNameOrEmail: string = '';
  public pin: string = '';
  public userEmailForm: FormGroup;
  public pinForm: FormGroup;
  public newPassForm: FormGroup;
  public isProfileError: boolean = false;
  public profileErrorMessage: string = '';
  public isSetNewPassError: boolean = false;
  public setNewPassErrorMessage: string = '';
  public resetPassStep: number = 1;
  
  constructor(
    private dataShareService: DataShareService,
    private cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }
  
  ngAfterViewInit() {
    this.AuthFooter.getFooterLanguage();
    this.cdr.detectChanges();
  }
  
  ngOnInit(): void {
    this.userEmailForm = this._formBuilder.group({
      userEmail: ['', Validators.required]
    });
    this.pinForm = this._formBuilder.group({
      pin: ['', Validators.required]
    });
    this.newPassForm = this._formBuilder.group({
      password: ['', Validators.required]
    })
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
    }
  }

  /** get language element with keyword */
  public getTranslate(keyword: string): string {
    for (let item of this.languagePublicElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  /** get all language and trigger get footer language */
  public getLanguage(): void {
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
      this.AuthFooter.getFooterLanguage();
    }
  }

  /** check profile is exist on WS */
  public checkProfile(): void {
    if (!this.userEmailForm.value.userEmail) {
      this.isProfileError = true;
      this.profileErrorMessage = "Email is empty! Type in your email.";
      return;
    }
    this.userNameOrEmail = this.userEmailForm.value.userEmail;
    this.authService.resetPassword(this.userNameOrEmail)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.resetPassStep += 1;
        } else {
          this.isProfileError = true;
          this.profileErrorMessage = res.ErrorMessage;
        }
      });
  }

  /** go to the back step */
  public goToBackStep(): void {
    if (this.resetPassStep === 1) {
      this.router.navigateByUrl('/login');
    }
    this.resetPassStep -= 1;
  }

  /** go to input pin number step */
  public goToPinStep(): void {
    this.resetPassStep += 1;
  }

  /** ge to new password input step */
  public goToNewPassStep(): void {
    this.resetPassStep += 1;
    this.pin = this.pinForm.value.pin;
  }

  /** finish the reset password step */
  public finishResetPass(): void {
    if (!this.newPassForm.value.password) {
      this.isSetNewPassError = true;
      this.setNewPassErrorMessage = "New password is empty! Type in a new password you would like to use."
      return;
    }
    const newPas: string = this.newPassForm.value.password;
    this.authService.setNewPasswordWithPin(this.userNameOrEmail, newPas, this.pin)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.router.navigateByUrl('/login');
        } else {
          this.isSetNewPassError = true;
          this.setNewPassErrorMessage = res.ErrorMessage;
        }
      });
  }

}
