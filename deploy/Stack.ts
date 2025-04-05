import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import * as donenv  from 'dotenv';

donenv.config();

export class NestjsLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const server = new nodejs.NodejsFunction(this, 'nodejs-aws-cart-api', {
            functionName: 'nodejs-aws-cart-api',
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: 'dist/main.lambda.js',
            handler: 'handler',
            timeout: cdk.Duration.seconds(30),
            memorySize: 1024,
            environment: {
                // APP_PORT: '4000',
                DB_HOST: process.env.DB_HOST,
                DB_PORT: process.env.DB_PORT,
                DB_USERNAME: process.env.DB_USERNAME,
                DB_PASSWORD: process.env.DB_PASSWORD,
                DB_DATABASE: process.env.DB_DATABASE,
                // JWT_SECRET: process.env.JWT_SECRET,
            },
            bundling: {
                externalModules: [
                    // 'pg-native'
                    '@nestjs/microservices',
                    '@nestjs/websockets',
                    'aws-sdk',
                    // 'class-transformer',
                    // 'class-validator',
                ],
            },
        });

        const { url } = server.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowedOrigins: ['*'],
                allowedMethods: [
                    lambda.HttpMethod.GET, 
                    lambda.HttpMethod.DELETE,
                    lambda.HttpMethod.PUT,
                ],
                allowedHeaders: ['*'],
            }
        })

        new cdk.CfnOutput(this, 'FunctionUrl', { value: url });
    }
}
