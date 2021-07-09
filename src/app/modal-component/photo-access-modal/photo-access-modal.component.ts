import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactMember } from '@app/model/contact_member';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '@app/service/chat.service';
import { ConversationService } from '@app/service/conversation.service';
import { MediaAccess } from '@app/model/media_access';

@Component({
  selector: 'app-photo-access-modal',
  templateUrl: './photo-access-modal.component.html',
  styleUrls: ['./photo-access-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PhotoAccessModalComponent implements OnInit {

  public avatar: string;
  public token: string;
  public userName: string;
  public mediaAccess: MediaAccess;

  constructor(
    public dialogRef: MatDialogRef<PhotoAccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMember,
    private cookieService: CookieService,
    private chatService: ChatService,
    private convService: ConversationService,
  ) {
    this.avatar = this.cookieService.get("Avatar");
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get("UserName");
  }

  ngOnInit(): void {
    this.convService.getMediaAccess(this.data.ProfileID, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.mediaAccess = res.Data;
        }
      })
  }

  /** update media access */
  public updateMediaAccess(): void {
    this.mediaAccess.InformTOByLunaOrYou = this.mediaAccess.InformTOForAccessUpdate;
    this.chatService.setMediaAccess(this.token, this.data, this.mediaAccess);
    this.dialogRef.close("success");
  }

}
