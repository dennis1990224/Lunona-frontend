import { Injectable, EventEmitter } from '@angular/core';
import { Message } from '@app/model/message_model';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';
import { Guid } from 'guid-typescript';
import { ContactMember } from '@app/model/contact_member';
import { ChatMessage } from '@app/model/chat_message';
import * as moment from 'moment';
import { ContactMemberUpdate } from '@app/model/contact_member_update';
import { RoomChangeStatus } from '@app/model/room_change_status';
import { DeleteMessage } from '@app/model/delete_message';
import { Updatebalance } from '@app/model/update_balance';
import { MediaAccess } from '@app/model/media_access';
import { StickerResource } from '@app/model/sticker_resource';
import { MemberItem } from '@app/model/member_item';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public contactList = new EventEmitter<ContactMember>();
  public newMessage = new EventEmitter<ChatMessage>();
  public connectionEstablished = new EventEmitter<Boolean>();
  public contactMemberUpdate = new EventEmitter<ContactMemberUpdate>();
  public roomChangestatus = new EventEmitter<RoomChangeStatus>();
  public messageDelete = new EventEmitter<DeleteMessage>();
  public messageUpdateBody = new EventEmitter<ChatMessage>();
  public updateBalance = new EventEmitter<Updatebalance>();
  public conversationDelete = new EventEmitter<any>();
  public updateContact = new EventEmitter<any>();
  public isConnected: boolean = false;

  public token: string;
  private connection: any;
  private proxy: any;
  public ermisUrl: string;
  public ermisConnectionID: string;

  constructor(
    private cookieService: CookieService
  ) {
    this.ermisUrl = environment.ermisUrl;
    this.initializeSignalRConnection();
  }

  /** initialize signalr connection */
  public initializeSignalRConnection(): void {
    this.token = this.cookieService.get('LunonaToken');
    const signalRUrl = `${this.ermisUrl}`;
    const connectionData = this.getConnectionData();
    this.connection = $.hubConnection(signalRUrl);
    this.connection.qs = connectionData;
    this.proxy = this.connection.createHubProxy('chathub');
    this.proxy.client = {};
    const that = this;
    this.proxy.server = {
      executeGetMeCommandsHistory: function (msgData) {
        return that.proxy.invoke.apply(that.proxy, $.merge(["ExecuteGetMeCommandsHistory"], $.makeArray(arguments)));
      },

      sendChatMessage: function (sFullStringMessage) {
        return that.proxy.invoke.apply(that.proxy, $.merge(["SendChatMessage"], $.makeArray(arguments)));
      },

      sendJSONMessageToConnectionID: function (ConnectionID, message) {
        return that.proxy.invoke.apply(that.proxy, $.merge(["SendJSONMessageToConnectionID"], $.makeArray(arguments)));
      },

      sendMessageToConnectionID: function (ConnectionID, message) {
        return that.proxy.invoke.apply(that.proxy, $.merge(["SendMessageToConnectionID"], $.makeArray(arguments)));
      },

      sendMessageToMonitors: function (message) {
        return that.proxy.invoke.apply(that.proxy, $.merge(["SendMessageToMonitors"], $.makeArray(arguments)));
      },

      sendMessageToProfileIDs: function (ProfileIDs, message) {
        return that.proxy.invoke.apply(that.proxy, $.merge(["SendMessageToProfileIDs"], $.makeArray(arguments)));
      },

      sendMessageToSupporters: function (message) {
        return that.proxy.invoke.apply(that.proxy, $.merge(["SendMessageToSupporters"], $.makeArray(arguments)));
      }
    }
    this.openProxy();
    this.connection.start().done((data: any) => {
      this.ermisConnectionID = data.id;
      this.connectionEstablished.emit(true);
      this.isConnected = true;
      this.getContactList(this.ermisConnectionID);
    }).catch((error: any) => {
      console.log('Notification Hub error ->' + error);
      setTimeout(() => {
        this.initializeSignalRConnection();
      }, 5000);
    });
  }

  /** get hub connection data */
  public getConnectionData(): any {
    const data = {
      ApplicationName: "Lobby",
      ConnectionType: 2,
      Token: `${this.token}`,
      ClientUniqueID: Guid.create().toString(),
      IsReConnecting: false,
    }
    const sendingData = {
      "LMSG": JSON.stringify(data)
    }
    return sendingData;
  }

  /** open proxy */
  public openProxy(): void {
    this.proxy.on('addChatMessage', (message) => {
      const oBaseReplay = JSON.parse(message);
      if (oBaseReplay) {
        if (oBaseReplay.Data) {
          oBaseReplay.Data = JSON.parse(oBaseReplay.Data);
          this.handleReceivedMessage(oBaseReplay);
        } else {
          console.log("SIGNALR: proxy.sendMessage", "oBase.Data is Null");
        }
      } else {
        console.log("SIGNALR: proxy.sendMessage", "oBase is Null");
      }
    });
  }

  /** handle Recieved Message */
  public handleReceivedMessage(objMessage): void {
    if (!(objMessage && objMessage.Command && objMessage.Data)) {
      let sError = "Received Unknown Type Message";
      if (objMessage && objMessage.tag) {
        sError += "- Tag = " + objMessage.tag;
      }
      if (objMessage && objMessage.data) {
        sError += " - Data= " + objMessage.data;
      }
      console.log("SIGNALR: handleRecieveMessage", sError);
      return;
    }
    switch (objMessage.Command) {
      case "NEWCONTACT":
        this.contactList.emit(objMessage.Data);
        break;
      case "CONTACTMODEUPDATE":
        this.contactMemberUpdate.emit(objMessage.Data);
        break;
      case "MSG":
        this.newMessage.emit(objMessage.Data);
        break;
      case "ROOMCHANGESTATUS":
        this.roomChangestatus.emit(objMessage.Data);
        break;
      case "MSGDELETE":
        this.messageDelete.emit(objMessage.Data);
        break;
      case "MSG_UPDATE_BODY":
        this.messageUpdateBody.emit(objMessage.Data);
        break;
      case "UPDBALLANCE":
        this.updateBalance.emit(objMessage.Data);
        break;
      case "DELCONVCOMPLETE":
        this.conversationDelete.emit(objMessage.Data);
        break;
      case "UPDATECONTACT":
        this.updateContact.emit(objMessage.Data);
        break;
    }
  }

  /** send read me message request */
  public sendReadMeMessage(token: string, profileId: number, room: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      Room: room,
      ToProfileID: profileId
    }
    const sendingData = {
      "Command": "READMESSAGES",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device": "",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** send chat message to one member */
  public sendMessageTo(token: string, message: string, myName: string, member: ContactMember | MemberItem): boolean {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MessageID: 0, 
      DateTimeToCreate: new Date().toJSON(),
      Room: member.Room,
      LoginNameFROM: myName,
      LoginNameTO: member.LoginName,
      Direction: 0,
      TPPP: "",
      StatusID: 0,
      MessageTypeID: 1,
      ReadyMessageID: 0,
      BodyOriginal: message,
      ContactType: "",
      IsTranlate: false,
      BodyTranlated: "",
      TranlatedLAGISO: "",
      TranslationTypeID: 0,
      TranslatedHumanID: 0,
      Translation: "",
      FontSizeID: 0,
      FontAttrID: 0,
      ElementID: "",
    }
    const sendingData = {
      "Command": "MSG",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device": "",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
    return true;
  }

  /** send wink to one member */
  public sendWink(token: string, member: MemberItem, myName: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MessageID: 0, 
      DateTimeToCreate: new Date().toJSON(),
      Room: "",
      LoginNameFROM: myName,
      LoginNameTO: member.LoginName,
      Direction: 0,
      TPPP: "",
      StatusID: 0,
      MessageTypeID: 2,
      ReadyMessageID: 0,
      BodyOriginal: "[PROFILE.MY.WINK]",
      ContactType: "",
      IsTranlate: false,
      BodyTranlated: "",
      TranlatedLAGISO: "",
      TranslationTypeID: 0,
      TranslatedHumanID: 0,
      Translation: "",
      FontSizeID: 0,
      FontAttrID: 0,
      ElementID: null,
      TypeID: 101,
    }
    const sendingData = {
      "Command": "MSG",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device": "",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** send photo to one member */
  public sendPhoto(token: string, photoName: string, myName: string, member: ContactMember | MemberItem): void {
    console.log("here is the send Photo", member)
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MessageID: 0, 
      DateTimeToCreate: new Date().toJSON(),
      Room: member.Room,
      LoginNameFROM: myName,
      LoginNameTO: member.LoginName,
      Direction: 0,
      TPPP: "",
      StatusID: 0,
      MessageTypeID: 3,
      ReadyMessageID: 0,
      BodyOriginal: `[MEDIA.CHATIMAGE.${photoName}]`,
      ContactType: "",
      IsTranlate: false,
      BodyTranlated: "",
      TranlatedLAGISO: "",
      TranslationTypeID: 0,
      TranslatedHumanID: 0,
      Translation: "",
      FontSizeID: 0,
      FontAttrID: 0,
      ElementID: "",
    }
    const sendingData = {
      "Command": "MSG",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device": "",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** send sticker to one member */
  public sendSticker(token: string, myName: string, member: ContactMember | MemberItem, sticker: StickerResource): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MessageID: 0, 
      DateTimeToCreate: new Date().toJSON(),
      Room: member.Room,
      LoginNameFROM: myName,
      LoginNameTO: member.LoginName,
      Direction: 0,
      TPPP: "",
      StatusID: 0,
      MessageTypeID: 4,
      ReadyMessageID: 0,
      BodyOriginal: `[MEDIA.STICKER.${sticker.ID}]`,
      ContactType: "",
      IsTranlate: false,
      BodyTranlated: "",
      TranlatedLAGISO: "",
      TranslationTypeID: 0,
      TranslatedHumanID: 0,
      Translation: "",
      FontSizeID: 0,
      FontAttrID: 0,
      ElementID: "",
    }
    const sendingData = {
      "Command": "MSG",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device": "",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** send video to one member */
  public sendVideo(token: string, videoName: string, myName: string, member: ContactMember | MemberItem): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MessageID: 0, 
      DateTimeToCreate: new Date().toJSON(),
      Room: member.Room,
      LoginNameFROM: myName,
      LoginNameTO: member.LoginName,
      Direction: 0,
      TPPP: "",
      StatusID: 0,
      MessageTypeID: 6,
      ReadyMessageID: 0,
      BodyOriginal: `[MEDIA.CHATVIDEO.${videoName}]`,
      ContactType: "",
      IsTranlate: false,
      BodyTranlated: "",
      TranlatedLAGISO: "",
      TranslationTypeID: 0,
      TranslatedHumanID: 0,
      Translation: "",
      FontSizeID: 0,
      FontAttrID: 0,
      ElementID: null,
    }

    const sendingData = {
      "Command": "MSG",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device": "",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** unblock selected member */
  public unblockMember(token: string, memberName: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const sendingData = {
      "Command": "UNBLOCKCONT",
      "Token": `${token}`,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": `{"ToProfileLoginName": "${memberName}"}`,
      "Device": "",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** get data from signalR */
  public getContactList(ermisConnectionId: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const sendingData = {
      "Command": "SEND_ME_MY_CONTACTS",
      "Token": `${this.token}`,
      "BeepID": "0",
      "CreatorUID": `${guidRef}`,
      "Data": `{"ErmisConnectionID":"${ermisConnectionId}","FilterMask":"","Limit":"0"}`,
      "Type": "BASE",
      "Device": "",
      "ErmisConnection": `${ermisConnectionId}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** get chat message info with token, room */
  public sendActRoom(token: string, room: string): void {
    console.log("here signalR getMyMessage")
    const guidRef = "LO-" + Guid.create().toString();
    const sendingData = {
      "Command": "ACTROOM",
      "Token": `${token}`,
      "BeepID": "0",
      "CreatorUID": `${guidRef}`,
      "Data": `{"Room":"${room}", "Device":""}`,
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** delete message from message list */
  public deleteMessageFromList(token: string, messageId: number, room: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MessageID: messageId,
      Room: room
    }
    const sendingData = {
      "Command": "DELETEMYMESSAGE",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** delete contact member */
  public deleteContactMember(myName: string, token: string, memberName: string, room: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      FromProfileLoginName: myName,
      ToProfileLoginName: memberName,
      Room: room
    }
    const sendingData = {
      "Command": "DELETECONTACT",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": `${guidRef}`,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** send chat message */
  public sendChatMessage(sFullStringMessage: string) {
    if (this.isConnected) {
      this.proxy.server.sendChatMessage(sFullStringMessage).done((result) => {
      });
    }
  }

  /** accept photo request */
  public acceptPhoto(token: string, messageId: number, answer: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MessageID: messageId,
      Answer: answer
    }
    const sendingData = {
      "Command": "CHAT_MEDIA_ANSWER",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": guidRef,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }
  
  /** update translate settings */
  public updateTranslateSetting(token: string, member: ContactMember, userName: string, mineLan: string, memberLan: string, freeText: boolean, preTranslate: boolean, freeTextOption: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      EUP_ProfileID_TO: member.ProfileID,
      Room: member.Room,
      LoginNameTO: member.LoginName,
      TranslateFreeText: freeText,
      TranslateFreeTextFromID: 10,
      TranslateFreeTextFromMessagesTO: freeTextOption=='auto' ? false : true,
      TranslateFreeTextFromNotifyTO: freeTextOption=='auto' ? false : true,
      TranslateReadyMessages: preTranslate,
      TranslateLagISOMY: mineLan,
      TranslateLagISOTO: memberLan,
    }
    const sendingData = {
      "Command":"TRANSLATE_ROOM_SETTINGS",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": guidRef,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** delete conversatio history */
  public deleteConversation(token: string, member: ContactMember): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      Room: member.Room,
      TellToOther: false,
    }
    const sendingData = {
      "Command": "DELCONV",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": guidRef,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** set media access */
  public setMediaAccess(token: string, member: ContactMember, mediaAccess: MediaAccess): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      MediaAccessRequestID: mediaAccess.MediaAccessRequestID,
      ProfileID_TO: member.ProfileID,
      PublicAccess: mediaAccess.PublicAccess,
      PrivateAccess: mediaAccess.PrivateAccess,
      SpicyAccess: mediaAccess.SpicyAccess,
      ChillyAccess: mediaAccess.ChillyAccess,
      InformTOForAccessUpdate: mediaAccess.InformTOForAccessUpdate,
      InformTOByLunaOrYou: mediaAccess.InformTOByLunaOrYou
    }
    const sendingData = {
      "Command": "SET_MEDIA_ACCESS",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": guidRef,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** block user */
  public blockUser(token: string, member: ContactMember, blockType: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      ToProfileLoginName: member.LoginName,
      BlockTypeID: blockType
    }
    const sendingData = {
      "Command": "BLOCKCONT",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": guidRef,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }

  /** contact request answer */
  public contactRequestAnswer(member: ContactMember, token: string): void {
    const guidRef = "LO-" + Guid.create().toString();
    const data = {
      ToProfileLoginName: member.LoginName,
      ToProfileID: member.ProfileID,
      Room: member.Room,
      Answer: "ACCEPT"
    }
    const sendingData = {
      "Command": "CONTACTREQUESTANSWER",
      "Token": token,
      "BeepID": 1,
      "CreatorUID": guidRef,
      "Data": JSON.stringify(data),
      "Device":"",
      "ErmisConnection": `${this.ermisConnectionID}`
    }
    this.sendChatMessage(JSON.stringify(sendingData));
  }
}
