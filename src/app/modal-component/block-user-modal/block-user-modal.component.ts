import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactMember } from '@app/model/contact_member';
import { environment } from '@env/environment';
import { ChatService } from '@app/service/chat.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-block-user-modal',
  templateUrl: './block-user-modal.component.html',
  styleUrls: ['./block-user-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlockUserModalComponent implements OnInit {

  public serverUrl: string = environment.serverUrl;
  public blockType: string = '1';
  public token: string;

  constructor(
    public dialogRef: MatDialogRef<BlockUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMember,
    private cookieService: CookieService,
    private chatService: ChatService
  ) {
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
  }

  /** block user */
  public blockUser(): void {
    this.chatService.blockUser(this.token, this.data, this.blockType);
    this.dialogRef.close("success");
  }

}
