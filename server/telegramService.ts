/**
 * Telegram Service Utility
 * 
 * Sends messages to the admin via a Telegram Bot.
 */

export async function sendTelegramMessage(message: string) {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.error("❌ Telegram credentials missing in .env");
            return false;
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
            console.log("✅ Telegram notification sent successfully!");
            return true;
        } else {
            console.error("❌ Telegram API Error:", data);
            return false;
        }
    } catch (error) {
        console.error("Telegram Service Error:", error);
        return false;
    }
}
