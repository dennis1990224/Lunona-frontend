import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileInformation } from '@app/model/profile_information';
import { ProfileMyProfileService } from '@app/service/profile-my-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MaleProfileMyInformation } from '@app/model/male-profile-my-information';
import { ListItem } from '@app/model/list_item';

@Component({
  selector: 'app-male-profile-what-you-got-modal',
  templateUrl: './male-profile-what-you-got-modal.component.html',
  styleUrls: ['./male-profile-what-you-got-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaleProfileWhatYouGotModalComponent implements OnInit {

  public token: string;
  public modalName: string;
  public myInformation: MaleProfileMyInformation;

  /** income modal variables */
  public selectedIncome: number;
  public incomes: ListItem[];

  /** house modal variables */
  public selectedHomeProperty: number;
  public selectedHomeSize: number;
  public selectedHomeType : number;
  public homeProperties: ListItem[];
  public homeSizes: ListItem[];
  public homeTypes: ListItem[];
  public isTypeDisable: boolean;
  public isTypeButtonDisable: boolean;

  /** villa modal variables */
  public selectedVillaProperty: number;
  public selectedVillaLocation: number;
  public villaProperties: ListItem[];
  public villaLocations: ListItem[];
  public isVillaDisable: boolean;
  public isVillaButtonDisalbe: boolean;

  /** vehicles modal variables */
  public selectedVehicles: ListItem[] = [];
  public vehicles: ListItem[];

  constructor(
    public dialogRef: MatDialogRef<MaleProfileWhatYouGotModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileInformation,
    private myProfileService: ProfileMyProfileService,
    private cookieService: CookieService,
  ) {
    this.modalName = this.data.name;
    this.token = this.cookieService.get('LunonaToken');
    console.log(this.modalName);
    this.getMyProfileInfo();
  }

  ngOnInit(): void {
  }

  /** get my profile information again on modal */
  public getMyProfileInfo(): void {
    this.myProfileService.getMyProfileInfo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myInformation = res.Data;
          this.checkModalStatus();
        }
      });
  }

  /** check modal status */
  public checkModalStatus(): void {
    switch (this.data.name) {
      case "income":
        this.selectedIncome = this.myInformation.Men_AnnualIncomeID;
        this.getIncomes();
        break;
      case "house":
        this.selectedHomeProperty = this.myInformation.Men_HomePropertyID;
        if (this.selectedHomeProperty === 0) {
          this.isTypeDisable = true;
        }
        this.selectedHomeSize = this.myInformation.Men_HomeSizeID;
        this.selectedHomeType = this.myInformation.Men_HomeTypeID;
        if (this.selectedHomeSize !== 0 && this.selectedHomeType !== 0) {
          this.isTypeButtonDisable = true;
        }
        this.getHouseInfo();
        break;
      case "otherHouse":
        this.selectedVillaProperty = this.myInformation.Men_OthersRealEstatesID;
        this.selectedVillaLocation = this.myInformation.Men_OthersRealEstatesID;
        if (this.selectedVillaProperty === 2) {
          this.isVillaDisable = false;
        } else {
          this.isVillaDisable = true;
        }
        this.getVillaInfo();
        break;
      case "vehicles":
        this.getVehicles();
        break;
    }
  }

  /** get incomes */
  public getIncomes(): void {
    this.myProfileService.getIncomes(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.incomes = res.Data["Item"];
        }
      })
  }

  /** update income */
  public updateIncome(): void {
    this.myProfileService.updateIncome(this.token, this.selectedIncome)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** get house information (property, size, type) */
  public getHouseInfo(): void {
    this.myProfileService.getHouseProperty(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.homeProperties = res.Data["Item"];
        }
      });
    this.myProfileService.getHouseSize(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.homeSizes = res.Data["Item"];
        }
      });
    this.myProfileService.getHouseType(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.homeTypes = res.Data["Item"];
        }
      })
  }

  /** update home data */
  public updateHomeData(): void {
    this.myProfileService.updateHouseProperty(this.token, this.selectedHomeProperty)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
    this.myProfileService.updateHouseSize(this.token, this.selectedHomeSize)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      });
    this.myProfileService.updateHouseType(this.token, this.selectedHomeType)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** when property change */
  public propertyChange(event): void {
    if (event.value === 0) {
      this.isTypeDisable = true;
      this.selectedHomeSize = 0;
      this.selectedHomeType = 0;
      this.isTypeButtonDisable = false;
    } else {
      this.isTypeDisable = false;
      if (this.selectedHomeSize === 0 || this.selectedHomeType === 0) {
        this.isTypeButtonDisable = true;
      }
    }
  }

  /** when size change */
  public sizeChange(event): void {
    if (event.value === 0 || this.selectedHomeType === 0) {
      this.isTypeButtonDisable = true;
    } else {
      this.isTypeButtonDisable = false;
    }
  }

  /** type chage event */
  public typeChange(event): void {
    if (event.value === 0 || this.selectedHomeType === 0) {
      this.isTypeButtonDisable = true;
    } else {
      this.isTypeButtonDisable = false;
    }
  }

  /** get villa information */
  public getVillaInfo(): void {
    this.myProfileService.getVillaProperty(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.villaProperties = res.Data["Item"];
        }
      });
    this.myProfileService.getVillaLocation(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.villaLocations = res.Data["Item"];
        }
      });
  }

  /** villa property change event */
  public viallaPropertyChange(event): void {
    if (event.value === 2) {
      this.isVillaDisable = false;
    } else {
      this.isVillaDisable = true;
    } 
  }

  /** villabel size change event */
  public villabSizeChange(event): void {
    if (event.value === 0) {
      this.isVillaButtonDisalbe = true;
    } else {
      this.isVillaButtonDisalbe = false;
    }
  }

  /** get Vehicles */
  public getVehicles(): void {
    this.myProfileService.getVehiclesInfo(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.vehicles = res.Data["Item"];
          for (let item of this.myInformation.Men_Cars.split(",")) {
            this.selectedVehicles = this.selectedVehicles.concat(this.vehicles.filter(ele => ele.ID === parseInt(item, 10)));
          }
          this.vehicles = this.vehicles.filter((ele) => !this.selectedVehicles.includes(ele)); 
        }
      })
  }

  /** remove vehicles in selected */
  public removeVehicle(removeVeh: ListItem, index: number): void {
    if (this.selectedVehicles.length === 1) {
      return;
    }
    this.selectedVehicles.splice(index, 1);
    this.vehicles = [removeVeh].concat(this.vehicles)
  }

  /** add vehicles to select */
  public addVehicle(addVe: ListItem, index: number): void {
    if (this.vehicles.length === 1) {
      return;
    }
    this.vehicles.splice(index, 1);
    this.selectedVehicles.push(addVe);
  }

  /** update vehicles information */
  public updateVehicle(): void {
    const vehicles: string = this.getVehicleSendingData();
    this.myProfileService.updateVehicle(this.token, vehicles)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dialogRef.close("success");
        }
      })
  }

  /** get vehicle sending value */  
  public getVehicleSendingData(): string {
    let vehicleIds: string = "";
    for (let i = 0; i < this.selectedVehicles.length; i++) {
      if ((i+1) === this.selectedVehicles.length) {
        vehicleIds = vehicleIds.concat(`${this.selectedVehicles[i].ID}`);
      } else {
        vehicleIds = vehicleIds.concat(`${this.selectedVehicles[i].ID},`)
      }
    }
    return vehicleIds;
  }
}
