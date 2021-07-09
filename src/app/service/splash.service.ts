import { Injectable, Inject } from '@angular/core';
import { AnimationPlayer, AnimationBuilder, animate, style } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  // splash screen Element. 
  private splashScreenEl: any;

  // splash player
  private player: AnimationPlayer;

  /**
   * Constructor
   */
  constructor(
    private _animationBuilder: AnimationBuilder,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router
  ) {
    // Initialize
    this._init();
  }

  /**
   * Initialize
   */
  private _init(): void {
    //Get the splash screen element
    this.splashScreenEl = this._document.body.querySelector("#lunona-splash-screen");

    //If the splash screen exists...
    if (this.splashScreenEl) {
      this._router.events
        .pipe(filter((event => event instanceof NavigationEnd)), take(1))
          .subscribe(() => {
            setTimeout(() => {
              this.hide();
            }, 3000);
          });
        
    }
  }

  /**
   * show the splash screen
   */
  public show(): void {
    this.player = this._animationBuilder
      .build([style({opacity: "0", zIndex: "9999"}), animate("400ms ease", style({opacity: "1"}))])
      .create(this.splashScreenEl);
    setTimeout(() => {
      this.player.play();
    }, 0);
  }

  /**
   * hide the splash screen
   */
  public hide(): void {
    this.player = this._animationBuilder
      .build([style({opacity: "1"}), animate("400ms ease", style({opacity: "0", zIndex: "-10"}))])
      .create(this.splashScreenEl);
    setTimeout(() => {
      this.player.play();
    }, 0);
  }
}
