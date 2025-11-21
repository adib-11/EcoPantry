# EcoPantry AI Server

AI Gateway Server for EcoPantry - Integrates Google Gemini AI for intelligent food waste reduction features.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in this directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Get Gemini API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Get from Supabase Dashboard → Settings → API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 4. Test the Server

Visit http://localhost:3000/health

You should see:
```json
{
  "status": "ok",
  "message": "AI Server is running!",
  "timestamp": "2025-11-21T..."
}
```

## 📁 Project Structure

```
ai-server/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── .env.example           # Example env file
├── config/
│   ├── gemini.js         # Gemini AI client setup
│   └── supabase.js       # Supabase client setup
├── routes/
│   ├── chat.js           # NourishBot chat endpoint
│   ├── scoring.js        # SDG scoring endpoint
│   ├── vision.js         # OCR/image scanning endpoint
│   ├── patterns.js       # Pattern analysis endpoint
│   ├── predictions.js    # Waste prediction endpoint
│   └── planner.js        # Meal planning endpoint
├── utils/
│   ├── promptTemplates.js # AI prompt templates
│   ├── dataFormatters.js  # Data formatting utilities
│   └── validators.js      # Input validation
└── middleware/
    ├── errorHandler.js    # Global error handling
    └── rateLimiter.js     # Rate limiting
```

## 🛣️ API Endpoints (To Be Implemented)

### Wave 1: Chat & Scoring
- `POST /api/chat` - NourishBot conversational AI
- `POST /api/score` - SDG impact scoring

### Wave 2: Vision
- `POST /api/scan` - Receipt/image OCR

### Wave 3: Predictions
- `POST /api/analyze-patterns` - Consumption pattern analysis
- `POST /api/predict-waste` - Expiry risk prediction

### Wave 4: Meal Planning
- `POST /api/meal-plan` - AI meal plan generation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `SUPABASE_URL` | Supabase project URL | Yes | - |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:5173 |

### Getting API Keys

**Gemini API Key:**
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

**Supabase Credentials:**
1. Open your Supabase project
2. Go to Settings → API
3. Copy the URL and service_role key (NOT the anon key)

## 🧪 Testing

Test endpoints using curl:

```bash
# Health check
curl http://localhost:3000/health

# Test chat (once implemented)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!","userId":"test-uuid"}'
```

## 🐛 Troubleshooting

### "GEMINI_API_KEY is not valid"
- Check that your key is correct
- Verify it hasn't expired
- Get a new key from Google AI Studio

### "CORS error"
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check that the frontend is running on the specified port

### "Supabase connection failed"
- Ensure you're using the `service_role` key, not the `anon` key
- Verify the URL is correct
- Check that your Supabase project is active

## 📊 Development Status

- [x] Infrastructure setup
- [ ] Chat endpoint
- [ ] Scoring endpoint
- [ ] Vision endpoint
- [ ] Pattern analysis endpoint
- [ ] Prediction endpoint
- [ ] Meal planner endpoint

## 📚 Documentation

- See `PART2_MASTER_PLAN.md` for implementation guide
- See `AI_API_DOCUMENTATION.md` for API reference
- See `PART2_QUICK_START.md` for quick setup guide

## 🔒 Security Notes

- Never commit `.env` file to git
- Use service role key only on backend (never in frontend)
- Implement rate limiting in production
- Validate all user inputs
- Sanitize file uploads

## 📝 License

MIT
