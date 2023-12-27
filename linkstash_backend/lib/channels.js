"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channels = void 0;
require("@feathersjs/transport-commons");
const logger_1 = require("./logger");
const channels = (app) => {
    logger_1.logger.warn('Publishing all events to all authenticated users. See `channels.ts` and https://dove.feathersjs.com/api/channels.html for more information.');
    app.on('connection', (connection) => {
        // On a new real-time connection, add it to the anonymous channel
        app.channel('anonymous').join(connection);
    });
    app.on('login', (authResult, { connection }) => {
        // connection can be undefined if there is no
        // real-time connection, e.g. when logging in via REST
        if (connection) {
            // The connection is no longer anonymous, remove it
            app.channel('anonymous').leave(connection);
            // Add it to the authenticated user channel
            app.channel('authenticated').join(connection);
        }
    });
    // eslint-disable-next-line no-unused-vars
    app.publish((data, context) => {
        // Here you can add event publishers to channels set up in `channels.js`
        // To publish only for a specific event use `app.publish(eventname, () => {})`
        // e.g. to publish all service events to all authenticated users use
        return app.channel('authenticated');
    });
};
exports.channels = channels;
//# sourceMappingURL=channels.js.map