import { Component, OnInit } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { BrowseService } from '@app/service/browse.service';
import { CookieService } from 'ngx-cookie-service';
import { BrowseMenu } from '@app/model/browse_menu';
import { BrowseData } from '@app/model/browse.data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse-dashboard',
  templateUrl: './browse-dashboard.component.html',
  styleUrls: ['./browse-dashboard.component.scss']
})
export class BrowseDashboardComponent implements OnInit {

  public cardLimit: number = -1;
  public token: string;
  public browseMenuData: BrowseMenu[];
  public browseDashboardDatas: BrowseData[];
  public isLoading: boolean = true;

  constructor(
    private browseService: BrowseService,
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.getBrowseMenu();
    this.getBrowseDashboardMenuData();
  }

  ngOnInit(): void {
  }

  /** get the browse card limit */
  public onResized(event: ResizedEvent) {
    this.cardLimit = Math.floor((event.newWidth + 25) / 204);
  }

  /** get Borwse menu info */
  public getBrowseMenu(): void {
    this.browseService.getBrowseMenu(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.browseMenuData = res.Data;
        }
      })
  }

  /** get browse dashboard Menu */
  public getBrowseDashboardMenuData(): void {
    this.isLoading = true;
    this.browseService.getBrowseDashboardData(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.isLoading = false;
          this.browseDashboardDatas = res.Data["Frames"];
        }
      })
  }

  /** go to browse page by see all button click */
  public goToBrowsePage(browseData: BrowseData): void {
    this.router.navigateByUrl(`/member/browse/${browseData.Header.Command}`);
  }
}
