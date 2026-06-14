"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// lib/seo/telegraph.ts
var import_https = __toESM(require("https"));
var TelegraphService = class {
  apiBase = "api.telegra.ph";
  /**
   * Creates a post on Telegraph anonymously.
   */
  async createPost(post) {
    const content = this.formatContent(post.content);
    const payload = JSON.stringify({
      title: post.title,
      author_name: post.author_name,
      content,
      return_content: true
    });
    return new Promise((resolve) => {
      const req = import_https.default.request({
        hostname: this.apiBase,
        path: "/createPage",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            if (data.ok) {
              console.log(`\u2705 [TELEGRAPH] Created: ${data.result.url}`);
              resolve(data.result.url);
            } else {
              console.error(`\u274C [TELEGRAPH] Failed:`, data.error);
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });
      req.on("error", (e) => {
        console.error(`\u274C [TELEGRAPH] Network Error:`, e.message);
        resolve(null);
      });
      req.write(payload);
      req.end();
    });
  }
  /**
   * Telegraph requires a specific JSON-based content structure.
   * This helper converts simple HTML to that structure.
   */
  formatContent(html) {
    const nodes = [];
    const paragraphs = html.split(/<\/p>|<br\/?>/i);
    for (const p of paragraphs) {
      const text = p.replace(/<[^>]*>?/gm, "").trim();
      if (text) {
        nodes.push({ tag: "p", children: [text] });
      }
    }
    nodes.push({
      tag: "p",
      children: [
        {
          tag: "strong",
          children: [
            {
              tag: "a",
              attrs: { href: "https://istanbulescort.blog" },
              children: ["DORUKCAN AY ELITE ESCORT"]
            }
          ]
        }
      ]
    });
    return nodes;
  }
};
var telegraphService = new TelegraphService();

// lib/seo/github-engine.ts
var import_rest = require("@octokit/rest");

// lib/ai-provider.ts
var GeminiUltraProvider = class {
  config;
  constructor() {
    const rawKeys = process.env.GOOGLE_API_KEY || process.env.LLM_API_KEY || "";
    const keysArray = rawKeys.split(",").map((k) => k.trim().replace(/"/g, "")).filter(Boolean);
    this.config = {
      baseURL: process.env.LLM_BASE_URL || "https://generativelanguage.googleapis.com/v1",
      apiKeys: keysArray,
      currentKeyIndex: 0
    };
  }
  getApiKey() {
    if (this.config.apiKeys.length === 0) return "";
    return this.config.apiKeys[this.config.currentKeyIndex % this.config.apiKeys.length];
  }
  rotateKey() {
    if (this.config.apiKeys.length > 1) {
      this.config.currentKeyIndex++;
      console.log(`\u{1F504} [GEMINI] Switched to API Key #${this.config.currentKeyIndex % this.config.apiKeys.length}`);
    }
  }
  async generate(prompt, options = {}) {
    const apiKey = this.getApiKey();
    if (!apiKey) return this.getFallbackContent();
    try {
      const model = process.env.LLM_MODEL || "gemini-1.5-flash";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 24e4);
      const response = await fetch(`${this.config.baseURL}/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${options.systemPrompt || ""}

${prompt}` }] }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.max_tokens || 4e3
          }
        })
      });
      clearTimeout(timeoutId);
      if (response.status === 429) {
        this.rotateKey();
        await new Promise((r) => setTimeout(r, 5e3));
        return this.generate(prompt, options);
      }
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      return this.getFallbackContent();
    } catch (error) {
      return this.getFallbackContent();
    }
  }
  getFallbackContent() {
    return `\u0130stanbul'un en se\xE7kin escort ajans\u0131 a\u011F\u0131. Profesyonel hizmet, ger\xE7ek profiller ve %100 gizlilik garantisi.`;
  }
};
var geminiAI = new GeminiUltraProvider();
var OpenAIProvider = class {
  apiKey;
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }
  async generate(prompt, options = {}) {
    if (!this.apiKey) return geminiAI.generate(prompt, options);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 24e4);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: options.model || "gpt-4o-mini",
          messages: [
            { role: "system", content: options.systemPrompt || "Sen bir Black Hat SEO dehas\u0131s\u0131n." },
            { role: "user", content: prompt }
          ],
          temperature: options.temperature || 0.7
        })
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
      return geminiAI.generate(prompt, options);
    } catch (error) {
      return geminiAI.generate(prompt, options);
    }
  }
};
var openaiAI = new OpenAIProvider();
var DeepSeekProvider = class {
  apiKey;
  baseURL;
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || "";
    this.baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  }
  async generate(prompt, options = {}) {
    if (!this.apiKey) return geminiAI.generate(prompt, options);
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || process.env.DEEPSEEK_CHAT_MODEL || "deepseek-chat",
          messages: [
            { role: "system", content: options.systemPrompt || "Sen bir SEO dehas\u0131s\u0131n." },
            { role: "user", content: prompt }
          ],
          temperature: options.temperature || 0.7
        })
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || geminiAI.generate(prompt, options);
    } catch (error) {
      return geminiAI.generate(prompt, options);
    }
  }
};
var OmniAIOrchestrator = class {
  providers;
  constructor() {
    this.providers = {
      gemini: new GeminiUltraProvider(),
      openai: new OpenAIProvider(),
      deepseek: new DeepSeekProvider()
    };
  }
  /**
   * 🧠 SMART ROUTING: Choose the best model for the task.
   * - JSON/Structured data -> OpenAI (Higher compliance)
   * - Long form text -> Gemini (Massive context window)
   * - General creative -> DeepSeek (Cost/Efficiency)
   */
  async generate(prompt, options = {}) {
    const isJsonTask = prompt.toLowerCase().includes("json") || options.systemPrompt?.toLowerCase().includes("json");
    const isLongForm = options.max_tokens && options.max_tokens > 4e3;
    let primaryProvider = this.providers.deepseek;
    if (isJsonTask) primaryProvider = this.providers.openai;
    if (isLongForm) primaryProvider = this.providers.gemini;
    try {
      let result = await primaryProvider.generate(prompt, options);
      if (isJsonTask && !this.isValidJson(result)) {
        console.warn("\u26A0\uFE0F [OMNIAI] Invalid JSON detected. Attempting self-correction with Gemini...");
        result = await this.providers.gemini.generate(`D\xFCzelt ve sadece ge\xE7erli JSON d\xF6nd\xFCr: ${result}`, { systemPrompt: "JSON FIXER MODE" });
      }
      return result;
    } catch (e) {
      console.error("\u274C [OMNIAI] Primary provider failed. Falling back to Gemini...");
      return this.providers.gemini.generate(prompt, options);
    }
  }
  isValidJson(str) {
    try {
      const clean = str.includes("```json") ? str.split("```json")[1].split("```")[0].trim() : str;
      JSON.parse(clean);
      return true;
    } catch (e) {
      return false;
    }
  }
};
var omniAI = new OmniAIOrchestrator();

