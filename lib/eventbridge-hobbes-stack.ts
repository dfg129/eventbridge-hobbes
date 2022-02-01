import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import { Rule } from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';

export class EventbridgeHobbesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bus = new events.EventBus(this, 'hobbes-eventbus', {
      eventBusName: 'HobbesEventBus'
    });

    const myFunctionHandler = new lambda.Function(this, 'MyFunction', {
     code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
     runtime: lambda.Runtime.NODEJS_12_X,
     handler: 'index.handler',
    });

    const storageRule = new Rule(this, 'store-rule', {
      description: "Send to DB lambda",
      enabled: true,
      ruleName: "StorageRule",
      eventBus: bus,
    });

    storageRule.addTarget(new targets.LambdaFunction(myFunctionHandler));

    storageRule.addEventPattern({
      account: ['707338571369'],
      source: ['aws.s3'],
    });

  }
}
