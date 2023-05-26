<h1 align="center" text-size="150px">
  <span>Kheeto.dev Bot</span>
</h1>

## What is Kheeto.dev Bot?
This is the official discord bot i made for my server<br>
It is a configurable multi-purpose bot with lots of features.

## How to setup the bot
The bot setup is simple:
1. Download the source code
2. Create a .env file in the main directory
> You can get the bot token by creating an application on the [Discord Developer Portal](https://discord.com/developers/applications)
3. Add a TOKEN variable with your bot token as the value   

You will also need to install all of the necessary libraries, which are listed below.<br>
Now you just need to run the bot by executing this command in the terminal:
```
node .\src\index.js
```
You can configure your bot from the `./config/config.json` file.<br>
> Keep in mind `./config/warns.json` is only used for data storage when not using a database, you shouldn't modify its content.
