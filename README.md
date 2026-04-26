# CloneMe 
> Your AI digital twin — built at ACLHacks '26

Clone yourself as an AI that chats just like you and automatically replies to your emails.

## How to use

### 1. Clone the chat app
- Open `index.html` in a browser (or run with Live Server in VS Code)
- Fill in your name, role, passion, vibe, and personality traits
- Chat with your clone!

### 2. Export your Gmail auto-responder
- In the app, click **Export Gmail Script** after creating your clone
- Copy the generated code

### 3. Set up Gmail auto-replies
- Go to [script.google.com](https://script.google.com)
- Create a new project and paste the exported code into `Code.gs`
- Click **Run** on `saveClonePersona` to save your persona
- Add a time-based trigger for `checkUnansweredEmails` (every hour)
- Your clone will now auto-reply to unanswered emails in your voice!

## Built with
- HTML / CSS / JavaScript
- Groq API (Llama 3.1)
- Google Apps Script
- Gmail API
- Claude (Anthropic)

## Team
Built at ACLHacks '26 — Theme: Cloning
