#!/bin/bash

# Test Admin Login Script
# This script tests if admin login is working

echo "=========================================="
echo "Testing Admin Login"
echo "=========================================="

# Test admin login
echo "1. Testing admin login API..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grocerymart.com","password":"admin123"}')

echo "Response: $RESPONSE"

# Extract token
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Admin login failed!"
    echo "Checking if admin user exists..."
    docker exec grocery-mongo mongosh grocerymart --quiet --eval "db.users.find({role: 'admin'}).count()"
    exit 1
fi

echo "✅ Admin login successful!"
echo "Token: ${TOKEN:0:20}..."

# Test admin stats
echo ""
echo "2. Testing admin stats API..."
STATS=$(curl -s -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN")

echo "Stats: $STATS"

# Test admin products
echo ""
echo "3. Testing admin products API..."
PRODUCTS=$(curl -s -X GET http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer $TOKEN" | head -c 200)

echo "Products (first 200 chars): $PRODUCTS..."

echo ""
echo "=========================================="
echo "Admin Login Test Complete!"
echo "=========================================="

