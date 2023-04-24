require('dotenv/config');
const Logger = require("../Logger");
const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);

module.exports = {
    name: 'messageCreate',
    async execute(message, client)
    {
        // Chat GPT Channel
        if (message.channel.id == process.env.OPENAI_CHANNEL) {
            let conversationLog = [{ role: 'system', content: "You are a friendly chatbot." }];
            
            await message.channel.sendTyping();

            let prevMessages = await message.channel.messages.fetch({ limit: 30 });
            prevMessages.reverse();
            prevMessages.forEach((msg) => {
                if (msg.author.id !== client.user.id && msg.author.bot) return;
                if (msg.author.id !== message.author.id) return;

                conversationLog.push({
                    role: 'user',
                    content: msg.content
                });
            })

            const result = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: conversationLog
            });

            message.reply(result.data.choices[0].message);
        }
    }
}