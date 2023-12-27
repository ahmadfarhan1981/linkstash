import type { Static } from '@feathersjs/typebox';
export declare const configurationSchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    authentication: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        secret: import("@sinclair/typebox").TString<string>;
        entity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNull]>>;
        entityId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        service: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        authStrategies: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        parseStrategies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
        jwtOptions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{}>>;
        jwt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            header: import("@sinclair/typebox").TString<string>;
            schemes: import("@sinclair/typebox").TString<string>;
        }>>;
        local: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            usernameField: import("@sinclair/typebox").TString<string>;
            passwordField: import("@sinclair/typebox").TString<string>;
            hashSize: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            errorMessage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            entityUsernameField: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            entityPasswordField: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
        oauth: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            redirect: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            origins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
            defaults: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                key: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
                secret: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            }>>;
        }>>;
    }>>;
    paginate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        default: import("@sinclair/typebox").TNumber;
        max: import("@sinclair/typebox").TNumber;
    }>>;
    origins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    mongodb: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    mysql: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        client: import("@sinclair/typebox").TString<string>;
        connection: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
            host: import("@sinclair/typebox").TString<string>;
            port: import("@sinclair/typebox").TNumber;
            user: import("@sinclair/typebox").TString<string>;
            password: import("@sinclair/typebox").TString<string>;
            database: import("@sinclair/typebox").TString<string>;
        }>>]>;
        pool: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            min: import("@sinclair/typebox").TNumber;
            max: import("@sinclair/typebox").TNumber;
        }>>;
    }>>;
    postgresql: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        client: import("@sinclair/typebox").TString<string>;
        connection: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
            host: import("@sinclair/typebox").TString<string>;
            port: import("@sinclair/typebox").TNumber;
            user: import("@sinclair/typebox").TString<string>;
            password: import("@sinclair/typebox").TString<string>;
            database: import("@sinclair/typebox").TString<string>;
        }>>]>;
        pool: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            min: import("@sinclair/typebox").TNumber;
            max: import("@sinclair/typebox").TNumber;
        }>>;
    }>>;
    sqlite: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        client: import("@sinclair/typebox").TString<string>;
        connection: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
            host: import("@sinclair/typebox").TString<string>;
            port: import("@sinclair/typebox").TNumber;
            user: import("@sinclair/typebox").TString<string>;
            password: import("@sinclair/typebox").TString<string>;
            database: import("@sinclair/typebox").TString<string>;
        }>>]>;
        pool: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            min: import("@sinclair/typebox").TNumber;
            max: import("@sinclair/typebox").TNumber;
        }>>;
    }>>;
    mssql: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        client: import("@sinclair/typebox").TString<string>;
        connection: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
            host: import("@sinclair/typebox").TString<string>;
            port: import("@sinclair/typebox").TNumber;
            user: import("@sinclair/typebox").TString<string>;
            password: import("@sinclair/typebox").TString<string>;
            database: import("@sinclair/typebox").TString<string>;
        }>>]>;
        pool: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            min: import("@sinclair/typebox").TNumber;
            max: import("@sinclair/typebox").TNumber;
        }>>;
    }>>;
}>, import("@sinclair/typebox").TObject<{
    host: import("@sinclair/typebox").TString<string>;
    port: import("@sinclair/typebox").TNumber;
    public: import("@sinclair/typebox").TString<string>;
}>]>;
export type ApplicationConfiguration = Static<typeof configurationSchema>;
export declare const configurationValidator: import("@feathersjs/schema").Validator<any, any>;
