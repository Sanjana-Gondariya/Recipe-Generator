-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    dietary_restrictions TEXT[],
    allergies TEXT[],
    cooking_time_preference INTEGER,
    cuisine_preferences TEXT[],
    goals TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    ingredients JSONB NOT NULL,
    cooking_time INTEGER,
    servings INTEGER,
    difficulty VARCHAR(50),
    cuisine_type VARCHAR(100),
    dietary_tags TEXT[],
    image_url VARCHAR(500),
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);

-- Search History Table (for AI recommendations)
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ingredients TEXT[],
    filters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Substitution Queries Table
CREATE TABLE IF NOT EXISTS substitution_queries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    original_ingredient VARCHAR(255) NOT NULL,
    substitution_reason TEXT,
    ai_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_recipe_id ON bookmarks(recipe_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING GIN(ingredients);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_tags ON recipes USING GIN(dietary_tags);

-- Sample recipes data
INSERT INTO recipes (title, description, instructions, ingredients, cooking_time, servings, difficulty, cuisine_type, dietary_tags) VALUES
('Chicken Stir Fry', 'Quick and easy chicken stir fry with vegetables', 
'1. Heat oil in a large pan. 2. Add chicken and cook until browned. 3. Add vegetables and stir fry for 5 minutes. 4. Add sauce and simmer for 2 minutes.',
'["chicken breast", "bell pepper", "onion", "soy sauce", "garlic", "ginger"]',
25, 4, 'Easy', 'Asian', ARRAY['high-protein', 'gluten-free']),

('Vegetarian Pasta', 'Healthy pasta dish with vegetables', 
'1. Boil pasta according to package directions. 2. Sauté vegetables in olive oil. 3. Add tomato sauce and simmer. 4. Combine pasta with sauce.',
'["pasta", "tomato", "zucchini", "onion", "garlic", "olive oil", "tomato sauce"]',
30, 4, 'Easy', 'Italian', ARRAY['vegetarian']),

('Salmon with Roasted Vegetables', 'Oven-baked salmon with seasonal vegetables', 
'1. Preheat oven to 400°F. 2. Place salmon and vegetables on baking sheet. 3. Drizzle with olive oil and season. 4. Bake for 20 minutes.',
'["salmon fillet", "broccoli", "carrots", "olive oil", "lemon", "salt", "pepper"]',
25, 2, 'Easy', 'Mediterranean', ARRAY['high-protein', 'gluten-free', 'low-carb']),

('Beef Tacos', 'Classic beef tacos with fresh toppings', 
'1. Brown ground beef in a pan. 2. Add taco seasoning and water. 3. Simmer for 5 minutes. 4. Serve in tortillas with toppings.',
'["ground beef", "taco shells", "lettuce", "tomato", "cheese", "onion", "taco seasoning"]',
20, 4, 'Easy', 'Mexican', ARRAY['high-protein']),

('Greek Salad', 'Fresh Mediterranean salad', 
'1. Chop vegetables into bite-sized pieces. 2. Mix olive oil, lemon juice, and herbs. 3. Toss vegetables with dressing. 4. Top with feta cheese.',
'["cucumber", "tomato", "red onion", "feta cheese", "olives", "olive oil", "lemon juice"]',
15, 4, 'Easy', 'Mediterranean', ARRAY['vegetarian', 'gluten-free', 'low-carb']);

