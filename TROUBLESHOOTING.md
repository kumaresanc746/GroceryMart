# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. 401 Unauthorized Errors

**Problem**: Seeing `401` errors in logs when accessing cart or orders without login.

**Solution**: This is **expected behavior**. The application is working correctly. These errors occur when:
- User visits cart/profile pages without logging in
- Session token has expired
- User tries to access protected endpoints

**Fix**: 
- ✅ Already fixed in the code - users will be redirected to login page
- Users need to login first before accessing protected pages

### 2. Favicon 404 Error

**Problem**: `GET /favicon.ico HTTP/1.1" 404`

**Solution**: 
- ✅ Already fixed - Added favicon in HTML head
- This is a minor cosmetic issue and doesn't affect functionality

### 3. MongoDB Connection Issues

**Check if MongoDB is running:**
```bash
docker ps | grep mongo
```

**Check MongoDB logs:**
```bash
docker logs grocery-mongo
```

**Restart MongoDB:**
```bash
docker-compose restart mongo
```

### 4. Backend Not Starting

**Check backend logs:**
```bash
docker logs grocery-backend
```

**Common causes:**
- MongoDB not ready yet - wait a few seconds
- Port 3000 already in use
- Environment variables not set

**Fix:**
```bash
# Check if port is in use
sudo lsof -i :3000

# Restart backend
docker-compose restart backend
```

### 5. Frontend Not Loading

**Check frontend logs:**
```bash
docker logs grocery-frontend
```

**Check nginx configuration:**
```bash
docker exec grocery-frontend nginx -t
```

**Restart frontend:**
```bash
docker-compose restart frontend
```

### 6. Products Not Showing

**Check if database is seeded:**
```bash
docker exec grocery-mongo mongosh grocerymart --eval "db.products.countDocuments()"
```

**If count is 0, seed database:**
```bash
cd backend
docker compose run --rm backend sh -lc "npm install && npm run seed"
```

### 7. Cannot Add to Cart

**Check:**
1. User is logged in (check localStorage for token)
2. Backend API is accessible
3. Check browser console for errors

**Test API:**
```bash
curl http://localhost:3000/api/products
```

### 8. Docker Compose Version Warning

**Warning**: `the attribute 'version' is obsolete`

**Solution**: This is just a warning, not an error. Docker Compose v2 doesn't require version field. You can remove it from docker-compose.yml if desired, but it won't affect functionality.

### 9. EC2 Instance Issues

**Cannot SSH:**
- Check security group allows SSH (port 22) from your IP
- Verify key pair is correct

**Services not starting:**
```bash
# Check Docker
sudo systemctl status docker

# Check containers
sudo docker ps -a

# View logs
sudo docker-compose logs
```

### 10. API Calls Failing

**Check API endpoint:**
```bash
curl http://YOUR_EC2_IP:3000/health
```

**Check CORS (if accessing from different domain):**
- Backend CORS is configured to allow all origins
- Check browser console for CORS errors

**Check authentication:**
- Token must be in localStorage
- Token format: `Bearer <token>`
- Token expires after 7 days

## Health Check Commands

### Check All Services
```bash
docker-compose ps
```

### Check Service Health
```bash
# Backend
curl http://localhost:3000/health

# Frontend
curl http://localhost/

# MongoDB
docker exec grocery-mongo mongosh --eval "db.adminCommand('ping')"
```

### Check Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo
```

## Reset Everything

**Complete reset (⚠️ deletes all data):**
```bash
docker-compose down -v
docker-compose up -d
cd backend
docker compose run --rm backend sh -lc "npm install && npm run seed"
```

## Getting Help

If issues persist:
1. Check logs: `docker-compose logs`
2. Verify all containers are running: `docker ps`
3. Check network connectivity: `docker network ls`
4. Review error messages in browser console (F12)

## Status Check Script

Create a file `check-status.sh`:
```bash
#!/bin/bash
echo "=== Docker Containers ==="
docker ps

echo -e "\n=== Backend Health ==="
curl -s http://localhost:3000/health || echo "Backend not responding"

echo -e "\n=== Frontend ==="
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost/

echo -e "\n=== MongoDB ==="
docker exec grocery-mongo mongosh --quiet --eval "db.adminCommand('ping').ok" || echo "MongoDB not responding"

echo -e "\n=== Products Count ==="
docker exec grocery-mongo mongosh grocerymart --quiet --eval "db.products.countDocuments()"
```

Make it executable:
```bash
chmod +x check-status.sh
./check-status.sh
```

