import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactMember } from '@app/model/contact_member';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import { ChatService } from '@app/service/chat.service';

@Component({
  selector: 'app-delete-conversation-modal',
  templateUrl: './delete-conversation-modal.component.html',
  styleUrls: ['./delete-conversation-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteConversationModalComponent implements OnInit {

  public avatar: string;
  public token: string;
  public userName: string;
  public serverUrl: string = environment.serverUrl;
  public isOpenDelete: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteConversationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMember,
    private cookieService: CookieService,
    private chatService: ChatService
  ) {
    this.avatar = this.cookieService.get("Avatar");
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get("UserName");
  }

  ngOnInit(): void {
  }

  /** delete conversation */
  public deleteConversation(): void {
    this.chatService.deleteConversation(this.token, this.data);
    this.dialogRef.close("success");
  }

}
