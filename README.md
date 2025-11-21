# EcoPantry - Smart Food Waste Management System

## 📋 Project Overview

EcoPantry is a comprehensive food waste management application designed for individuals, families, and communities (hostels/mess halls) in Bangladesh. The platform helps users track their pantry inventory, log meal consumption, and reduce food waste through smart expiry alerts and recipe suggestions. Built with a modern tech stack, it promotes sustainability by calculating green scores and providing actionable insights to minimize food waste.

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type-safe development
- **Vite 5.4** - Build tool and dev server
- **React Router 6.30** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **Framer Motion 12.23** - Animation library
- **React Query (TanStack Query) 5.83** - Server state management

### Backend (BaaS)
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication (email/password)
  - Storage (image uploads)
  - Real-time subscriptions (optional)

### Additional Libraries
- **React Hook Form 7.61** - Form management
- **Zod 3.25** - Schema validation
- **date-fns 3.6** - Date utilities
- **Recharts 2.15** - Data visualization
- **Lucide React 0.462** - Icon library

## 📁 Project Structure

```
ecopantry-hub-main-2/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── animated/       # Animated components
│   │   ├── Navigation.tsx  # Main navigation
│   │   ├── NavLink.tsx     # Navigation links
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── contexts/           # React contexts
│   │   └── UserPersonaContext.tsx  # User type state
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/
│   │       ├── client.ts   # Supabase client setup
│   │       ├── auth.ts     # Auth functions
│   │       ├── storage.ts  # Storage helpers
│   │       ├── types.ts    # TypeScript types
│   │       ├── useAuth.ts  # Auth state hook
│   │       └── hooks/      # Data fetching hooks
│   │           ├── index.ts
│   │           ├── useProfile.ts
│   │           ├── useInventory.ts
│   │           ├── useConsumptions.ts
│   │           └── useResources.ts
│   ├── lib/               # Utility functions
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Landing.tsx    # Landing page
│   │   ├── Login.tsx      # Login page
│   │   ├── Register.tsx   # Registration page
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── Inventory.tsx  # Inventory management
│   │   ├── Consumptions.tsx  # Meal logging
│   │   ├── Resources.tsx  # Tips & recipes
│   │   └── Profile.tsx    # User profile
│   ├── data/              # Mock/static data
│   │   └── mockData.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── docs/                  # Documentation
│   └── architecture.md
├── supabase-schema.sql           # Database schema
├── supabase-rls-policies.sql     # Security policies
├── supabase-seed-data.sql        # Sample data
├── supabase-storage-setup.sql    # Storage configuration
├── BACKEND_IMPLEMENTATION_PLAN.md  # Implementation guide
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js)
- **Supabase Account** - [Sign up at supabase.com](https://supabase.com) (only if creating your own instance)

### Quick Start (Using Shared Database)

For the fastest setup, use the shared Supabase instance:

```bash
# 1. Clone the repository
git clone https://github.com/adib-11/EcoPantry.git
cd ecopantry-hub-main-2

# 2. Install dependencies
npm install

# 3. Set up environment variables (uses shared database)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` with a fully functional backend!

### Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/adib-11/EcoPantry.git
cd ecopantry-hub-main-2
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

**Option A: Use the Shared Supabase Instance (Recommended for Testing)**

Copy the example environment file to create your `.env`:

```bash
cp .env.example .env
```

This will use the shared Supabase instance that's already configured with the database schema and seed data. You can start developing immediately!

**Option B: Use Your Own Supabase Instance**

If you want to create your own Supabase project:

1. Create a `.env` file in the project root:
   ```bash
   touch .env
   ```

2. Add your Supabase credentials (found in your Supabase project settings):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Follow **Step 4** below to set up the database schema

**Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

### Step 4: Backend Setup (Supabase)

**If you're using the shared Supabase instance (`.env.example`)**, you can skip this step! The database is already set up with schema and seed data.

**If you created your own Supabase project**, follow these steps:

#### 4.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name (e.g., "EcoPantry")
3. Select the closest region (Singapore or Mumbai for Bangladesh)
4. Set a strong database password and save it securely
5. Wait for project provisioning (~2 minutes)

#### 4.2 Set Up Database Schema

Run the SQL scripts in the Supabase SQL Editor (in order):

1. **Create Tables:**
   ```bash
   # Copy and paste the contents of supabase-schema.sql
   ```

2. **Set Up Security Policies:**
   ```bash
   # Copy and paste the contents of supabase-rls-policies.sql
   ```

3. **Configure Storage:**
   ```bash
   # Copy and paste the contents of supabase-storage-setup.sql
   ```

4. **Seed Sample Data (Optional):**
   ```bash
   # Copy and paste the contents of supabase-seed-data.sql
   ```

#### 4.3 Disable Email Verification (Development Only)

