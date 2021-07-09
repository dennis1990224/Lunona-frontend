import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '@app/service/auth.service';
import { LoginReturnValue } from '@app/model/login_return';
import { DataShareService } from '@app/service/data-share.service';
import { ConversationService } from '@app/service/conversation.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMyProfileModalComponent } from '@app/modal-component/delete-my-profile-modal/delete-my-profile-modal.component';
import { LogOutModalComponent } from '@app/modal-component/log-out-modal/log-out-modal.component';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { LanguageElement } from '@app/model/language_element';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public selectedStatus = {
    status: "online",
    statusImg: "assets/img-2/members/online-status.png"
  };
  public yourStatuses = [
    {
      status: "online",
      statusImg: "assets/img-2/members/online-status.png"
    },
    {
      status: "offline",
      statusImg: "assets/img-2/members/offline-status.png"
    }
  ]
  public sideNumber: number;
  public pagePath: string;
  public userName: string;
  public email: string;
  public avatar: string;
  public token: string;
  public authenticationSessionID: string;
  public profileData: LoginReturnValue;
  public languageMemberElements: LanguageElement[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private dataShareService: DataShareService,
    private convService: ConversationService,
    private dialog: MatDialog,
    private myProfileService: ProfileMyProfileService
  ) {
    this.userName = this.cookieService.get("UserName");
    this.email = this.cookieService.get("Email");
    this.avatar = this.cookieService.get("Avatar");
    this.token = this.cookieService.get("LunonaToken");
    this.authenticationSessionID = sessionStorage.getItem("AuthenticateSessionID");
    this.activatedRoute.url.subscribe(url => {
      if (url.length > 0) {
        this.pagePath = url[0].path;
        this.checkPageStatus();
      }
    });
    this.languageMemberElements = this.dataShareService.getLanguageMemberElements();
  }

  ngOnInit(): void {
    this.dataShareService.changeProfileEvent
      .subscribe((res) => {
        if (res === true) {
          this.getProfileBasic();
          this.dataShareService.changeProfile(false);
        }
      });
    this.dataShareService.changeLanguageEvent
      .subscribe((res) => {
        if (res === true) {
          this.languageMemberElements = this.dataShareService.getLanguageMemberElements();
        }
      });
  }

  /** get profile basic */
  public getProfileBasic(): void {
    this.convService.getPreviewProfileBasic(this.token, this.userName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.avatar = res.Data["ProfilePhotoBase"];
          this.cookieService.set("Avatar", this.avatar);
        }
      });
  }

  /** get profile info */
  public getProfileInfo(): void {
    this.authService.checkToken(this.authenticationSessionID, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          console.log(res)
          if (res.Data.ProfilePhotoUrl.includes("http")) {
            this.profileData = res.Data;
          } else {
            const item: LoginReturnValue = res.Data;
            item.ProfilePhotoUrl = `https://lunona.com${item.ProfilePhotoUrl}`
            this.profileData = item;
          }
        }
      })
  }

  /** check pageStatus */
  public checkPageStatus(): void {
    switch (this.pagePath) {
      case "dashboard":
        this.sideNumber = 1;
        break;
      case "my-profile":
        this.sideNumber = 2;
        break;
      case "my-likes":
        this.sideNumber = 3;
        break;
      case "chats":
        this.sideNumber = 4;
        break;
      case "waiting-chat":
        this.sideNumber = 5;
        break;
      case "blocked":
        this.sideNumber = 6;
        break;
      case "your-pin":
        this.sideNumber = 7;
        break;
      case "sent-kiss":
        this.sideNumber = 8;
        break;
      case "them-view":
        this.sideNumber = 9;
        break;
      case "view-them":
        this.sideNumber = 10;
        break;
      case "by-kiss":
        this.sideNumber = 11;
        break;
      case "by-pinned":
        this.sideNumber = 12;
        break;
      case "help-center":
        this.sideNumber = 13;
        break;
    }
  }

  /** online or offline status select */
  public selectStatus(yourStatus: any): void {
    this.selectedStatus = yourStatus;
  }

  /** go to male profile dashboard */
  public goMprofileDashboard(): void {
    this.sideNumber = 1;
    this.router.navigateByUrl('/member/profile/dashboard');
  }

  /** go to male profile my profile */
  public goMprofileMyProfile(): void {
    this.sideNumber = 2;
    this.router.navigateByUrl('/member/profile/my-profile');
  }

  /** go what are you into */
  public goMylikes(): void {
    this.sideNumber = 3;
    this.router.navigateByUrl('/member/profile/my-likes');
  }

  /** go to Chats */
  public goChats(): void {
    this.sideNumber = 4;
    this.router.navigateByUrl('/member/profile/chats');
  }

  /** go waiting to chat with you */
  public goWaitingChat(): void {
    this.sideNumber = 5;
    this.router.navigateByUrl('/member/profile/waiting-chat');
  }

  /** go You blocked them */
  public goBlocked(): void {
    this.sideNumber = 6;
    this.router.navigateByUrl('/member/profile/blocked');
  }

  /** go You pinned them */
  public goYourPin(): void {
    this.sideNumber = 7;
    this.router.navigateByUrl('/member/profile/your-pin');
  }

  /** go You sent kisses to them */
  public goSentKiss(): void {
    this.sideNumber = 8;
    this.router.navigateByUrl('/member/profile/sent-kiss');
  }

  /** go They viewed your profile */
  public goThemView(): void {
    this.sideNumber = 9;
    this.router.navigateByUrl('/member/profile/them-view');
  }

  /** go You viewed their profiles */
  public goViewThem(): void {
    this.sideNumber = 10;
    this.router.navigateByUrl('/member/profile/view-them');
  }

  /** go They sent you kiss */
  public goByKiss(): void {
    this.sideNumber = 11;
    this.router.navigateByUrl('/member/profile/by-kiss');
  }

  /** go They pinned you */
  public goByPinned(): void {
    this.sideNumber = 12;
    this.router.navigateByUrl('/member/profile/by-pinned');
  }

  /** go Help Center */
  public goMhelpCenter(): void {
    this.sideNumber = 13;
    this.router.navigateByUrl('/member/profile/help-center');
  }

  /** go Delete profile */
  public deleteProfile(): void {
    const dialogRef = this.dialog.open(DeleteMyProfileModalComponent, {
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
    this.sideNumber = 14;
  }

  /** log out function */
  public logOut(): void {
    const dialogRef = this.dialog.open(LogOutModalComponent, {
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.myProfileService.logOut(this.token)
          .subscribe((res) => {
            if (res === "OK:Deleted") {
              this.router.navigateByUrl("landing-male/1");
            }
          });
      }
    });
  }

  /** get translate data */
  public getTranslate(key: string): string {
    for (let item of this.languageMemberElements) {
      if (item.FullElementKey === key) {
        return item.Body;
      }
    }
  }

}
