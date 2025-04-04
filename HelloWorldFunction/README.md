# Azure Function - Hello World

This is a simple HTTP-triggered Azure Function that returns "Hello, World!" when accessed.

## Function Code

```javascript
app.http('HelloWorld', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        context.res = {
            status: 200,
            body: "Hello, World!"
        };

        return context.res;
    }
});
```

## Local Testing

1. Install dependencies:
   ```
   npm install
   ```

2. Run the function locally:
   ```
   func start
   ```

3. Test the function at http://localhost:7071/api/HelloWorld

## Manual Deployment Steps

To deploy this function to Azure, follow these steps:

1. Sign in to the [Azure Portal](https://portal.azure.com)

2. Create a new Function App:
   - Click on "Create a resource"
   - Search for "Function App" and select it
   - Click "Create"
   - Fill in the details:
     - **Subscription**: Select your subscription
     - **Resource Group**: Create new or select existing (note this for later)
     - **Function App name**: Choose a globally unique name (note this for later)
     - **Publish**: Code
     - **Runtime stack**: Node.js
     - **Version**: 18 LTS
     - **Region**: Choose a region close to your users
     - **Operating System**: Windows
     - **Plan type**: Consumption (Serverless)
   - Click "Review + create" and then "Create"
   - Wait for deployment to complete

3. Deploy your function code:
   - In the Azure Portal, navigate to your newly created Function App
   - Click on "Deployment Center" in the left menu
   - Select "External Git" or "Local Git" for manual deployment
   - Follow the instructions to push your code to the Git repository
   
   Alternatively, use Azure Functions Core Tools:
   ```
   func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
   ```

4. Test your deployed function:
   - In the Azure Portal, navigate to your Function App
   - Click on "Functions" in the left menu
   - Click on the "HelloWorld" function
   - Click on "Get Function URL" and copy the URL
   - Access the URL in a browser or through tools like curl or Postman

5. Notes:
   - Function App Name: [Fill in after deployment]
   - Resource Group: [Fill in after deployment]
   - Function URL: [Fill in after deployment] 