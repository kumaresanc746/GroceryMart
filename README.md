# 🛒 GroceryMart - Full-Stack E-Commerce Platform

A complete, production-ready grocery e-commerce application with modern DevOps practices including Docker, Kubernetes, Jenkins CI/CD, Terraform infrastructure, Ansible automation, and Prometheus/Grafana monitoring.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker Compose](#quick-start-with-docker-compose)
- [Ubuntu EC2 Setup Guide](#ubuntu-ec2-setup-guide)
- [Docker Deployment](#docker-deployment)
- [Jenkins CI/CD Setup](#jenkins-cicd-setup)
- [Terraform Infrastructure](#terraform-infrastructure)
- [Ansible Configuration](#ansible-configuration)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring Setup](#monitoring-setup)
- [Auto-Deployment on EC2 Start](#auto-deployment-on-ec2-start)
- [API Documentation](#api-documentation)
- [Admin Credentials](#admin-credentials)

## ✨ Features

### Frontend
- 🏠 Home page with hero banners and category grid
- 🔐 User authentication (Login/Signup)
- 👤 Admin login and dashboard
- 📦 Product listing and details pages
- 🛒 Shopping cart functionality
- 💳 Checkout workflow
- 📋 Order history and profile management
- 📱 Fully responsive mobile-first UI (Zepto/Blinkit style)

### Backend
- 🔒 JWT-based authentication
- 👥 Role-based access control (User/Admin)
- 📊 RESTful API endpoints
- 🗄️ MongoDB database with Mongoose ODM
- ✅ Input validation and error handling
- 🔐 Secure password hashing

### Admin Dashboard
- 📈 Real-time statistics (Products, Customers, Orders)
- 📦 Product CRUD operations
- 👥 User management
- 📋 Order management and delivery tracking
- 📊 Low stock alerts

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- No frameworks (Pure vanilla JS)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### DevOps & Infrastructure
- Docker & Docker Compose
- Kubernetes (EKS)
- Jenkins CI/CD
- Terraform (AWS)
- Ansible
- Prometheus & Grafana
- Nginx

## 📁 Project Structure

```
grocery-mart/
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── cart.html
│   ├── checkout.html
│   ├── profile.html
│   ├── login.html
│   ├── signup.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── main.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── profile.js
│   │   └── admin-dashboard.js
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── server.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seed.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── ansible/
│   ├── inventory.ini
│   └── playbook.yml
├── kubernetes/
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── mongo-statefulset.yaml
│   ├── mongo-express-deployment.yaml
│   ├── ingress.yaml
│   └── secrets.yaml
├── monitoring/
│   ├── prometheus-deployment.yaml
│   ├── grafana-deployment.yaml
│   └── servicemonitor.yaml
└── README.md
```

## 📦 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- AWS Account with CLI configured
- Terraform 1.0+
- Ansible 2.9+
- kubectl (for Kubernetes)
- Git

## 🚀 Quick Start with Docker Compose

### 1. Clone the Repository

```bash
git clone <repository-url>
cd grocery-mart
```

### 2. Start Services

```bash
docker-compose up -d
```

### 3. Seed Database

```bash
cd backend
npm install
npm run seed
```

### 4. Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Mongo Express**: http://localhost:8081 (admin/admin123)

## 🖥️ Ubuntu EC2 Setup Guide

### Step 1: Launch EC2 Instance

1. Log in to AWS Console
2. Navigate to EC2 → Launch Instance
3. Select **Ubuntu Server 22.04 LTS**
4. Choose instance type: **t3.medium** (minimum)
5. Configure security group:
   - SSH (22) from your IP
   - HTTP (80) from anywhere
   - HTTPS (443) from anywhere
   - Custom TCP (8080) for Jenkins
   - Custom TCP (3000) for backend
6. Create or select a key pair
7. Launch instance

### Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Step 3: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 4: Install Docker

```bash
# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu
newgrp docker
```

### Step 5: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 6: Install Git

```bash
sudo apt install -y git
```

### Step 7: Clone Repository

```bash
cd /opt
sudo git clone https://github.com/kumaresanc746/GroceryMart.git  grocery-mart
sudo chown -R ubuntu:ubuntu grocery-mart
cd grocery-mart
```

### Step 8: Configure Environment Variables

```bash
cd backend
cp .env.example .env
nano .env
```

Update with your MongoDB URI and JWT secret:

```
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocerymart
JWT_SECRET=your-secure-secret-key-here
```

### Step 9: Start Application

```bash
cd /opt/grocery-mart
docker-compose up -d
```

### Step 10: Seed Database

```bash
cd backend
npm install
npm run seed
```

### Step 11: Verify Services

```bash
docker-compose ps
```

All services should be running.

## 🐳 Docker Deployment

### Build Images

```bash
# Build backend
cd backend
docker build -t grocery-mart-backend:latest .

# Build frontend
cd ../frontend
docker build -t grocery-mart-frontend:latest .
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag grocery-mart-backend:latest YOUR_USERNAME/grocery-mart-backend:latest
docker tag grocery-mart-frontend:latest YOUR_USERNAME/grocery-mart-frontend:latest

# Push images
docker push YOUR_USERNAME/grocery-mart-backend:latest
docker push YOUR_USERNAME/grocery-mart-frontend:latest
```

### Update docker-compose.yml

Replace image names with your Docker Hub images:

```yaml
backend:
  image: YOUR_USERNAME/grocery-mart-backend:latest
  # ... rest of config

frontend:
  image: YOUR_USERNAME/grocery-mart-frontend:latest
  # ... rest of config
```

## 🔄 Jenkins CI/CD Setup

### Step 1: Install Jenkins

```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Step 2: Access Jenkins

1. Get initial admin password:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

2. Open browser: `http://<EC2_IP>:8080`
3. Install suggested plugins
4. Create admin user

### Step 3: Configure Jenkins Credentials

1. Go to **Manage Jenkins** → **Credentials**
2. Add credentials:
   - **docker-hub-username**: Your Docker Hub username
   - **docker-hub-password**: Your Docker Hub password/token
   - **aws-access-key-id**: AWS access key
   - **aws-secret-access-key**: AWS secret key
   - **kubeconfig**: Kubernetes config file (if using K8s)

### Step 4: Create Jenkins Pipeline

1. Click **New Item**
2. Enter name: `grocery-mart-pipeline`
3. Select **Pipeline**
4. In **Pipeline** section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: Your Git repository URL
   - Branch: `main` or `master`
   - Script Path: `Jenkinsfile`
5. Save and click **Build Now**

### Step 5: Configure Auto-Deployment

The Jenkinsfile includes stages for:
- Git Pull
- Install Dependencies
- Build Frontend
- Docker Build
- Docker Push
- Kubernetes Deployment

## 🏗️ Terraform Infrastructure

### Step 1: Configure AWS CLI

```bash
aws configure
# Enter AWS Access Key ID
# Enter AWS Secret Access Key
# Enter default region: us-east-1
# Enter output format: json
```

### Step 2: Initialize Terraform

```bash
cd terraform
terraform init
```

### Step 3: Create S3 Bucket for State (Optional but Recommended)

```bash
aws s3 mb s3://grocery-mart-terraform-state
```

### Step 4: Update Variables

Edit `terraform/variables.tf`:

```hcl
variable "ec2_ami" {
  default = "ami-0c55b159cbfafe1f0" # Update with your region's Ubuntu AMI
}

variable "ec2_key_name" {
  default = "your-key-pair-name"
}
```

### Step 5: Plan Infrastructure

```bash
terraform plan
```

### Step 6: Apply Infrastructure

```bash
terraform apply
```

Type `yes` to confirm. This will create:
- VPC with public/private subnets
- Internet Gateway
- Security Groups
- EC2 Instance
- EKS Cluster
- Auto-scaling Node Group

### Step 7: Get Outputs

```bash
terraform output
```

Note the EC2 public IP and EKS cluster details.

## 🤖 Ansible Configuration

### Step 1: Install Ansible

```bash
sudo apt update
sudo apt install -y ansible
```

### Step 2: Update Inventory

Edit `ansible/inventory.ini`:

```ini
[ec2_instances]
grocery_mart_server ansible_host=YOUR_EC2_PUBLIC_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/your-key.pem
```

### Step 3: Test Connection

```bash
ansible all -i ansible/inventory.ini -m ping
```

### Step 4: Run Playbook

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

This will:
- Install Docker and Docker Compose
- Install Jenkins
- Install kubectl
- Copy application files
- Deploy with Docker Compose

## ☸️ Kubernetes Deployment

### Step 1: Configure kubectl for EKS

```bash
aws eks update-kubeconfig --name grocery-mart-cluster --region us-east-1
```

### Step 2: Update Kubernetes YAMLs

Edit `kubernetes/backend-deployment.yaml` and `kubernetes/frontend-deployment.yaml`:

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.

### Step 3: Create Namespace

```bash
kubectl apply -f kubernetes/namespace.yaml
```

### Step 4: Create Secrets

```bash
kubectl apply -f kubernetes/secrets.yaml
```

### Step 5: Deploy MongoDB

```bash
kubectl apply -f kubernetes/mongo-statefulset.yaml
```

### Step 6: Deploy Backend

```bash
kubectl apply -f kubernetes/backend-deployment.yaml
```

### Step 7: Deploy Frontend

```bash
kubectl apply -f kubernetes/frontend-deployment.yaml
```

### Step 8: Deploy Mongo Express

```bash
kubectl apply -f kubernetes/mongo-express-deployment.yaml
```

### Step 9: Deploy Ingress (Optional)

```bash
# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml

# Deploy Ingress
kubectl apply -f kubernetes/ingress.yaml
```

### Step 10: Verify Deployments

```bash
kubectl get pods -n grocery-mart
kubectl get services -n grocery-mart
```

### Step 11: Get Service URLs

```bash
# Frontend LoadBalancer
kubectl get svc frontend -n grocery-mart

# Mongo Express NodePort
kubectl get svc mongo-express -n grocery-mart
```

## 📊 Monitoring Setup

### Step 1: Deploy Prometheus

```bash
kubectl apply -f monitoring/prometheus-deployment.yaml
```

### Step 2: Deploy Grafana

```bash
kubectl apply -f monitoring/grafana-deployment.yaml
```

### Step 3: Access Prometheus

```bash
kubectl port-forward svc/prometheus 9090:9090 -n grocery-mart
```

Access at: http://localhost:9090

### Step 4: Access Grafana

```bash
kubectl port-forward svc/grafana 3000:3000 -n grocery-mart
```

Access at: http://localhost:3000
- Username: `admin`
- Password: `admin123`

### Step 5: Configure Grafana Data Source

1. Login to Grafana
2. Go to **Configuration** → **Data Sources**
3. Add **Prometheus**
4. URL: `http://prometheus:9090`
5. Save & Test

### Step 6: Import Dashboards

1. Go to **Dashboards** → **Import**
2. Use dashboard ID: `315` (Node Exporter) or `6417` (Kubernetes)
3. Select Prometheus data source
4. Import

## 🔄 Auto-Deployment on EC2 Start

### Create Startup Script

Create `/opt/grocery-mart/auto-deploy.sh`:

```bash
#!/bin/bash

# Auto-deployment script for EC2 instance startup
# This script runs automatically when EC2 instance starts

cd /opt/grocery-mart

# Pull latest code
git pull origin main || git pull origin master

# Login to Docker Hub
echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# Pull latest images
docker-compose pull

# Restart services
docker-compose up -d --force-recreate

# Seed database if needed
cd backend
if [ ! -f .seeded ]; then
    npm install
    npm run seed
    touch .seeded
fi

echo "Auto-deployment completed at $(date)"
```

### Make Script Executable

```bash
chmod +x /opt/grocery-mart/auto-deploy.sh
```

### Create Systemd Service

Create `/etc/systemd/system/grocery-mart-auto-deploy.service`:

```ini
[Unit]
Description=GroceryMart Auto-Deploy Service
After=network.target docker.service

[Service]
Type=oneshot
ExecStart=/opt/grocery-mart/auto-deploy.sh
User=ubuntu
Environment="DOCKER_HUB_USERNAME=your-username"
Environment="DOCKER_HUB_PASSWORD=your-password"

[Install]
WantedBy=multi-user.target
```

### Enable Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable grocery-mart-auto-deploy.service
```

### Test Auto-Deployment

```bash
sudo systemctl start grocery-mart-auto-deploy.service
sudo systemctl status grocery-mart-auto-deploy.service
```

### Configure EC2 User Data

Alternatively, add to EC2 User Data script:

```bash
#!/bin/bash
cd /opt/grocery-mart
docker-compose pull
docker-compose up -d
```

## 📡 API Documentation

### Authentication Endpoints

#### User Signup
```
POST /api/auth/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

#### User Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

#### Admin Login
```
POST /api/admin/login
Body: {
  "email": "admin@grocerymart.com",
  "password": "admin123"
}
```

### Product Endpoints

#### Get All Products
```
GET /api/products
```

#### Get Product by ID
```
GET /api/products/:id
```

#### Get Products by Category
```
GET /api/products?category=Fruits
```

### Cart Endpoints (Requires Authentication)

#### Get Cart
```
GET /api/cart
Headers: Authorization: Bearer <token>
```

#### Add to Cart
```
POST /api/cart/add
Headers: Authorization: Bearer <token>
Body: {
  "productId": "product_id",
  "quantity": 1
}
```

#### Remove from Cart
```
POST /api/cart/remove
Headers: Authorization: Bearer <token>
Body: {
  "productId": "product_id"
}
```

### Order Endpoints (Requires Authentication)

#### Create Order
```
POST /api/orders/create
Headers: Authorization: Bearer <token>
Body: {
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 100
    }
  ],
  "totalAmount": 200,
  "deliveryAddress": "123 Main St",
  "paymentMethod": "cod"
}
```

#### Get Order History
```
GET /api/orders/history
Headers: Authorization: Bearer <token>
```

### Admin Endpoints (Requires Admin Authentication)

#### Get Dashboard Stats
```
GET /api/admin/stats
Headers: Authorization: Bearer <admin_token>
```

#### Get All Products
```
GET /api/admin/products
Headers: Authorization: Bearer <admin_token>
```

#### Add Product
```
POST /api/admin/products/add
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Product Name",
  "category": "Fruits",
  "price": 100,
  "stock": 50,
  "image": "image_url",
  "description": "Product description"
}
```

#### Update Product
```
PUT /api/admin/products/update/:id
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Updated Name",
  "price": 120,
  "stock": 40
}
```

#### Delete Product
```
DELETE /api/admin/products/delete/:id
Headers: Authorization: Bearer <admin_token>
```

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <admin_token>
```

#### Get All Orders
```
GET /api/admin/orders
Headers: Authorization: Bearer <admin_token>
```

## 🔑 Admin Credentials

Default admin credentials (created by seed script):

- **Email**: admin@grocerymart.com
- **Password**: admin123

**⚠️ Change these credentials in production!**

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Get products
curl http://localhost:3000/api/products
```

### Test Frontend

Open browser: http://localhost

## 🐛 Troubleshooting

### Docker Issues

```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Restart services
docker-compose restart
```

### MongoDB Connection Issues

```bash
# Check MongoDB container
docker-compose exec mongo mongosh

# Verify database
use grocerymart
show collections
```

### Kubernetes Issues

```bash
# Check pod status
kubectl describe pod <pod-name> -n grocery-mart

# Check logs
kubectl logs <pod-name> -n grocery-mart

# Restart deployment
kubectl rollout restart deployment/backend -n grocery-mart
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- GroceryMart Team

## 🙏 Acknowledgments

- Zepto/Blinkit for UI inspiration
- All open-source contributors

---

**Happy Shopping! 🛒**

