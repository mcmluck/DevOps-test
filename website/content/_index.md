---
title: "Monster DevOps Technical Test"
description: "Static Site on AWS"
---
The solution here is a static site hosted on S3 which is behind Cloudfront. If needed Route53 can be setup to redirect to the cloudfront URL. All infrastructure is setup using AWS CDK and stored in [github](). This solution was selected because of the following reasons:

Security
======
In this solution, all the content is stored in S3. The S3 has a bucket policy to not allow it to be accessed directly through the S3 link and can only be accessed through Cloudfront URLs. Cloudfront is used to allow for HTTPS redirection to improve security and ensure no unecrypted traffic is accessing the webpage. Additionally this means that files are not open to the public to ensure security.

Reliability
======
The solution uses a combination of S3 and Cloudfront to provide a highly available solution. It is available across region due to the nature of S3 and Cloudfront being Global services. Cloudfront being a Cloud Delivery network, allows for the content to be distributed globally while being performant.

Cost
======
Being a static site, content is assumed to not be changed regularly and as such data transfer rates would not be high thus making S3 and cloudfront cost effective solutions while providing cross region support. Compared to a web server on an EC2, usage costs is calculated on server usage whereas services such as S3 calculate usage based of data transfer. Additionally, data transferred from S3 to cloudfront is not charged minimising cost.

Maintability
======
All infrastructure is easily maintained as it is all infrastructure as code. No infrastructure is provisioned through the console and with a CI/CD tool deployment of the CDK stack can be completely automated. Additionally, all changes are tracked in the repository and CDK is able to deploy it reliabily. 
