export interface Tender {
    [key: string]: string | Date;
    tenderId: string;
    tenderNumber: string;
    tenderName: string;
    tenderReleaseDate: Date;
    tenderClosingDate: Date;
    description: string;
    tenderCreator:string;
}