For faster development testing:

1. Go to Authentication > Providers > Email
2. Toggle off "Confirm email"
3. Click Save

**Note:** Re-enable for production!

### Step 5: Run the Application

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Step 6: Build for Production

To create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🌱 Seed Data Usage

The `supabase-seed-data.sql` file contains sample data for testing:

- **15 Sustainability Tips** - Food waste reduction advice
- **15 Bangladeshi Recipes** - Local dishes with ingredients
- Sample data helps you test the application without manually entering data

### To Use Seed Data:

1. Open Supabase SQL Editor
2. Copy the contents of `supabase-seed-data.sql`
3. Paste and execute
4. Refresh your application to see the data in the Resources page

### To Clear Seed Data:

```sql
DELETE FROM resources WHERE category IN ('tip', 'recipe');
```

## 📊 Database Schema

### Tables:

1. **profiles** - User profile information
   - `id`, `full_name`, `email`, `user_type`, `household_size`, `dietary_preferences`, `monthly_budget`, `green_score`, `location`, `avatar_url`

2. **inventory** - Pantry items with expiry tracking
   - `id`, `user_id`, `name`, `category`, `quantity`, `unit`, `expiry_date`, `purchase_date`, `cost`, `image_url`, `batch`, `purchased_by`, `notes`

3. **consumptions** - Meal consumption logs
   - `id`, `user_id`, `meal_name`, `meal_date`, `ingredients_used`, `servings`, `fed_people`, `image_url`, `wasted_items`, `notes`

4. **resources** - Tips, recipes, and educational content
   - `id`, `title`, `category`, `content`, `image_url`, `ingredients`, `expiring_ingredients`, `prep_time`, `difficulty`, `icon`, `is_public`

5. **activity_logs** - User activity tracking (optional)
   - `id`, `user_id`, `activity_type`, `metadata`, `points_earned`

### Storage Buckets:

- `pantry-images` - Inventory item photos
- `meal-images` - Meal photos
- `receipts` - Scanned receipts
- `avatars` - User profile pictures

## 🔒 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Authentication** - Email/password with Supabase Auth
- **Protected Routes** - Unauthorized users redirected to login
- **Type Safety** - TypeScript for compile-time error checking
- **Environment Variables** - Sensitive data not in source code

### Shared Database Note

The project includes a `.env.example` file with credentials to a shared Supabase instance. This is safe because:
- The **anon key** is designed to be public (it's used in client-side code)
- **Row Level Security** ensures users can only access their own data
- Each user's data is isolated by their authentication session
- The database password is NOT exposed (only the anon key)

For production deployments, you should create your own Supabase instance.

## 🎨 Key Features

1. **Multi-Persona Support**
   - Individual users
   - Family households
   - Community (hostel/mess) management

2. **Inventory Management**
   - Add items manually or via receipt scanning
   - Track expiry dates with visual status (fresh/expiring/expired)
   - Filter and sort items
   - Delete items

3. **Meal Logging**
   - Log meals with ingredients
   - Track servings and people fed
   - Add notes and photos
   - View consumption history

4. **Smart Features**
   - Green score calculation
   - Expiring item alerts
   - Recipe suggestions based on expiring ingredients
   - Sustainability tips

5. **User Dashboard**
   - Overview of inventory stats
   - Recent activity feed
   - Green score tracking
   - Impact metrics (items saved, CO₂ reduced, money saved)

## 🧪 Testing

### Manual Testing Checklist:

- [ ] User registration with all persona types
- [ ] Login/logout functionality
- [ ] Profile updates persist correctly
- [ ] Add inventory items
- [ ] Delete inventory items
- [ ] Filter and search inventory
- [ ] Log meals with ingredients
- [ ] Delete meal logs
- [ ] View tips and recipes
- [ ] Green score updates
- [ ] Expiring items show correct status

### Test Accounts:

Create test accounts for each persona type:
- Individual: `test-individual@example.com`
- Family: `test-family@example.com`
- Community: `test-community@example.com`

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify):

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables in deployment settings
4. Deploy

### Supabase Configuration:

1. Update Authentication > URL Configuration
2. Add production URLs to allowed redirect URLs
3. Enable email verification for production
4. Set up custom domain (optional)

## 📚 Additional Documentation

- **BACKEND_IMPLEMENTATION_PLAN.md** - Detailed implementation guide
- **docs/architecture.md** - System architecture
- **SQL Files** - Database setup scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes.

## 👥 Support

For questions or issues:
- Check the implementation plan in `BACKEND_IMPLEMENTATION_PLAN.md`
- Review Supabase documentation: https://supabase.com/docs
- Check React Query docs: https://tanstack.com/query/latest

---

**Built with ❤️ for sustainable living in Bangladesh**