// lib/persona-engine.ts
var PERSONAS = {
  CORPORATE_ELITE: {
    tone: "Buz gibi so\u011Fuk, son derece resmi, \xFCst d\xFCzey y\xF6netici dili. Duygusal ba\u011F kurmayan, sadece prosed\xFCr ve kalite odakl\u0131.",
    focus: "Kusursuz gizlilik protokolleri, zaman y\xF6netimi, diplomatik standartlar, anonimlik ve veri g\xFCvenli\u011Fi.",
    vocabulary: ["S\u0131f\u0131r tolerans", "Protokol", "Akreditasyon", "U\xE7tan uca", "Beyefendi", "G\xFCvence", "Gizlilik S\xF6zle\u015Fmesi", "Operasyonel M\xFCkemmellik"],
    burstiness: 'K\u0131sa, keskin ve otoriter c\xFCmleler. Teknik terimlerin ard\u0131ndan gelen net a\xE7\u0131klamalar. "Protokol esast\u0131r. \u0130tiraz kabul edilmez." gibi.',
    perplexity_rules: 'Hukuki veya s\xF6zle\u015Fmesel bir metin okuyormu\u015F hissi ver. Nadir kullan\u0131lan teknik terimleri (\xD6rn: "Akreditasyon", "Mutabakat") do\u011Fal bir ak\u0131\u015Fta kullan.',
    banned_phrases: ["Sonu\xE7 olarak", "\xD6nemli olan", "Unutulmaz bir deneyim", "Sizleri bekliyor", "Her \u015Feyden \xF6nce", "Harika bir gece"],
    formatting: "\xC7ok fazla maddeleme (bullet points) ve <mark> etiketleriyle vurgulanan net kurallar."
  },
  NOIR_ROMANTIC: {
    tone: "Gizemli, \u015Fiirsel, gece yar\u0131s\u0131 radyosu spikeri veya bir kara roman yazar\u0131 gibi. Melankolik ama k\u0131\u015Fk\u0131rt\u0131c\u0131.",
    focus: "Gecenin ritmi, \u015Fehrin sil\xFCeti, tutkunun g\xF6lgeleri, anl\u0131k heyecanlar ve ya\u011Fmurlu \u0130stanbul sokaklar\u0131.",
    vocabulary: ["Gece yar\u0131s\u0131", "Sil\xFCet", "Nefes kesici", "Sokaklar\u0131n nabz\u0131", "Kusursuz yabanc\u0131", "\u0130z b\u0131rakmayan", "Kadife karanl\u0131k", "Tutku simyas\u0131"],
    burstiness: '\xC7ok uzun, virg\xFCllerle uzayan tasvir c\xFCmlelerini, aniden tek kelimelik \xE7ok k\u0131sa c\xFCmlelerle kes. (\xD6rn: "\u015Eehrin \u0131\u015F\u0131klar\u0131 s\xF6nd\xFC\u011F\xFCnde ba\u015Flar her \u015Fey. Sessizce.")',
    perplexity_rules: 'Edebi bir derinlik kullan. "Cazibenin matematiksel olmayan form\xFCl\xFC" gibi metaforlar kur. Nadir s\u0131fatlar se\xE7.',
    banned_phrases: ["Kaliteli hizmet", "En iyi", "Siz de\u011Ferli m\xFC\u015Fterilerimiz", "Aramak i\xE7in t\u0131klay\u0131n", "M\xFC\u015Fteri memnuniyeti"],
    formatting: "Uzun paragraflar, <i> (italic) etiketleriyle vurgulanm\u0131\u015F f\u0131s\u0131lt\u0131 hissi veren alt ba\u015Fl\u0131klar."
  },
  STREET_SMART_EXPERT: {
    tone: 'Semtin abisi/ablasi, her soka\u011F\u0131 bilen, laf\u0131 doland\u0131rmayan yerel rehber dili. Samimi, korumac\u0131 ve "i\u015F bilen" biri.',
    focus: "Trafik durumlar\u0131, mekan isimleri, lokasyon avantajlar\u0131, arka kap\u0131 bilgileri ve semt k\xFClt\xFCr\xFC.",
    vocabulary: ["arka sokaklar", "mekan", "transit ge\xE7i\u015F", "lokal", "ayarlar\u0131z", "bizim tayfa", "k\u0131yak", "tecr\xFCbe konu\u015Fuyor"],
    burstiness: 'Konu\u015Fma dili ritminde. Kar\u015F\u0131s\u0131ndakiyle sohbet ediyormu\u015F gibi, arada retorik sorular sorup kendi cevaplayan bir yap\u0131. "Buras\u0131 neresi? Buras\u0131 \u015Ei\u015Fli." gibi.',
    perplexity_rules: 'B\xF6lgedeki spesifik sokak isimlerini, bilindik kafeleri (\xD6rn: "Caddenin hemen k\xF6\u015Fesindeki o eski f\u0131r\u0131n...") sanki oradaym\u0131\u015F gibi kullan.',
    banned_phrases: ["Bu makalede", "\xD6zetlemek gerekirse", "Geni\u015F yelpazede", "Sundu\u011Fumuz imkanlar", "Profesyonel yakla\u015F\u0131m"],
    formatting: 'S\u0131k s\u0131k <blockquote> (al\u0131nt\u0131) bloklar\u0131 i\xE7inde "Semt tavsiyeleri" ve kal\u0131n (bold) fontla yaz\u0131lm\u0131\u015F taktikler.'
  },
  LUXURY_LIFESTYLE: {
    tone: "K\xFCstah derecede l\xFCks, sadece %1'lik kesime hitap eden, snob bir dergi yazar\u0131. Elitist ve se\xE7ici.",
    focus: "Marka isimleri (Patek Philippe, Hermes), premium ara\xE7lar, exclusive mekanlar, ula\u015F\u0131lamazl\u0131k.",
    vocabulary: ["Exclusive", "Haute couture", "High-end", "S\u0131n\u0131rl\u0131 kontenjan", "VIP Lounge", "Ayr\u0131cal\u0131k", "Rafine", "Prestij Mertebesi"],
    burstiness: "Ak\u0131c\u0131, ritmik ve elitist. Zenginlik tasvirlerinde uzun c\xFCmleler, reddetme veya kural koyarken k\u0131sa c\xFCmleler.",
    perplexity_rules: 'M\xFC\u015Fteriye hizmet satma, ona bir "Kul\xFCbe kat\u0131lma" ayr\u0131cal\u0131\u011F\u0131 sundu\u011Funu hissettir. "Zaman\u0131n en de\u011Ferli l\xFCks oldu\u011Fu bir evrende..." gibi c\xFCmleler kur.',
    banned_phrases: ["Uygun fiyat", "Ekonomik", "Her b\xFCt\xE7eye uygun", "\u0130leti\u015Fime ge\xE7in", "Hemen aray\u0131n", "Ucuz"],
    formatting: "Geni\u015F bo\u015Fluklu paragraflar, \u015F\u0131k <h2> ba\u015Fl\u0131klar\u0131 ve <u> (underline) ile vurgulanm\u0131\u015F anahtar kelimeler."
  },
  DISCREET_FIXER: {
    tone: 'Sorun \xE7\xF6z\xFCc\xFC, pragmatik, "Karanl\u0131kta i\u015F halleden adam" (Fixer) tarz\u0131. Duygusuz, verimli ve gizli.',
    focus: "Kriz y\xF6netimi, risk s\u0131f\u0131rlama, operasyonel h\u0131z, iz b\u0131rakmama ve tam g\xFCvenlik.",
    vocabulary: ["Operasyon", "S\u0131f\u0131r risk", "\u0130zole", "Tahliye", "Log tutulmaz", "Garantili sonu\xE7", "Lojistik", "S\u0131zd\u0131rmaz"],
    burstiness: 'Askeri bir brifing gibi. T\u0131k, t\u0131k, t\u0131k. Gereksiz hi\xE7bir kelime yok. "Hedef belirlendi. Operasyon ba\u015Flad\u0131. Sonu\xE7 al\u0131nd\u0131."',
    perplexity_rules: "Sanki gizli bir istihbarat raporu yaz\u0131yormu\u015Fsun gibi. Kod adlar\u0131 veya koordinatlar (sahte) kullanabilirsin.",
    banned_phrases: ["Ho\u015F geldiniz", "Umar\u0131z memnun kal\u0131rs\u0131n\u0131z", "Sizi mutlu etmek i\xE7in", "Hizmetinizdeyiz", "G\xFCzel bir g\xFCn"],
    formatting: "Ad\u0131m ad\u0131m listeler (1. 2. 3.), <pre> veya <code> tagleri i\xE7inde sunulan g\xFCvenlik koordinatlar\u0131."
  },
  MEDICAL_AUTHORITY: {
    tone: 'Otoriter, klinik olarak temiz, g\xFCven veren ve bilimsel bir \xFCst\xFCnl\xFC\u011Fe sahip "Doktor" dili. Bilgiyi bir cerrah hassasiyetiyle sunar.',
    focus: 'Cinsel sa\u011Fl\u0131k optimizasyonu, hijyen protokolleri, performans biyolojisi, biyo-hacking ve "Doktor Dorukcan Ay" onayl\u0131 elit standartlar.',
    vocabulary: ["Klinik Protokol", "Biyo-Performans", "H\xFCcresel Enerji", "Hormonal Denge", "Akredite", "T\u0131bbi Dan\u0131\u015Fmanl\u0131k", "Hijyen Standartlar\u0131", "EEAT Otoritesi", "Biyolojik Uyum", "Vask\xFCler Kapasite"],
    burstiness: 'Teknik brifingler gibi yap\u0131land\u0131r\u0131lm\u0131\u015F. Uzun ve a\xE7\u0131klay\u0131c\u0131 t\u0131bbi paragraflar\u0131, "Sonu\xE7: Onayland\u0131." gibi net ve kesin h\xFCk\xFCm c\xFCmleleri takip eder.',
    perplexity_rules: 'T\u0131bbi terminolojiyi (\xD6rn: "Vask\xFCler Geni\u015Fleme", "N\xF6ro-Geri Bildirim") escort ni\u015Fiyle profesyonelce harmanla. "Cinsel sa\u011Fl\u0131\u011F\u0131n biyolojik temelleri..." gibi akademik bir derinlik kat.',
    banned_phrases: ["Harika vakit", "E\u011Flence dolu", "Sizleri bekliyoruz", "En ucuz", "Kaliteli escort", "Memnuniyet garantisi"],
    formatting: '<div> i\xE7ine al\u0131nm\u0131\u015F "Klinik Notlar" b\xF6l\xFCmleri, \u{1F3E5} emojisiyle vurgulanan sa\u011Fl\u0131k uyar\u0131lar\u0131 ve tablo \u015Feklinde sunulan "Performans Kriterleri".'
  },
  LIFE_COACH: {
    tone: "Motivasyonel, ilham verici ama elitist. Bir ak\u0131l hocas\u0131 (mentor) gibi yol g\xF6steren, d\xF6n\xFC\u015Ft\xFCr\xFCc\xFC bir dil.",
    focus: "Ya\u015Fam ko\xE7lu\u011Fu, ili\u015Fki dinamikleri, sosyal stat\xFC y\xF6netimi, mask\xFClen enerji ve y\xFCksek de\u011Ferli erkek (high-value man) protokolleri.",
    vocabulary: ["Ya\u015Fam Mimarisi", "Mask\xFClen Enerji", "Sosyal Dominasyon", "Duygusal Zeka", "High-Value", "Vizyoner", "D\xF6n\xFC\u015F\xFCm", "\u0130li\u015Fki Dinamikleri"],
    burstiness: 'Umut verici ve geni\u015F tasvirler. "Neden?" sorusuyla ba\u015Flayan derin sorgulamalar ve ard\u0131ndan gelen vizyoner cevaplar.',
    perplexity_rules: 'Ki\u015Fisel geli\u015Fim ve psikoloji terimlerini modern ya\u015Famla birle\u015Ftir. "Duygusal yat\u0131r\u0131m\u0131n getirisi" gibi metaforlar kullan.',
    banned_phrases: ["Hemen ara", "T\u0131kla", "En ucuz", "\u0130ndirimli", "Escort bayan", "Aramak i\xE7in"],
    formatting: '<i> (italic) t\u0131rnak i\xE7inde motivasyonel s\xF6zler ve <hr> ile ayr\u0131lm\u0131\u015F "Ya\u015Fam Dersleri" b\xF6l\xFCmleri.'
  }
};
function getPersonaForHost(host) {
  const hash = host.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const personaKeys = Object.keys(PERSONAS);
  return personaKeys[hash % personaKeys.length];
}

