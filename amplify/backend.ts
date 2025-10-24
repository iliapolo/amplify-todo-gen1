import { RemovalPolicy, Tags } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { defineBackend } from "@aws-amplify/backend";
import ci from "ci-info";
import { Duration } from "aws-cdk-lib";

let AMPLIFY_GEN_1_ENV_NAME = process.env.AMPLIFY_GEN_1_ENV_NAME;
if (ci.isCI && !AMPLIFY_GEN_1_ENV_NAME) {
    throw new Error("AMPLIFY_GEN_1_ENV_NAME is required in CI environment");
}
else if (!ci.isCI && !AMPLIFY_GEN_1_ENV_NAME) {
    AMPLIFY_GEN_1_ENV_NAME = "sandbox";
}

const backend = defineBackend({
    auth,
    data
});
const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.userPoolName = `amplifytodogen1be5ccb9d_userpool_be5ccb9d-${AMPLIFY_GEN_1_ENV_NAME}`;
// cfnUserPool.usernameAttributes = undefined;
cfnUserPool.policies = {
    passwordPolicy: {
        minimumLength: 8,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        requireUppercase: false,
        temporaryPasswordValidityDays: 7
    }
};
const cfnIdentityPool = backend.auth.resources.cfnResources.cfnIdentityPool;
cfnIdentityPool.identityPoolName = `amplifytodogen1be5ccb9d_identitypool_be5ccb9d__${AMPLIFY_GEN_1_ENV_NAME}`;
cfnIdentityPool.allowUnauthenticatedIdentities = false;
const userPool = backend.auth.resources.userPool;
const userPoolClient = userPool.addClient("NativeAppClient", {
    disableOAuth: true,
    authSessionValidity: Duration.minutes(3),
    userPoolClientName: "amplifbe5ccb9d_app_client",
    enablePropagateAdditionalUserContextData: false,
    enableTokenRevocation: true,
    refreshTokenValidity: Duration.days(30),
    generateSecret: false
});
// Tags.of(backend.stack).add("gen1-migrated-app", "true");
