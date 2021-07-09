import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimateNavigationService {

  private currentAnimation: any = null;
  private currentAnimationId: number = -1;
  public animations: any;

  constructor() { }

  public setCurrentAnimation(animationId) {
    let nextAnimation = "";
    let isDuplicate = false;

    switch(animationId) {
      case 1:
        nextAnimation = "slideToLeft";
        break;
      case 2:
        nextAnimation = "slideToRight";
        break;
      case 3:
        nextAnimation = "slideToTop";
        break;
      case 4:
        nextAnimation = "slideToBottom";
        break;
    }

    if (this.currentAnimation  && (this.currentAnimation.indexOf("Duplicate") > -1)) {
      isDuplicate = true;
    }

    if ((animationId == this.currentAnimationId) && !isDuplicate) {
      nextAnimation = nextAnimation + "Duplicate";
    }

    this.currentAnimation = nextAnimation;
    this.currentAnimationId = animationId;
  }

  public getCurrentAnimation() {
    return this.currentAnimation;
  }
}