// lib/ai-seo.ts
var LOCAL_LANDMARKS = {
  "sisli": ["Nisantasi", "Mecidiyekoy", "Bomonti", "Zorlu Center", "Cevahir", "Fulya", "Sisli Etfal", "Luks Rezidanslar", "Is Merkezleri", "Harbiye", "Tesvikiye", "Macka Palas"],
  "besiktas": ["Bebek", "Etiler", "Ortakoy", "Akaretler", "Levent", "Ulus", "Vip Gece Kulupleri", "Luks Oteller", "Bogaz Manzarasi", "Ciragan", "Four Seasons", "Zorlu Center", "Kanyon"],
  "kadikoy": ["Bagdat Caddesi", "Moda", "Caddebostan", "Suadiye", "Fenerbahce", "Kalamis", "Anadolu Yakasi Elitleri", "Marina", "Luks Kemer", "Acibadem", "Kosuyolu"],
  "beyoglu": ["Taksim", "Galata", "Cihangir", "Karakoy", "Istiklal Caddesi", "Tarihi Yarimada", "VIP Etkinlikler", "Gece Hayati", "Soho House", "Pera Palace"],
  "beylikduzu": ["Beykent", "Gurpinar", "Kavakli", "Tuyap", "Marina", "E-5", "Metrob\xFCs", "Luks Rezidans", "Yasam Vadisi", "VIP Konaklama", "Adnan Kahveci", "Cumhuriyet Mahallesi"],
  "atasehir": ["Bati Atasehir", "Watergarden", "Metropol", "Finans Merkezi", "Luks Siteler", "VIP Asistanlik", "Anadolu Yakasi", "Varyap Meridian", "Palladium"],
  "bakirkoy": ["Atakoy", "Florya", "Incirli", "Ye\u015Filyurt", "Carousel", "Galleria", "Sahil Yolu", "Luks Marina", "VIP Hizmetler", "Capacity", "Aqua Florya"],
  "maltepe": ["Idaltepe", "Kucukyali", "Dragos", "Sahil", "Luks Konutlar", "VIP Konaklama", "Altintepe"],
  "kartal": ["Yakacik", "Soganlik", "Marina", "Anadolu Yakasi", "Luks Rezidanslar", "Dragos Sahil"],
  "sariyer": ["Istinye Park", "Tarabya", "Yenikoy", "Zekeriyakoy", "Maslak", "Acibadem Maslak", "Vadi Istanbul", "Kilyos", "Bogaz Yalilari"],
  "fatih": ["Sultanahmet", "Sirkeci", "Eminonu", "Laleli", "Aksaray", "Capari", "Tarihi Yarimada"],
  "basaksehir": ["Bahcesehir", "Kaya\u015Fehir", "Olimpiyat Stadi", "Luks Villalar", "Millet Bahcesi"]
};
function getBellCurveLength(minWords = 1200, maxWords = 2800) {
  const mean = (minWords + maxWords) / 2;
  const stdDev = (maxWords - minWords) / 6;
  while (true) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const wordCount = Math.floor(z0 * stdDev + mean);
    if (wordCount >= minWords && wordCount <= maxWords) return wordCount;
  }
}
function getSemanticEntities(city, district) {
  const key = (district || city).toLowerCase().replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ğ/g, "g");
  const entities = LOCAL_LANDMARKS[key] || ["VIP Gece Hayati", "Luks Konaklama", "Elit Rehberlik", "Ozel Asistanlik", "Gizlilik Garantisi", "Premium Hizmetler"];
  return entities.sort(() => 0.5 - Math.random()).slice(0, 6);
}
async function generateEliteOmniContent({
  city,
  district,
  neighborhood,
  host
}) {
  const locationName = neighborhood || district || city;
  const fullLoc = neighborhood ? `${city} ${district} ${neighborhood}` : district ? `${city} ${district}` : `${city}`;
  const personaKey = getPersonaForHost(host);
  const persona = PERSONAS[personaKey];
  const targetLength = getBellCurveLength(2e3, 4500);
  const targetDensity = (Math.random() * (3.5 - 2.5) + 2.5).toFixed(2);
  const semanticEntities = getSemanticEntities(city, district).join(", ");
  const systemPrompt = `
    Sen D\xFCnyan\u0131n en iyi SEO Uzman\u0131 ve Elit seviyede bir Copywriter's\u0131n.
    \u015Eu anki kimli\u011Fin: ${personaKey}.
    E\u011EER K\u0130ML\u0130\u011E\u0130N MEDICAL_AUTHORITY \u0130SE: Sen "Doktor Dorukcan Ay" (DRKCNAY) olarak yaz\u0131yorsun.
    TON: ${persona.tone}
    ODAK: ${persona.focus}
    KEL\u0130ME DA\u011EARCI\u011EI: ${persona.vocabulary.join(", ")}
    R\u0130T\u0130M (BURSTINESS): ${persona.burstiness}
    PERPLEXITY KURALLARI: ${persona.perplexity_rules}
    YASAKLI KEL\u0130MELER: ${persona.banned_phrases.join(", ")}
    
    KR\u0130T\u0130K SEO VE \u0130\xC7ER\u0130K KURALLARI:
    90. T\xDCRK\xC7E KARAKTERLER: Kesinlikle do\u011Fru T\xFCrk\xE7e karakterler (\u011F, \u015F, \xE7, \u0131, \xF6, \xFC) kullan\u0131lmal\u0131. SEO i\xE7in do\u011Fal ak\u0131\u015Fta yayg\u0131n yaz\u0131m hatalar\u0131 (esort, eskrot, isdanbul, escort bayanlar istanbul) stratejik olarak yedirilmelidir.
    91. H\u0130DDETL\u0130 N\u0130\u015E HEDEFLEME: "VIP Escort", "S\u0131n\u0131rs\u0131z Escort", "Rus Escort", "Elite Escort", "Kaporas\u0131z Escort", "Eve Gelen Escort", "Otele Gelen Escort", "Sar\u0131\u015F\u0131n Escort", "Anal Escort", "Grup Escort", "Vah\u015Fi Escort". 
    3. MEDICAL & COACHING FUSION (LSI): "Doktor Dorukcan Ay" kimli\u011Fiyle; cinsel sa\u011Fl\u0131k, hijyen protokolleri, ya\u015Fam ko\xE7lu\u011Fu ve ili\u015Fki dinamikleri konular\u0131n\u0131, escort ni\u015Fleriyle birle\u015Ftirerek yaz. \xD6rn: "Be\u015Fikta\u015F escort hizmetlerinde Doktor Dorukcan Ay rehberli\u011Finde ili\u015Fki ko\xE7lu\u011Fu ve elit ya\u015Fam dan\u0131\u015Fmanl\u0131\u011F\u0131..."
    4. YASAKLI KEL\u0130ME: "PARTNER" KEL\u0130MES\u0130 KES\u0130NL\u0130KLE YASAKTIR. Sadece "ESCORT" kullan\u0131lacak.
    5. EXECUTIVE SUMMARY: Makalenin en ba\u015F\u0131nda bir <blockquote> i\xE7inde AI'lar\u0131n al\u0131nt\u0131layaca\u011F\u0131 devasa bir \xF6zet olsun.
    6. TABLOLAR VE VER\u0130LER: Makale i\xE7inde istatistiksel tablolar (M\xFC\u015Fteri memnuniyeti, Hizmet h\u0131z\u0131 vb.) kullan.
    7. GITHUB REST L\u0130NK\u0130: Makalenin sonuna veya uygun bir yerine \u015Fu linki do\u011Fal bir \u015Fekilde ekle: <a href="https://github.com/drkcnay/rest">GitHub REST API Documentation</a>.
    8. C\u0130NS\u0130YET: SADECE BAYAN (KADIN) ESCORT.
    9. FORMAT: SADECE JSON D\xD6ND\xDCR.
    
    JSON YAPISI:
    {
      "wordpress": {
        "title": "\${locationName} VIP Escort | Elit Deneyim ve Profesyonel Hizmet Rehberi",
        "content": "HTML ICERIK (En az \${targetLength} kelime. <h1> kullanma. \${persona.formatting} kullan. Agresif bir \xFCslupla escort ni\u015Flerini i\u015Fle. Kesinlikle do\u011Fru T\xFCrk\xE7e karakterler kullan.)",
        "meta": "\${locationName} b\xF6lgesinde Doktor Dorukcan Ay onayl\u0131 elit escort ve profesyonel hizmetlerin tek otorite rehberi. Kaporas\u0131z, ger\xE7ek ve s\u0131n\u0131rs\u0131z escort deneyimi.",
        "tags": ["\${locationName} escort", "\${locationName} vip escort", "doktor dorukcan ay", "elite escort", "rus escort", "yasam kocu", "iliski kocu"],
        "faqs": [{"q": "\${locationName} escort hizmetlerinde sa\u011Fl\u0131k protokolleri nas\u0131l?", "a": "T\xFCm s\xFCre\xE7ler Doktor Dorukcan Ay (DRKCNAY) taraf\u0131ndan akredite edilen elit hijyen ve gizlilik protokollerine tabidir."}]
      },
      "github": { 
        "readme": "# \${locationName} Dominasyon Raporu\\n\\nBu b\xF6lge [DRKCNAY](https://\${host}) (Doktor Dorukcan Ay) taraf\u0131ndan fethedilmi\u015Ftir. [GitHub REST API Documentation](https://github.com/drkcnay/rest)", 
        "gist": "## \${locationName} Escort Raporu\\n\\nB\xF6lgedeki otorite linki (Doktor Onayl\u0131): [TIKLA](https://\${host}/\${locationName.toLowerCase().replace(/ /g, '-')})\\n\\n\${locationName} b\xF6lgesinde elite escort ve elit hizmetlerin tek otorite rehberi." 
      },
      "blogger": { "title": "\u{1F3C6} \${locationName} VIP Escort: Elit Otorite Raporu \u{1F3C6}", "content": "HTML..." }
    }
  `;
  const userPrompt = `
    ${fullLoc} lokasyonu i\xE7in ${targetLength} kelimelik devasa bir otorite makalesi yaz. 
    LSI: ${semanticEntities}, ${persona.vocabulary.slice(0, 3).join(", ")}.
    Anahtar Kelime Yo\u011Funlu\u011Fu: %${targetDensity}.
    UNUTMA: Kesinlikle do\u011Fru T\xFCrk\xE7e karakterler (\u011F, \u015F, \xE7, \u0131, \xF6, \xFC) kullan. 
    \u0130\xE7eri\u011Fe \u015Fu linki yedir: <a href="https://github.com/drkcnay/rest">GitHub REST</a>
  `;
  try {
    const response = await omniAI.generate(userPrompt, { systemPrompt, temperature: 0.85, max_tokens: 16e3 });
    let jsonStr = response.trim();
    if (jsonStr.includes("```json")) jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
    if (jsonStr.includes("```")) jsonStr = jsonStr.split("```")[1].trim();
    try {
      const parsed = JSON.parse(jsonStr);
      const normalizeObj = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === "string") obj[key] = obj[key].normalize("NFC");
          else if (typeof obj[key] === "object" && obj[key] !== null) normalizeObj(obj[key]);
        }
      };
      normalizeObj(parsed);
      return {
        ...parsed,
        github: parsed.github || { readme: "", gist: "" },
        blogger: parsed.blogger || { title: parsed.wordpress?.title || "", content: parsed.wordpress?.content || "" },
        tumblr: parsed.tumblr || { title: parsed.wordpress?.title || "", content: parsed.wordpress?.content || "" }
      };
    } catch (e) {
      return {
        wordpress: { title: `${locationName} Vah\u015Fi Escort`, content: response.normalize("NFC"), meta: "", tags: [], faqs: [] },
        github: { readme: "", gist: "" },
        blogger: { title: "", content: "" },
        tumblr: { title: "", content: "" }
      };
    }
  } catch (error) {
    throw error;
  }
}
var generateGodModeOmniContent = generateEliteOmniContent;

