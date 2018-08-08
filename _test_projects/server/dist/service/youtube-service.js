"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as Storage from "@google-cloud/storage";
// import * as PubSub from "@google-cloud/pubsub";
// const config = require('../utils/config');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
// import * as shell from 'shelljs';
class YoutubeService {
    // private bucket_prefix: string = config.google.bucket_prefix;
    // private gcstore = new Storage(config.google.credentials);
    // private pubsub = new PubSub(config.google.credentials);
    authorize(requestData, token) {
        var credentials = {
            client_id: '1061452289412-38kf1e8vsm0gtdqncjocq98cbnflar5i.apps.googleusercontent.com',
            client_secret: "3LK-wHUrP6ajT0xCMw2Iwszr",
            redirect_url: "http://localhost:3000/auth/google/callback",
        };
        var clientSecret = credentials.client_secret;
        var clientId = credentials.client_id;
        var redirectUrl = credentials.redirect_url;
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        // Check if we have previously stored a token.
        // fs.readFile(TOKEN_PATH, function(err: any, token: any) {
        //     if (!token) {
        //         return this.getNewToken(oauth2Client, requestData);
        //     } else {
        oauth2Client.credentials = (token);
        return {
            oauth2Client: oauth2Client,
            requestData: requestData
        };
        // }
        // });
    }
    /**
     * Remove parameters that do not have values.
     *
     * @param {Object} params A list of key-value pairs representing request
     *                        parameters and their values.
     * @return {Object} The params object minus parameters with no values set.
     */
    removeEmptyParameters(params) {
        for (let p in params) {
            if (!params[p] || params[p] == 'undefined') {
                delete params[p];
            }
        }
        return params;
    }
    activitiesList(auth, requestData) {
        var service = google.youtube('v3');
        var parameters = this.removeEmptyParameters(requestData['params']);
        parameters['auth'] = auth;
        service.activities.list(parameters, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            console.log(response);
        });
    }
}
exports.YoutubeService = YoutubeService;
exports.default = new YoutubeService();
