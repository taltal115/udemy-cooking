"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documents_1 = require("../models/documents");
const _1 = require("../models/general/");
var deferred = require('deferred');
class HomeService extends _1.Auth {
    userInit(model) {
        const defer = deferred();
        documents_1.UserPreference.findOneAndUpdate(
        // { userId: "5aa7-f1f3-4e17-4e36-89bc-7435" },//@TODO: remove hardcoded id!
        { userId: this.auth.user_id }, model, { upsert: true }, function (err, doc) {
            if (err) {
                defer.reject(err);
            }
            defer.resolve({
                success: true
            });
        });
        return defer.promise;
    }
    tree() {
        return {
            data: {
                text: "Ext JS",
                qtip: "left tree grid tooltip for I like chocolate",
                uuid: 1,
                expanded: true,
                children: [
                    {
                        text: "Archives",
                        uuid: 2,
                        isDeleted: true,
                        children: [
                            {
                                uuid: 3, leaf: false, expanded: false, text: "111Application.js", children: [
                                    {
                                        uuid: 4, leaf: false, expanded: false, text: "222Application.js", children: [
                                            {
                                                uuid: 5, leaf: false, expanded: false, text: "333Application.js", children: [
                                                    { uuid: 6, leaf: false, expanded: false, text: "444Application.js" }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Movies 2017",
                        expanded: true,
                        uuid: 7,
                        children: [
                            { uuid: 8, leaf: false, expanded: false, text: "Action" },
                            { uuid: 9, leaf: false, expanded: false, text: "Comedy" },
                            { uuid: 10, leaf: false, expanded: false, text: "Drama" }
                        ]
                    },
                    {
                        text: "Commercial",
                        uuid: 11,
                        children: [
                            { uuid: 12, leaf: false, expanded: false, text: "ButtonGroup.js" },
                            { uuid: 13, leaf: false, expanded: false, text: "Container.js" },
                            { uuid: 14, leaf: false, expanded: false, text: "Viewport.js" }
                        ]
                    },
                    {
                        text: "Music",
                        uuid: 15,
                        children: [
                            {
                                text: "dom",
                                uuid: 16,
                                children: [
                                    { uuid: 17, leaf: false, expanded: false, text: "Element.form.js" },
                                    { uuid: "12fgfsdg3", leaf: false, expanded: false, text: "Element.static-more.js" }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
    }
}
exports.HomeService = HomeService;