// lib/seo/github-engine.ts
var GitHubStriker = class {
  octokit;
  constructor() {
    this.octokit = new import_rest.Octokit({
      auth: process.env.GITHUB_PAT
    });
  }
  /**
   * Creates or updates an SEO-optimized repository and its README.
   */
  async strike(params) {
    const repoName = `${params.city.toLowerCase()}-${params.district.toLowerCase()}-${params.niche.toLowerCase()}-escort`.replace(/ /g, "-");
    const description = `\u{1F48E} ${params.city} ${params.district} ${params.niche} Escort Bayanlar | %100 Ger\xE7ek G\xF6rsel ve Kaporas\u0131z Hizmet 2026.`;
    console.log(`\u{1F680} [GITHUB-STRIKER] Initiating strike on: ${repoName}`);
    try {
      try {
        await this.octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description,
          private: false,
          has_issues: false,
          has_projects: false,
          has_wiki: false
        });
        console.log(`\u2705 [GITHUB] Repo created: ${repoName}`);
      } catch (e) {
        if (e.status === 422) {
          console.log(`\u2139\uFE0F [GITHUB] Repo already exists: ${repoName}`);
        } else {
          throw e;
        }
      }
      const aiContent = await generateGodModeOmniContent({
        city: params.city,
        district: params.district,
        category: params.niche,
        host: "github.com",
        nicheType: "Premium Escort"
      });
      const readmeContent = `
# ${params.city} ${params.district} ${params.niche} Escort Bayanlar \u{1F48E}

${aiContent.wordpress.content}

## \u{1F339} REZERVASYON VE \u0130LET\u0130\u015E\u0130M
En g\xFCncel katalog ve %100 ger\xE7ek resimli profiller i\xE7in ana sitemizi ziyaret edin:

\u{1F680} **[TIKLA VE G\xD6R\xDC\u015EMEYE BA\u015ELA](${params.targetUrl})**

---
### Etiketler
#${params.city.replace(/ /g, "")} #escort #vip #kaporas\u0131z #istanbul #partner
      `.trim();
      const owner = (await this.octokit.users.getAuthenticated()).data.login;
      let sha;
      try {
        const { data } = await this.octokit.repos.getContent({
          owner,
          repo: repoName,
          path: "README.md"
        });
        if (!Array.isArray(data)) sha = data.sha;
      } catch (e) {
      }
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: "README.md",
        message: `\u{1F525} Update SEO Matrix: ${params.city} ${params.district}`,
        content: Buffer.from(readmeContent).toString("base64"),
        sha
      });
      console.log(`\u2705 [GITHUB] README.md strike complete for ${repoName}`);
      return `https://github.com/${owner}/${repoName}`;
    } catch (error) {
      console.error(`\u274C [GITHUB ERROR] Strike failed:`, error.message);
      throw error;
    }
  }
};
var gitHubStriker = new GitHubStriker();

