import { ProxyHandler } from './seo/proxy-handler';
import axios from 'axios';

export interface AiOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  systemPrompt?: string;
  provider?: string;
  isJson?: boolean;
}

/**
 * 🪐 GEMINI ULTRA PROVIDER (STABLE FALLBACK)
 */
class GeminiUltraProvider {
  private config: { apiKeys: string[]; currentKeyIndex: number };

  constructor() {
    this.config = {
      apiKeys: [],
      currentKeyIndex: 0
    };
  }

  private getBaseUrl(): string {
    return process.env.LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  private getApiKey(): string {
    if (this.config.apiKeys.length === 0) {
      const rawKeys = process.env.GOOGLE_API_KEY || process.env.LLM_API_KEY || '';
      const keysArray = rawKeys.split(',').map(k => k.trim().replace(/"/g, '')).filter(Boolean);
      this.config.apiKeys = keysArray;
      if (keysArray.length > 0) {
        console.log(`📡 [GEMINI] Lazy-loaded ${keysArray.length} API keys.`);
      }
    }

    if (this.config.apiKeys.length === 0) {
      console.warn('⚠️ [GEMINI] No API keys found in environment variables!');
      return '';
    }
    return this.config.apiKeys[this.config.currentKeyIndex % this.config.apiKeys.length];
  }

  private rotateKey() {
    if (this.config.apiKeys.length > 1) {
      this.config.currentKeyIndex++;
      console.log(`🔄 [GEMINI] Switched to API Key #${this.config.currentKeyIndex % this.config.apiKeys.length}`);
    }
  }

  async generate(prompt: string, options: AiOptions = {}, retryCount = 0): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) return this.getFallbackContent();

    try {
      let model = options.model || process.env.LLM_MODEL || 'gemini-2.0-flash';
      if (model.includes('deepseek') || model.includes('gpt') || model.includes('llama') || model.includes('mistral') || model.includes('claude')) {
        model = process.env.LLM_MODEL || 'gemini-2.0-flash';
      }
      const url = `${this.getBaseUrl()}/models/${model}:generateContent?key=${apiKey}`;
      
      console.log(`📡 [GEMINI] Calling API: ${model}`);

      const response = await axios.post(url, {
        contents: [{ parts: [{ text: `${options.systemPrompt || ''}\n\n${prompt}` }] }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.max_tokens || 4000,
        }
      }, { timeout: 120000 });

      if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      }
      
      console.warn(`⚠️ [GEMINI] Unexpected response format:`, JSON.stringify(response.data));
      return this.getFallbackContent();
    } catch (error: any) {
      const errorData = error.response?.data?.error;
      const errMsg = errorData?.message || error.message || "";
      
      if (errMsg.toLowerCase().includes("depleted") || errMsg.toLowerCase().includes("credit") || errMsg.toLowerCase().includes("billing")) {
        console.warn(`⚠️ [GEMINI] Prepayment credits depleted/billing issue. Skipping retries.`);
        return this.getFallbackContent();
      }

      if (error.response?.status === 429 && retryCount < 1) {
        console.warn(`⚠️ [GEMINI] Rate limit hit (429).`);
        if (this.config.apiKeys.length > 1) {
          this.rotateKey();
          return this.generate(prompt, options, retryCount + 1);
        }
        console.warn('🕒 [GEMINI] Only 1 key available. Waiting 5s before retry...');
        await new Promise(r => setTimeout(r, 5000));
        return this.generate(prompt, options, retryCount + 1);
      }
      console.error('❌ [GEMINI] Generation failed:', errMsg);
      return this.getFallbackContent();
    }
  }

  private getFallbackContent(): string {
    return `İstanbul'un en seçkin escort hizmetleri ağı. Profesyonel hizmet, gerçek profiller ve %100 gizlilik garantisi.`;
  }
}

const geminiAI = new GeminiUltraProvider();

/**
 * 🤖 OPENAI PROVIDER (SECONDARY FALLBACK)
 */
class OpenAIProvider {
  private apiKey: string = '';

