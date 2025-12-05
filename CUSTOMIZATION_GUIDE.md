# 🔧 Code Customization Guide (Tamil/English)

## ⚠️ முக்கியமான மாற்றங்கள் (Important Changes Required)

### 1. Docker Hub Username மாற்றவும்

#### Kubernetes Files:
```yaml
# File: kubernetes/backend-deployment.yaml
# Line 15: Replace YOUR_DOCKERHUB_USERNAME
image: YOUR_DOCKERHUB_USERNAME/grocery-mart-backend:latest

# File: kubernetes/frontend-deployment.yaml  
# Line 15: Replace YOUR_DOCKERHUB_USERNAME
image: YOUR_DOCKERHUB_USERNAME/grocery-mart-frontend:latest
```

#### Jenkinsfile:
```groovy
# Line 6-7: Add your Docker Hub credentials
DOCKER_HUB_USERNAME = credentials('docker-hub-username')
DOCKER_HUB_PASSWORD = credentials('docker-hub-password')
```

### 2. MongoDB Connection String

#### Backend .env file:
```bash
# File: backend/.env
MONGODB_URI=mongodb://mongo:27017/grocerymart
# Production: mongodb://your-mongodb-host:27017/grocerymart
```

### 3. JWT Secret Key மாற்றவும்

```bash
# File: backend/.env
JWT_SECRET=your-secure-secret-key-change-this-in-production

# File: kubernetes/secrets.yaml
# Update jwt-secret value
```

### 4. EC2 IP Address

#### Ansible Inventory:
```ini
# File: ansible/inventory.ini
grocery_mart_server ansible_host=YOUR_EC2_PUBLIC_IP ansible_user=ubuntu
```

### 5. AWS Configuration

#### Terraform Variables:
```hcl
# File: terraform/variables.tf
variable "ec2_ami" {
  default = "ami-0c55b159cbfafe1f0" # Your region's Ubuntu AMI
}

variable "ec2_key_name" {
  default = "your-aws-key-pair-name"
}
```

### 6. Domain Name (Optional)

#### Kubernetes Ingress:
```yaml
# File: kubernetes/ingress.yaml
# Line 12: Replace with your domain
- host: grocerymart.example.com
```

### 7. Auto-Deploy Script Credentials

```bash
# File: scripts/auto-deploy.sh
# Add environment variables:
export DOCKER_HUB_USERNAME="your-username"
export DOCKER_HUB_PASSWORD="your-password"
```

### 8. Git Repository URL

#### Multiple Files:
```bash
# scripts/ec2-user-data.sh
git clone https://github.com/your-username/grocery-mart.git

# scripts/setup-ec2.sh  
# Update repository URL

# Jenkinsfile
# Update Git repository URL in SCM configuration
```

## 📝 Step-by-Step Customization

### Step 1: Docker Hub Setup
1. Docker Hub account create செய்யவும்
2. Username note செய்யவும்
3. All YAML files-ல் replace செய்யவும்

### Step 2: Backend Configuration
```bash
cd backend
cp .env.example .env
nano .env
# Update MONGODB_URI and JWT_SECRET
```

### Step 3: Frontend API URL
```javascript
// File: frontend/js/api.js
// Already configured to work with both localhost and production
// No changes needed if using nginx proxy
```

### Step 4: AWS Setup
```bash
# Configure AWS CLI
aws configure
# Enter Access Key, Secret Key, Region
```

### Step 5: Jenkins Credentials
1. Jenkins-ல் login செய்யவும்
2. Manage Jenkins → Credentials
3. Add credentials:
   - docker-hub-username
   - docker-hub-password
   - aws-access-key-id
   - aws-secret-access-key

## 🎯 Quick Checklist

- [ ] Docker Hub username update செய்துள்ளீர்களா?
- [ ] Backend .env file create செய்துள்ளீர்களா?
- [ ] JWT secret key change செய்துள்ளீர்களா?
- [ ] EC2 IP address update செய்துள்ளீர்களா?
- [ ] AWS credentials configure செய்துள்ளீர்களா?
- [ ] Git repository URL update செய்துள்ளீர்களா?
- [ ] Domain name update செய்துள்ளீர்களா? (optional)

## 🔒 Security Reminders

1. **Never commit .env files** - Already in .gitignore
2. **Change default admin password** - admin@grocerymart.com / admin123
3. **Use strong JWT secret** - At least 32 characters
4. **Restrict MongoDB access** - Use security groups
5. **Enable HTTPS** - For production deployments

## 📞 Support

If you need help with any customization, check:
- README.md for detailed setup
- QUICKSTART.md for quick start guide
- PROJECT_SUMMARY.md for overview

