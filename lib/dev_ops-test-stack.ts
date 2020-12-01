import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';

export class DevOpsTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //setup bucket
    const bucket = new s3.Bucket(this, 'monsterDevOpstest.com', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });

    //load website into bucket
    const deployment = new s3Deployment.BucketDeployment(this, 'deploywebsite',{
      sources: [s3Deployment.Source.asset("./website/public")],
      destinationBucket: bucket
    });

    //setup origin access identity for cloudfront
    const originAccess = new cloudfront.OriginAccessIdentity(this, 'testOAI', {
      comment: 'OAI for cloudfront'
    })
    
    //setup cloudfront
    const cloudfrontDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "MyDistribution",
      {
        comment: "CDN for website",
        defaultRootObject: "index.html",
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: originAccess
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                defaultTtl: cdk.Duration.seconds(0),
                allowedMethods:
                  cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              },
            ],
          },
        ],
      }
    );

    //attach bucket policy to only allow cloudfront origin access identity
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [bucket.bucketArn + "/*"],
      principals: [originAccess.grantPrincipal],
    }));
  }
}
