export interface ContactMemberUpdate {
    ContactID: number;
    IsOnLine: number;
    LastOnLineDateTime: string;
    Notification: boolean;
    Room: string;
    ToProfileLoginName: string;
}