import OpenAI from 'openai';

let openai = null;

function getOpenAI() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return null;
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

// Fallback substitution database for common ingredients
const fallbackSubstitutions = {
  'eggs': [
    {
      substitute_name: 'Applesauce',
      ratio: '1/4 cup per egg',
      reason: 'Works well in baking, adds moisture and binding properties',
      best_for: 'Baking, muffins, cakes'
    },
    {
      substitute_name: 'Flaxseed meal + water',
      ratio: '1 tbsp flaxseed + 3 tbsp water per egg',
      reason: 'Forms a gel-like consistency similar to eggs',
      best_for: 'Vegan baking, pancakes, waffles'
    },
    {
      substitute_name: 'Yogurt or buttermilk',
      ratio: '1/4 cup per egg',
      reason: 'Adds moisture and slight leavening',
      best_for: 'Baking, quick breads'
    }
  ],
  'butter': [
    {
      substitute_name: 'Coconut oil',
      ratio: '1:1',
      reason: 'Solid at room temperature like butter, works well in baking',
      best_for: 'Baking, cookies, cakes'
    },
    {
      substitute_name: 'Olive oil',
      ratio: '3/4 cup per 1 cup butter',
      reason: 'Adds moisture and flavor, lower saturated fat',
      best_for: 'Cooking, sautéing, some baking'
    },
    {
      substitute_name: 'Avocado',
      ratio: '1:1 (mashed)',
      reason: 'Creamy texture and healthy fats',
      best_for: 'Baking, brownies, some cookies'
    }
  ],
  'milk': [
    {
      substitute_name: 'Almond milk',
      ratio: '1:1',
      reason: 'Neutral flavor, works in most recipes',
      best_for: 'Baking, cooking, smoothies'
    },
    {
      substitute_name: 'Oat milk',
      ratio: '1:1',
      reason: 'Creamy texture similar to dairy milk',
      best_for: 'Baking, coffee, cereal'
    },
    {
      substitute_name: 'Coconut milk',
      ratio: '1:1',
      reason: 'Rich and creamy, adds tropical flavor',
      best_for: 'Curries, soups, some baking'
    }
  ]
};

class SubstitutionController {
  async getSubstitution(req, res) {
    try {
      const { ingredient, context, dietary_restrictions, cooking_method } = req.body;

      if (!ingredient || !ingredient.trim()) {
        return res.status(400).json({ error: 'Ingredient is required' });
      }

      const ingredientLower = ingredient.toLowerCase().trim();

      // Try fallback substitutions first for common ingredients
      if (fallbackSubstitutions[ingredientLower]) {
        return res.json({
          original: ingredient,
          substitutions: fallbackSubstitutions[ingredientLower]
        });
      }

      // Try to get OpenAI client
      const openai = getOpenAI();
      
      // If OpenAI is not available, return a generic response
      if (!openai) {
        return res.json({
          original: ingredient,
          substitutions: [
            {
              substitute_name: 'Check online substitution guides',
              ratio: 'Varies',
              reason: 'AI-powered substitutions require an API key. For common ingredients like eggs, butter, and milk, substitutions are available.',
              best_for: 'General cooking'
            }
          ],
          message: 'OpenAI API key not configured. Using basic substitutions.'
        });
      }

      const aiPrompt = `Suggest appropriate ingredient substitutions for cooking:

Original ingredient: ${ingredient}
Context/Dish: ${context || 'General cooking'}
Dietary restrictions: ${dietary_restrictions || 'None'}
Cooking method: ${cooking_method || 'Any'}

Provide 3-5 substitution options. For each substitution, include:
- substitute_name
- ratio (how much to use compared to original)
- reason (why this works)
- best_for (what dishes/methods it works best for)

Return as a JSON array of objects.`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a culinary expert specializing in ingredient substitutions. Always return valid JSON arrays."
          },
          {
            role: "user",
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      let substitutions;
      try {
        substitutions = JSON.parse(completion.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Try to extract JSON from the response
        const content = completion.choices[0].message.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          substitutions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid response format from AI');
        }
      }

      res.json({
        original: ingredient,
        substitutions: Array.isArray(substitutions) ? substitutions : [substitutions]
      });
    } catch (error) {
      console.error('Get substitution error:', error);
      
      // Return fallback for common ingredients even on error
      const ingredientLower = req.body?.ingredient?.toLowerCase().trim();
      if (ingredientLower && fallbackSubstitutions[ingredientLower]) {
        return res.json({
          original: req.body.ingredient,
          substitutions: fallbackSubstitutions[ingredientLower],
          message: 'AI unavailable, showing basic substitutions'
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to get substitution suggestions',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default new SubstitutionController();