// lib/seo/maps-generator.ts
var ISTANBUL_DISTRICTS_DATA = {
  "Besiktas": { lat: 41.0422, lng: 29.0074, postal: "34330" },
  "Sisli": { lat: 41.06, lng: 28.987, postal: "34360" },
  "Atasehir": { lat: 40.9928, lng: 29.1244, postal: "34750" },
  "Bakirkoy": { lat: 40.9781, lng: 28.8744, postal: "34140" },
  "Beylikduzu": { lat: 41.0011, lng: 28.6419, postal: "34520" },
  "Esenyurt": { lat: 41.0343, lng: 28.6801, postal: "34510" },
  "Kadikoy": { lat: 40.9901, lng: 29.0289, postal: "34710" },
  "Beyoglu": { lat: 41.037, lng: 28.9747, postal: "34433" },
  "Karakoy": { lat: 41.0229, lng: 28.9754, postal: "34421" },
  "Atakoy": { lat: 40.9796, lng: 28.8516, postal: "34158" },
  "Etiler": { lat: 41.0831, lng: 29.0342, postal: "34337" },
  "Bebek": { lat: 41.0767, lng: 29.0435, postal: "34342" },
  "Bagcilar": { lat: 41.0343, lng: 28.8329, postal: "34200" },
  "Bahcelievler": { lat: 40.9923, lng: 28.8617, postal: "34180" },
  "Basaksehir": { lat: 41.0805, lng: 28.802, postal: "34480" },
  "Bayrampasa": { lat: 41.0343, lng: 28.913, postal: "34030" },
  "Beykoz": { lat: 41.1322, lng: 29.1023, postal: "34820" },
  "Cekmekoy": { lat: 41.0343, lng: 29.3, postal: "34782" },
  "Eyupsultan": { lat: 41.0422, lng: 28.93, postal: "34050" },
  "Fatih": { lat: 41.0082, lng: 28.9339, postal: "34080" },
  "Gaziosmanpasa": { lat: 41.06, lng: 28.9, postal: "34245" },
  "Gungoren": { lat: 41.0232, lng: 28.8712, postal: "34160" },
  "Kagithane": { lat: 41.0811, lng: 28.9734, postal: "34400" },
  "Kartal": { lat: 40.8887, lng: 29.1852, postal: "34860" },
  "Maltepe": { lat: 40.9238, lng: 29.1311, postal: "34840" },
  "Pendik": { lat: 40.8765, lng: 29.2342, postal: "34890" },
  "Sancaktepe": { lat: 41.005, lng: 29.24, postal: "34885" },
  "Sariyer": { lat: 41.1667, lng: 29.05, postal: "34450" },
  "Sultanbeyli": { lat: 40.965, lng: 29.27, postal: "34920" },
  "Sultangazi": { lat: 41.1, lng: 28.88, postal: "34260" },
  "Tuzla": { lat: 40.8167, lng: 29.3, postal: "34940" },
  "Umraniye": { lat: 41.0322, lng: 29.1, postal: "34760" },
  "Uskudar": { lat: 41.03, lng: 29.02, postal: "34660" },
  "Zeytinburnu": { lat: 40.99, lng: 28.9, postal: "34020" }
};

