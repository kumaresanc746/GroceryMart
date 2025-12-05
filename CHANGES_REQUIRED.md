# ⚠️ மாற்ற வேண்டிய கோடுகள் (Code Changes Required)

## 🔴 முக்கியமான மாற்றங்கள் (Critical Changes)

### 1️⃣ Docker Hub Username மாற்றவும்

#### File 1: `kubernetes/backend-deployment.yaml`
```yaml
Line 18: 
# BEFORE:
image: YOUR_DOCKERHUB_USERNAME/grocery-mart-backend:latest

# AFTER (உங்கள் username-ஐ போடவும்):
image: your-dockerhub-username/grocery-mart-backend:latest
```

#### File 2: `kubernetes/frontend-deployment.yaml`
```yaml
Line 18:
# BEFORE:
image: YOUR_DOCKERHUB_USERNAME/grocery-mart-frontend:latest

# AFTER:
image: your-dockerhub-username/grocery-mart-frontend:latest
```

### 2️⃣ EC2 IP Address மாற்றவும்

#### File: `ansible/inventory.ini`
```ini
Line 2:
# BEFORE:
grocery_mart_server ansible_host=YOUR_EC2_PUBLIC_IP ansible_user=ubuntu

# AFTER (உங்கள் EC2 public IP-ஐ போடவும்):
grocery_mart_server ansible_host=54.123.45.67 ansible_user=ubuntu
```

### 3️⃣ Backend Environment Variables

#### File: `backend/.env` (create this file)
```bash
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocerymart
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
```

### 4️⃣ Git Repository URL

#### File: `scripts/ec2-user-data.sh`
```bash
Line 30:
# BEFORE:
git clone https://github.com/your-username/grocery-mart.git

# AFTER (உங்கள் repository URL-ஐ போடவும்):
git clone https://github.com/YOUR_GITHUB_USERNAME/grocery-mart.git
```

#### File: `scripts/setup-ec2.sh`
```bash
Line 68:
# Update with your repository URL
```

### 5️⃣ AWS Key Pair Name

#### File: `terraform/variables.tf`
```hcl
Line 20:
# BEFORE:
variable "ec2_key_name" {
  default = "grocery-mart-key"
}

# AFTER (உங்கள் AWS key pair name-ஐ போடவும்):
variable "ec2_key_name" {
  default = "your-aws-key-pair-name"
}
```

### 6️⃣ AWS AMI ID (Optional - Region wise)

#### File: `terraform/variables.tf`
```hcl
Line 12:
# BEFORE:
default = "ami-0c55b159cbfafe1f0" # Ubuntu 22.04 LTS

# AFTER (உங்கள் region-க்கு suitable AMI-ஐ போடவும்):
# Find AMI: https://cloud-images.ubuntu.com/locator/ec2/
default = "ami-xxxxxxxxxxxxxxxxx"
```

### 7️⃣ Domain Name (Optional - Production-க்கு)

#### File: `kubernetes/ingress.yaml`
```yaml
Line 12:
# BEFORE:
- host: grocerymart.example.com

# AFTER (உங்கள் domain-ஐ போடவும்):
- host: yourdomain.com
```

### 8️⃣ Docker Hub Credentials (Scripts-ல்)

#### File: `scripts/auto-deploy.sh`
```bash
# Add these lines at the top:
export DOCKER_HUB_USERNAME="your-dockerhub-username"
export DOCKER_HUB_PASSWORD="your-dockerhub-password"
```

#### File: `scripts/ec2-user-data.sh`
```bash
Line 43:
Environment="DOCKER_HUB_USERNAME=your-dockerhub-username"
Environment="DOCKER_HUB_PASSWORD=your-dockerhub-password"
```

## 📋 Quick Checklist

மேலே உள்ள அனைத்தையும் மாற்றிய பிறகு:

- [ ] ✅ Docker Hub username update செய்துள்ளீர்களா?
- [ ] ✅ EC2 IP address update செய்துள்ளீர்களா?
- [ ] ✅ Backend .env file create செய்துள்ளீர்களா?
- [ ] ✅ Git repository URL update செய்துள்ளீர்களா?
- [ ] ✅ AWS key pair name update செய்துள்ளீர்களா?
- [ ] ✅ JWT secret key change செய்துள்ளீர்களா?

## 🚀 Usage Example

### Local Development (No changes needed)
```bash
docker-compose up -d
cd backend && npm install && npm run seed
```

### Production Deployment
மேலே உள்ள அனைத்து changes-யும் செய்த பிறகு:

```bash
# 1. Build and push Docker images
docker build -t your-username/grocery-mart-backend:latest ./backend
docker build -t your-username/grocery-mart-frontend:latest ./frontend
docker push your-username/grocery-mart-backend:latest
docker push your-username/grocery-mart-frontend:latest

# 2. Deploy to Kubernetes
kubectl apply -f kubernetes/
```

## 💡 Tips

1. **Docker Hub**: Free account create செய்யலாம் - https://hub.docker.com
2. **EC2 IP**: AWS Console → EC2 → Instances → Public IP copy செய்யவும்
3. **JWT Secret**: Strong password போல minimum 32 characters use செய்யவும்
4. **Git URL**: GitHub/GitLab/Bitbucket repository URL

## 📞 Need Help?

Check these files:
- `README.md` - Complete setup guide
- `QUICKSTART.md` - Quick start
- `CUSTOMIZATION_GUIDE.md` - Detailed customization

