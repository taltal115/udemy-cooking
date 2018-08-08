import { IUserAttributes } from "../";
export interface ISession {
	user?: IUserAttributes,
	token?: String,
	expires?: Date
}