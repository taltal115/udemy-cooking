import { Instance } from 'sequelize';

export interface IRoleAttributes {
    value: number;
    name: string;
}

export interface IRoleInstance extends Instance<IRoleAttributes> {
    value: number;
    name: string;
}