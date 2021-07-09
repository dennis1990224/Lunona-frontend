import { ProfileTopContact } from './profile-top-contact';

export interface ProfileDashboardData {
    //return Occupation
    Contacts: number;
    MeViewThem : number;
    PinsReceived: number;
    PinsSent: number;
    Profile_CompletePersent: number;
    Profile_Info: boolean;
    Profile_Money : boolean;
    Profile_Photos: boolean;
    Rate: number;
    ThemViewMe: number;
    Top15Contacts: ProfileTopContact[];
    TopExtraContacts: ProfileTopContact[];
    WinksNotReplied: number;
    WinksPercent: number;
    WinksReplied: number;
    WinksSent: number;
}