import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { ContactMember } from '@app/model/contact_member';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import { ChatService } from '@app/service/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateSettingModalComponent } from '@app/modal-component/translate-setting-modal/translate-setting-modal.component';
import { DeleteConversationModalComponent } from '@app/modal-component/delete-conversation-modal/delete-conversation-modal.component';
import { PhotoAccessModalComponent } from '@app/modal-component/photo-access-modal/photo-access-modal.component';
import { BlockUserModalComponent } from '@app/modal-component/block-user-modal/block-user-modal.component';
import { DonateLunsModalComponent } from '@app/modal-component/donate-luns-modal/donate-luns-modal.component';
import { DateModalComponent } from '@app/modal-component/date-modal/date-modal.component';
import { DeleteContactModalComponent } from '@app/modal-component/delete-contact-modal/delete-contact-modal.component';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-chat-member-item',
  templateUrl: './chat-member-item.component.html',
  styleUrls: ['./chat-member-item.component.scss']
})
export class ChatMemberItemComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @Input() public contactMember: ContactMember;
  public serverUrl: string = environment.serverUrl;

  public token: string;
  public isLoad: boolean = false;
  public defaulUrl: string = "assets/img-2/conversation/default-Women.png";
  public imageUrl: string;
  public isActive: boolean = false;

  constructor(
    private cookieService: CookieService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.token = this.cookieService.get('LunonaToken');
    this.updateContectMember();
  }

  ngOnInit(): void {
    this.imageUrl = this.serverUrl + this.contactMember.ProfilePhotoBase;
  }

  /** update image url when image broken */
  public updateUrl(): void {
    this.imageUrl = this.defaulUrl;
  }

  /** update contact member info by signalR */
  public updateContectMember(): void {
  }

  /** show setting menu */
  public showSettingMenu(): boolean {
    this.menuTrigger.openMenu();
    return false;
  }

  /** open translate modal */
  public openTranslateModal(): void {
    const dialogRef = this.dialog.open(TranslateSettingModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.contactMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open delete conversation modal */
  public openDelConvModal(): void {
    const dialogRef = this.dialog.open(DeleteConversationModalComponent, {
      panelClass: 'delete-conversation',
      data: this.contactMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open photo access modal */
  public openPhotoAccessModal(): void {
    const dialogRef = this.dialog.open(PhotoAccessModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.contactMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open block user modal */
  public openBlockUserModal(): void {
    const dialogRef = this.dialog.open(BlockUserModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.contactMember
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.router.navigateByUrl('/member/conversation/dashboard');
      }
    });
  }

  /** open donate modal */
  public openDonateModal(): void {
    const dialogRef = this.dialog.open(DonateLunsModalComponent, {
      panelClass: 'donate-modalbox',
      data: this.contactMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open date modal */
  public openDateModal(): void {
    const dialogRef = this.dialog.open(DateModalComponent, {
      panelClass: 'date-modalbox',
      data: this.contactMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** open delete contact modal */
  public openDeleteContact(): void {
    const dialogRef = this.dialog.open(DeleteContactModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.contactMember
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
      if (result === "success") {
        
      }
    });
  }


}
