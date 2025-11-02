# OpenAI API Key for Students - Free Options

## 🎓 Free OpenAI API Keys for Students

### Option 1: GitHub Education Pack (Recommended)
**GitHub Student Developer Pack** includes free OpenAI credits!

1. **Sign up for GitHub Student Pack:**
   - Go to: https://education.github.com/pack
   - Verify your student status with a valid student email
   - You'll get $50-200 in OpenAI credits (varies by promotion)

2. **Get OpenAI API Key:**
   - Visit: https://platform.openai.com/api-keys
   - Sign up with your GitHub account
   - Create a new API key
   - Add payment method (but credits from GitHub pack will be used first)

### Option 2: OpenAI Free Tier (Limited)
- **New users get $5 free credit** when you sign up
- Visit: https://platform.openai.com/signup
- This credit usually expires after 3 months
- Good for testing but limited for production

### Option 3: Azure OpenAI for Students
- Some universities have Azure for Students
- Check if your school provides Azure credits
- Azure OpenAI is compatible with OpenAI API

### Option 4: Alternative Free AI Services
If OpenAI doesn't work for you, here are alternatives:

1. **Hugging Face Inference API** (Free tier available)
   - Some models are free
   - Visit: https://huggingface.co/inference-api

2. **Google Cloud Natural Language API**
   - Free tier: 5,000 requests/month
   - Visit: https://cloud.google.com/natural-language

3. **Cohere API** (Free tier for students)
   - Visit: https://cohere.com/

## 📝 How to Add Your API Key to This Project

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Create or edit `.env` file:**
   ```bash
   # If .env doesn't exist, copy from env.example
   cp env.example .env
   ```

3. **Add your OpenAI API key:**
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

4. **Restart the backend server:**
   ```bash
   npm start
   ```

## ⚠️ Important Notes

- **Never commit your API key** to GitHub or share it publicly
- The `.env` file is already in `.gitignore` to protect your keys
- Free tier credits can run out quickly, monitor your usage at: https://platform.openai.com/usage
- API costs are per token used (input + output)
- For recipe generation, expect ~500-2000 tokens per request (~$0.002-0.008)

## 💡 Tips to Reduce API Costs

1. Use shorter prompts when possible
2. Cache common responses
3. Use the fallback substitutions for common ingredients (already implemented)
4. Limit AI recipe generation to logged-in users only

## 🔗 Useful Links

- OpenAI Pricing: https://openai.com/pricing
- OpenAI Dashboard: https://platform.openai.com/account/usage
- GitHub Student Pack: https://education.github.com/pack
- OpenAI Documentation: https://platform.openai.com/docs

