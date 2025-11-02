import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RecipeData {
  constructor() {
    this.recipes = [];
    this.loaded = false;
  }

  async loadRecipes() {
    if (this.loaded) {
      return;
    }

    return new Promise((resolve, reject) => {
      const results = [];
      
      const csvPath = path.join(__dirname, '../data/RAW_recipes.csv');
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Parse the string arrays from CSV
            const recipe = {
              id: parseInt(row.id),
              name: row.name,
              minutes: parseInt(row.minutes) || 0,
              n_steps: parseInt(row.n_steps) || 0,
              steps: this.parseArray(row.steps),
              description: row.description || '',
              ingredients: this.parseArray(row.ingredients),
              n_ingredients: parseInt(row.n_ingredients) || 0,
              tags: this.parseArray(row.tags),
              nutrition: this.parseArray(row.nutrition)
            };
            results.push(recipe);
          } catch (error) {
            console.error('Error parsing recipe:', error);
          }
        })
        .on('end', () => {
          console.log(`Loaded ${results.length} recipes`);
          this.recipes = results;
          this.loaded = true;
          resolve();
        })
        .on('error', (error) => {
          console.error('Error loading recipes:', error);
          reject(error);
        });
    });
  }

  parseArray(str) {
    try {
      // Parse arrays like "['item1', 'item2']"
      return JSON.parse(str.replace(/'/g, '"'));
    } catch (error) {
      return [];
    }
  }

  searchRecipes(filters = {}) {
    const { ingredients, max_time, max_ingredients, exclude_ingredients, use_only_saved } = filters;
    
    // Ensure recipes are loaded
    if (!this.loaded || this.recipes.length === 0) {
      console.warn('Recipes not loaded yet');
      return [];
    }
    
    let results = [...this.recipes];

    // Filter by ingredients
    if (ingredients && ingredients.trim()) {
      const searchTerms = Array.isArray(ingredients) 
        ? ingredients 
        : ingredients.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
      
      if (searchTerms.length > 0) {
        if (use_only_saved === 'true' || use_only_saved === true) {
          // Strict mode: Recipe must primarily use ONLY the saved ingredients
          // Find recipes where all recipe ingredients are found in the search terms (saved ingredients)
          results = results.filter(recipe => {
            if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
              return false;
            }
            
            // Get all recipe ingredients as lowercase terms
            const recipeIngTerms = recipe.ingredients.map(ing => {
              // Extract base ingredient name (remove quantities, units, etc.)
              return ing.toLowerCase().replace(/[\d.,\/\s]+(cup|tbsp|tsp|oz|lb|gram|kg|ml|l|clove|piece|slice|can|package|packet|bunch|head|stalk|teaspoon|tablespoon|ounce|pound|gram|kilogram|milliliter|liter|whole|diced|chopped|sliced|minced|grated|peeled|seeded|stemmed|trimmed|halved|quartered|crushed|ground|powder|fresh|frozen|dried|canned|jar|bottle|box|bag|strip|sprig|leaf|leaves)/g, '').trim();
            }).filter(Boolean);
            
            // Check if ALL recipe ingredients are found in saved ingredients
            // Allow some flexibility for common words
            const commonWords = ['salt', 'pepper', 'water', 'oil', 'butter', 'sugar', 'flour'];
            const allFound = recipeIngTerms.every(recipeIng => {
              // Skip very short or common words
              if (recipeIng.length < 3 || commonWords.includes(recipeIng)) {
                return true;
              }
              // Check if this recipe ingredient matches any saved ingredient
              return searchTerms.some(savedIng => {
                const savedIngClean = savedIng.toLowerCase();
                // Check for exact match or substring match (saved ingredient contains recipe ingredient or vice versa)
                return recipeIng.includes(savedIngClean) || savedIngClean.includes(recipeIng) || 
                       recipeIng === savedIngClean || savedIngClean === recipeIng;
              });
            });
            
            // Also require that at least some saved ingredients are actually used
            const hasMatches = recipeIngTerms.some(recipeIng => 
              searchTerms.some(savedIng => {
                const savedIngClean = savedIng.toLowerCase();
                return recipeIng.includes(savedIngClean) || savedIngClean.includes(recipeIng) || 
                       recipeIng === savedIngClean || savedIngClean === recipeIng;
              })
            );
            
            return allFound && hasMatches;
          });
        } else {
          // Normal mode: Recipe contains ANY of the search terms
          results = results.filter(recipe => {
            if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
              return false;
            }
            const recipeIngredients = recipe.ingredients.join(' ').toLowerCase();
            return searchTerms.some(term => recipeIngredients.includes(term));
          });
        }
      }
    }

    // Filter by max time
    if (max_time) {
      const maxTime = parseInt(max_time);
      results = results.filter(recipe => recipe.minutes <= maxTime);
    }

    // Filter by max ingredients
    if (max_ingredients) {
      const maxIng = parseInt(max_ingredients);
      results = results.filter(recipe => recipe.n_ingredients <= maxIng);
    }

    // Exclude ingredients
    if (exclude_ingredients) {
      const excludeList = Array.isArray(exclude_ingredients)
        ? exclude_ingredients
        : exclude_ingredients.split(',').map(i => i.trim().toLowerCase());
      
      results = results.filter(recipe => {
        const recipeIngredients = recipe.ingredients.join(' ').toLowerCase();
        return !excludeList.some(excluded => recipeIngredients.includes(excluded));
      });
    }

    return results;
  }

  getRecipeById(id) {
    return this.recipes.find(recipe => recipe.id === parseInt(id));
  }

  getAllRecipes() {
    return this.recipes;
  }
}

export default new RecipeData();

