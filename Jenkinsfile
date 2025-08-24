pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps{
                git branch: 'main', url: 'https://github.com/dibyasagar16/portfolio-site.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Static site - no build needed'
            }
        }

        stage('Deploy to Apache') {
            steps {
                sh '''
                set -e
                echo "Deploying to Apache web directory"
                sudo rm -rf /var/www/html/*
                sudo cp -r * /var/www/html/
                sudo systemctl restart apache2
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful.'
        }
        failure {
            echo '❌ Deployment Failed.'
        }
    }
}