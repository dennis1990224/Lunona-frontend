import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { trigger, transition, style, animate, state, group } from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';
import { ProfileMyLikesService } from '@app/service/profile-my-likes.service';
import { MaleProfileMyLikes } from '@app/model/male-profile-my-likes';
import { DataShareService } from '@app/service/data-share.service';
import { LanguageElement } from '@app/model/language_element';

@Component({
  selector: 'app-profile-my-likes',
  templateUrl: './profile-my-likes.component.html',
  styleUrls: ['./profile-my-likes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 0, overflow: 'hidden' })),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),

        group([
          animate(300, style({ height: 0 })),
          animate('200ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),

        group([
          animate(300, style({ height: '*' })),
          animate('400ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
  ]
})
export class ProfileMyLikesComponent implements OnInit {
  public isActive: number;
  public mylikesData: MaleProfileMyLikes;
  public visible: boolean = true;
  public token: string;
  public userName: string;
  public languageElement: LanguageElement[];
  public myLikes = [
    {
      id: 1,
      name: "My Dream"
    },
    {
      id: 2,
      name: "Very"
    },
    {
      id: 3,
      name: "So-So"
    },
    {
      id: 4,
      name: "Not at All"
    }
  ]
  public categories = [
    {
      id: 1,
      category: 'Age'
    },
    {
      id: 2,
      category: 'Body Type'
    },
    {
      id: 3,
      category: 'Features'
    },
    {
      id: 4,
      category: 'Height'
    },
    {
      id: 5,
      category: 'Hair Color'
    },
    {
      id: 6,
      category: 'Bust'
    },
    {
      id: 7,
      category: 'Finish'
    }
  ];

  constructor(
    private myLikesService: ProfileMyLikesService,
    private cookieService: CookieService,
    private dataShareService: DataShareService
  ) {
    this.token = this.cookieService.get('LunonaToken');
    this.userName = this.cookieService.get("UserName");
    this.isActive = 0;
    this.languageElement = this.dataShareService.getLanguageMemberElements();
  }

  ngOnInit(): void {
    this.getProfileLikes();
    this.dataShareService.changeLanguageEvent
      .subscribe((res) => {
        if (res === true) {
          this.languageElement = this.dataShareService.getLanguageMemberElements();
        }
      });
  }

  @HostListener("mousewheel", ["$event"])
  public onMouseWheel(event) {
    if (event.wheelDelta > 0) {
      if (this.isActive === 0) {
        return;
      }
      this.isActive = this.isActive - 1;
    } else {
      if (this.isActive === 6) {
        return;
      }
      this.isActive = this.isActive + 1;
    }
  }

  /** select category with id */
  public selectCategory(id: number): void {
    this.isActive = id - 1;
  }

  /** get Profile likes */
  public getProfileLikes(): void {
    this.myLikesService.getProfileLikes(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.mylikesData = res.Data;
          console.log(this.mylikesData)
        }
      })
  }

  /** page up */
  public upPage(): void {
    this.isActive = this.isActive - 1;
  }

  /** page down */
  public downPage(): void {
    this.isActive = this.isActive + 1;
  }

  /** change my likes */
  public changeMyLikes(key: string): void {
    this.myLikesService.setMyProfileLikes(key, this.token, this.mylikesData.AgeA)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          console.log("success set my profile likes");
        } else {
          console.log(res.ErrorMessage)
        }
      })
  }

  /** get value of the my information tab title */
  public getTranslate(keyword: string) {
    for (let item of this.languageElement) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  /** get translate value when it has the name */
  public getTranslateWithName(keyword: string): string {
    for (let item of this.languageElement) {
      if (item.FullElementKey === keyword) {
        let data: string = item.Body.replace("##MYLOGINNAME##", this.userName).replace("##LOGINNAME##", this.userName);
        console.log(data)
        return data;
      }
    }
  }

}
