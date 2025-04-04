pipeline {
    agent any
    
    // Environment variables needed for Azure deployment
    environment {
        AZURE_CLIENT_ID = credentials('AZURE_CLIENT_ID')
        AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
        AZURE_TENANT_ID = credentials('AZURE_TENANT_ID')
        RESOURCE_GROUP = credentials('RESOURCE_GROUP')
        FUNCTION_APP_NAME = credentials('FUNCTION_APP_NAME')
        // Define Azure CLI path based on your system
        AZURE_CLI_PATH = "C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2"
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
                        
                        // Use PowerShell to create a zip package manually excluding node_modules and tests
                        powershell """
                            \$files = Get-ChildItem -Recurse -File | Where-Object { \$_.FullName -notmatch '(node_modules|tests)' }
                            \$zipFile = '../function.zip'
                            if (Test-Path \$zipFile) { Remove-Item \$zipFile }
                            \$files | Compress-Archive -DestinationPath \$zipFile
                        """
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
                    
                    // Add Azure CLI to PATH for this session
                    bat 'SET PATH=%PATH%;%AZURE_CLI_PATH%'
                    
                    // Verify Azure CLI is available
                    bat 'az --version'
                    
                    // Login to Azure using service principal
                    withCredentials([
                        string(credentialsId: 'AZURE_CLIENT_ID', variable: 'CLIENT_ID'),
                        string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'CLIENT_SECRET'),
                        string(credentialsId: 'AZURE_TENANT_ID', variable: 'TENANT_ID')
                    ]) {
                        bat """
                            az login --service-principal -u %CLIENT_ID% -p %CLIENT_SECRET% --tenant %TENANT_ID%
                        """
                    }
                    
                    // Deploy using the zip deployment method
                    withCredentials([
                        string(credentialsId: 'RESOURCE_GROUP', variable: 'RG'),
                        string(credentialsId: 'FUNCTION_APP_NAME', variable: 'APP_NAME')
                    ]) {
                        bat """
                            az functionapp deployment source config-zip --resource-group %RG% --name %APP_NAME% --src function.zip
                        """
                    }
                    
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
