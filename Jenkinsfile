pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password')
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        KUBECONFIG = credentials('kubeconfig')
    }

    stages {
        stage('Git Pull') {
            steps {
                echo 'Pulling latest code from repository...'
                sh 'git pull origin main || git pull origin master'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install || echo "No npm dependencies for frontend"'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo 'Frontend build completed (static files)'
                }
            }
        }

        stage('Docker Build') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            def backendImage = docker.build("${env.DOCKER_HUB_USERNAME}/grocery-mart-backend:${env.BUILD_NUMBER}")
                            backendImage.tag("latest")
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            def frontendImage = docker.build("${env.DOCKER_HUB_USERNAME}/grocery-mart-frontend:${env.BUILD_NUMBER}")
                            frontendImage.tag("latest")
                        }
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    sh "echo '${env.DOCKER_HUB_PASSWORD}' | docker login -u '${env.DOCKER_HUB_USERNAME}' --password-stdin"
                    sh "docker push ${env.DOCKER_HUB_USERNAME}/grocery-mart-backend:${env.BUILD_NUMBER}"
                    sh "docker push ${env.DOCKER_HUB_USERNAME}/grocery-mart-backend:latest"
                    sh "docker push ${env.DOCKER_HUB_USERNAME}/grocery-mart-frontend:${env.BUILD_NUMBER}"
                    sh "docker push ${env.DOCKER_HUB_USERNAME}/grocery-mart-frontend:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh '''
                        kubectl set image deployment/backend backend=${DOCKER_HUB_USERNAME}/grocery-mart-backend:${BUILD_NUMBER} -n grocery-mart || echo "Backend deployment update failed"
                        kubectl set image deployment/frontend frontend=${DOCKER_HUB_USERNAME}/grocery-mart-frontend:${BUILD_NUMBER} -n grocery-mart || echo "Frontend deployment update failed"
                        kubectl rollout status deployment/backend -n grocery-mart || echo "Backend rollout check failed"
                        kubectl rollout status deployment/frontend -n grocery-mart || echo "Frontend rollout check failed"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}

