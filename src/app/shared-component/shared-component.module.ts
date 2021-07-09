import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { StaticFooterComponent } from './static-footer/static-footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { LandingFemaleFooterComponent } from './landing-female-footer/landing-female-footer.component';
import { LanguageService } from '@app/service/language.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthFooterComponent } from './auth-footer/auth-footer.component';
import { MemberHeaderComponent } from './member-header/member-header.component';
import { MemberFooterComponent } from './member-footer/member-footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaleProfileInformationTabComponent } from './male-profile-information-tab/male-profile-information-tab.component';
import { MaleProfilePublicTabComponent } from './male-profile-public-tab/male-profile-public-tab.component';
import { MaleProfilePrivateTabComponent } from './male-profile-private-tab/male-profile-private-tab.component';
import { MaleProfileSplicyTabComponent } from './male-profile-splicy-tab/male-profile-splicy-tab.component';
import { MaleProfileChillyTabComponent } from './male-profile-chilly-tab/male-profile-chilly-tab.component';
import { MaleProfileSavedTabComponent } from './male-profile-saved-tab/male-profile-saved-tab.component';
import { MaleProfilePrivacyTabComponent } from './male-profile-privacy-tab/male-profile-privacy-tab.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaleProfileAboutyouModalComponent } from '@app/modal-component/male-profile-aboutyou-modal/male-profile-aboutyou-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MaleProfileLookingforModalComponent } from '@app/modal-component/male-profile-lookingfor-modal/male-profile-lookingfor-modal.component';
import { MaleProfileWhatYouGotModalComponent } from '@app/modal-component/male-profile-what-you-got-modal/male-profile-what-you-got-modal.component';
import { MaleProfileAccountSettingModalComponent } from '@app/modal-component/male-profile-account-setting-modal/male-profile-account-setting-modal.component';
import { UploadPhotoComponent } from '@app/modal-component/upload-photo/upload-photo.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MembersItemComponent } from './members-item/members-item.component';
import { MatDividerModule } from '@angular/material/divider';
import { MaleProfileViewYourPhotoModalComponent } from '@app/modal-component/male-profile-view-your-photo-modal/male-profile-view-your-photo-modal.component';
import { MaleProfileNotificationModalComponent } from '@app/modal-component/male-profile-notification-modal/male-profile-notification-modal.component';
import { MaleProfileMoreSettingModalComponent } from '@app/modal-component/male-profile-more-setting-modal/male-profile-more-setting-modal.component';
import { MaleProfileRateModalComponent } from '@app/modal-component/male-profile-rate-modal/male-profile-rate-modal.component';
import { ChatMemberItemComponent } from './chat-member-item/chat-member-item.component';
import { ChatNoMemberComponent } from './chat-no-member/chat-no-member.component';
import { ChatProfilePreviewComponent } from './chat-profile-preview/chat-profile-preview.component';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { MatListModule } from '@angular/material/list';
import { SafeHtmlPipe } from '@app/pipe/safehtml.pipe';
import { BlockUserModalComponent } from '@app/modal-component/block-user-modal/block-user-modal.component';
import { TranslateSettingModalComponent } from '@app/modal-component/translate-setting-modal/translate-setting-modal.component';
import { DeleteConversationModalComponent } from '@app/modal-component/delete-conversation-modal/delete-conversation-modal.component';
import { PhotoAccessModalComponent } from '@app/modal-component/photo-access-modal/photo-access-modal.component';
import { DonateLunsModalComponent } from '@app/modal-component/donate-luns-modal/donate-luns-modal.component';
import { DateModalComponent } from '@app/modal-component/date-modal/date-modal.component';
import { DeleteContactModalComponent } from '@app/modal-component/delete-contact-modal/delete-contact-modal.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { SnapshotModalComponent } from '@app/modal-component/snapshot-modal/snapshot-modal.component';
import { SavedMediaModalComponent } from '@app/modal-component/saved-media-modal/saved-media-modal.component';
import { ChatModalComponent } from '@app/modal-component/chat-modal/chat-modal.component';
import { DeleteMessageModalComponent } from '@app/modal-component/delete-message-modal/delete-message-modal.component';
import { DragDropDirective } from '@app/directive/drag-drop.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowseProfileCardComponent } from './browse-profile-card/browse-profile-card.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MemberProfileModalComponent } from '@app/modal-component/member-profile-modal/member-profile-modal.component';
import { PreviewImageModalComponent } from '@app/modal-component/preview-image-modal/preview-image-modal.component';
import { ConfirmWinkModalComponent } from '@app/modal-component/confirm-wink-modal/confirm-wink-modal.component';
import { TransactionModalComponent } from '@app/modal-component/transaction-modal/transaction-modal.component';
import { AutoMessageModalComponent } from '@app/modal-component/auto-message-modal/auto-message-modal.component';
import { SetProfilePromptComponent } from '@app/modal-component/set-profile-prompt/set-profile-prompt.component';
import { SetCoverphotoPromptComponent } from '@app/modal-component/set-coverphoto-prompt/set-coverphoto-prompt.component';
import { DeleteProfilePhotoComponent } from '@app/modal-component/delete-profile-photo/delete-profile-photo.component';
import { ChangePhotoCategoryComponent } from '@app/modal-component/change-photo-category/change-photo-category.component';
import { ChangeProfileCoverModalComponent } from '@app/modal-component/change-profile-cover-modal/change-profile-cover-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MapModalComponent } from '@app/modal-component/map-modal/map-modal.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { SocialStatusModalComponent } from '@app/modal-component/social-status-modal/social-status-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmUnblockModalComponent } from '@app/modal-component/confirm-unblock-modal/confirm-unblock-modal.component';
import { DeleteMyProfileModalComponent } from '@app/modal-component/delete-my-profile-modal/delete-my-profile-modal.component';
import { LogOutModalComponent } from '@app/modal-component/log-out-modal/log-out-modal.component';

