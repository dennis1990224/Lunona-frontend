import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactMember } from '@app/model/contact_member';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '@app/service/chat.service';
import { environment } from '@env/environment';
import { ConversationService } from '@app/service/conversation.service';
import { DateData } from '@app/model/date_data';
import { ListItem } from '@app/model/list_item';

@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.component.html',
  styleUrls: ['./date-modal.component.scss']
})
export class DateModalComponent implements OnInit {

  public isMyDate: boolean = false;
  public serverUrl: string = environment.serverUrl;
  public token: string;
  public avatar: string;
  public dateDay: Date;
  public datesData: DateData[] = [];
  public datesLists: ListItem[] = [];
  public dateRate: number = 1;
  public notes: string = "";
  public isEdit: boolean = false;
  public dateID: number;

  constructor(
    public dialogRef: MatDialogRef<DateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMember,
    private cookieService: CookieService,
    private chatService: ChatService,
    private conService: ConversationService,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.avatar = this.cookieService.get("Avatar");
  }

  ngOnInit(): void {
    this.getMyDates();
    this.getlistAllItems();
    this.dateDay = new Date();
  }

  /** go to my date modal */
  public goToMyDate(): void {
    this.isMyDate = true;
  }

  /** go to original modal */
  public goToDateContain(): void {
    this.isMyDate = false;
  }

  /** get my dates */
  public getMyDates(): void {
    this.conService.getMyDates(this.token, this.data.ProfileID)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.datesData = res.Data;
          if (this.datesData.length > 0) {
            for (const item of this.datesData) {
              item.action = false;
            }
          }
        }
      });
  }

  /** get my lists all items */
  public getlistAllItems(): void {
    this.conService.getDateListItems(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.datesLists = res.Data["Item"];
          console.log(this.datesLists)
        }
      })
  }

  /** delete action show */
  public deleteActionShow(item: DateData): void {
    this.datesData = this.datesData.map((value) => {
      value.action = value.DateID === item.DateID;
      return value;
    })
  }

  /** delete date cancel */
  public deleteDateCancel(item: DateData): void {
    this.datesData = this.datesData.map((value) => {
      if (value.DateID === item.DateID) {
        value.action = false;
      }
      return value;
    })
  }

  /** delete date from list */
  public deleteDate(item: DateData): void {
    this.conService.deleteMyDate(item.DateID, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.datesData = this.datesData.filter(obj => obj.DateID !== item.DateID);
        }
      })
  }

  /** save date */
  public saveAndEditDate(): void {
    if (this.isEdit) {
      const data = {
        DateID: this.dateID,
        DateOn: `/Date(${this.dateDay.getTime()}${this.dateDay.toTimeString().substring(12, 17)})/`,
        Notes: this.notes,
        ToProfileID: this.data.ProfileID,
        Token: this.token,
        VoteID: this.dateRate
      }
      const newDate = {
        newDate: data
      }
      this.conService.editMyDate(newDate)
        .subscribe((res) => {
          if (res.EditMyDateResult["ErrorMessage"] === "OK") {
            this.isEdit = false;
            this.getMyDates();
            this.goToDateContain();
          }
        })
    } else {
      const data = {
        DateOn: `/Date(${this.dateDay.getTime()}${this.dateDay.toTimeString().substring(12, 17)})/`,
        Notes: this.notes,
        ToProfileID: this.data.ProfileID,
        Token: this.token,
        VoteID: this.dateRate
      }
      const newDate = {
        newDate: data
      }
      this.conService.addNewDate(newDate)
        .subscribe((res) => {
          if (res.AddNewDateResult["ErrorMessage"] === "OK") {
            this.isEdit = false;
            this.getMyDates();
            this.goToDateContain();
          }
        });
    }
  }

  /** edit item by tap */
  public editDate(item: DateData): void {
    this.isEdit = true;
    this.dateID = item.DateID;
    this.dateDay = new Date(parseInt(item.DateOn.substring(6,19)));
    this.dateRate = item.VoteID;
    this.notes = item.Notes;
    this.goToMyDate();
  }

}
