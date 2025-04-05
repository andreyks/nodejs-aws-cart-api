import * as cdk from 'aws-cdk-lib';

import {NestjsLambdaStack} from './Stack';

const app = new cdk.App({});

new NestjsLambdaStack(app, 'cart-api', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
  },
});
