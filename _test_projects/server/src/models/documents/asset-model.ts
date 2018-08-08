import { Document, Schema, PaginateModel, model } from "mongoose";
import mongoosePaginate = require('mongoose-paginate');
import { IAsset } from "./interfaces";
// const config = require('../../utils/config');

export interface IAssetModel<T extends Document> extends PaginateModel<T> { }

export const AssetsSchema: Schema = new Schema({
  name: {
    type: String,
    es_indexed: true
  },
  orgId: {
    type: String,
    es_indexed: true
  },
  categories: {
    type: [String],
    es_indexed: true
  },
  genres: {
    type: [String],
    es_indexed: true
  },
  tags: {
    type: [String],
    es_indexed: true
  },
  fileUuid: {
    type: String
  }
},
  {
    timestamps: true,
    strict: false
  });

AssetsSchema.plugin(mongoosePaginate);
export const Asset: IAssetModel<IAsset> = model<IAsset>("Asset", AssetsSchema) as IAssetModel<IAsset>;
