#!/bin/bash

# EC2 Setup Script
# Run this script on a fresh Ubuntu EC2 instance

set -e

echo "=========================================="
echo "GroceryMart EC2 Setup Script"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install prerequisites
echo "Installing prerequisites..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    unzip

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Jenkins
echo "Installing Jenkins..."
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Install kubectl
echo "Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /opt/grocery-mart
sudo chown ubuntu:ubuntu /opt/grocery-mart

# Clone repository (if not already cloned)
if [ ! -d "/opt/grocery-mart/.git" ]; then
    echo "Please clone your repository to /opt/grocery-mart"
    echo "Example: git clone <your-repo-url> /opt/grocery-mart"
fi

# Setup auto-deploy service
echo "Setting up auto-deploy service..."
sudo cp /opt/grocery-mart/scripts/auto-deploy.sh /opt/grocery-mart/scripts/auto-deploy.sh
sudo chmod +x /opt/grocery-mart/scripts/auto-deploy.sh

sudo tee /etc/systemd/system/grocery-mart-auto-deploy.service > /dev/null << 'EOF'
[Unit]
Description=GroceryMart Auto-Deploy Service
After=network.target docker.service

[Service]
Type=oneshot
ExecStart=/opt/grocery-mart/scripts/auto-deploy.sh
User=ubuntu
Environment="DOCKER_HUB_USERNAME=your-username"
Environment="DOCKER_HUB_PASSWORD=your-password"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable grocery-mart-auto-deploy.service

# Get Jenkins initial password
echo "=========================================="
echo "Setup completed!"
echo "=========================================="
echo "Jenkins initial admin password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
echo ""
echo "Access Jenkins at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
echo "=========================================="