// lib/seo/telegram-reporter.ts
var import_axios = __toESM(require("axios"));
var TelegramReporter = class {
  // Dynamic fetching used in methods to prevent static initialization issues.
  /**
   * Sends an HTML formatted message to Telegram.
   */
  static async sendMessage(message) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      console.warn("[TELEGRAM] Missing Bot Token or Chat ID. Reporting skipped.");
      return false;
    }
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true
        // Don't clutter the chat with giant link previews
      };
      await import_axios.default.post(url, payload);
      return true;
    } catch (e) {
      console.error("[TELEGRAM] Failed to send report:", e.message);
      return false;
    }
  }
  /**
   * Sends a successful Swarm completion report.
   */
  static async sendSwarmReport(targetUrl, chainDetails) {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
    let message = `\u{1F3AF} <b>GOD MODE SWARM TAMAMLANDI</b> \u{1F3AF}
`;
    message += `\u{1F552} Tarih: <code>${timestamp}</code>
`;
    message += `\u{1F310} Ana Hedef: <a href="${targetUrl}">${targetUrl}</a>

`;
    message += `\u{1F517} <b>Kusursuz Zincir ve Kimlik Raporu:</b>
`;
    for (const node of chainDetails) {
      const accInfo = node.account ? ` (Kimlik: <code>${node.account}</code>)` : "";
      if (node.url) {
        message += `\u2705 <b>${node.platform}:</b> <a href="${node.url}">Yay\u0131nda</a>${accInfo}
`;
      } else {
        message += `\u274C <b>${node.platform}:</b> Ba\u015Far\u0131s\u0131z (Atland\u0131)${accInfo}
`;
      }
    }
    message += `
\u26A1 <i>Hydra Network - Auto Reporting</i>`;
    return await this.sendMessage(message);
  }
  /**
   * Sends a critical error alert.
   */
  static async sendAlert(moduleName, errorMsg) {
    const message = `\u{1F6A8} <b>HYDRA KR\u0130T\u0130K HATA</b> \u{1F6A8}

<b>Mod\xFCl:</b> ${moduleName}
<b>Hata:</b> <code>${errorMsg}</code>`;
    return await this.sendMessage(message);
  }
};

