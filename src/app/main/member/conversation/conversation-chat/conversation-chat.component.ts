import { Component, OnInit, NgZone, ViewEncapsulation, ElementRef, ViewChild, AfterViewChecked, AfterViewInit, OnDestroy, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataShareService } from '@app/service/data-share.service';
import { ContactMember } from '@app/model/contact_member';
import { ConversationService } from '@app/service/conversation.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatMessage } from '@app/model/chat_message';
import { ChatService } from '@app/service/chat.service';
import * as moment from 'moment';
import { ReadyMessageCategory } from '@app/model/ready_message_category';
import { environment } from '@env/environment';
import { ReadyMessage } from '@app/model/ready_message';
import { StickerResource } from '@app/model/sticker_resource';
import { StickerCategory } from '@app/model/sticker_category';
import { MatDialog } from '@angular/material/dialog';
import { TranslateSettingModalComponent } from '@app/modal-component/translate-setting-modal/translate-setting-modal.component';
import { SnapshotModalComponent } from '@app/modal-component/snapshot-modal/snapshot-modal.component';
import { SavedMediaModalComponent } from '@app/modal-component/saved-media-modal/saved-media-modal.component';
import { UploadService } from '@app/service/upload.service';
import { RoomChangeStatus } from '@app/model/room_change_status';
import { noop, Subscription } from 'rxjs';
import { BlockUserModalComponent } from '@app/modal-component/block-user-modal/block-user-modal.component';
import { ScrollEvent } from 'ngx-scroll-event';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-conversation-chat',
  templateUrl: './conversation-chat.component.html',
  styleUrls: ['./conversation-chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConversationChatComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chatRoom') chatRoom: ElementRef;

  public profileID: string;
  public myAllContacts: ContactMember[];
  public member: ContactMember;
  public profileInfo: any;
  public previewProfileInfo: any;
  public token: string;
  public isMoreOption: boolean = false;
  public isOpenSticker: boolean = false;
  public isSendActive: boolean = false;
  public textMessage: string = "";
  public myChatMessages: ChatMessage[] = [];
  public userName: string;
  public isSticker: boolean = false;
  public isReadyMessage: boolean = true;
  public readyMessageCategories: ReadyMessageCategory[];
  public readyMessages: ReadyMessage[];
  public stickerCategories: StickerCategory[];
  public stickers: StickerResource[];
  public serverUrl: string = environment.serverUrl;
  public readyMessageIndex: number = 1;
  public stickerMessageIndex: number = 1;
  public isExpand: boolean = false;
  public file: any;
  public start: number;
  public end: number;
  public part: number;
  public size: number;
  public sliceSize: number = 5242880;
  public file_id: string;
  public type: string;
  public extension: string;
  public uploadProgress: number = 0;
  public newMessageSubscription: Subscription;
  public isOldLoading: boolean = false;
  public isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataShareService: DataShareService,
    private convService: ConversationService,
    private cookieService: CookieService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private uploadService: UploadService,
    private router: Router,
    private injector: Injector
  ) {
    this.myAllContacts = this.dataShareService.getAllContacts();
    this.token = this.cookieService.get('LunonaToken');
    this.userName = this.cookieService.get('UserName');
    this.subscribeChatMessage();
  }

  ngOnInit(): void {
    this.receiveHeaderEvent();
    this.receiveReadyStickerChange();
    this.getReadyMessageCategories();
    this.getReadyMessageByCategory(110);
    this.getStickerCategories();
    this.getStickerByCategory(1);
    this.getRoomChangeStatus();
    this.messageUpdate();
    this.activatedRoute.params.subscribe(params => {
      this.profileID = params["profileID"];
      this.member = this.getMemberInfo(this.profileID);
      this.getProfileInfo();
      this.getPreviewInfo();
      this.getMyChatMessages(this.member);
      setTimeout(() => {
        this.chatScrollDown();
      }, 1700);
    });
  }

  ngAfterViewInit() {
  }

  /** ngOnDestroy unsubscribe all things */
  ngOnDestroy(): void {
    this.newMessageSubscription.unsubscribe();
  }

  /** chat scroll down */
  public chatScrollDown(): void {
    const chatBorad = document.body.querySelector("#messages");
    if (chatBorad) {
      chatBorad.scrollTop = chatBorad.scrollHeight;
    }
  }

  /** receive header change event */
  public receiveHeaderEvent(): void {
    this.dataShareService.headerEvent.subscribe(res => {
      this.isSticker = res;
    });
  }

  /** receive ready and sticker change event */
  public receiveReadyStickerChange(): void {
    this.dataShareService.readyStickerEvent.subscribe(res => {
      this.isReadyMessage = res;
    })
  }

  /** subscribe chat message */
  public subscribeChatMessage(): void {
    this.newMessageSubscription = this.chatService.newMessage.subscribe((newMessage: ChatMessage) => {
      this.ngZone.run(() => {
        if (newMessage.Room === this.myChatMessages[0].Room) {
          this.updateChatMessages(newMessage);
        }
      })
    })
  }

  /** message update when photo accept and reject */
  public messageUpdate(): void {
    this.chatService.messageUpdateBody.subscribe((messageUpdate: ChatMessage) => {
      this.ngZone.run(() => {
        if (messageUpdate.Room === this.myChatMessages[0].Room) {
          this.myChatMessages = this.myChatMessages.map(item => {
            if (messageUpdate.MessageID === item.MessageID) {
              return messageUpdate;
            } else {
              return item;
            }
          })
        }
      })
    })
  }

  /** room change status */
  public getRoomChangeStatus(): void {
    this.chatService.roomChangestatus.subscribe((roomChage: RoomChangeStatus) => {
      this.ngZone.run(() => {
        if (this.myChatMessages.length > 0) {
          if (roomChage.Room === this.myChatMessages[0].Room) {
            this.myChatMessages = this.myChatMessages.map(item => {
              if (item.LoginNameFROM === this.userName) {
                item.Seen = false;
              }
              return item;
            })
          }
        }
      });
    });
  }

  /** update chat messages */
  public updateChatMessages(newMessage: ChatMessage): void {
    const index: number = this.myChatMessages.length - 1;
    newMessage.showTranslate = false;
    newMessage.translateText = "See translate";
    newMessage.originalText = "See original";
    if (this.myChatMessages[index].LoginNameFROM !== newMessage.LoginNameFROM) {
      newMessage.showFace = true;
      newMessage.time = moment(newMessage.LastUpdateKEY).format("hh:mm a");
      this.myChatMessages[index].time = moment(this.myChatMessages[index].LastUpdateKEY).format("hh:mm a");
    } else {
      newMessage.showFace = false;
    }
    if (newMessage.MessageTypeID === 7) {
      newMessage.extraInfo = JSON.parse(newMessage.ExtraData);
    }
    if (newMessage.MessageTypeID === 4 && newMessage.ExtraData.includes("emoji")) {
      newMessage.isEmoj = true;
    } else {
      newMessage.isEmoj = false;
    }
    this.myChatMessages.push(newMessage);
    setTimeout(() => {
      this.chatScrollDown();
    }, 500)
  }

  /** get profile information by profile ID */
  public getMemberInfo(profileID: string): ContactMember {
    for (const item of this.myAllContacts) {
      if (item.ProfileID === parseInt(profileID)) {
        return item;
      }
    }
    return null;
  }

  /** get profile info with name */
  public getProfileInfo(): void {
    this.convService.getPreviewProfileBasic(this.token, this.member.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileInfo = res.Data;
        }
      });
  }

  /** get perview profile information with name */
  public getPreviewInfo(): void {
    this.convService.getPreviewProfileInfo(this.token, this.member.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.previewProfileInfo = res.Data;
        }
      })
  }

  /** get my chat message with contact member */
  public getMyChatMessages(member: ContactMember): void {
    this.isLoading = true;
    this.convService.getMyChatMessages(member.ProfileID, member.Room, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          console.log(res.Data)
          const myMessage: ChatMessage[] = res.Data
          for (const item of myMessage) {
            item.showTranslate = false;
            item.translateText = "See translate";
            item.originalText = "See original";
            if (item.MessageTypeID === 7) {
              item.extraInfo = JSON.parse(item.ExtraData);
            }
            if (item.MessageTypeID === 4 && item.ExtraData.includes("emoji")) {
              item.isEmoj = true;
            } else {
              item.isEmoj = false;
            }
          }
          this.getFilterChatMessage(myMessage);
        }
      });
  }

  /** filter and sort chat message */
  public getFilterChatMessage(chatMessages: ChatMessage[]): void {
    if (chatMessages.length > 0) {
      this.myChatMessages = chatMessages.sort((a, b) => (a.MessageID > b.MessageID) ? 1 : ((b.MessageID > a.MessageID) ? -1 : 0));
      this.myChatMessages[0].showFace = true;
      if (moment(new Date()).diff(moment(this.myChatMessages[0].LastUpdateKEY), 'days') > 0) {
        const diff: number = moment(new Date()).diff(moment(this.myChatMessages[0].LastUpdateKEY), 'days');
        const time: string = moment(this.myChatMessages[0].LastUpdateKEY).format("hh:mm a");
        this.myChatMessages[0].conversationStart = `${diff} days ago, ${time}`;
      } else {
        const time: string = moment(this.myChatMessages[0].LastUpdateKEY).format("hh:mm a");
        this.myChatMessages[0].conversationStart = `Today, ${time}`;
      }
      for (let i = 1; i < this.myChatMessages.length; i++) {
        if (this.myChatMessages[i - 1].LoginNameFROM !== this.myChatMessages[i].LoginNameFROM) {
          this.myChatMessages[i].showFace = true;
          this.myChatMessages[i].time = moment(this.myChatMessages[i].LastUpdateKEY).format("hh:mm a");
          this.myChatMessages[i - 1].time = moment(this.myChatMessages[i - 1].LastUpdateKEY).format("hh:mm a");
        } else {
          this.myChatMessages[i].showFace = false;
          this.myChatMessages[i].time = moment(this.myChatMessages[i].LastUpdateKEY).format("hh:mm a");
          this.myChatMessages[i - 1].time = moment(this.myChatMessages[i - 1].LastUpdateKEY).format("hh:mm a");
        }
        if (moment(this.myChatMessages[i].LastUpdateKEY).format('YYYY-MM-DD') !== moment(this.myChatMessages[i - 1].LastUpdateKEY).format('YYYY-MM-DD')) {
          if (moment(new Date()).diff(moment(this.myChatMessages[i].LastUpdateKEY), 'days') > 0) {
            const diff: number = moment(new Date()).diff(moment(this.myChatMessages[i].LastUpdateKEY), 'days');
            const time: string = moment(this.myChatMessages[i].LastUpdateKEY).format("hh:mm a");
            this.myChatMessages[i].conversationStart = `${diff} days ago, ${time}`;
          } else {
            const time: string = moment(this.myChatMessages[i].LastUpdateKEY).format("hh:mm a");
            this.myChatMessages[i].conversationStart = `Today, ${time}`;
          }
        }
      }
      this.isLoading = false;
    }
    
  }

  /** get my old chat message */
  public getOldChatMessage(): void {
    this.isOldLoading = true;
    this.convService.getMyOldChatMessage(this.member, this.myChatMessages[0].MessageID, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          for (const item of res.Data) {
            item.showTranslate = false;
            item.translateText = "See translate";
            item.originalText = "See original";
            if (item.MessageTypeID === 7) {
              item.extraInfo = JSON.parse(item.ExtraData);
            }
            if (item.MessageTypeID === 4 && item.ExtraData.includes("emoji")) {
              item.isEmoj = true;
            } else {
              item.isEmoj = false;
            }
            this.myChatMessages.unshift(item);
          }
          this.getFilterChatMessage(this.myChatMessages);
          this.isOldLoading = false;
        }
      })
  }

  /** input text message */
  public inputMessage(): void {
    if (this.textMessage.length > 0) {
      this.isSendActive = true;
    }
  }

  /** send text message */
  public sendTextMessage(): void {
    if (this.textMessage.length > 0) {
      const result: boolean = this.chatService.sendMessageTo(this.token, this.textMessage, this.userName, this.member);
      if (result) {
        this.textMessage = "";
      }
    }
  }

  /** detect enter key event when key pressed */
  public sendMessageByEnter(): void {
    this.sendTextMessage();
  }

  /** get all ready message categories */
  public getReadyMessageCategories(): void {
    this.convService.getReadyMessageCategories(this.token)
      .subscribe(res => {
        if (res.ErrorMessage === "OK") {
          this.readyMessageCategories = res.Data;
        }
      })
  }

  /** get ready messages by category */
  public getReadyMessageByCategory(category: number): void {
    this.convService.getReadyMessagesByCategory(category, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.readyMessages = res.Data;
          for (const item of this.readyMessages) {
            item.active = false;
          }
        }
      });
  }

  /** get all sticker categories */
  public getStickerCategories(): void {
    this.convService.getStickerCategories(this.token)
      .subscribe(res => {
        if (res.ErrorMessage === "OK") {
          this.stickerCategories = res.Data;
        }
      })
  }

  /** get stickers by category */
  public getStickerByCategory(category: number): void {
    this.convService.getStickersByCategory(this.token, category)
      .subscribe(res => {
        if (res.ErrorMessage === "OK") {
          this.stickers = res.Data;
        }
      })
  }

  /** select category and get ready messages */
  public selectMessageCategory(categoryId: number): void {
    this.readyMessageIndex = categoryId;
    let messageCategory: number;
    switch (categoryId) {
      case 1:
        messageCategory = 110;
        break;
      case 2:
        messageCategory = 200;
        break;
      case 3:
        messageCategory = 160;
        break;
      case 4:
        messageCategory = 280;
        break;
      case 5:
        messageCategory = 130;
        break;
      case 6:
        messageCategory = 210;
        break;
      case 7:
        messageCategory = 140;
        break;
    }
    this.getReadyMessageByCategory(messageCategory);
  }

  /** select sticker category and get ready messages */
  public selectStickerCategory(categoryId: number): void {
    this.stickerMessageIndex = categoryId;
    let stickerCategory: number;
    switch (categoryId) {
      case 1:
        stickerCategory = 1;
        break;
      case 2:
        stickerCategory = 30;
        break;
      case 3:
        stickerCategory = 31;
        break;
      case 4:
        stickerCategory = 28;
        break;
      case 5:
        stickerCategory = 32;
        break;
    }
    this.getStickerByCategory(stickerCategory);
  }

  /** category select expand */
  public categoryExpand(): void {
    this.isExpand = !this.isExpand;
  }

  /** open take photo modal */
  public openTakePhoto(): void {
    const dialogRef = this.dialog.open(SnapshotModalComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("take photo modal after close:", result);
    })
  }

  /** open saved media */
  public openSavedMedia(): void {
    const dialogRef = this.dialog.open(SavedMediaModalComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("save media modal after close:", result);
    })
  }

  /** open translate modal */
  public openTranslate(): void {
    const dialogRef = this.dialog.open(TranslateSettingModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.member
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** upload photo and send */
  public sendPhoto($event): void {
    if ($event.target.files && $event.target.files[0]) {
      this.file = $event.target.files[0];
      this.upload(this.file)
    }
  }

  /** upload video and send */
  public sendVideo($event): void {
    if ($event.target.files && $event.target.files[0]) {
      this.file = $event.target.files[0];
      this.upload(this.file);
    }
  }

  /** upload function */
  public upload(file): void {
    const file_type_arr: string[] = file.type.split("/");
    const file_type: string = file_type_arr[0];
    const file_extension: string = file_type_arr[1] === 'quicktime' ? 'mov' : file_type_arr[1];
    if (file_type === "video") {
      this.chunkFile({ file: this.file, type: file_type, extension: file_extension });
    } else {
      this.photoUpload({ data: file, extension: file_extension, type: file_type });
    }
  }

  /** chunk video File */
  public chunkFile({ file, type, extension }): void {
    // this.file_id = parseInt(new Date().getTime().toString(), 16).toString();
    this.file_id = Guid.create().toString();
    this.start = 0;
    this.part = 0;
    this.size = parseInt(file.size) - 1;
    this.uploadVideoLoop(type, extension);
  }

  /** upload video loop */
  public uploadVideoLoop(type: string, extension: string): void {
    this.end = this.start + this.sliceSize;
    if (this.size - this.end < 0) {
      this.end = this.size;
    }
    const s = this.getSlice(this.file, this.start, this.end);
    const upload_params = {
      data: s,
      fullVideoData: {},
      extension: extension,
      type: type,
      start: this.start,
      end: this.end,
      size: this.size,
      id: this.file_id,
      part: this.part,
      parts_length: Math.ceil((this.size + 1) / this.sliceSize),
    };
    if (this.start === 0) {
      upload_params.fullVideoData = this.file;
    }
    this.fileUploader(upload_params)
      .subscribe((res) => {
        if (res.type) {
          const part_length: number = Math.ceil((this.size + 1) / this.sliceSize);
          if (part_length > 1) {
            if (this.part === 0) {
              this.uploadProgress = Math.floor(Math.round(100 * res.loaded / res.total) / part_length);
            } else {
              this.uploadProgress = Math.floor((this.part * 100 + Math.round(100 * res.loaded / res.total)) / part_length);
            }
          } else {
            this.uploadProgress = Math.round(100 * res.loaded / res.total);
          }
          const uploadObj = {
            member: this.member,
            progress: this.uploadProgress
          }
          this.dataShareService.setUploadProcess(uploadObj);
        }
        if (res.body) {
          if (res.body.d["ErrorMessage"] === "OK") {
            this.ngZone.run(() => {
              if (res.body.d["ErrorMessage"] === "OK") {
                const mediaGuid: string = res.body.d["MediaGuid"];
                this.chatService.sendVideo(this.token, mediaGuid, this.userName, this.member);
              }
            });
          }
          if (this.end < this.size) {
            console.log("continue upload")
            this.start += this.sliceSize;
            this.part++;
            setTimeout(() => {
              this.uploadVideoLoop(type, extension);
            }, 1)
          }
        }
      })
  }

  /** upload file function */
  public fileUploader({ data, fullVideoData, extension, type, start, end, size, id, part, parts_length }) {
    const reader = new FileReader();
    const file_obj = {
      data: data,
      category: 'chat',
      extension: extension,
      start: start,
      end: end,
      size: size,
      isVideo: true,
      id: id,
      part: part,
      parts_length: parts_length
    }
    if ((type === "video" && start === 0) || type === "image") {
      reader.onload = function (e) {
        file_obj.data = e.target.result;
      }
      reader.readAsArrayBuffer(type === "video" ? fullVideoData : data);
    }
    return this.uploadService.upload(file_obj, this.token);
  }

  /** get slice */
  public getSlice(file: any, start: number, end: number) {
    const slice = file.mozSlice ? file.mozSlice :
      file.webkitSlice ? file.webkitSlice :
        file.slice ? file.slice : noop;
    return slice.bind(file)(start, end);
  }

  /** photo upload function */
  public photoUpload({ data, extension, type }): void {
    const reader = new FileReader();
    const file_obj = {
      data: data,
      category: 'chat',
      extension: extension,
      isVideo: false
    }
    const that = this;
    reader.onload = function (e) {
      file_obj.data = e.target.result;
    }
    this.uploadService.upload(file_obj, this.token)
      .subscribe((res) => {
        console.log(res);
        if (res.type) {
          this.uploadProgress = Math.round(100 * res.loaded / res.total);
          const uploadObj = {
            member: this.member,
            progress: this.uploadProgress
          }
          this.dataShareService.setUploadProcess(uploadObj)
        }
        if (res.body) {
          if (res.body.d["ErrorMessage"] === "OK") {
            const url: string[] = res.body.d["Url_BASE"].split("/");
            const name: string = url[url.length - 1].replace("-base.jpeg", "");
            this.chatService.sendPhoto(this.token, name, this.userName, this.member);
          }
        }
      });
  }

  /** confirm user request */
  public confirmUserRequest(): void {
    this.chatService.contactRequestAnswer(this.member, this.token);
  }

  /** block user request */
  public blockUserRequest(): void {
    const dialogRef = this.dialog.open(BlockUserModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.member
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "success") {
        this.router.navigateByUrl('member/conversation/dashboard');
      }
    });
  }

  /** active ready message action */
  public activeAction(readyMessage: ReadyMessage): void {
    this.readyMessages = this.readyMessages.map(item => {
      if (item.ID === readyMessage.ID) {
        item.active = !item.active;
      } else {
        item.active = false;
      }
      return item;
    })
  }

  /** send ready message */
  public sendReadyMessage(readyMessage: ReadyMessage): void {
    this.textMessage = readyMessage.TranslatedValue;
    this.sendTextMessage();
  }

  /** edit ready message */
  public editReadyMessage(readyMessage: ReadyMessage): void {
    this.textMessage = readyMessage.TranslatedValue;
  }

  /** send sticker */
  public sendSticker(sticker: StickerResource): void {
    console.log(sticker)
    this.chatService.sendSticker(this.token, this.userName, this.member, sticker);
  }

  /** click more option event */
  public changeMoreOption(): void {
    this.isMoreOption = !this.isMoreOption;
    setTimeout(() => {
      this.chatScrollDown();
    }, 500)
  }

  /** open sticker page by click smile icon */
  public openStickerPage(): void {
    this.isOpenSticker = true;
    this.isSticker = true;
    // this.dataShareService.readyStickerChange(true);

    // this.dataShareService.changeMenuEvent(true);
  }

  /** message box scroll event */
  public handleScroll(event: ScrollEvent) {
    if (this.isOldLoading) {
      return ;
    }
    if (event.isReachingTop) {
      this.getOldChatMessage();
    }
  }
}

