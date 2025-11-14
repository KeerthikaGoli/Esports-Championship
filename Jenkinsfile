pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/KeerthikaGoli/Esports-Championship.git', branch: 'main'
            }
        }

        stage('Build') {
            steps {
                echo "Building the Esports Championship project..."
                bat 'echo Build step running'
            }
        }

        stage('Test') {
            steps {
                echo "Running tests for Esports Championship..."
                bat 'echo Test step running'
            }
        }
    }

    post {
        always {
            echo "Pipeline finished"
        }
    }
}
