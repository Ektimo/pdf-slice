export interface Slice {
    keyword: string;
    pdfPwd: string | undefined;
    email: string | undefined;
}

export interface Config {
    adminNotificationsEmail: string;
    emailDomain: string;
    emailSubject: string;
    emailContent: string;
    smtpServer: string;
    smtpPassword: string;
    smtpUsername: string;
    smtpSender: string; // e.g. '"Name Surname" <name.surname@example.com>'
    slices: Slice[];
}