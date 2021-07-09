import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SplashService } from './service/splash.service';
import { AnimateNavigationService } from './service/animate-navigation.service';
import { trigger, query, transition, animation, style, animate, state, group } from '@angular/animations';
import { environment } from '@env/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ChatService } from './service/chat.service';
import { Message } from './model/message_model';
import { ContactMember } from './model/contact_member';
import { DataShareService } from './service/data-share.service';
import { BrowseService } from './service/browse.service';

const slideToRight = [
  query(':enter, :leave', style({ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }), { optional: true }),
  query(':leave', style({ transform: 'translateX(0%)' }), { optional: true }),
  query(':enter', style({ transform: 'translateX(-100%)' }), { optional: true }),
  group([
    query(':leave', [
      animate('500ms ease-in-out', style({ transform: 'translateX(100%)' })),
    ], { optional: true }),
    query(':enter', [
      animate('500ms ease-in-out', style({ transform: 'translateX(0%)' })),
    ], { optional: true })
  ])
];

const slideToLeft = [
  query(':enter, :leave', style({ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }), { optional: true }),
  query(':leave', style({ transform: 'translateX(0%)' }), { optional: true }),
  query(':enter', style({ transform: 'translateX(100%)' }), { optional: true }),
  group([
    query(':leave', [
      animate('500ms ease-in-out', style({ transform: 'translateX(-100%)' })),
    ], { optional: true }),
    query(':enter', [
      animate('500ms ease-in-out', style({ transform: 'translateX(0%)' })),
    ], { optional: true })
  ])
];

const slideToTop = [
  query(':enter, :leave', style({ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }), { optional: true }),
  query(':leave', style({ transform: 'translateY(0%)' }), { optional: true }),
  query(':enter', style({ transform: 'translateY(100%)' }), { optional: true }),
  group([
    query(':leave', [
      animate('500ms ease-in-out', style({ transform: 'translateY(-100%)' })),
    ], { optional: true }),
    query(':enter', [
      animate('500ms ease-in-out', style({ transform: 'translateY(0%)' })),
    ], { optional: true })
  ])
];


const slideToBottom = [
  query(':enter, :leave', style({ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }), { optional: true }),
  query(':leave', style({ transform: 'translateY(0%)' }), { optional: true }),
  query(':enter', style({ transform: 'translateY(-100%)' }), { optional: true }),
  group([
    query(':leave', [
      animate('500ms ease-in-out', style({ transform: 'translateY(100%)' })),
    ], { optional: true }),
    query(':enter', [
      animate('500ms ease-in-out', style({ transform: 'translateY(0%)' })),
    ], { optional: true })
  ])
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition("* => slideToLeft", slideToLeft),
      transition("* => slideToRight", slideToRight),
      transition("* => slideToTop", slideToTop),
      transition("* => slideToBottom", slideToBottom),
      transition("* => slideToLeftDuplicate", slideToLeft),
      transition("* => slideToRightDuplicate", slideToRight),
      transition("* => slideToTopDuplicate", slideToTop),
      transition("* => slideToBottomDuplicate", slideToBottom),
    ])
  ],
})
export class AppComponent implements OnInit {

  title = 'Lunona';
  public dots: number[] = [1, 2, 3, 4 ,5, 6, 7, 8, 9];
  public genderPath: string;
  public pagePath: number;
  public isLanding: boolean = false;

  public textMessage: string = "";
  public uniqueID: string = new Date().getTime().toString();
  public messages = new Array<Message>();

  public contactList: ContactMember[] = [];
  public newMessage: number = 0;

  /**
   * constructor
   */
  constructor(
    @Inject(DOCUMENT) private document: any,
    private splashService: SplashService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private animService: AnimateNavigationService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private dataShareService: DataShareService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getGenderAndPath(event.url);
      }
    });
  }

  /**
   * On Init
   */
  public ngOnInit(): void {
    this.getMemberList();
  }

  /** get contact member list */
  public getMemberList(): void {
    this.chatService.contactList.subscribe((contactMember: ContactMember) => {
      this.ngZone.run(() => {
        contactMember.active = false;
        if (contactMember.NewMessages > 0) {
          this.newMessage += contactMember.NewMessages;
        }
        this.contactList.push(contactMember);
        this.dataShareService.setContactList(this.contactList);
        this.dataShareService.setUnreadCount(this.newMessage);
        this.dataShareService.setAllContacts(this.contactList);
      });
    });
  }

  /** get gender and path */
  public getGenderAndPath(url: string): void {
    const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
    const firstUrl: string = url.slice(1).split(urlDelimitators)[0];
    if (firstUrl === "landing-male" || firstUrl === "landing-female") {
      this.genderPath = firstUrl;
      this.pagePath = parseInt(url.slice(1).split(urlDelimitators)[1], 10);
      this.isLanding = true;
    } else {
      this.isLanding = false;
    }
  }

  public getAnimation() {
    return this.animService.getCurrentAnimation();
  }

  /** go to pages by dots */
  public goToByDot(dotIndex: number): void {
    const newUrl: string = `${this.genderPath}/${dotIndex}`;
    if (this.pagePath && this.pagePath < dotIndex) {
      this.animService.setCurrentAnimation(3);
      this.router.navigateByUrl(newUrl);
    }
    if (this.pagePath && this.pagePath > dotIndex) {
      this.animService.setCurrentAnimation(4);
      this.router.navigateByUrl(newUrl);
    }
    this.router.navigateByUrl(newUrl);
  }
}
