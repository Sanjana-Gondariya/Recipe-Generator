# Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

## Database Setup

1. Install PostgreSQL if you haven't already
   - MacOS: `brew install postgresql`
   - Windows: Download from https://www.postgresql.org/download/
   - Linux: `sudo apt-get install postgresql`

2. Start PostgreSQL service
   - MacOS/Linux: `brew services start postgresql` or `sudo service postgresql start`
   - Windows: PostgreSQL will run as a service after installation

3. Create a PostgreSQL user and database
   ```bash
   psql postgres
   ```
   
   Then in the PostgreSQL prompt:
   ```sql
   CREATE USER your_db_user WITH PASSWORD 'your_password';
   CREATE DATABASE food_waste_saver;
   GRANT ALL PRIVILEGES ON DATABASE food_waste_saver TO your_db_user;
   \q
   ```

## Environment Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file:
   ```bash
   cp env.example .env
   ```

3. Edit the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=food_waste_saver
   DB_USER=your_db_user
   DB_PASSWORD=your_password

   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   OPENAI_API_KEY=your-openai-api-key

   PORT=5000
   NODE_ENV=development
   ```

4. Get an OpenAI API key:
   - Visit https://platform.openai.com/api-keys
   - Sign up or log in
   - Create a new API key
   - Add it to your `.env` file

## Installation

1. Navigate to the project root:
   ```bash
   cd /path/to/food-waste-saver
   ```

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

   This will install dependencies for:
   - Root project
   - Backend
   - Frontend

## Database Initialization

1. Initialize the database schema:
   ```bash
   cd backend
   node migrations/init-db.js
   ```

   This will:
   - Create the database if it doesn't exist
   - Set up all tables and indexes
   - Insert sample recipe data

## Running the Application

### Option 1: Run both frontend and backend together (Recommended for development)

From the project root:
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Option 2: Run separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Testing the Application

1. Open your browser and navigate to: http://localhost:3000

2. Test the application:
   - Sign up for a new account
   - Complete the onboarding process
   - Search for recipes
   - Bookmark some recipes
   - Get AI recommendations
   - Try ingredient substitutions

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `psql -l`
- Verify credentials in `.env` file
- Check that the database exists: `psql -U your_db_user -d food_waste_saver -c "SELECT 1;"`

### Port Already in Use

- Backend port 5000 in use: Change `PORT` in `backend/.env`
- Frontend port 3000 in use: The React app will prompt to use a different port

### OpenAI API Errors

- Verify your API key is correct
- Check you have credits in your OpenAI account
- Review OpenAI rate limits

### Dependency Issues

- Delete `node_modules` folders and `package-lock.json` files
- Run `npm run install:all` again
- Clear npm cache: `npm cache clean --force`

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Update database connection for production
3. Use a proper JWT secret
4. Deploy to services like:
   - Heroku
   - AWS
   - DigitalOcean
   - Railway

### Frontend

1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

3. Update `REACT_APP_API_URL` to point to your production backend

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## Support

For issues or questions, contact the development team:
- Riddhi Patel
- Armina Rahman
- Sanjana Gondariya
- Elizabeth Perry

