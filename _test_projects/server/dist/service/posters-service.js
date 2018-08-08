"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documents_1 = require("../models/documents");
const models_1 = require("../models");
const deferred = require('deferred');
class PostersService extends models_1.Auth {
    get(query) {
        const defer = deferred();
        try {
            //var q = {};
            // if (!isNaN(query.id)) {
            //     q = { "parents": query.id };
            // }
            if (!isNaN(query.id)) {
                // TODO: replace with using $lookup
                documents_1.UserPreference.findOne({ userId: this.auth.user_id }, {
                    favorites: 1
                }, (err, data) => {
                    if (err) {
                        defer.resolve('tree');
                    }
                    if (data) {
                        var favorites = data.getValue('favorites');
                        if (favorites.length > 0) {
                            var favorite = favorites.find(item => item.id == query.id);
                            if (favorite) {
                                var ids = favorite.assets;
                                documents_1.Asset.paginate({ _id: { $in: ids } }, {
                                    select: {
                                        "format.format_long_name": 1,
                                        "format.format_name": 1,
                                        "format.filename": 1,
                                        "poster": 1,
                                        "name": 1,
                                        "genres": 1,
                                        "format.duration": 1,
                                        "streams": { $elemMatch: { "codec_type": "video" } }
                                    },
                                    lean: false,
                                    page: query.page,
                                    limit: query.limit
                                }, function (err, result) {
                                    defer.resolve(result);
                                });
                            }
                            else {
                                defer.resolve({});
                            }
                        }
                        else {
                            defer.resolve({});
                        }
                    }
                });
            }
            else {
                documents_1.Asset.paginate({}, {
                    select: {
                        "format.format_long_name": 1,
                        "format.format_name": 1,
                        "format.filename": 1,
                        "poster": 1,
                        "name": 1,
                        "genres": 1,
                        "format.duration": 1,
                        "streams": { $elemMatch: { "codec_type": "video" } }
                    },
                    lean: false,
                    page: query.page,
                    limit: query.limit
                }, function (err, result) {
                    defer.resolve(result);
                });
            }
        }
        catch (e) {
            defer.resolve([]);
        }
        return defer.promise;
    }
}
exports.PostersService = PostersService;
