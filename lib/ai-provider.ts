import { ProxyHandler } from './seo/proxy-handler';
import axios from 'axios';

export interface AiOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  systemPrompt?: string;
  provider?: string;
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

  async generate(prompt: string, options: AiOptions = {}): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) return this.getFallbackContent();

    try {
      const model = options.model || process.env.LLM_MODEL || 'gemini-2.0-flash';
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
      if (error.response?.status === 429) {
        console.warn(`⚠️ [GEMINI] Rate limit hit (429).`);
        if (this.config.apiKeys.length > 1) {
          this.rotateKey();
          return this.generate(prompt, options);
        }
        console.warn('🕒 [GEMINI] Only 1 key available. Waiting 30s before retry...');
        await new Promise(r => setTimeout(r, 30000));
        return this.generate(prompt, options);
      }
      console.error('❌ [GEMINI] Generation failed:', error.message || error);
      return this.getFallbackContent();
    }
  }

  private getFallbackContent(): string {
    return `İstanbul'un en seçkin escort ajansı ağı. Profesyonel hizmet, gerçek profiller ve %100 gizlilik garantisi.`;
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
    if (!key) return geminiAI.generate(prompt, options);

    try {
      console.log(`📡 [OPENAI] Calling API: ${options.model || 'gpt-4o-mini'}`);
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: options.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: options.systemPrompt || 'Sen bir Black Hat SEO dehasısın.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7
      }, {
        headers: { 'Authorization': `Bearer ${key}` },
        timeout: 120000
      });

      if (response.data.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
      
      return geminiAI.generate(prompt, options);
    } catch (error: any) {
      console.error('❌ [OPENAI] Error:', error.message);
      return geminiAI.generate(prompt, options);
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
    if (!key) return geminiAI.generate(prompt, options);

    try {
      const model = options.model || process.env.DEEPSEEK_CHAT_MODEL || 'deepseek-chat';
      console.log(`📡 [DEEPSEEK] Calling API: ${model}`);
      
      const response = await axios.post(`${this.getBaseUrl()}/chat/completions`, {
        model: model,
        messages: [
          { role: 'system', content: options.systemPrompt || 'Sen bir SEO dehasısın.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7
      }, {
        headers: { 'Authorization': `Bearer ${key}` },
        timeout: 120000
      });

      return response.data.choices?.[0]?.message?.content || geminiAI.generate(prompt, options);
    } catch (error: any) {
      console.error('❌ [DEEPSEEK] Error:', error.message);
      return geminiAI.generate(prompt, options);
    }
  }
}

/**
 * 🔱 DRKCNAY HYDRA: OMNIAI ORCHESTRATOR (v2.0)
 * Intelligent multi-provider routing with self-correction and contextual logic.
 */

class OmniAIOrchestrator {
  private providers: { gemini: GeminiUltraProvider; openai: OpenAIProvider; deepseek: DeepSeekProvider };

  constructor() {
    this.providers = {
      gemini: new GeminiUltraProvider(),
      openai: new OpenAIProvider(),
      deepseek: new DeepSeekProvider()
    };
  }

  async generate(prompt: string, options: AiOptions = {}): Promise<string> {
    const isJsonTask = prompt.toLowerCase().includes('json') || options.systemPrompt?.toLowerCase().includes('json');
    const isLongForm = options.max_tokens && options.max_tokens > 4000;

    let primaryProvider = this.providers.deepseek;
    if (isJsonTask) primaryProvider = this.providers.openai as any;
    if (isLongForm) primaryProvider = this.providers.gemini as any;

    console.log(`📡 [OMNIAI] Routing request: isJson=${isJsonTask}, isLong=${isLongForm}, provider=${isLongForm ? 'gemini' : (isJsonTask ? 'openai' : 'deepseek')}`);

    try {
      let result = await (primaryProvider as any).generate(prompt, options);

      // 🛠️ SELF-CORRECTION: Validate JSON if required
      if (isJsonTask && !this.isValidJson(result)) {
        console.warn('⚠️ [OMNIAI] Invalid JSON detected. Attempting self-correction with Gemini...');
        result = await this.providers.gemini.generate(`Düzelt ve sadece geçerli JSON döndür: ${result}`, { systemPrompt: 'JSON FIXER MODE' });
      }

      return result;
    } catch (e) {
      console.error('❌ [OMNIAI] Primary provider failed. Falling back to Gemini...');
      return this.providers.gemini.generate(prompt, options);
    }
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
