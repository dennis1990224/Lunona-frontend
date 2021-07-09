import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileMyProfileService {

  public apiUrl: string = environment.apiUrl;
  public mainUrl: string = "MainService.svc";
  public uploadUrl: string = "UploadService.svc";
  public geoUrl: string = "GeoService.svc";
  public getMyProfileInfoUrl: string = "GetMyProfileInformationItem";
  public getCountyUrl: string = "GetCountries";
  public GetCitiesAndZipUrl: string = "GetCitiesAndZip";
  public updateProfileLocationUrl: string = "UpdateMyProfileLocation";
  public UpdateMyProfileDateUrl: string = "UpdateMyProfileDate";
  public GetAlllistUrl: string = "GetListAllItems";
  public updateProfileUrl: string = "UpdateMyProfileInformationItem";
  public getNationalitiesUrl: string = "GetNationalities";
  public languageUrl: string = "LanguagesService.svc";
  public siteSupportLanUrl: string = "SiteSupportingLanguages";
  public getResourceUrl: string = "GetResources";
  public getMyPrivacySettingUrl: string = "GetMyPrivacySettings";
  public getMediaAccessUrl: string = "GetMyMediaAccess";
  public setMyPrivacyUrl: string = "SetMyPrivacySettings";
  public setPinUrl: string = "SetPinned";
  public setRateUrl: string = "SetRate";
  public getPhotoUrl: string = "GetMyPhotos";
  public setProfileWithAvatarUrl: string = "SetProfilePhotoWithAvatar";
  public setProfilePhotoUrl: string = "SetProfilePhoto";
  public setCoverPhotoUrl: string = "SetCoverPhoto";
  public changeCategoryUrl: string = "ChangePhotoCategory";
  public deletePhotoUrl: string = "DeletePhoto";
  public getProfilePhotoEditUrl: string = "GetProfilePhotoForEdit";
  public setProfilePhotoCroppingUrl: string = "SetProfilePhotoCropping";
  public getLocationInfoUrl: string = "GetMyProfileLocationInfo";
  public changePassUrl: string = "ChangePassword";
  public logOutUrl: string = "logout";
  public getPublicLikesUrl: string = "GetPublicLikeDefaults";
  public getlocationinfoUrl: string = "getlocationinfo";

  constructor(
    private httpClient: HttpClient
  ) { }

  /** log out */
  public logOut(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.logOutUrl}`, {
        params: new HttpParams()
          .set("token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get public likes in landing page */
  public getPublicLikes(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getPublicLikesUrl}`)
      .pipe(
        map((res: any) => res)
      )
  }

  /** get location information in landing */
  public getLocationLanding(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.geoUrl}/${this.getlocationinfoUrl}`, {
        params: new HttpParams()
          .set("Latitude", "0")
          .set("Longitude", "0")
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get the my profile information */
  public getMyProfileInfo(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getMyProfileInfoUrl}`, {
        params: new HttpParams().set('Token', token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get the countires for the location modal */
  public getCountries(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.geoUrl}/${this.getCountyUrl}`, {
        params: new HttpParams()
          .set('city', '')
          .set('country', '')
          .set('state', '')
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get cities */
  public getCitiesAndZip(key: string, countryISO: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetCitiesAndZipUrl}`, {
        params: new HttpParams()
          .set("CityOrZip", key)
          .set("Country", countryISO)
          .set("StateISO", "")
          .set('Token', token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get occupation lists */
  public getOccupationList(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "BusinessSector")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get all spoken languages */
  public getSpokenLanguage(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "LanguagesSpoken")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get whole nationalities from WS */
  public getNationalities(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getNationalitiesUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get site support languages */
  public getSiteSupportLanguages(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.languageUrl}/${this.siteSupportLanUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get tattoo values */
  public getTattoo(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "Profile_BodyArt")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get smoking values */
  public getSmokings(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "Profile_Smoking")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get relationShip values */
  public getRelationShips(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "RelationshipStatus")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get children info */
  public getChildren(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "Children")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get education info */
  public getEducation(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "Education")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get incomes info */
  public getIncomes(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "AnnualIncome")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get house property */
  public getHouseProperty(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "HomeProperty")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get house size */
  public getHouseSize(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "HomeSize")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get house type */
  public getHouseType(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "HomeType")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get Villa property */
  public getVillaProperty(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "OtherHome")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get villa location */
  public getVillaLocation(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "OtherHomeLocation")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get vehicles infor */
  public getVehiclesInfo(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "OtherCarsType")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get avatar image with category Id and token */
  public getAvatarImage(categoryId: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getResourceUrl}`, {
        params: new HttpParams()
          .set('CategoryID', categoryId.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** profile set with avatar */
  public setProfileWithAvatar(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.uploadUrl}/${this.setProfileWithAvatarUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set profile Photo with avatar */
  public setProfilePhotoWithAvatar(resourceID: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.uploadUrl}/${this.setProfileWithAvatarUrl}`, {
        params: new HttpParams()
          .set("ResourceID", resourceID.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get my privacy settings */
  public getMyPrivacySettings(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getMyPrivacySettingUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** change password */
  public ChangePassword(newPass: string, oldPass: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.changePassUrl}`, {
        params: new HttpParams()
          .set("NewPassword", newPass)
          .set("OldPassword", oldPass)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get media access */
  public getMediaAccess(token: string, category: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getMediaAccessUrl}`, {
        params: new HttpParams()
          .set("Category", category)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get location information */
  public getLocationInfo(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getLocationInfoUrl}`, {
        params: new HttpParams()
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get all travel countries */
  public getAllTravelCountries(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.GetAlllistUrl}`, {
        params: new HttpParams()
          .set("ListTableName", "AbleToTravel")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update profile information location */
  public updateMyProfileLocation(selectedCity: string, selectedCountry: string, latitude: number, logitude: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileLocationUrl}`, {
        params: new HttpParams()
          .set("City", selectedCity)
          .set("Country", selectedCountry)
          .set("Latitude", latitude.toString())
          .set("Longitude", logitude.toString())
          .set("StateISO", "")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update profile information birthday */
  public updateMyProfileBirthday(day: number, month: number, year: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.UpdateMyProfileDateUrl}`, {
        params: new HttpParams()
          .set("Day", day.toString())
          .set("Month", month.toString())
          .set("ProfileDateField", "Birthday")
          .set("Token", token)
          .set("Year", year.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update profile informatioin occupation */
  public updateMyProfileOccupation(value: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_BusinessSectorID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update profile information spoken language */
  public updateSpokenLanguage(token: string, spokenLanguage: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_SpokenLanguages")
          .set("Token", token)
          .set("Value", spokenLanguage)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update profile information nationality */
  public updateMyProfileNationality(nationalityID: number, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_NationalityID")
          .set("Token", token)
          .set("Value", nationalityID.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set profile photo */
  public setProfilePhoto(photoID: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.uploadUrl}/${this.setProfilePhotoUrl}`, {
        params: new HttpParams()
          .set("PhotoID", photoID)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set cover photo */
  public setCoverPhoto(photoID: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.uploadUrl}/${this.setCoverPhotoUrl}`, {
        params: new HttpParams()
          .set("PhotoID", photoID)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** change photo category */
  public changePhotoCategory(photoID: string, newCategory: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.changeCategoryUrl}`, {
        params: new HttpParams()
          .set("EUP_MediaGuid", photoID)
          .set("NewCategory", newCategory)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** delete photo on profile page */
  public deletePhoto(photoID: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.deletePhotoUrl}`, {
        params: new HttpParams()
          .set("EUP_MediaGUID", photoID)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set site language */
  public SetLanguage(languageISO: string, token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.languageUrl}/SetLanguage`, {
        params: new HttpParams()
          .set("NewLanguageISO", languageISO)
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update height */
  public updateHeight(token: string, height: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_HeightCM")
          .set("Token", token)
          .set("Value", height.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update tattoo value */
  public updateTattoo(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_BodyArtID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update smoking value */
  public updateSmoking(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_SmokingID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update relationship value */
  public updateRelationShip(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_RelationshipStatusID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update child value */
  public updateChild(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_ChildrenID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update education value */
  public updateEducation(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "PersonalInfo_EducationID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update looking for value with key */
  public updateLookingForData(key: string, value: boolean, token: string): Observable<any> {
    let sendingValue = "";
    if (value === true) {
      sendingValue = "true";
    } else {
      sendingValue = "false";
    }
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", key)
          .set("Token", token)
          .set("Value", sendingValue)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update income data */
  public updateIncome(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "Men_AnnualIncomeID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update house property */
  public updateHouseProperty(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "Men_HomePropertyID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update house size */
  public updateHouseSize(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "Men_HomeSizeID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update hosue type */
  public updateHouseType(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "Men_HomeTypeID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update vehicle information */
  public updateVehicle(token: string, value: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.updateProfileUrl}`, {
        params: new HttpParams()
          .set("Key", "Men_Cars")
          .set("Token", token)
          .set("Value", value)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update public photo level */
  public updatePublicPhotoLevel(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "PrivacySettings_PublicPhotosLevelID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update chilly photo level */
  public updateChillyPhotoLevel(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "PrivacySettings_ChillyPhotosLevelID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update private photo level */
  public updatePrivatePhotoLevel(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "PrivacySettings_PrivatePhotosLevelID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update spicy photo level */
  public updateSpicyPhotoLevel(token: string, value: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "PrivacySettings_SpicyPhotosLevelID")
          .set("Token", token)
          .set("Value", value.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update privacy receive settings */
  public updatePrivacyRecieveSetting(token: string, value: boolean): Observable<any> {
    let sendingValue: string = "";
    if (value === true) {
      sendingValue = "true";
    } else {
      sendingValue = "false";
    }
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "NotificationsSettings_WhenNewMessageReceived")
          .set("Token", token)
          .set("Value", sendingValue)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update privacy kisses settings */
  public updatePrivacyKissesSetting(token: string, value: boolean): Observable<any> {
    let sendingValue: string = "";
    if (value === true) {
      sendingValue = "true";
    } else {
      sendingValue = "false";
    }
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "NotificationsSettings_WhenWingReceived")
          .set("Token", token)
          .set("Value", sendingValue)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update privacy rate settings */
  public updatePrivacyRateSetting(token: string, value: boolean): Observable<any> {
    let sendingValue: string = "";
    if (value === true) {
      sendingValue = "true";
    } else {
      sendingValue = "false";
    }
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "NotificationsSettings_WhenNewRateReceived")
          .set("Token", token)
          .set("Value", sendingValue)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update privacy nearBy settings */
  public updatePrivacyNearBySetting(token: string, value: boolean): Observable<any> {
    let sendingValue: string = "";
    if (value === true) {
      sendingValue = "true";
    } else {
      sendingValue = "false";
    }
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "NotificationsSettings_WhenNewMembersNearMe")
          .set("Token", token)
          .set("Value", sendingValue)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** udpate more setting other country settings */
  public updateOtherCountrySetting(token: string, value: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "More_AllowOnlyMyCountry")
          .set("Token", token)
          .set("Value", value)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update travel countries settings */
  public updateTravelCountries(token: string, value: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setMyPrivacyUrl}`, {
        params: new HttpParams()
          .set("Key", "More_AbleToTravel")
          .set("Token", token)
          .set("Value", value)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** update pin information */
  public updatePinInfo(token: string, profileId: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setPinUrl}`, {
        params: new HttpParams()
          .set("TOProfileID", profileId.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      );
  }

  /** update rate information by profile id */
  public updateRateByProfileID(token: string, profileID: number, ratingValue: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.setRateUrl}`, {
        params: new HttpParams()
          .set("RateValue", ratingValue.toString())
          .set("TOProfileID", profileID.toString())
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get public photo information */
  public getPublicPhotos(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getPhotoUrl}`, {
        params: new HttpParams()
          .set("Category", "public")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get private photo information */
  public getPrivatePhotos(token: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.mainUrl}/${this.getPhotoUrl}`, {
        params: new HttpParams()
          .set("Category", "private")
          .set("Token", token)
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** get spicy photos information */
  public getSpicyPhotos(token: string): Observable<any> {
    return this.httpClient
    .get(`${this.apiUrl}/${this.mainUrl}/${this.getPhotoUrl}`, {
      params: new HttpParams()
        .set("Category", "spicy")
        .set("Token", token)
    })
    .pipe(
      map((res: any) => res)
    )
  }

  /** get chilly photo information */
  public getChillyPhotos(token: string): Observable<any> {
    return this.httpClient
    .get(`${this.apiUrl}/${this.mainUrl}/${this.getPhotoUrl}`, {
      params: new HttpParams()
        .set("Category", "chilly")
        .set("Token", token)
    })
    .pipe(
      map((res: any) => res)
    )
  }

  /** get saved photo information */
  public getSavedPhotos(token: string): Observable<any> {
    return this.httpClient
    .get(`${this.apiUrl}/${this.mainUrl}/${this.getPhotoUrl}`, {
      params: new HttpParams()
        .set("Category", "Saved")
        .set("Token", token)
    })
    .pipe(
      map((res: any) => res)
    )
  }

  /** get profile photo edit */
  public getProfilePhotoEdit(photoID: string, token: string, viewPortWidth: number, photoType: string): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.uploadUrl}/${this.getProfilePhotoEditUrl}`, {
        params: new HttpParams()
          .set("PhotoID", photoID)
          .set("PhotoType", photoType)
          .set("Token", token)
          .set("ViewportWidth", viewPortWidth.toString())
      })
      .pipe(
        map((res: any) => res)
      )
  }

  /** set profile photo cropping */
  public setProfilePhotoCropping(cropHeight, cropWidth, cropX, cropY, photoID, token, viewPortwidth, photoType): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/${this.uploadUrl}/${this.setProfilePhotoCroppingUrl}`, {
        params: new HttpParams()
          .set("CropHeight", cropHeight)
          .set("CropWidth", cropWidth)
          .set("CropX", cropX)
          .set("CropY", cropY)
          .set("PhotoID", photoID)
          .set("PhotoType", photoType)
          .set("Token", token)
          .set("ViewportWidth", viewPortwidth)
      })
      .pipe(
        map((res: any) => res)
      )
  }
}
