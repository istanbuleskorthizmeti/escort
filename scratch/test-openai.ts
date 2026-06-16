import axios from 'axios';

async function main() {
  const apiKey = "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";
  const url = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await axios.post(url, {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello in Turkish" }]
    }, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    console.log("Success! Response:", response.data.choices?.[0]?.message?.content);
  } catch (error: any) {
    console.error("Failed:", error.response?.data || error.message);
  }
}

main();