  private getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = process.env.OPENAI_API_KEY || '';
      if (this.apiKey) console.log('📡 [OPENAI] Lazy-loaded API key.');
    }
    return this.apiKey;
  }

  async generate(prompt: string, options: AiOptions = {}): Promise<string> {
    const key = this.getApiKey();
    if (!key) throw new Error('OpenAI API key is not configured.');

    try {
      let model = options.model || 'gpt-4o-mini';
      if (model.includes('deepseek') || model.includes('gemini') || model.includes('llama') || model.includes('mistral') || model.includes('claude')) {
        model = 'gpt-4o-mini';
      }
      console.log(`📡 [OPENAI] Calling API: ${model}`);
      
      const postData: any = {
        model: model,
        messages: [
          { role: 'system', content: options.systemPrompt || 'Sen bir Black Hat SEO dehasısın.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7
      };

      if (options.isJson) {
        postData.response_format = { type: "json_object" };
      }

      const response = await axios.post('https://api.openai.com/v1/chat/completions', postData, {
        headers: { 'Authorization': `Bearer ${key}` },
        timeout: 120000
      });

      if (response.data.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
      throw new Error('OpenAI returned empty response');
    } catch (error: any) {
      console.error('❌ [OPENAI] Error:', error.message);
      throw error;
    }
  }
}

/**
 * 🌊 DEEPSEEK PROVIDER (COST-EFFECTIVE REASONER)
 */
class DeepSeekProvider {
  private apiKey: string = '';

  private getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = process.env.DEEPSEEK_API_KEY || '';
      if (this.apiKey) console.log('📡 [DEEPSEEK] Lazy-loaded API key.');
    }
    return this.apiKey;
  }

  private getBaseUrl(): string {
    return process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  }

  async generate(prompt: string, options: AiOptions = {}): Promise<string> {
    const key = this.getApiKey();
    if (!key) throw new Error('DeepSeek API key is not configured.');

    try {
      const model = options.model || process.env.DEEPSEEK_CHAT_MODEL || 'deepseek-chat';
      console.log(`📡 [DEEPSEEK] Calling API: ${model}`);
      
      const postData: any = {
        model: model,
        messages: [
          { role: 'system', content: options.systemPrompt || 'Sen bir SEO dehasısın.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: options.max_tokens || 4000
      };

      if (model !== 'deepseek-reasoner') {
        postData.temperature = options.temperature || 0.7;
      }

      if (options.isJson) {
        postData.response_format = { type: "json_object" };
      }

      const response = await axios.post(`${this.getBaseUrl()}/chat/completions`, postData, {
        headers: { 'Authorization': `Bearer ${key}` },
        timeout: 120000
      });

      if (response.data.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
      throw new Error('DeepSeek returned empty response');
    } catch (error: any) {
      console.error('❌ [DEEPSEEK] Error:', error.message);
      throw error;
    }
  }
}

/**
 * ⚡ GROQ PROVIDER (ULTRA-FAST INFERENCE)
 */
class GroqProvider {
  private apiKey: string = '';

  private getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = process.env.GROQ_API_KEY || '';
      if (this.apiKey) console.log('📡 [GROQ] Lazy-loaded API key.');
    }
    return this.apiKey;
  }

  async generate(prompt: string, options: AiOptions = {}): Promise<string> {
    const key = this.getApiKey();
    if (!key) throw new Error('Groq API key is not configured.');

    try {
      const model = options.model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
      console.log(`📡 [GROQ] Calling API: ${model}`);

      const postData: any = {
        model: model,
        messages: [
          { role: 'system', content: options.systemPrompt || 'Sen bir SEO dehasısın.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 4000
      };

      if (options.isJson) {
        postData.response_format = { type: "json_object" };
      }

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', postData, {
        headers: { 'Authorization': `Bearer ${key}` },
        timeout: 60000
      });

      if (response.data.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
      throw new Error('Groq returned empty response');
    } catch (error: any) {
      console.error('❌ [GROQ] Error:', error.message);
      throw error;
    }
  }
}

/**
 * 🔱 DRKCNAY HYDRA: OMNIAI ORCHESTRATOR (v3.0)
 * Intelligent multi-provider routing with Groq/DeepSeek balancing, self-correction, and fallback safety.
 */
class OmniAIOrchestrator {
  private providers: {
    gemini: GeminiUltraProvider;
    openai: OpenAIProvider;
    deepseek: DeepSeekProvider;
    groq: GroqProvider;
  };

  constructor() {
    this.providers = {
      gemini: new GeminiUltraProvider(),
      openai: new OpenAIProvider(),
      deepseek: new DeepSeekProvider(),
      groq: new GroqProvider()
    };
  }

  async generate(prompt: string, options: AiOptions = {}): Promise<string> {
    const isJsonTask = (options.systemPrompt?.toLowerCase().includes('json') || false) || 
                       (prompt.substring(0, 500).toLowerCase().includes('json'));
    const isLongForm = options.max_tokens && options.max_tokens > 4000;

    // Define the ideal provider order based on task type:
    let order: string[] = [];
    if (options.provider) {
      order = [options.provider];
    } else if (isLongForm) {
      order = ['gemini', 'openai', 'deepseek', 'groq'];
    } else if (isJsonTask) {
      order = ['groq', 'deepseek', 'openai', 'gemini'];
    } else {
      order = ['deepseek', 'openai', 'gemini', 'groq'];
    }

    // Filter order to only providers that actually have keys configured
    const configuredOrder = order.filter(provider => {
      if (provider === 'gemini') {
        const rawKeys = process.env.GOOGLE_API_KEY || process.env.LLM_API_KEY || '';
        return !!rawKeys.split(',').map(k => k.trim()).filter(Boolean).length;
      }
      if (provider === 'openai') {
        return !!process.env.OPENAI_API_KEY;
      }
      if (provider === 'deepseek') {
        return !!process.env.DEEPSEEK_API_KEY;
      }
      if (provider === 'groq') {
        return !!process.env.GROQ_API_KEY;
      }
      return false;
    });

    if (configuredOrder.length === 0) {
      console.warn('⚠️ [OMNIAI] No configured API keys found! Falling back to Gemini.');
      configuredOrder.push('gemini');
    }

    let lastError: any = null;
    for (const providerName of configuredOrder) {
      console.log(`📡 [OMNIAI] Attempting generation with provider: ${providerName} (isJson=${isJsonTask}, isLong=${isLongForm})`);
      const provider = this.providers[providerName as keyof typeof this.providers];
      
      try {
        let result = await provider.generate(prompt, { ...options, isJson: isJsonTask, provider: providerName });
        console.log(`[OMNIAI DEBUG] Raw response from ${providerName} (length: ${result.length}):`, result.substring(0, 300) + "...");

        // If provider fell back internally to returning the generic content, treat as failure to trigger next provider
        if (result === `İstanbul'un en seçkin escort hizmetleri ağı. Profesyonel hizmet, gerçek profiller ve %100 gizlilik garantisi.`) {
          throw new Error('Provider returned fallback content');
        }

        // If JSON is required, validate it
        if (isJsonTask && !this.isValidJson(result)) {
          try {
            const clean = result.includes('```json') ? result.split('```json')[1].split('```')[0].trim() : result;
            JSON.parse(clean);
          } catch (jsonErr: any) {
            console.warn(`[OMNIAI DEBUG] JSON Parse Error:`, jsonErr.message);
          }
          console.warn(`⚠️ [OMNIAI] ${providerName} returned invalid JSON. Trying self-correction...`);
          try {
            const corrected = await provider.generate(
              `HATA: Geçersiz JSON ürettin. Lütfen şu içeriği düzelt ve SADECE geçerli JSON döndür: ${result}`, 
              { ...options, systemPrompt: 'JSON REPAIR MODE: SADECE JSON DÖNDÜR.', provider: providerName }
            );
            if (this.isValidJson(corrected)) {
              result = corrected;
            } else {
              throw new Error('Self-correction failed to produce valid JSON');
            }
          } catch (err) {
            console.warn(`⚠️ [OMNIAI] Self-correction on ${providerName} failed:`, (err as any).message);
            throw err;
          }
        }

        return result;
      } catch (err: any) {
        console.error(`❌ [OMNIAI] Provider ${providerName} failed:`, err.message || err);
        lastError = err;
      }
    }

    console.error('❌ [OMNIAI] All configured providers failed. Returning fallback.');
    return `İstanbul'un en seçkin escort hizmetleri ağı. Profesyonel hizmet, gerçek profiller ve %100 gizlilik garantisi.`;
  }

  private isValidJson(str: string): boolean {
    try {
      const clean = str.includes('```json') ? str.split('```json')[1].split('```')[0].trim() : str;
      JSON.parse(clean);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const omniAI = new OmniAIOrchestrator();
