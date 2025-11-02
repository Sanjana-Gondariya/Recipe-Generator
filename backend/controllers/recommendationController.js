import excelStorage from '../models/excelStorage.js';
import recipeData from '../models/recipes.js';
import OpenAI from 'openai';

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
};

class RecommendationController {
  async getRecommendations(req, res) {
    try {
      const userId = req.user.userId;

      // Get user's bookmarked recipes
      const bookmarks = await excelStorage.getBookmarks(userId);

      // Get user preferences
      const preferences = await excelStorage.getUserPreferences(userId) || {};

      // If no bookmarks, return error or suggest popular recipes
      if (bookmarks.length === 0) {
        const allRecipes = recipeData.getAllRecipes();
        const popularRecipes = allRecipes.slice(0, 5).map(recipe => ({
          title: recipe.name,
          description: recipe.description,
          recommended_ingredients: recipe.ingredients,
          cooking_time: recipe.minutes,
          reason_for_recommendation: 'Popular recipe from our collection'
        }));
        return res.json({
          message: 'Please bookmark some recipes to get personalized recommendations',
          recommendations: popularRecipes
        });
      }

      // Enrich bookmarks with recipe data
      const bookmarkedRecipes = bookmarks.map(bookmark => {
        const recipe = recipeData.getRecipeById(bookmark.recipe_id);
        return recipe ? {
          title: recipe.name,
          name: recipe.name,
          cuisine_type: recipe.tags ? recipe.tags.join(', ') : '',
          dietary_tags: recipe.tags || [],
          ingredients: recipe.ingredients || []
        } : null;
      }).filter(Boolean);

      // Prepare context for AI
      const recipeSummaries = bookmarkedRecipes.map(r => ({
        title: r.title,
        cuisine: r.cuisine_type,
        dietary: r.dietary_tags,
        ingredients: r.ingredients
      }));

      const openai = getOpenAI();
      
      // If OpenAI is not configured, return fallback recommendations
      if (!openai) {
        const fallbackRecipes = bookmarkedRecipes.slice(0, 5).map(r => {
          const recipe = recipeData.getRecipeById(r.id || r.title);
          return recipe ? {
            title: recipe.name,
            description: recipe.description,
            recommended_ingredients: recipe.ingredients,
            cooking_time: recipe.minutes,
            reason_for_recommendation: 'Similar to your bookmarked recipes'
          } : null;
        }).filter(Boolean);
        
        return res.json({
          message: 'AI recommendations require OpenAI API key. Showing similar recipes.',
          recommendations: fallbackRecipes
        });
      }

      const aiPrompt = `Based on these bookmarked recipes, suggest 5 similar recipes that the user might enjoy:

Bookmarked recipes:
${JSON.stringify(recipeSummaries, null, 2)}

User preferences:
Dietary restrictions: ${preferences.dietary_restrictions || 'None'}
Allergies: ${preferences.allergies || 'None'}
Cuisine preferences: ${preferences.cuisine_preferences || 'Any'}
Goals: ${preferences.goals || 'None'}

Return a JSON array with recipe suggestions. Each suggestion should have: title, description, recommended_ingredients (array), cooking_time (minutes), and reason_for_recommendation.`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful recipe recommendation assistant. Always return valid JSON arrays."
          },
          {
            role: "user",
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiRecommendations = JSON.parse(completion.choices[0].message.content);

      res.json({
        based_on: bookmarkedRecipes.length,
        recommendations: aiRecommendations
      });
    } catch (error) {
      console.error('Get recommendations error:', error);
      
      // Fallback to bookmarked recipes if AI fails
      try {
        const bookmarks = await excelStorage.getBookmarks(req.user.userId);
        const fallbackRecipes = bookmarks.slice(0, 5).map(bookmark => {
          const recipe = recipeData.getRecipeById(bookmark.recipe_id);
          return recipe ? {
            title: recipe.name,
            description: recipe.description,
            recommended_ingredients: recipe.ingredients,
            cooking_time: recipe.minutes
          } : null;
        }).filter(Boolean);

        res.json({
          message: 'AI recommendations temporarily unavailable, showing bookmarked recipes',
          recommendations: fallbackRecipes
        });
      } catch (fallbackError) {
        res.status(500).json({ error: 'Failed to get recommendations' });
      }
    }
  }
}

export default new RecommendationController();

