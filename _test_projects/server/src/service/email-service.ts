import { IMailOptions } from "../models";

const nodemailer = require('nodemailer'),
    hbs = require('nodemailer-express-handlebars'),
    path = require('path'),
    deferred = require('deferred'),
    config = require('../utils/config');

// http://excellencenodejsblog.com/express-nodemailer-sending-mails/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'admin@ditve.tv',
        pass: 'Oalon59$'
    }

});

var view_path = path.resolve(__dirname, '../..', 'views');
transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: path.join(view_path, '_shared'),
        partialsDir: path.join(view_path, '_partials'),
        defaultLayout: 'mail-layout'
    },
    viewPath: path.join(view_path, 'mails'),
    extName: '.hbs'
}));

// const email = new Email({
//     views: {
//         options: {
//             extension: 'ejs' // <---- HERE
//         }
//     }
// });

export class EmailService {
    //private _templatesdir: string = path.resolve(__dirname, '../templates');
    public static async send(options: IMailOptions): Promise<any> {
        const defer = deferred();

        let context = options.context;
        context.schema = config.schema;
        context.host = config.host;
        context.url = config.schema + config.host;

        transporter.sendMail({
            from: options.from,
            to: options.to,
            subject: options.subject,
            template: options.template,
            context: context
        }, function (error, envelope) {
            if (error) {
                return defer.reject(error);
            }
            transporter.close();
            return defer.resolve(envelope);
        });

        return defer.promise;
    }
}