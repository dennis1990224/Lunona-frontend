import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactMember } from '@app/model/contact_member';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '@app/service/chat.service';
import { environment } from '@env/environment';
import { ConversationService } from '@app/service/conversation.service';

@Component({
  selector: 'app-donate-luns-modal',
  templateUrl: './donate-luns-modal.component.html',
  styleUrls: ['./donate-luns-modal.component.scss']
})
export class DonateLunsModalComponent implements OnInit {

  public token: string;
  public serverUrl: string = environment.serverUrl;
  public avatar: string;
  public lunValue: number = 50;
  public message: string =  "";

  constructor(
    public dialogRef: MatDialogRef<DonateLunsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMember,
    private cookieService: CookieService,
    private convService: ConversationService,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.avatar = this.cookieService.get("Avatar");
  }

  ngOnInit(): void {
  }

  /** send luns to member */
  public donateLuns(): void {
    this.convService.sendLuns(this.token, this.data, this.lunValue, this.message)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

}
