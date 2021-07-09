import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataShareService } from '@app/service/data-share.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversation-dashboard',
  templateUrl: './conversation-dashboard.component.html',
  styleUrls: ['./conversation-dashboard.component.scss']
})
export class ConversationDashboardComponent implements OnInit, OnDestroy {

  public unreadCount: number;
  public unreadSubscription: Subscription;

  constructor(
    private dataShareService: DataShareService,
  ) { }

  ngOnInit(): void {
    this.getUreadCount();
  }

  /** get unread Count */
  public getUreadCount(): void {
    this.unreadSubscription = this.dataShareService.unreadCount.subscribe((res) => {
      this.unreadCount = res;
    })
  }

  /** onDestroy */
  public ngOnDestroy(): void {
    if (this.unreadSubscription) {
      this.unreadSubscription.unsubscribe();
    }
  }
}
