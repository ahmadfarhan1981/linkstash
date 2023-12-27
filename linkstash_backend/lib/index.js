"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const logger_1 = require("./logger");
const port = app_1.app.get('port');
const host = app_1.app.get('host');
process.on('unhandledRejection', (reason) => logger_1.logger.error('Unhandled Rejection %O', reason));
app_1.app.listen(port).then(() => {
    logger_1.logger.info(`Feathers app listening on http://${host}:${port}`);
});
//# sourceMappingURL=index.js.map