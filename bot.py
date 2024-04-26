#!/usr/bin/env python
# pylint: disable=unused-argument
# This program is dedicated to the public domain under the CC0 license.
"""
Simple example of a Telegram bot with a button to open a web app.
"""
import json
import logging
from telegram import KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Define a `/start` command handler.
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message with a button that opens the web app."""
    await update.message.reply_text(
        "Please press the button below to open the password generator web app.",
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text="Open Password Generator",
                web_app=WebAppInfo(url="https://webappforbot.vercel.app/generator.html"),
            )
        ),
    )

# Handle incoming WebAppData
async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the received web app data."""
    data = json.loads(update.effective_message.web_app_data.data)
    user_id = update.effective_user.id
    
    if data["action"] == "save_password":
        password = data["password"]
        if user_id not in context.bot_data:
            context.bot_data[user_id] = []
        context.bot_data[user_id].append(password)
    elif data["action"] == "get_history":
        password_history = context.bot_data.get(user_id, [])
        await update.effective_message.web_app_data.web_app_launch(
            json.dumps({"action": "show_history", "history": password_history})
        )

# Define a `/history` command handler.
async def history(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send the user's password generation history."""
    user_id = update.effective_user.id
    password_history = context.bot_data.get(user_id, [])
    
    if password_history:
        history_text = "Your password generation history:\n" + "\n".join(password_history)
    else:
        history_text = "No password generation history found."
    
    await update.message.reply_text(history_text)

def main() -> None:
    """Start the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token("7175277669:AAGstKftoqtTqw6Yu4A37t6G76BC6qEwgMA").build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("history", history))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    # Run the bot until the user presses Ctrl-C
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
