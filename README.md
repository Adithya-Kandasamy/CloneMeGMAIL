# CloneMe
Your AI digital twin — built at ACLHacks '26

Can't reply to everyone? Clone yourself. CloneMe builds an AI version of you that chats like you and can even reply to your emails automatically.

## Setup
You need a free Groq API key first. Go to console.groq.com, sign up, and grab your key. Then open code.html and find this line near the top and replace it with your key: const GROQ_KEY = "your-key-here";

## How to use

### 1. Run the chat app
Open code.html in your browser, fill in your name, vibe, passions, and how you talk — then chat with your clone.

### 2. Get your Gmail script
Once your clone is set up, hit Export Gmail Script and copy the code it generates.

### 3. Set it up in Google
Go to script.google.com, paste the code into Code.gs, run saveClonePersona once to save your info, then set a time-based trigger on checkUnansweredEmails to run every hour. Your clone handles emails from there.

## Stack
HTML / CSS / JS · Groq API · Llama 3.1 · Google Apps Script · Claude (Anthropic)

## Built at ACLHacks '26 — Theme: Cloning
