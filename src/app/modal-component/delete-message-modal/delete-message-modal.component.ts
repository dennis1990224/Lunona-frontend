import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatMessage } from '@app/model/chat_message';
import { ChatService } from '@app/service/chat.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-delete-message-modal',
  templateUrl: './delete-message-modal.component.html',
  styleUrls: ['./delete-message-modal.component.scss']
})
export class DeleteMessageModalComponent implements OnInit {

  public serverUrl: string;
  public token: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteMessageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChatMessage,
    private chatService: ChatService,
    private cookieService: CookieService
  ) {
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
  }

  /** delete message from chat list */
  public deleteMessage(): void {
    this.chatService.deleteMessageFromList(this.token, this.data.MessageID, this.data.Room);
    this.dialogRef.close("success");
  }

}
