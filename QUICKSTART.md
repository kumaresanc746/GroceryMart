# 🚀 Quick Start Guide

## Local Development (5 minutes)

### 1. Clone and Start

```bash
git clone <repository-url>
cd grocery-mart
docker-compose up -d
```

### 2. Seed Database

```bash
cd backend
npm install
npm run seed
```

### 3. Access Application

- Frontend: http://localhost
- Backend API: http://localhost:3000
- Mongo Express: http://localhost:8081 (admin/admin123)

### 4. Test Credentials

**Admin Login:**
- Email: admin@grocerymart.com
- Password: admin123

**Create User Account:**
- Go to http://localhost/signup.html
- Create your account

## Production Deployment (EC2)

### Option 1: Automated Setup Script

```bash
# On EC2 instance
wget https://raw.githubusercontent.com/your-repo/grocery-mart/main/scripts/setup-ec2.sh
chmod +x setup-ec2.sh
sudo ./setup-ec2.sh
```

### Option 2: Manual Steps

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clone Repository
cd /opt
git clone <your-repo-url> grocery-mart
cd grocery-mart

# 4. Start Services
docker-compose up -d

# 5. Seed Database
cd backend
npm install
npm run seed
```

## Docker Hub Deployment

### 1. Build and Push Images

```bash
# Build
docker build -t your-username/grocery-mart-backend:latest ./backend
docker build -t your-username/grocery-mart-frontend:latest ./frontend

# Push
docker push your-username/grocery-mart-backend:latest
docker push your-username/grocery-mart-frontend:latest
```

### 2. Update docker-compose.yml

Replace image names with your Docker Hub images.

## Kubernetes Deployment

```bash
# 1. Update image names in YAML files
# Replace YOUR_DOCKERHUB_USERNAME with your username

# 2. Apply configurations
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/mongo-statefulset.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml

# 3. Check status
kubectl get pods -n grocery-mart
kubectl get services -n grocery-mart
```

## Terraform Infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Troubleshooting

### Services not starting?

```bash
docker-compose logs
docker-compose ps
```

### Database connection issues?

```bash
docker-compose exec mongo mongosh
use grocerymart
show collections
```

### Port already in use?

```bash
# Change ports in docker-compose.yml
# Or stop conflicting services
sudo lsof -i :80
sudo lsof -i :3000
```

## Need Help?

Check the full [README.md](README.md) for detailed documentation.

