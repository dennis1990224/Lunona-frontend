import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BrowseService } from '@app/service/browse.service';
import { DataShareService } from '@app/service/data-share.service';
import { BrowseMenu } from '@app/model/browse_menu';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  public pagePath: string;
  public sideNumber: number;
  public token: string;
  public browseMenuData: BrowseMenu[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private browseService: BrowseService,
    private dataShareService: DataShareService
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.activatedRoute.url.subscribe(url => {
      if (url.length > 0) {
        this.pagePath = url[0].path;
        this.checkPageStatus();
      }
    });
    this.getBrowseMenu();
  }

  ngOnInit(): void {
  }

  /** check page status */
  public checkPageStatus(): void {
    switch (this.pagePath) {
      case "dashboard":
        this.sideNumber = 1;
        break;
      case "near":
        this.sideNumber = 2;
        break;
      case "online":
        this.sideNumber = 3;
        break;
      case "newlocal":
        this.sideNumber = 4;
        break;
      case "new":
        this.sideNumber = 5;
        break;
      case "socialposition":
        this.sideNumber = 6;
        break;
      case "hostcity":
        this.sideNumber = 7;
        break;
      case "hostyourcity":
        this.sideNumber = 8;
        break;
      case "travel":
        this.sideNumber = 9;
        break;
      case "workforyou":
        this.sideNumber = 10;
        break;
    }
  }

  /** get Browse menu info */
  public getBrowseMenu(): void {
    this.browseMenuData = this.dataShareService.getBrowseMenu();
    if (this.browseMenuData === null) {
      this.browseService.getBrowseMenu(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.browseMenuData = res.Data;
          this.dataShareService.setBrowseMenuData(this.browseMenuData);
          console.log(this.browseMenuData);
        }
      });
    }
  }

  /** go to browse dashboard */
  public goBrowseDashboard(): void {
    this.sideNumber = 1;
    this.router.navigateByUrl('/member/browse/dashboard');
  }

  /** go to browse page */
  public goToBrowsePage(browseMenu: any, index: number): void {
    this.sideNumber = index + 2;
    this.router.navigateByUrl(`/member/browse/${browseMenu.Command}`);
  }

  /** go to browse close to you */
  public goBrowseCloseYou(): void {
    this.sideNumber = 2;
    this.router.navigateByUrl('/member/browse/close-you');
  }

  /** go to online now */
  public goBrowseOnline(): void {
    this.sideNumber = 3;
    this.router.navigateByUrl('/member/browse/online');
  }

  /** go to new arrivals coutntry */
  public goBrowseCountryArrival(): void {
    this.sideNumber = 4;
    this.router.navigateByUrl('/member/browse/country-arrivals');
  }

  /** go to new arrivals world */
  public goBrowseWorldArrival(): void {
    this.sideNumber = 5;
    this.router.navigateByUrl('/member/browse/world-arrivals');
  }

  /** go to Social Status */
  public goBrowseSocial(): void {
    this.sideNumber = 6;
    this.router.navigateByUrl('/member/browse/social');
  }

  /** go to To host you */
  public goBrowseHostYou(): void {
    this.sideNumber = 7;
    this.router.navigateByUrl('/member/browse/host-you');
  }

  /** go to To host them */
  public goBrowseHostThem(): void {
    this.sideNumber = 8;
    this.router.navigateByUrl('/member/browse/host-them');
  }

  /** go to travel together */
  public goBrowseTravel(): void {
    this.sideNumber = 9;
    this.router.navigateByUrl('/member/browse/travel');
  }

  /** go to To work in your company */
  public goBrowseCompany(): void {
    this.sideNumber = 10;
    this.router.navigateByUrl('/member/browse/company');
  }
}
