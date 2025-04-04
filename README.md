# Jenkins CI/CD Pipeline for Azure Functions

This repository contains a CI/CD pipeline implementation using Jenkins to automatically build, test, and deploy an Azure Function application. The pipeline is triggered by GitHub webhooks and manages the entire deployment process.

## Project Overview

This project demonstrates a complete CI/CD workflow with the following components:
- Simple "Hello World" Azure Function
- GitHub repository integration with Jenkins via webhooks
- Automated testing with at least 3 test cases
- Deployment to Azure Functions

## Prerequisites

- Azure Account with access to Azure Functions
- GitHub Account
- Jenkins Server installation
- Azure CLI configured on Jenkins server
- Node.js/npm (or other package manager based on your function language)
- ngrok for webhook setup (for local Jenkins instances)

## Architecture

The pipeline follows this workflow:
1. Code changes pushed to GitHub repository
2. GitHub webhook triggers Jenkins pipeline
3. Jenkins executes pipeline stages (Build → Test → Deploy)
4. Azure Function is deployed to production environment

## Azure Function

The repository includes a simple HTTP-triggered Azure Function that returns "Hello, World!" when invoked. The function is implemented in JavaScript and follows Azure Functions best practices.

## Jenkins Pipeline

The Jenkins pipeline is defined in the `Jenkinsfile` at the root of the repository. It consists of three main stages:

### Build Stage
- Installs dependencies 
- Prepares the application for testing and deployment

### Test Stage
- Runs automated tests to ensure functionality
- Validates HTTP response, status codes, and edge cases
- Requires all tests to pass before proceeding to deployment

### Deploy Stage
- Uses Azure CLI to authenticate and deploy to Azure Functions
- Creates or updates the function app
- Verifies successful deployment

## Webhook Configuration

This project uses GitHub webhooks to automatically trigger the Jenkins pipeline whenever changes are pushed to the repository. ngrok is used to expose the local Jenkins server to the internet.

## Test Cases

The test suite includes the following test cases:
1. Basic HTTP response validation ("Hello, World!" message)
2. HTTP status code verification (200 OK)
3. Edge case handling

## Setup Instructions

### 1. Azure Function Setup
```bash
# Create Function App in Azure
az functionapp create --name <your-function-app-name> --resource-group <your-resource-group> --consumption-plan-location <location> --runtime <runtime> --storage-account <storage-account>

# Deploy function manually first time (optional)
func azure functionapp publish <your-function-app-name>
```

### 2. Jenkins Configuration
```bash
# Install necessary Jenkins plugins
- GitHub Integration
- Azure CLI
- Pipeline

# Configure GitHub webhook
- Use ngrok to create public URL: ngrok http 8080
- Add webhook in GitHub repo settings pointing to: https://<ngrok-url>/github-webhook/
```

### 3. Jenkins Credentials Setup
```bash
# Add Azure Service Principal credentials to Jenkins
- AZURE_CLIENT_ID
- AZURE_CLIENT_SECRET
- AZURE_TENANT_ID
- RESOURCE_GROUP
- FUNCTION_APP_NAME
```

### 4. Running the Pipeline
The pipeline will automatically trigger when changes are pushed to the repository. Alternatively, you can manually trigger it from the Jenkins dashboard.

## Repository Structure

```
├── host.json                # Azure Functions host configuration
├── local.settings.json      # Local settings for function app
├── package.json             # Node.js dependencies
├── Jenkinsfile              # Jenkins pipeline definition
├── HelloWorld/              # Azure Function code
│   ├── function.json        # Function binding configuration
│   └── index.js             # Function implementation
├── tests/                   # Test suite
│   └── hello.test.js        # Test cases
└── README.md                # This file
```

## Troubleshooting

Common issues and solutions:
- **Jenkins cannot connect to GitHub**: Verify webhook URL and credentials
- **Azure deployment fails**: Check Azure credentials and permissions
- **Tests failing**: Ensure test environment is properly configured

## Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [ngrok Documentation](https://ngrok.com/docs)
