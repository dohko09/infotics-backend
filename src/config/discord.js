import { Client } from 'discord.js';
import dotenv from "dotenv";
dotenv.config();

const client = new Client();
client.login(process.env.DISCORD_TOKEN);

export function discordEnviarMensaje(message) {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL); // Reemplaza 'ID_DEL_CANAL' con el ID del canal al que deseas enviar el mensaje.

    if (channel) {
        channel.send(message);
    } else {
        console.log('Canal no encontrado.');
    }
};

client.once('ready', () => {
    console.log('Bot de discord disponible.');
});

