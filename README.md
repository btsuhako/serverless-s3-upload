This project is a brief proof of concept for using the [Serverless](https://serverless.com) [open-source framework](https://github.com/serverless/serverless) to generate signed URLs for secure uploads to an Amazon S3 bucket.

1.  Deploy the Serverless project.

    a.  Configure the `service` project namespace in the `serverless.yml` file for your individual needs.

    b.  Run the following command to download project dependencies:

      > `npm install`

    c.  Within the project folder, run the following command to deploy the service. Make note of the POST endpoint in the console output.

      > `sls deploy`

2.  Deploy the HTML frontend.

    a.  Use the AWS CLI to create your website. Be sure to substitute `YOUR_STACK_NAME` and `YOUR_BUCKET_NAME` in the command below. Note that S3 bucket names must be globally unique.
      > `aws cloudformation create-stack --stack-name YOUR_STACK_NAME --template-body file://./cf-website.json --parameters ParameterKey=MyBucketName,ParameterValue=YOUR_BUCKET_NAME`

      It make take 5-10 minutes for the stack creation to complete. Use the following command to find the website address. First ensure that the `StackStatus` is `CREATE_COMPLETE`, then make note of the `WebsiteURL` in the `Outputs` section.
      > `aws cloudformation describe-stacks --stack-name YOUR_STACK_NAME`

    b.  Edit the `html/js/main.js` file, and set the `SIGN_API` variable to the value from the deployment endpoint.

    c.  Copy the HTML files to your website
      > `aws s3 cp html s3://YOUR_BUCKET_NAME --recursive`

    d.  Be your that the website is functioning: open a browser and navigate to the `WebsiteURL` from the output above.

    e.  For production deployment, use the `CloudFrontURL` from the frontend CloudFormation stack creation step. Note that by default, assets are aggressively cached and file changes in the S3 bucket may take time to propagate to CloudFront.