@NgModule({
  declarations: [
    LandingHeaderComponent,
    LandingFooterComponent,
    StaticFooterComponent,
    LandingFemaleFooterComponent,
    AuthFooterComponent,
    MemberHeaderComponent,
    MemberFooterComponent,
    MaleProfileInformationTabComponent,
    MaleProfilePublicTabComponent,
    MaleProfilePrivateTabComponent,
    MaleProfileSplicyTabComponent,
    MaleProfileChillyTabComponent,
    MaleProfileSavedTabComponent,
    MaleProfilePrivacyTabComponent,
    MaleProfileAboutyouModalComponent,
    MaleProfileLookingforModalComponent,
    MaleProfileWhatYouGotModalComponent,
    MaleProfileAccountSettingModalComponent,
    MaleProfileViewYourPhotoModalComponent,
    MaleProfileNotificationModalComponent,
    MaleProfileMoreSettingModalComponent,
    MaleProfileRateModalComponent,
    UploadPhotoComponent,
    MembersItemComponent,
    ChatMemberItemComponent,
    ChatNoMemberComponent,
    ChatProfilePreviewComponent,
    ChatMessageListComponent,
    SafeHtmlPipe,
    TranslateSettingModalComponent,
    DeleteConversationModalComponent,
    PhotoAccessModalComponent,
    BlockUserModalComponent,
    DonateLunsModalComponent,
    DateModalComponent,
    DeleteContactModalComponent,
    SnapshotModalComponent,
    SavedMediaModalComponent,
    ChatModalComponent,
    DeleteMessageModalComponent,
    DragDropDirective,
    BrowseProfileCardComponent,
    LoadingSpinnerComponent,
    MemberProfileModalComponent,
    PreviewImageModalComponent,
    ConfirmWinkModalComponent,
    TransactionModalComponent,
    AutoMessageModalComponent,
    SetProfilePromptComponent,
    SetCoverphotoPromptComponent,
    DeleteProfilePhotoComponent,
    ChangePhotoCategoryComponent,
    ChangeProfileCoverModalComponent,
    MapModalComponent,
    SocialStatusModalComponent,
    ConfirmUnblockModalComponent,
    DeleteMyProfileModalComponent,
    LogOutModalComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatToolbarModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatSelectModule,
    MatSliderModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    NgCircleProgressModule.forRoot({}),
    RoundProgressModule,
    ImageCropperModule,
    GoogleMapsModule,
    MatIconModule,
    RouterModule, 
  ],
  exports: [
    LandingHeaderComponent,
    LandingFooterComponent,
    StaticFooterComponent,
    AuthFooterComponent,
    LandingFemaleFooterComponent,
    MemberHeaderComponent,
    MemberFooterComponent,
    MaleProfileInformationTabComponent,
    MaleProfilePublicTabComponent,
    MaleProfilePrivateTabComponent,
    MaleProfileSplicyTabComponent,
    MaleProfileChillyTabComponent,
    MaleProfileSavedTabComponent,
    MaleProfilePrivacyTabComponent,
    MaleProfileAccountSettingModalComponent,
    MaleProfileViewYourPhotoModalComponent,
    MaleProfileNotificationModalComponent,
    MaleProfileMoreSettingModalComponent,
    UploadPhotoComponent,
    MembersItemComponent,
    MaleProfileRateModalComponent,
    ChatMemberItemComponent,
    ChatNoMemberComponent,
    ChatProfilePreviewComponent,
    ChatMessageListComponent,
    TranslateSettingModalComponent,
    DeleteConversationModalComponent,
    PhotoAccessModalComponent,
    BlockUserModalComponent,
    DonateLunsModalComponent,
    DateModalComponent,
    DeleteContactModalComponent,
    SnapshotModalComponent,
    SavedMediaModalComponent,
    ChatModalComponent,
    DeleteMessageModalComponent,
    BrowseProfileCardComponent,
    LoadingSpinnerComponent,
    MemberProfileModalComponent,
    PreviewImageModalComponent,
    ConfirmWinkModalComponent,
    TransactionModalComponent,
    AutoMessageModalComponent,
    SetProfilePromptComponent,
    SetCoverphotoPromptComponent,
    DeleteProfilePhotoComponent,
    ChangePhotoCategoryComponent,
    ChangeProfileCoverModalComponent,
    MapModalComponent,
    SocialStatusModalComponent,
    ConfirmUnblockModalComponent,
    DeleteMyProfileModalComponent,
    LogOutModalComponent,
    SafeHtmlPipe
  ],
  providers: [
    LanguageService,
    CookieService,
    SafeHtmlPipe
  ]
})
export class SharedComponentModule { }
