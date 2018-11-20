export interface Employee {
    name: string;
    pdfPwd: string;
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
    employees: Employee[];
}