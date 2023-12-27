"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidator = exports.dataValidator = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/validators.html
const schema_1 = require("@feathersjs/schema");
const formats = [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
];
exports.dataValidator = (0, schema_1.addFormats)(new schema_1.Ajv({}), formats);
exports.queryValidator = (0, schema_1.addFormats)(new schema_1.Ajv({
    coerceTypes: true
}), formats);
//# sourceMappingURL=validators.js.map