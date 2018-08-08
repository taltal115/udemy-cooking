import { Schema, Document, Model, model } from "mongoose";
import { IUserPreference } from './interfaces';

export interface IUserPreferenceModel extends IUserPreference, Document { }


export const UserPreferenceSchema = new Schema({
    userId: {
        type: String, unique: true, required: true, index: true
    }
}, {
        //_id: false,
        strict: false,
        collection: 'user-preferences'
    });

export const UserPreference: Model<IUserPreferenceModel> = model<IUserPreferenceModel>("UserPreference", UserPreferenceSchema);