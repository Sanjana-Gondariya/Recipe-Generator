import excelStorage from '../models/excelStorage.js';
import OpenAI from 'openai';

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
};

class AIRecipeController {
  async generateRecipesFromIngredients(req, res) {
    try {
      const userId = req.user.userId;
      const { useOnlySaved = false, additionalIngredients = '' } = req.body;

      // Get user's saved ingredients
      const savedIngredients = await excelStorage.getUserIngredients(userId);
      const savedIngredientList = savedIngredients.map(item => item.ingredient);

      if (useOnlySaved && savedIngredientList.length === 0) {
        return res.status(400).json({ 
          error: 'No saved ingredients found. Please add ingredients first.' 
        });
      }

      // Combine saved and additional ingredients
      let allIngredients = [...savedIngredientList];
      if (additionalIngredients && additionalIngredients.trim()) {
        const additional = additionalIngredients.split(',').map(i => i.trim()).filter(Boolean);
        allIngredients = [...new Set([...allIngredients, ...additional])];
      }

      if (allIngredients.length === 0) {
        return res.status(400).json({ 
          error: 'No ingredients provided. Please add ingredients or provide additional ingredients.' 
        });
      }

      // Get OpenAI client
      const openai = getOpenAI();
      if (!openai) {
        return res.status(503).json({ 
          error: 'AI recipe generation requires OpenAI API key',
          message: 'Please configure OPENAI_API_KEY to use this feature'
        });
      }

      // Get user preferences for context
      const preferences = await excelStorage.getUserPreferences(userId) || {};

      const aiPrompt = `Generate 5 creative and delicious recipes using these ingredients:
${allIngredients.join(', ')}

${useOnlySaved ? '(IMPORTANT: Use ONLY these ingredients - do not suggest additional ingredients the user does not have)' : '(You may suggest a few additional common ingredients if needed, but focus on the provided ingredients)'}

User preferences:
- Dietary restrictions: ${preferences.dietary_restrictions || 'None'}
- Allergies: ${preferences.allergies || 'None'}
- Cuisine preferences: ${preferences.cuisine_preferences || 'Any'}

For each recipe, provide:
1. title (creative name)
2. description (brief description of the dish)
3. ingredients (array of all ingredients needed)
4. instructions (array of step-by-step instructions)
5. cooking_time or minutes (in minutes)
6. servings (number of servings)
7. difficulty (easy, medium, or hard)
8. cuisine_type (e.g., Italian, Asian, American)
9. tags (optional array of tags like dietary, cuisine, meal type)
10. tips (optional cooking tips)

Return as a JSON array of recipe objects.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a creative chef and recipe generator. Always return valid JSON arrays of recipe objects. Make recipes practical and achievable."
          },
          {
            role: "user",
            content: aiPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      let recipes;
      try {
        const content = completion.choices[0].message.content;
        // Try to parse JSON
        recipes = JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from markdown code blocks or plain text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recipes = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid response format from AI');
        }
      }

      // Ensure it's an array
      if (!Array.isArray(recipes)) {
        recipes = [recipes];
      }

      // Add generated timestamp and source
      const enrichedRecipes = recipes.map((recipe, index) => ({
        ...recipe,
        id: `ai-generated-${Date.now()}-${index}`,
        name: recipe.title || recipe.name,
        n_ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0,
        n_steps: Array.isArray(recipe.instructions) ? recipe.instructions.length : 0,
        minutes: recipe.cooking_time || recipe.minutes || 30,
        steps: recipe.instructions || [],
        source: 'ai-generated',
        generated_from: allIngredients,
        use_only_saved: useOnlySaved
      }));

      res.json({
        count: enrichedRecipes.length,
        recipes: enrichedRecipes,
        ingredients_used: allIngredients,
        use_only_saved: useOnlySaved
      });
    } catch (error) {
      console.error('Generate AI recipes error:', error);
      res.status(500).json({ 
        error: 'Failed to generate AI recipes',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default new AIRecipeController();
