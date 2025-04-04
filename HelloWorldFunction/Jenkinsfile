pipeline {
    agent any
    
    tools {
        nodejs 'nodejs' // Use the NodeJS installation configured in Jenkins
    }
    
    stages {
        stage('Build') {
            steps {
                echo 'Building Azure Function...'
                dir('HelloWorldFunction') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                dir('HelloWorldFunction') {
                    sh 'npm test'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying to Azure...'
                dir('HelloWorldFunction') {
                    withCredentials([string(credentialsId: 'AZURE_CREDENTIALS', variable: 'AZURE_CREDS')]) {
                        sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
                        sh 'func azure functionapp publish $FUNCTION_APP_NAME --javascript'
                        sh 'az logout'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
        }
        success {
            echo 'Successfully deployed to Azure'
        }
        failure {
            echo 'Deployment failed'
        }
    }
} 