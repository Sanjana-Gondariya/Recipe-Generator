# 🚀 Quick Start Guide for VS Code

## For Your Friend - Step by Step Instructions

### Prerequisites Check ✅
Make sure you have these installed:
- **Node.js** (v14+) - Download from [nodejs.org](https://nodejs.org/)
- **PostgreSQL** - Download from [postgresql.org](https://www.postgresql.org/download/)
- **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com/)

---

## Step 1: Clone the Repository 🌐

1. Open **VS Code**
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Git: Clone" and select it
4. Paste this URL: `https://github.com/Sanjana-Gondariya/Recipe-Generator.git`
5. Choose where to save it
6. Click "Open" when asked

---

## Step 2: Setup Database 🗄️

### On Windows:
1. Install PostgreSQL from the website (it includes pgAdmin)
2. Open **pgAdmin** (comes with PostgreSQL)
3. Create a new database called `food_waste_saver`

### Or via Command Line:
Open **Terminal** in VS Code: `Ctrl+` ` (backtick) or `View → Terminal`

```bash
# Create database and user
psql postgres

# In PostgreSQL prompt, run:
CREATE USER recipe_user WITH PASSWORD 'recipe123';
CREATE DATABASE food_waste_saver OWNER recipe_user;
GRANT ALL ON SCHEMA public TO recipe_user;
\q
```

---

## Step 3: Configure Environment ⚙️

1. In VS Code, open the `backend` folder
2. Look for `env.example` file
3. **Copy it** and rename to `.env`
4. Open `.env` and edit these lines:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_waste_saver
DB_USER=recipe_user
DB_PASSWORD=recipe123

JWT_SECRET=recipe-generator-super-secret-jwt-key-2024

OPENAI_API_KEY=your-openai-api-key-here

PORT=5001

NODE_ENV=development
```

**Important:** The PORT is set to **5001** (not 5000) to avoid conflicts!

---

## Step 4: Install Dependencies 📦

In the **Terminal** (make sure you're in the project root):

```bash
npm run install:all
```

This will install everything needed (takes a few minutes)

---

## Step 5: Setup Database Tables 🗃️

```bash
cd backend
node migrations/init-db.js
```

You should see: "Database initialization completed" ✅

---

## Step 6: Run the Application 🎉

### Option A: Run Everything Together (EASIEST!)

In **Terminal** from the project root:
```bash
npm run dev
```

This starts both frontend and backend automatically!

### Option B: Run Separately (if Option A doesn't work)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend** (open a new terminal in VS Code):
```bash
cd frontend
npm start
```

---

## Step 7: Open in Browser 🌐

Once running, open your browser and go to:
**http://localhost:3000**

You should see the Food Waste Saver app! 🎉

---

## Common Issues & Fixes 🔧

### "Port 5000 already in use"
✅ **Fixed!** We're using port 5001 now.

### "PostgreSQL connection error"
- Make sure PostgreSQL is running
- Check your `.env` file has correct credentials
- Restart PostgreSQL service

### "Cannot find module 'pg'"
Run: `cd backend && npm install`

### "EADDRINUSE: port 3000"
React will automatically use port 3001, just open `http://localhost:3001`

### VS Code Terminal Shortcuts
- Open Terminal: `` Ctrl+` `` (backtick)
- New Terminal: `Ctrl+Shift+` (backtick)
- Split Terminal: `Ctrl+\`

---

## Need OpenAI API Key? 🔑

For AI features, you need an API key:

1. Visit [platform.openai.com](https://platform.openai.com/api-keys)
2. Sign up (free tier gives $5 credit!)
3. Create API key
4. Add it to `backend/.env` file

**For Students:** Check `OPENAI_API_KEY_INFO.md` for free options! 🎓

---

## Success! 🎊

If everything worked:
- ✅ Backend running on http://localhost:5001
- ✅ Frontend running on http://localhost:3000
- ✅ Database connected
- ✅ Recipe Generator working!

---

## Getting Help 📞

If stuck, check:
1. Terminal for error messages
2. VS Code Problems panel (`Ctrl+Shift+M`)
3. `SETUP.md` for detailed instructions
4. Ask the team!

**Happy Coding!** 🚀

---

## VS Code Extension Recommendations 📦

Install these extensions for better experience:

1. **ES7+ React/Redux/React-Native snippets** - Better React coding
2. **PostgreSQL** - Database management in VS Code
3. **GitLens** - Better Git integration
4. **Prettier** - Auto code formatting
5. **ESLint** - Code quality checks

---

## Keyboard Shortcuts Cheat Sheet ⌨️

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Open Terminal | `Ctrl + `` | `Cmd + `` |
| New Terminal | `Ctrl + Shift + `` | `Cmd + Shift + `` |
| Command Palette | `Ctrl + Shift + P` | `Cmd + Shift + P` |
| Format Document | `Shift + Alt + F` | `Shift + Option + F` |
| Search Files | `Ctrl + P` | `Cmd + P` |
| Split Terminal | `Ctrl + \` | `Cmd + \` |
| Close Terminal | Type `exit` | Type `exit` |

