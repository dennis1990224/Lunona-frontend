export interface AutoMessage {
    //return AutoMessage
    BodyHTML: string;
    City: string;
    CountriesText: string;
    CountryISO: string;
    CreatedDate: string;
    ExecutionTypeComboID: number;
    ExecutionTypeText: string;
    FromAGE: number;
    KilometersFromMe: number;
    MessageID: number;
    ReadyMessageID: number;
    RuleTypeComboID: number;
    RuleTypeText: string;
    ToAGE: number;
    isDelete: boolean;
    isExcute: boolean;
    isOpenExcute: boolean;
}