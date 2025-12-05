# 🔐 Admin Access Guide

## Admin Login Credentials

**Default Admin Account:**
- **Email**: `admin@grocerymart.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## How to Access Admin Dashboard

### Method 1: Direct URL
Navigate to: `http://YOUR_EC2_IP/admin-login.html`

### Method 2: Navigation Menu
Click on **"Admin"** link in the navigation menu (visible on all pages)

### Method 3: After Login
If you're logged in as admin, the "Admin" link changes to "Admin Dashboard"

## Verify Admin User Exists

Check if admin user is in database:

```bash
# On EC2 instance
docker exec grocery-mongo mongosh grocerymart --eval "db.users.find({role: 'admin'}).pretty()"
```

Expected output should show:
```json
{
  _id: ObjectId("..."),
  name: "Admin User",
  email: "admin@grocerymart.com",
  role: "admin",
  ...
}
```

## Create Admin User (if missing)

If admin user doesn't exist, create it:

```bash
cd /opt/grocery-mart/backend
docker compose run --rm backend sh -lc "npm run seed"
```

Or manually create via MongoDB:

```bash
docker exec grocery-mongo mongosh grocerymart
```

Then in mongosh:
```javascript
use grocerymart
db.users.insertOne({
  name: "Admin User",
  email: "admin@grocerymart.com",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  role: "admin",
  phone: "1234567890"
})
```

## Admin Dashboard Features

Once logged in as admin, you can:

1. **View Statistics**
   - Total Products
   - Low Stock Count
   - Total Customers
   - Pending Orders
   - Deliveries Today

2. **Manage Products**
   - View all products in table
   - Add new products
   - Edit existing products
   - Delete products

3. **View Users**
   - See all registered customers

4. **View Orders**
   - See all orders
   - Track delivery status

## Troubleshooting

### Admin Login Not Working

1. **Check if admin user exists:**
   ```bash
   docker exec grocery-mongo mongosh grocerymart --eval "db.users.countDocuments({role: 'admin'})"
   ```
   Should return `1` or more

2. **Check backend logs:**
   ```bash
   docker logs grocery-backend
   ```

3. **Test admin login API:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@grocerymart.com","password":"admin123"}'
   ```

4. **Re-seed database:**
   ```bash
   cd /opt/grocery-mart/backend
   docker compose run --rm backend sh -lc "npm run seed"
   ```

### Admin Dashboard Not Loading

1. **Check browser console** (F12) for errors
2. **Verify token is stored:**
   - Open browser DevTools → Application → Local Storage
   - Check for `token` and `userRole: admin`

3. **Check API response:**
   ```bash
   # Get admin stats (requires token)
   curl -X GET http://localhost:3000/api/admin/stats \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Security Notes

1. **Change default password** immediately in production
2. **Use strong JWT secret** in production
3. **Enable HTTPS** for admin access
4. **Restrict admin access** by IP if possible
5. **Monitor admin activities** in logs

## Quick Test

Test admin login from command line:

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grocerymart.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Use token to get stats
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"
```

If this works, admin login is functioning correctly!

