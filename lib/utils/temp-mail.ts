
import axios from 'axios';

export class TempMailProvider {
    private static API_URL = 'https://www.1secmail.com/api/v1/';

    /**
     * Generates a random temporary email address
     */
    static async generateEmail(): Promise<string> {
        const response = await axios.get(`${this.API_URL}?action=genRandomMailbox&count=1`);
        return response.data[0];
    }

    /**
     * Checks the inbox for a specific email address
     */
    static async checkInbox(email: string) {
        const [username, domain] = email.split('@');
        const response = await axios.get(`${this.API_URL}?action=getMessages&login=${username}&domain=${domain}`);
        return response.data; // Array of message objects: {id, from, subject, date}
    }

    /**
     * Fetches a specific message body (useful for extracting verification codes)
     */
    static async getMessageContent(email: string, messageId: number) {
        const [username, domain] = email.split('@');
        const response = await axios.get(`${this.API_URL}?action=readMessage&login=${username}&domain=${domain}&id=${messageId}`);
        return response.data; // {id, from, subject, date, content, body, textBody, htmlBody}
    }

    /**
     * Polls the inbox until a message with a specific keyword arrives (e.g. "verify", "code")
     */
    static async waitForCode(email: string, keyword: string, timeoutMs = 60000): Promise<string | null> {
        const start = Date.now();
        console.log(`🕵️‍♂️ [TEMP-MAIL] Waiting for code in ${email}...`);

        while (Date.now() - start < timeoutMs) {
            const messages = await this.checkInbox(email);
            for (const msg of messages) {
                if (msg.subject.toLowerCase().includes(keyword.toLowerCase()) || msg.from.toLowerCase().includes(keyword.toLowerCase())) {
                    const fullMsg = await this.getMessageContent(email, msg.id);
                    return fullMsg.body || fullMsg.textBody;
                }
            }
            await new Promise(r => setTimeout(r, 5000)); // Poll every 5s
        }
        return null;
    }
}
