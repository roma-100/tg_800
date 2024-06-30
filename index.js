const {gameOptions, againOptions} = require('./options')
const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramApi(token, {polling: true});
const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage (chatId, 'Can you gess my number?');
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;

    await  bot.sendMessage (chatId, 'Let\'s try!', againOptions);
}

// Listen for any kind of message. There are different kinds of
// messages.
// Matches "/echo [whatever]"
const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Initial salutation'},
    {command: '/info', description: 'Get user\'s info'},
    {command: '/game', description: 'Game mode'}

  ])

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text
    if (text === '/start'){
        await bot.sendSticker(chatId, 'https://cdn.sanity.io/images/81pocpw8/production/f78870eaa0ed14c0be5377586900407eddbfd0c8-1200x900.jpg')
        return bot.sendMessage(chatId, `You are welcome`)
    }

    if (text === '/info'){
        return bot.sendMessage(chatId, `Info data: first_name: ${msg.from.first_name}, last_name: ${msg.from.last_name}, username: ${msg.from.username}`)
    }

    if (text === '/game') return startGame(chatId)

    return bot.sendMessage(chatId, 'Unknown command...')
    })

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data

        if (data === '/again') return startGame(chatId)

        if (data === chats[chatId]){
            return await bot.sendMessage(chatId, 'You are won! My number is: ' + chats[chatId], gameOptions)
        } else {
            return await bot.sendMessage(chatId, 'Nope! My number is: ' + chats[chatId], gameOptions)
        }

        bot.sendMessage(chatId, "You've selected: " + data)
        console.log(msg.message.chat.id)
        console.log(chats)
    })
}


start();