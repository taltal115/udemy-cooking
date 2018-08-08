import { Schema, Document, Model, model } from "mongoose";
import { IOrganizationPreference } from './interfaces';

export interface IOrganizationPreferenceModel extends IOrganizationPreference, Document { }


export const OrganizationPreferenceSchema = new Schema({
    organizationId: {
        type: String, unique: true, required: true, index: true
    }
}, {
        //_id: false,
        strict: false,
        collection: 'organization-preferences'
    });

export const OrganizationPreference: Model<IOrganizationPreferenceModel> = model<IOrganizationPreferenceModel>("OrganizationPreference", OrganizationPreferenceSchema);