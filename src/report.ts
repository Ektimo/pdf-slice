import { DateTime } from 'luxon';
import logger from "./logger";
import {Config} from "./config";
import * as nodemailer from 'nodemailer';
import Bottleneck from "bottleneck"

export module Report {

    // throttle for 10 seconds between sending emails (don't completely flood the inbox in case of any accidental loops)
    const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 5000
    });

    const config: Config = require('./../config.json');

    export async function sendMail(to: string, subject: string, textContent: string, attachmentFilename: string, attachmentPath: string) {
        const smtpConfig = {
            host: config.smtpServer,
            port: 587,
            // set to false and used tls configuration below, just using true somehow doesn't work:
            // https://github.com/dialogflow/dialogflow-nodejs-client-v2/issues/89
            secure: false,
            auth: {
                user: config.smtpUsername,
                pass: config.smtpPassword
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false // https://stackoverflow.com/questions/14262986/node-js-hostname-ip-doesnt-match-certificates-altnames
            }
        };

        let transporter = nodemailer.createTransport(smtpConfig);

        // setup email data with unicode symbols
        let mailOptions = {
            from: `"toggl-redmine sync" <${config.smtpSender}>`,
            to: to, // comma separated list of receivers
            subject: subject,
            // html: htmlContent, // html body
            text: textContent,
            attachments: [{
                filename: attachmentFilename,
                path: attachmentPath,
                contentType: 'application/pdf'
            }]
        };

        return limiter.schedule(() => {
                logger.info(`Sending email '${mailOptions.subject}' to ${mailOptions.to} with attachment ${attachmentPath}`);
                return transporter.sendMail(mailOptions);
            })
            .then(info => logger.info(`Message sent: ${info.messageId}`))
            .catch(error => logger.error(`Failed to send mail to ${to}, message: ${error}`));
    }
}