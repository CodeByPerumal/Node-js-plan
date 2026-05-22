PS C:\Users\PERUMAL V\OneDrive\Desktop\Node\Day 09\02> serverless --version

✔ Installed Serverless Framework v4.36.1

Serverless ϟ Framework 4.36.1

PS C:\Users\PERUMAL V\OneDrive\Desktop\Node\Day 09\02> npm install @aws-sdk/client-dynamodb

added 44 packages, and audited 45 packages in 10s

6 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\PERUMAL V\OneDrive\Desktop\Node\Day 09\02> npm install @aws-sdk/lib-dynamodb

added 2 packages, and audited 47 packages in 4s

6 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\PERUMAL V\OneDrive\Desktop\Node\Day 09\02> npm install uuid

added 1 package, and audited 48 packages in 1s

7 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\PERUMAL V\OneDrive\Desktop\Node\Day 09\02> serverless

Serverless ϟ Framework

Welcome to Serverless Framework V.4

Create a new project by selecting a Template to generate scaffolding for a specific use-case.

? Select A Template: ... 
√ Select A Template: · AWS / Node.js / HTTP API

√ Name Your Project: · DynamoDB-CRUD

✔ Template Downloaded

This Template contains a Serverless Framework Service. Services are stacks of AWS resources, and can contain your entire application or a part of it (e.g. users, comments, checkout, etc.). Enter a name using lowercase letters, numbers and hyphens only.

√ Serverless Framework V4 CLI is free for developers and organizations making less than $2 million annually, but requires an account or a license key.

Please login/register or enter your license key: · Login/Register


If your browser does not open automatically, please open this URL: https://app.serverless.com?client=cli&transactionId=U2YqpQLUJg1VJgsA-8hN6

✔ You have successfully signed in.

While the CLI is free for developers and organizations making less than $2 million annually, Serverless Framework's Dashboard offers additional features such as Observability, State, Secrets & AWS Access sharing, which can incur a cost. To enable these additional features, add your Service to an "App". Apps also group your Services together in the Dashboard, for better organization.

Create or select an existing App below to associate with your Service, or skip.

√ Create Or Select An Existing App: · Create A New App

√ Name Your New App: · payflow2025

Your new Service "DynamoDB-CRUD" is ready. Here are next steps:

• Open Service Directory: cd DynamoDB-CRUD
• Install Dependencies: npm install (or use another package manager)
• Deploy Your Service: serverless deploy