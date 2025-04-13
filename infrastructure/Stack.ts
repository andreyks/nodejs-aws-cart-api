import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as donenv  from 'dotenv';

donenv.config();

export class NestjsLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const DB_HOST = process.env.DB_HOST || '';
        const DB_PORT = process.env.DB_PORT || '';
        const DB_NAME = process.env.DB_NAME || '';
        const DB_USERNAME = process.env.DB_USERNAME || '';
        const DB_PASSWORD = process.env.DB_PASSWORD || '';
        const VPC_ID = process.env.VPC_ID || '';
        const RDS_SECURITY_GROUP_ID = process.env.RDS_SECURITY_GROUP_ID || '';

        if (
        !(
            DB_HOST &&
            DB_PORT &&
            DB_NAME &&
            DB_USERNAME &&
            DB_PASSWORD &&
            VPC_ID &&
            RDS_SECURITY_GROUP_ID
        )
        ) {
            console.log("Error: Wrong environment variables!")
        }

        // Assuming you have an existing VPC
        // const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });
        const vpc = ec2.Vpc.fromLookup(this, 'VPC', { vpcId: VPC_ID });

        // Create a security group for the Lambda function
        const lambdaSG = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
            vpc,
            allowAllOutbound: true,
            description: 'Security group for Lambda function',
        });
    
        // A security group for the RDS instance
        const dbSG = ec2.SecurityGroup.fromSecurityGroupId(this, 'DatabaseSecurityGroup', RDS_SECURITY_GROUP_ID);

        // Allow the Lambda security group to access the RDS security group
        dbSG.addIngressRule(lambdaSG, ec2.Port.tcp(5432), 'Allow Lambda access');

        const server = new NodejsFunction(this, 'nodejs-aws-cart-api', {
            functionName: 'nodejs-aws-cart-api',
            runtime: lambda.Runtime.NODEJS_22_X,
            entry: path.join(__dirname, '../src/main.lambda.ts'),
            handler: 'handler',
            // depsLockFilePath: path.join(__dirname, '../../package-lock.json'),
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
            allowPublicSubnet: true,
            vpc: vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            securityGroups: [lambdaSG],
        });

        // Grant the Lambda function permissions to access RDS
        server.addToRolePolicy(new iam.PolicyStatement({
            actions: ['rds-db:connect'],
            // resources: ['arn:aws:rds-db:eu-north-1:account-id:dbuser:db-resource-id/database-user'],
            resources: ['arn:aws:rds:eu-north-1:140023362902:db:shop'],
        }));

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


        // // Create VPC
        // const vpc = new ec2.Vpc(this, 'LambdaRDS', {
        //     maxAzs: 2,
        //     natGateways: 0,
        // });
    
        // // Create RDS instance
        // const dbInstance = new rds.DatabaseInstance(this, 'MyRDSInstance', {
        //     engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_17 }),
        //     instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
        //     vpc,
        //     vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        //     databaseName: process.env.DB_NAME || 'shop',
        //     allocatedStorage: 20,
        //     maxAllocatedStorage: 20,
        //     deleteAutomatedBackups: true,
        //     removalPolicy: cdk.RemovalPolicy.DESTROY,
        //     deletionProtection: false,
        //     multiAz: false,
        //     publiclyAccessible: false,
        //     credentials: rds.Credentials.fromPassword(process.env.DB_USERNAME, cdk.SecretValue.plainText('postgres'))
        // });
    
        // // Create EC2 instance
        // const ec2Instance = new ec2.Instance(this, 'MyEC2Instance', {
        //     vpc,
        //     vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        //     instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
        //     machineImage: ec2.MachineImage.latestAmazonLinux2023(),
        // });
    
        // // Allow EC2 instance to connect to RDS
        // dbInstance.connections.allowFrom(ec2Instance, ec2.Port.tcp(5432));
    
        // // Install psql client on EC2 instance
        // ec2Instance.addUserData(
        //     'sudo dnf install postgresql15'
        // );
    
        // // Create Lambda function
        // const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
        //     runtime: lambda.Runtime.NODEJS_22_X,
        //     handler: 'index.handler',
        //     code: lambda.Code.fromAsset('lambda'),
        //     vpc,
        //     vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        // });
    
        // // Allow Lambda to connect to RDS
        // dbInstance.grantConnect(lambdaFunction);
    
        // // Output connection information
        // new cdk.CfnOutput(this, 'RDS Endpoint', { value: dbInstance.dbInstanceEndpointAddress });
        // new cdk.CfnOutput(this, 'EC2 Public IP', { value: ec2Instance.instancePublicIp });
    }
}
