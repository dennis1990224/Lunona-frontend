import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Options, LabelType } from 'ng5-slider';
import { CookieService } from 'ngx-cookie-service';
import { BankService } from '@app/service/bank.service';
import { ListItem } from '@app/model/list_item';
import { CountryInfo } from '@app/model/country_info';
import { AuthService } from '@app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AutoMessageModalComponent } from '@app/modal-component/auto-message-modal/auto-message-modal.component';
import { DataShareService } from '@app/service/data-share.service';
import { AutoMessage } from '@app/model/auto_message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-first-message',
  templateUrl: './add-first-message.component.html',
  styleUrls: ['./add-first-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddFirstMessageComponent implements OnInit {

  public savedAutoMessage: AutoMessage
  public autoMessageRuleType: ListItem[];
  public autoMessageExecutionTypes: ListItem[];
  public selectedRuleType: number = 1;
  public selectedExecutionType: number = 1;
  public token: string;
  public message: string = "";
  public socialMinValue: number = 22;
  public socialMaxValue: number = 35;
  public filterCountries: CountryInfo[];
  public allCityPrediction: any[];
  public country: string[] = [];
  public allCountriesName: CountryInfo[];
  public selectedCountry: string = "";
  public countryISO: string = "";
  public countryArray = new Array<string>(1);

  public city: string;
  public allCities: string[] = [];
  public selectedCity: string;
  public selectedCountryCity: string = "Country";

  public distance: number = 1;

  public options: Options = {
    floor: 18,
    ceil: 42,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value.toString();
        case LabelType.High:
          return value.toString();
        default:
          return "";
      }
    }
  }

  constructor(
    private cookieService: CookieService,
    private bankService: BankService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dataShareService: DataShareService,
    private router: Router
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.getAutoMessageRuleType();
    this.getAutomaticMessagesExecutionType();
    this.getCountries();
    this.savedAutoMessage = this.dataShareService.getAutoMessage();
    if (this.savedAutoMessage !== null && this.savedAutoMessage !== undefined) {
      this.setEditData();
    }
    console.log(this.savedAutoMessage);
  }

  ngOnInit(): void {
  }

  /** set edit data */
  public setEditData(): void {
    this.selectedRuleType = this.savedAutoMessage.RuleTypeComboID;
    this.socialMinValue = this.savedAutoMessage.FromAGE;
    this.socialMaxValue = this.savedAutoMessage.ToAGE;
    this.selectedExecutionType = this.savedAutoMessage.ExecutionTypeComboID;
    this.message = this.savedAutoMessage.BodyHTML;
    const countryArray: string[] = this.savedAutoMessage.CountriesText.split(",");
    this.countryArray = new Array<string>(countryArray.length);
    this.country = countryArray;
  }

  /** get auto messages */
  public getAutoMessageRuleType(): void {
    this.bankService.getAutoMessageRuleType(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.autoMessageRuleType = res.Data["Item"];
        }
      });
  }

  /** get automatic messages execution type */
  public getAutomaticMessagesExecutionType(): void {
    this.bankService.getAutomaticMessagesExecutionType(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.autoMessageExecutionTypes = res.Data["Item"];
          console.log(this.autoMessageExecutionTypes)
        }
      });
  }

  public getCountries(): void {
    this.authService.getCountries()
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.allCountriesName = res.Data;
        }
      });
  }

  /** get countryISO with countryName */
  public getCountryISO(): string {
    for (const item of this.country) {
      const found: CountryInfo = this.allCountriesName.find(element => element.CountryName == item);
      if (found) {
        this.countryISO = this.countryISO.concat(`${found.CountryISO},`);
      }
    }
    this.countryISO = this.countryISO.substring(0, this.countryISO.length - 1);
    return this.countryISO;
  }

  /** get country info with country name */
  public getCountryInfo(): string {
    for (const item of this.country) {
      const found: CountryInfo = this.allCountriesName.find(element => element.CountryName == item);
      console.log(found)
      if (found) {
        this.selectedCountry = this.selectedCountry.concat(`${found.CountryName},`);
      }
    }
    this.selectedCountry = this.selectedCountry.substring(0, this.selectedCountry.length - 1);
    return this.selectedCountry;
  }

  /** filter with index */
  public doFilter(index: number): void {
    this.filterCountries = this.allCountriesName.filter(item => {
      if (item.CountryName.toLowerCase().includes(this.country[index].toLowerCase())) {
        return item;
      }
    });
  }

  /** add country array button click */
  public addCountry(): void {
    const length = this.countryArray.length;
    if (this.country[length - 1] || length === 1) {
      this.countryArray = new Array(length + 1);
      this.filterCountries = [];
    }
  }

  /** delete country button click */
  public deleteCountry(): void {
    const length = this.countryArray.length;
    if (length > 1) {
      this.countryArray = new Array(length - 1);
      this.filterCountries = [];
      if (this.country[length - 1]) {
        this.country.pop();
      }
    }
  }

  /** open auto message modal */
  public openAutoMessageModal(): void {
    const dialogRef = this.dialog.open(AutoMessageModalComponent, {
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success === "OK") {
        this.message = result.data["TranslatedValue"];
      }
    })
  }

  /** delete message */
  public deleteMessage(): void {
    this.message = "";
  }

  /** filter cities when keyboard input */
  public dofilterCity(): void {
    this.allCities = [];
    if (this.city.length > 0) {
      this.bankService.getCountryCity(this.token, this.city)
        .subscribe((res) => {
          if (res.status === "OK") {
            this.allCityPrediction = res.predictions;
            for (const item of res.predictions) {
              this.allCities.push(item.description);
            }
          }
        })
    }
  }

  /** increase distance */
  public increaseDistance(): void {
    this.distance = this.distance + 1;
  }

  /** decrease distance */
  public decreaseDistance(): void {
    if (this.distance > 1) {
      this.distance = this.distance - 1;
    }
  }

  /** city select auto complete event */
  public onSelectionChange(event): void {
    const citiesArray: string[] = this.city.split(",");
    this.city = citiesArray[0];
    this.selectedCity = this.city;
    this.selectedCountryCity = citiesArray[citiesArray.length-1];
    console.log(this.selectedCountryCity)
  }

  /** save auto message */
  public saveAutoMessage(): void {
    let messageItem: any;
    let sendingData: any;
    if (this.savedAutoMessage) {
      messageItem = {
        BodyHTML: this.message,
        City: this.city,
        CountriesText: this.getCountryInfo(),
        CountryISO: this.getCountryISO(),
        ExecutionTypeComboID: this.selectedExecutionType,
        FromAGE: this.socialMinValue,
        KilometersFromMe: this.distance,
        MessageID: this.savedAutoMessage.MessageID,
        ReadyMessageID: -1,
        RuleTypeComboID: this.selectedRuleType,
        ToAGE: this.socialMaxValue
      }
      sendingData = {
        Command: "UPDATE",
        Token: this.token,
        clearReceivers: false,
        messageItem: messageItem
      }
    } else {
      messageItem = {
        BodyHTML: this.message,
        City: this.city,
        CountriesText: this.getCountryInfo(),
        CountryISO: this.getCountryISO(),
        ExecutionTypeComboID: this.selectedExecutionType,
        FromAGE: this.socialMinValue,
        KilometersFromMe: this.distance,
        MessageID: 0,
        ReadyMessageID: -1,
        RuleTypeComboID: this.selectedRuleType,
        ToAGE: this.socialMaxValue
      }
      sendingData = {
        Command: "ADD",
        Token: this.token,
        clearReceivers: false,
        messageItem: messageItem
      }
    }
    this.bankService.setMyAutoMessage(sendingData)
      .subscribe((res) => {
        console.log(res);
        if (res.SetMyAutomaticMessageResult["ErrorMessage"] === "OK") {
          const result: boolean = this.dataShareService.setAutoMessage(null);
          if (result) {
            this.router.navigateByUrl("/member/bank/auto-msg/dashboard");
          }
        }
      })
  }
}
