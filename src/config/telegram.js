import TelegramBot from 'node-telegram-bot-api';
import dotenv from "dotenv";
dotenv.config();
// Crea una instancia del bot
const bot = new TelegramBot(process.env.TOKEN_TELEGRAM, { polling: true });

// Función para enviar mensajes a un grupo
export function telegramEnviarMensaje(message) {
  const options = {
    parse_mode: 'Markdown',
  };
  bot.sendMessage(process.env.CHAT_ID, message.trim(), options);
}