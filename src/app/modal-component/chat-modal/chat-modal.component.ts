import { Component, OnInit, NgZone, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReadyMessage } from '@app/model/ready_message';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '@app/service/chat.service';
import { ConversationService } from '@app/service/conversation.service';
import { ReadyMessageCategory } from '@app/model/ready_message_category';
import { StickerCategory } from '@app/model/sticker_category';
import { StickerResource } from '@app/model/sticker_resource';
import { RoomChangeStatus } from '@app/model/room_change_status';
import { ChatMessage } from '@app/model/chat_message';
import { ActivatedRoute, Router } from '@angular/router';
import { DataShareService } from '@app/service/data-share.service';
import { UploadService } from '@app/service/upload.service';
import { ContactMember } from '@app/model/contact_member';
import { TranslateSettingModalComponent } from '../translate-setting-modal/translate-setting-modal.component';
import { MemberItem } from '@app/model/member_item';
import { environment } from '@env/environment';
import { LoginReturnValue } from '@app/model/login_return';
import { AuthService } from '@app/service/auth.service';
import * as moment from 'moment';
import { Subscription, noop } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit, OnDestroy {

  public member: ContactMember;
  public isShowReadySticker: boolean = true;
  public isReadyMessage: boolean = true;
  public readyMessages: ReadyMessage[];
  public textMessage: string = "";
  public token: string;
  public userName: string;
  public readyMessageCategories: ReadyMessageCategory[];
  public stickerCategories: StickerCategory[];
  public stickers: StickerResource[];
  public myChatMessages: ChatMessage[] = [];
  public myAllContacts: ContactMember[];
  public readyMessageIndex: number = 1;
  public stickerMessageIndex: number = 1;
  public isExpand: boolean = false;
  public profileInfo: any;
  public isMoreOption: boolean = false;
  public serverUrl: string = environment.serverUrl;
  public balance: number;
  public profileID: number;
  public isSendActive: boolean = false;
  public newMessageSubscription: Subscription;
  public file: any;
  public file_id: string;
  public start: number;
  public end: number;
  public part: number;
  public size: number;
  public sliceSize: number = 5242880;
  public type: string;
  public extension: string;
  public uploadProgress: number = 0;
  public isOldLoading: boolean = false;
  public isLoading: boolean = false;
  public isProfileInfo: boolean = false;

  /** modal status change variable */
  public isTakePhoto: boolean = false;
  public isChat: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ChatModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberItem,
    private activatedRoute: ActivatedRoute,
    private dataShareService: DataShareService,
    private convService: ConversationService,
    private cookieService: CookieService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private uploadService: UploadService,
    private router: Router,
    private authService: AuthService
  ) {
    this.myAllContacts = this.dataShareService.getAllContacts();
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get('UserName');
    this.subscribeChatMessage();
  }

  ngOnInit(): void {
    this.profileID = this.data.ProfileID;
    // this.member = this.getMemberInfo(this.profileID);
    this.getReadyMessageCategories();
    this.getReadyMessageByCategory(110);
    this.getStickerCategories();
    this.getStickerByCategory(1);
    this.getRoomChangeStatus();
    this.messageUpdate();
    this.getOriginalInfo();
    this.getProfileInfo();
    this.getMyChatMessages(this.data);
    setTimeout(() => {
      this.chatScrollDown();
    }, 1700);
  }

  /** ngOnDestroy unsubscribe all things */
  ngOnDestroy(): void {
    this.newMessageSubscription.unsubscribe();
  }


  /** subscribe chat message */
  public subscribeChatMessage(): void {
    this.newMessageSubscription = this.chatService.newMessage.subscribe((newMessage: ChatMessage) => {
      this.ngZone.run(() => {
        if (newMessage.Room === this.data.Room) {
          this.updateChatMessages(newMessage);
        }
      });
    })
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
    this.myChatMessages.push(newMessage);
    setTimeout(() => {
      this.chatScrollDown();
    }, 500)
  }

  /** chat scroll down */
  public chatScrollDown(): void {
    const chatBorad = document.body.querySelector("#messages-modal");
    if (chatBorad) {
      chatBorad.scrollTop = chatBorad.scrollHeight;
    }
  }

  /** get original info */
  public getOriginalInfo(): void {
    const authenticateSessionId: string = sessionStorage.getItem('AuthenticateSessionID');
    const token: string = this.cookieService.get("LunonaToken");
    this.authService.checkToken(authenticateSessionId, token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          const result: LoginReturnValue = res.Data;
          this.balance = result.TotalLUN;
        }
      });
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

  /** get profile info with name */
  public getProfileInfo(): void {
    this.isProfileInfo = true;
    this.convService.getPreviewProfileBasic(this.token, this.data.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileInfo = res.Data;
          this.isProfileInfo = false;
        }
      });
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

  /** get profile information by profile ID */
  public getMemberInfo(profileID: number): ContactMember {
    if (this.myAllContacts === null) {
      return null;
    }
    for (const item of this.myAllContacts) {
      if (item.ProfileID === profileID) {
        return item;
      }
    }
    return null;
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

  /** get my chat message with contact member */
  public getMyChatMessages(member: ContactMember | MemberItem): void {
    this.isLoading = true;
    if (member === null) {
      this.myChatMessages = [];
      return;
    }
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
          }
          this.getFilterChatMessage(myMessage);
        }
      });
  }

  /** get my old chat message */
  public getOldChatMessage(): void {
    this.isOldLoading = true;
    this.convService.getMyOldChatMessage(this.data, this.myChatMessages[0].MessageID, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          for (const item of res.Data) {
            item.showTranslate = false;
            item.translateText = "See translate";
            item.originalText = "See original";
            if (item.MessageTypeID === 7) {
              item.extraInfo = JSON.parse(item.ExtraData);
            }
            this.myChatMessages.unshift(item);
          }
          this.getFilterChatMessage(this.myChatMessages);
          this.isOldLoading = false;
        }
      })
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
    } else {
      this.isLoading = false;
    }
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
            member: this.data,
            progress: this.uploadProgress
          }
          this.dataShareService.setUploadProcess(uploadObj)
        }
        if (res.body) {
          if (res.body.d["ErrorMessage"] === "OK") {
            const url: string[] = res.body.d["Url_BASE"].split("/");
            const name: string = url[url.length - 1].replace("-base.jpeg", "");
            this.chatService.sendPhoto(this.token, name, this.userName, this.data);
          }
        }
      });
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
            member: this.data,
            progress: this.uploadProgress
          }
          this.dataShareService.setUploadProcess(uploadObj);
        }
        if (res.body) {
          if (res.body.d["ErrorMessage"] === "OK") {
            this.ngZone.run(() => {
              if (res.body.d["ErrorMessage"] === "OK") {
                const mediaGuid: string = res.body.d["MediaGuid"];
                this.chatService.sendVideo(this.token, mediaGuid, this.userName, this.data);
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

  /** get slice */
  public getSlice(file: any, start: number, end: number) {
    const slice = file.mozSlice ? file.mozSlice :
      file.webkitSlice ? file.webkitSlice :
        file.slice ? file.slice : noop;
    return slice.bind(file)(start, end);
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

  /** detect enter key event when key pressed */
  public sendMessageByEnter(): void {
    this.sendTextMessage();
  }

  /** send sticker */
  public sendSticker(sticker: StickerResource): void {
    console.log(sticker)
    this.chatService.sendSticker(this.token, this.userName, this.data, sticker);
  }

  /** edit ready message */
  public editReadyMessage(readyMessage: ReadyMessage): void {
    this.textMessage = readyMessage.TranslatedValue;
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
          });
        }
      });
    });
  }

  /** send ready message */
  public sendReadyMessage(readyMessage: ReadyMessage): void {
    this.textMessage = readyMessage.TranslatedValue;
    this.sendTextMessage();
  }

  /** send text message */
  public sendTextMessage(): void {
    if (this.textMessage.length > 0) {
      const result: boolean = this.chatService.sendMessageTo(this.token, this.textMessage, this.userName, this.data);
      if (result) {
        this.textMessage = "";
      }
    }
  }

  /** category select expand */
  public categoryExpand(): void {
    this.isExpand = !this.isExpand;
  }


  /** input text message */
  public inputMessage(): void {
    if (this.textMessage.length > 0) {
      this.isSendActive = true;
    }
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

  /** open translate modal */
  public openTranslate(): void {
    const dialogRef = this.dialog.open(TranslateSettingModalComponent, {
      panelClass: 'custom-modalbox',
      data: this.data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("translate modal after close:", result);
    });
  }

  /** click more option event */
  public changeMoreOption(): void {
    this.isMoreOption = !this.isMoreOption;
    setTimeout(() => {
      this.chatScrollDown();
    }, 500)
  }

  /** go to ready message */
  public goToReady(): void {
    this.isShowReadySticker = true;
    this.isReadyMessage = true;
  }

  /** go to sticker message */
  public goToSticker(): void {
    this.isShowReadySticker = true;
    this.isReadyMessage = false;
  }

  /** show hide ready and sticker */
  public showHideReadySticker(): void {
    this.isShowReadySticker = !this.isShowReadySticker;
  }

  /** hide the ready sticker */
  public hideReadySticker(): void {
    this.isShowReadySticker = false;
  }

  /** go take photo */
  public goTakePhoto(): void {
    this.isChat = false;
    this.isTakePhoto = true;
  }

  public goChat(): void {
    this.isChat = true;
    this.isTakePhoto = false;
  }
}
