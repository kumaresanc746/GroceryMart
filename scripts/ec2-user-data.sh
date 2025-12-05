#!/bin/bash

# EC2 User Data Script
# This script runs when EC2 instance is first launched

# Update system
apt-get update -y
apt-get upgrade -y

# Install required packages
apt-get install -y curl wget git unzip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/grocery-mart
chown ubuntu:ubuntu /opt/grocery-mart

# Clone repository (update with your repository URL)
cd /opt
git clone https://github.com/your-username/grocery-mart.git || echo "Repository clone failed"
chown -R ubuntu:ubuntu grocery-mart

# Create auto-deploy service
cat > /etc/systemd/system/grocery-mart-auto-deploy.service << 'EOF'
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

# Make auto-deploy script executable
chmod +x /opt/grocery-mart/scripts/auto-deploy.sh

# Enable auto-deploy service
systemctl daemon-reload
systemctl enable grocery-mart-auto-deploy.service

# Run initial deployment
su - ubuntu -c "cd /opt/grocery-mart && /opt/grocery-mart/scripts/auto-deploy.sh"

# Log completion
echo "EC2 User Data script completed at $(date)" >> /var/log/user-data.log

