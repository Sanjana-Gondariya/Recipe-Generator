# Food Waste Saver

An innovative application designed to help users reduce food waste by efficiently utilizing available pantry ingredients. The app generates personalized recipe recommendations using AI, provides filtering options, and includes bookmarking functionality.

## Team Members
- Riddhi Patel
- Armina Rahman
- Sanjana Gondariya
- Elizabeth Perry

## Features

### 🔐 Authentication
- Secure login and signup system
- User account management
- JWT-based authentication

### 🌟 Onboarding
- Personalized user goals and preferences
- Customized experience based on user expectations

### 📚 Bookmarks
- Save favorite recipes
- Access bookmarks across sessions
- Personalized to each user account

### 🤖 AI Recommendations
- Personalized recipe suggestions based on bookmarked recipes
- Encourages exploration of new meal options

### 🔍 Advanced Filtering
- Filter by cooking time
- Filter by ingredient count
- Dietary restrictions and allergies
- Ingredient exclusions

### 🔄 Ingredient Substitutions
- AI-powered substitution suggestions
- Interactive Q&A interface
- Flexibility in recipe preparation

### 🔮 Future Enhancements
- Mobile application
- AI chatbot for recipe inquiries
- Photo upload for pantry items
- Nutritional value detection
- Goal-based meal planning

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- Modern CSS with responsive design

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- OpenAI API integration

## Quick Start 🚀

**New to the project?** Check out **[QUICK_START.md](QUICK_START.md)** for step-by-step VS Code setup instructions!

## Installation

For detailed setup instructions, see [SETUP.md](SETUP.md)

1. Clone the repository
2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
- Create `.env` file in `backend/` directory
- Add your database credentials and API keys

4. Run database migrations:
```bash
cd backend
node migrations/init-db.js
```

5. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Project Structure

```
food-waste-saver/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── migrations/
│   └── package.json
└── package.json
```

## Usage

1. Sign up for a new account or log in
2. Complete the onboarding process with your preferences
3. Input available ingredients to find matching recipes
4. Use filters to refine results
5. Bookmark your favorite recipes
6. Get AI-powered recommendations based on your preferences
7. Ask for ingredient substitutions when needed

## Contributing

This project is developed by the Food Waste Saver team.

## License

MIT License

