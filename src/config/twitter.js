import { TwitterApi } from 'twitter-api-v2';
import dotenv from "dotenv";
dotenv.config();

const client = new TwitterApi(
    {
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
);

const clientTwitter = client.readWrite;

export function twitterEnviarMensaje(message) {
    try {
        clientTwitter.v2.tweet(message);
    } catch (error) {
        console.error(error);
    }
};