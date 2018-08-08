import { Instance } from 'sequelize';
import { IOrganizationInstance } from '.';

export interface IUserAttributes {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
    password: string;
    //username: string;
    email: string;
    emailConfirmed: boolean;
    isEmailBroken: boolean;
    phone: string;
    phoneConfirmed: boolean;
    securityStamp: string;
    loginFailedCount: number;
    isLocked: boolean;
    lockExpire: Date;
    orgID: string;
}

export interface IUserRequest extends IUserAttributes {
    mailActivation: any;
}

export interface IUserInstance extends Instance<IUserAttributes> {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
    password: string;
    //username: string;
    email: string;
    emailConfirmed: boolean;
    isEmailBroken: boolean;
    phone: string;
    phoneConfirmed: boolean;
    securityStamp: string;
    loginFailedCount: number;
    isLocked: boolean;
    lockExpire: Date;
    organizations: [IOrganizationInstance]
    orgID: string;
}