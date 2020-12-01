#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DevOpsTestStack } from '../lib/dev_ops-test-stack';

const app = new cdk.App();

const env = {
    region: 'ap-southeast-2',
}

new DevOpsTestStack(app, 'DevOpsTestStack',{
    env: env
});
