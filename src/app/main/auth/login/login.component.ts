import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { LanguageElement } from '@app/model/language_element';
import { DataShareService } from '@app/service/data-share.service';
import { AuthFooterComponent } from '@app/shared-component/auth-footer/auth-footer.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/service/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginReturnValue } from '@app/model/login_return';
import { Router } from '@angular/router';
import { ChatService } from '@app/service/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  
  @ViewChild('AuthFooter') AuthFooter: AuthFooterComponent;

  public languagePublicElements: LanguageElement[];
  public userNameForm: FormGroup;
  public passwordForm: FormGroup;
  public isAfterCheckUserName: boolean = false;
  public isNextDisable: boolean = false;
  public passwordHide: boolean = true;
  public isStaySignIn: boolean = false;
  public nameErrorMessage: string = '';
  public passErrorMessage: string = '';
  public isNameError: boolean = false;
  public isPassError: boolean = false;
  public loginResult: LoginReturnValue;
  public userName: string;
  public password: string;
  public LanguageISO: string;
  public CookieVisitorUID: string;
  public AuthenticateSessionID: string;
  public lunonaToken: string;

  constructor(
    private dataShareService: DataShareService,
    private cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private chatService: ChatService
  ) {
  }

  ngAfterViewInit() {
    this.AuthFooter.getFooterLanguage();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.userNameForm = this._formBuilder.group({
      userName: ['', [Validators.required]],
    });
    this.passwordForm = this._formBuilder.group({
      password: ['', [Validators.required]],
    })
    this.languagePublicElements = this.dataShareService.getLanguagePublicElements();
    if (this.languagePublicElements) {
    }
  }

  /** check user name or login */
  public checkUserNameOrLogin(): void {
    if (!this.isAfterCheckUserName && !this.userNameForm.valid) {
      this.isNameError = true;
      this.nameErrorMessage = "Email or UserName is Empty";
      return;
    } 
    if (this.isAfterCheckUserName && !this.passwordForm.valid) {
      return;
    }
    if (!this.isAfterCheckUserName) {
      this.checkUserName();
    } else {
      this.logIn();
    }
  }

  /** login to the WS */
  public logIn(): void {
    this.userName = this.userNameForm.value.userName;
    this.password = this.passwordForm.value.password;
    this.LanguageISO = this.cookieService.get('lunaoLang');
    this.CookieVisitorUID = this.cookieService.get('CookieVisitorUID');
    this.authService.login(this.userName, this.password, this.LanguageISO, this.CookieVisitorUID)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.loginResult = res.Data;
          this.lunonaToken = this.loginResult.Token.toString();
          this.AuthenticateSessionID = this.loginResult.AuthenticateSessionID;
          this.checkToken()
        } else {
         this.isPassError = true;
         this.passErrorMessage = res.ErrorMessage;
        }
      });
  }

  /** check token */
  public checkToken(): void {
    this.authService.checkToken(this.AuthenticateSessionID, this.lunonaToken)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.loginResult = res.Data;
          this.cookieService.set("UserName", this.loginResult.LoginName);
          this.cookieService.set("Avatar", this.loginResult.ProfilePhotoUrl);
          this.cookieService.set("Email", this.loginResult.EmailORSocialNameOrSocialID);
          this.cookieService.set("LunonaToken", this.loginResult.Token.toString(), 3600);
          this.cookieService.set("CountryISO", this.loginResult.CountryISO);
          sessionStorage.setItem('AuthenticateSessionID', this.loginResult.AuthenticateSessionID);
          this.chatService.initializeSignalRConnection();
          if (this.loginResult.GenderId === 1) {
            this.router.navigateByUrl('/member/browse/dashboard');
          } else {
            this.router.navigateByUrl('/member/browse/dashboard');
          }
        } else {
          this.isPassError = true;
          this.passErrorMessage = res.ErrorMessage;
        }
      });
  }

  /** check user name in the WS */
  public checkUserName(): void {
    this.isNextDisable = true;
    this.authService.checkUserName(this.userNameForm.value.userName, this.cookieService.get('lunaoLang'))
      .subscribe((res) => {
        this.isNextDisable = false;
        if (res.ErrorMessage === "OK") {
          this.isAfterCheckUserName = true;
        } else {
          this.nameErrorMessage = res.ErrorMessage;
          this.isNameError = true;
        }
      });
  }

  /** ge to the Reset Password page */
  public goToResetPass(): void {
    this.router.navigateByUrl('/reset-password');
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

}
