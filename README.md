# 🚀 Jenkins CI/CD Pipeline to Deploy Azure Functions

## 🎯 Objective

This project sets up a full CI/CD pipeline using **Jenkins**, **GitHub**, and **Azure Functions**. The goal is to build, test, and deploy a simple "Hello, World!" Azure Function triggered via GitHub push events and automated through Jenkins.

---

## 🔧 Prerequisites

- Azure Account + CLI
- GitHub Repository
- Jenkins installed locally (`http://localhost:8080`)
- Ngrok for GitHub webhook tunneling
- Node.js and npm
- Azure Function Tools and Core Tools (v4+)

---

## 🧪 Azure Function Code (Node.js)

**File**: `HelloWorldFunction/index.js`

```javascript
module.exports = async function (context, req) {
    context.res = {
        status: 200,
        body: "Hello, World!"
    };
};
🧪 Test Cases (Jest)
File: tests/hello.test.js

javascript
Copy
Edit
const request = require('supertest');
const app = require('../HelloWorldFunction');

describe('Hello World Function', () => {
    test('returns status 200', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });

    test('returns Hello, World!', async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe("Hello, World!");
    });

    test('should handle undefined routes gracefully', async () => {
        const res = await request(app).get('/not-found');
        expect([404, 200]).toContain(res.statusCode); // Depending on routing setup
    });
});
🔨 Jenkinsfile (CI/CD Pipeline)
groovy
Copy
Edit
pipeline {
    agent any
    environment {
        AZURE_CLIENT_ID = credentials('azure-client-id')
        AZURE_CLIENT_SECRET = credentials('azure-client-secret')
        AZURE_TENANT_ID = credentials('azure-tenant-id')
        RESOURCE_GROUP = 'your-resource-group'
        FUNCTION_APP_NAME = 'your-function-app-name'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying to Azure Function...'
                sh """
                zip -r function.zip *
                az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                az functionapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $FUNCTION_APP_NAME --src function.zip
                """
            }
        }
    }
}
🌐 GitHub Webhook Setup with Ngrok
Start Jenkins: http://localhost:8080

Start Ngrok:
ngrok http 8080
Copy forwarding HTTPS URL, e.g., https://abc123.ngrok.io

GitHub → Repo → Settings → Webhooks → Add:

bash
Copy
Edit
Payload URL: https://abc123.ngrok.io/github-webhook/
Content-Type: application/json
Event Trigger: Just the push event
✅ Testing the Pipeline
Push any changes to the GitHub repo

Jenkins webhook triggers:

✅ Build

✅ Test (3 automated Jest tests)

✅ Deploy to Azure

Visit deployed function URL to verify

📝 Notes
Jenkins is running locally on port 8080

Ngrok is used to tunnel Jenkins for webhook access

Azure CLI is used for login & deployment

Secrets are managed via Jenkins credentials store
