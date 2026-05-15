import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();
import { TelegramReporter } from './lib/seo/telegram-reporter';
TelegramReporter.sendMessage('🔥 TEST MESSAGE').then(console.log).catch(console.error);
