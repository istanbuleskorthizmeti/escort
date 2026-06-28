"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBroadcaster = void 0;
var telegraf_1 = require("telegraf");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
/**
 * 🪐 DRKCNAY TELEGRAM BROADCASTER
 * Auto-posts images, SEO links, and CTA messages to channels/groups.
 */
var BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
var TARGET_CHANNELS = (process.env.TELEGRAM_TARGET_CHANNELS || '').split(',').map(function (c) { return c.trim(); }).filter(Boolean);
var WHATSAPP_NUMBER = "+90 501 635 50 53";
var WHATSAPP_LINK = "https://wa.me/".concat(WHATSAPP_NUMBER, "?text=").concat(encodeURIComponent("Merhaba, detaylı bilgi almak istiyorum."));
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
exports.TelegramBroadcaster = {
    /**
     * Posts a random VIP image with a promotional caption to all target channels.
     */
    broadcastPromo: function () {
        return __awaiter(this, void 0, void 0, function () {
            var imageDir, images, randomImage, imagePath, captions, caption, keyboard, _i, TARGET_CHANNELS_1, channel, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!BOT_TOKEN || TARGET_CHANNELS.length === 0) {
                            console.log("⚠️ [TG-BROADCAST] Bot token or target channels not configured.");
                            return [2 /*return*/];
                        }
                        imageDir = path.join(process.cwd(), 'public/images/profiles');
                        images = [];
                        try {
                            images = fs.readdirSync(imageDir).filter(function (f) { return f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'); });
                        }
                        catch (err) {
                            console.log("⚠️ [TG-BROADCAST] Profile images directory not found.");
                            return [2 /*return*/];
                        }
                        if (images.length === 0) {
                            console.log("⚠️ [TG-BROADCAST] No images found for broadcasting.");
                            return [2 /*return*/];
                        }
                        randomImage = images[Math.floor(Math.random() * images.length)];
                        imagePath = path.join(imageDir, randomImage);
                        captions = [
                            "\uD83D\uDD25 <b>VIP Escort Ajans\u0131 - S\u0131n\u0131rs\u0131z Hizmet</b>\n\n\u0130stanbul'un en elit ve gizli hizmeti. Ger\u00E7ek profiller, %100 memnuniyet garantisi.\n\n\uD83D\uDCCD <i>Hemen randevu olu\u015Ftur!</i>",
                            "\u2728 <b>L\u00FCks ve \u0130htiras Bir Arada</b>\n\nS\u0131radanl\u0131\u011F\u0131 unutun. En \u00F6zel anlar i\u00E7in \u00F6zenle se\u00E7ilmi\u015F elit kadromuzla tan\u0131\u015F\u0131n.\n\n\uD83D\uDCCD <i>Katalog i\u00E7in t\u0131kla!</i>",
                            "\uD83D\uDC8E <b>Premium Escort Deneyimi</b>\n\nGizlilik, kalite ve s\u0131n\u0131rs\u0131z e\u011Flence. \u00D6zel g\u00F6r\u00FC\u015Fmeleriniz i\u00E7in buraday\u0131z.\n\n\uD83D\uDCCD <i>\u015Eimdi ileti\u015Fime ge\u00E7!</i>"
                        ];
                        caption = captions[Math.floor(Math.random() * captions.length)];
                        keyboard = telegraf_1.Markup.inlineKeyboard([
                            [telegraf_1.Markup.button.url('📲 WhatsApp\'tan Yaz', WHATSAPP_LINK)],
                            [telegraf_1.Markup.button.url('🌐 Kataloğu Gör', 'https://istanbulescort.blog')]
                        ]);
                        console.log("\uD83D\uDE80 [TG-BROADCAST] F\u0131rlat\u0131l\u0131yor: ".concat(randomImage));
                        _i = 0, TARGET_CHANNELS_1 = TARGET_CHANNELS;
                        _a.label = 1;
                    case 1:
                        if (!(_i < TARGET_CHANNELS_1.length)) return [3 /*break*/, 6];
                        channel = TARGET_CHANNELS_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, bot.telegram.sendPhoto(channel, { source: imagePath }, __assign({ caption: caption, parse_mode: 'HTML' }, keyboard))];
                    case 3:
                        _a.sent();
                        console.log("\u2705 [TG-BROADCAST] G\u00F6nderildi: ".concat(channel));
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.error("\u274C [TG-BROADCAST] Hata (".concat(channel, "):"), err_1.message);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Broadcasts a text message (e.g., a new SEO link) to all target channels.
     */
    broadcastLink: function (title, url, description) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _i, TARGET_CHANNELS_2, channel, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!BOT_TOKEN || TARGET_CHANNELS.length === 0)
                            return [2 /*return*/];
                        message = "\n\uD83D\uDE80 <b>".concat(title, "</b>\n\n").concat(description, "\n\n\uD83D\uDD17 <a href=\"").concat(url, "\">Hemen \u0130ncele</a>\n    ").trim();
                        _i = 0, TARGET_CHANNELS_2 = TARGET_CHANNELS;
                        _a.label = 1;
                    case 1:
                        if (!(_i < TARGET_CHANNELS_2.length)) return [3 /*break*/, 6];
                        channel = TARGET_CHANNELS_2[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, bot.telegram.sendMessage(channel, message, {
                                parse_mode: 'HTML',
                                link_preview_options: { is_disabled: false }
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        console.error("\u274C [TG-BROADCAST] Link g\u00F6nderim hatas\u0131 (".concat(channel, "):"), err_2.message);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
};
