#!/bin/bash

# Test script for NourishBot Chat API
# Usage: ./test-chat.sh

echo "🧪 Testing NourishBot Chat API"
echo "================================"
echo ""

# Test 1: Simple greeting
echo "Test 1: Simple greeting"
echo "-----------------------"
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!","userId":"25b2e7f3-24c1-43c6-85f1-f2b6e28a80ac"}' \
  | python3 -c "import json, sys; data=json.load(sys.stdin); print(f'✅ Reply: {data[\"reply\"][:100]}...')"
echo ""
echo ""

# Test 2: Ask for recipe
echo "Test 2: Ask for cooking suggestions"
echo "-----------------------------------"
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What can I cook with rice and eggs?","userId":"25b2e7f3-24c1-43c6-85f1-f2b6e28a80ac"}' \
  | python3 -c "import json, sys; data=json.load(sys.stdin); print(f'✅ Reply: {data[\"reply\"][:200]}...'); print(f'Session ID: {data[\"sessionId\"]}')"
echo ""
echo ""

# Test 3: Food waste tips
echo "Test 3: Ask for food waste tips"
echo "-------------------------------"
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How can I reduce food waste?","userId":"25b2e7f3-24c1-43c6-85f1-f2b6e28a80ac"}' \
  | python3 -c "import json, sys; data=json.load(sys.stdin); print(f'✅ Reply: {data[\"reply\"][:200]}...'); print(f'Actionable: {data[\"context\"][\"actionableAdvice\"]}')"
echo ""
echo ""

# Test 4: Validation - Empty message
echo "Test 4: Validation test (should fail)"
echo "-------------------------------------"
response=$(curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"","userId":"25b2e7f3-24c1-43c6-85f1-f2b6e28a80ac"}')
echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); print(f'❌ Error (expected): {data.get(\"error\", {}).get(\"message\", \"Unknown\")}')"
echo ""
echo ""

echo "✅ All tests complete!"
