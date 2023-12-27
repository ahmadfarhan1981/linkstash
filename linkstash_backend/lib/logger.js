"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
const winston_1 = require("winston");
// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
exports.logger = (0, winston_1.createLogger)({
    // To see more detailed errors, change this to 'debug'
    level: 'info',
    format: winston_1.format.combine(winston_1.format.splat(), winston_1.format.simple()),
    transports: [new winston_1.transports.Console()]
});
//# sourceMappingURL=logger.js.map