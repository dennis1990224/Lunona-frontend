import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactMember } from '@app/model/contact_member';
import { environment } from '@env/environment';
import { ChatService } from '@app/service/chat.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-delete-contact-modal',
  templateUrl: './delete-contact-modal.component.html',
  styleUrls: ['./delete-contact-modal.component.scss']
})
export class DeleteContactModalComponent implements OnInit {

  public isConfirm: boolean = false;
  public serverUrl: string = environment.serverUrl;
  public token: string;
  public myName: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteContactModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMember,
    private chatService: ChatService,
    private cookieService: CookieService
  ) {
    this.myName = this.cookieService.get("UserName");
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
    this.chatService.updateContact.subscribe((res) => {
      if (res.Status === "L") {
        this.dialogRef.close("success")
      }
    })
  }

  /** confirm delete */
  public confirmDelete(): void {
    this.isConfirm = true;
  }

  /** cancel delete */
  public cancelDelete(): void {
    this.isConfirm = false;
  }

  /** subscribe the delete contact member event */

  /** delete contact memeber */
  public deleteContact(): void {
    this.chatService.deleteContactMember(this.myName, this.token, this.data.LoginName, this.data.Room);
  }
}
