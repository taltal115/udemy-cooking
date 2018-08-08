import { SendMailOptions } from "nodemailer";


export interface IMailOptions extends SendMailOptions {
	template?: string;
	context?: any;
}