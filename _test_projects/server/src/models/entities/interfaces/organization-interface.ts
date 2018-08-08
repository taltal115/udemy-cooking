import { Instance } from 'sequelize';

export interface IOrganizationAttributes {
    id: string;
    name: string;
    url: string;
}

export interface IOrganizationRequest extends IOrganizationAttributes {
    mailActivation: any;
    customer_id: any;
    admin_email: string;

}

export interface IOrganizationInstance extends Instance<IOrganizationAttributes> {
    id: string;
    name: string;
    url: string;
}