"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const logger_1 = require("../logger");
const logError = async (context, next) => {
    try {
        await next();
    }
    catch (error) {
        logger_1.logger.error(error.stack);
        // Log validation errors
        if (error.data) {
            logger_1.logger.error('Data: %O', error.data);
        }
        throw error;
    }
};
exports.logError = logError;
//# sourceMappingURL=log-error.js.map