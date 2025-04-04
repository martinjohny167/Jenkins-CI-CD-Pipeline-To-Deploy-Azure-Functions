pipeline {
    agent any
    
    // Environment variables needed for Azure deployment
    environment {
        AZURE_CLIENT_ID = credentials('AZURE_CLIENT_ID')
        AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
        AZURE_TENANT_ID = credentials('AZURE_TENANT_ID')
        RESOURCE_GROUP = credentials('RESOURCE_GROUP')
        FUNCTION_APP_NAME = credentials('FUNCTION_APP_NAME')
    }
    
    tools {
        nodejs 'nodejs' // Make sure this is configured in Jenkins tools
    }
    
    stages {
        stage('Build') {
            steps {
                script {
                    echo 'Building the application...'
                    dir('HelloWorldFunction') {
                        bat 'npm install'
                        
                        // Create a zip package for deployment
                        bat 'powershell -Command "Compress-Archive -Path . -DestinationPath ../function.zip -Force -Exclude node_modules,tests"'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    echo 'Running tests...'
                    dir('HelloWorldFunction') {
                        // Install dev dependencies if not already included
                        bat 'npm install --also=dev'
                        
                        // Run the test suite
                        bat 'npm test'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying to Azure...'
                    
                    // Login to Azure using service principal
                    bat """
                        az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                    """
                    
                    // Deploy using the zip deployment method
                    bat """
                        az functionapp deployment source config-zip \
                        --resource-group $RESOURCE_GROUP \
                        --name $FUNCTION_APP_NAME \
                        --src function.zip
                    """
                    
                    // Logout from Azure CLI
                    bat """
                        az logout
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}
