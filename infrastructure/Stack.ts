import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as donenv  from 'dotenv';

donenv.config();

export class NestjsLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const server = new NodejsFunction(this, 'nodejs-aws-cart-api', {
            functionName: 'nodejs-aws-cart-api',
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: path.join(__dirname, '../src/main.lambda.ts'),
            handler: 'handler',
            timeout: cdk.Duration.seconds(30),
            memorySize: 128,
            environment: {
                // APP_PORT: '4000',
                DB_HOST: process.env.DB_HOST || '',
                DB_PORT: process.env.DB_PORT || '',
                DB_NAME: process.env.DB_NAME|| '',
                DB_USERNAME: process.env.DB_USERNAME || '',
                DB_PASSWORD: process.env.DB_PASSWORD || '',
                // JWT_SECRET: process.env.JWT_SECRET,
            },
            bundling: {
                minify: true,
                sourceMap: true,
                externalModules: [
                    // 'pg-native'
                    '@nestjs/microservices',
                    '@nestjs/websockets',
                    'aws-sdk',
                    'class-transformer',
                    'class-validator',
                ],
                nodeModules: [
                    '@nestjs/core',
                    '@nestjs/common',
                    '@nestjs/platform-express',
                    'reflect-metadata',
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
