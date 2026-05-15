import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  
  try {
    const response = await fetch(`${baseUrl}/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

listModels();