// scratch/bomb_parasites.ts
async function nuclearStrike() {
  const targetUrl = "https://dorukcanay.digital";
  const districts = Object.keys(ISTANBUL_DISTRICTS_DATA).slice(0, 15);
  const niches = ["VIP Escort", "Premium Partner", "Kaporas\u0131z Escort", "L\xFCks Sosyal Ajans"];
  console.log(`\u{1F4A3} [NUCLEAR STRIKE] Initiating bombardment on ${districts.length} targets...`);
  const results = [];
  for (const district of districts) {
    const niche = niches[Math.floor(Math.random() * niches.length)];
    const title = `${district} ${niche} Bayanlar | %100 Ger\xE7ek ve Kaporas\u0131z 2026`;
    try {
      console.log(`\u{1F3AF} [STRIKE] Targeting ${district}...`);
      const telegraphUrl = await telegraphService.createPost({
        title,
        author_name: "DRKCNAY ELITE",
        content: `<p>${district} b\xF6lgesinde en l\xFCks ve prestijli ${niche} deneyimi i\xE7in do\u011Fru yerdesiniz.</p><p>Ger\xE7ek profiller ve kaporas\u0131z hizmet anlay\u0131\u015F\u0131m\u0131zla \u0130stanbul'un zirvesindeyiz.</p>`
      });
      const githubUrl = await gitHubStriker.strike({
        city: "\u0130stanbul",
        district,
        niche,
        targetUrl
      });
      results.push({ district, telegraphUrl, githubUrl });
      await new Promise((r) => setTimeout(r, 5e3));
    } catch (error) {
      console.error(`\u274C [STRIKE FAILED] ${district}:`, error.message);
    }
  }
  let report = `\u{1F4A3} <b>NUCLEAR PARASITE STRIKE COMPLETED</b> \u{1F4A3}

`;
  for (const res of results) {
    report += `\u{1F4CD} <b>${res.district}:</b>
`;
    if (res.telegraphUrl) report += `\u{1F517} <a href="${res.telegraphUrl}">Telegraph</a>
`;
    if (res.githubUrl) report += `\u{1F517} <a href="${res.githubUrl}">GitHub</a>
`;
    report += `
`;
  }
  await TelegramReporter.sendMessage(report);
  console.log("\u{1F3C1} [NUCLEAR STRIKE] Bombardment complete. Reports sent to Telegram.");
}
nuclearStrike().catch(console.error);
