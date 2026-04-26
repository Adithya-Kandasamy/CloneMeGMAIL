
// NOTE ON HOW THIS WAS BUILT
//
// Most of this script was written by us (~80%). That includes:
// - The overall idea (AI email auto-responder / digital clone)
// - The Gmail workflow (finding unread emails, checking sender,
//   replying, labeling, marking as read)
// - saveClonePersona() and how the persona is stored
// - checkUnansweredEmails() logic and filtering
// - Prompt design inside generateFollowUp()
// - Testing, debugging, and making everything work together
//
// Claude (AI) was used for a smaller part (~20%), mainly:
// - Helping structure the API request in generateFollowUp()
// - Fixing some issues with UrlFetchApp and headers
// - Minor debugging for parsing API responses
//
// We did the core logic and structure ourselves.
// ============================================================

var GROQ_KEY = "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";
var GROQ_MODEL = "llama-3.1-8b-instant"; 
var LABEL_NAME = "CloneMe/FollowedUp";

// RUN THIS FIRST (once only)
function saveClonePersona() {
  var persona = {
    name:    "Adithya Kandasamy",
    role:    "Entreprenurship student at stone bridge",
    passion: "our non profit called openbyte where we make tech more accessible, basketball",
    vibe:    "Im very chill, and I talk in US slang. I say bro a lot, and say Ig bro Ig when someone says something weird. Im very enthusiastic about hackathons. I say ... a lot.",
    traits:  ["Sarcastic","Chill","Logical","Empathetic"],
    hottake: "pineapple pizza"
  };
  PropertiesService.getScriptProperties().setProperty("CLONE_PERSONA", JSON.stringify(persona));
  Logger.log("Persona saved for: Adithya Kandasamy");
}

function checkUnansweredEmails() {
  var persona = getPersona();
  if (!persona) { Logger.log("Run saveClonePersona first!"); return; }

  var label = getOrCreateLabel(LABEL_NAME);
  var myEmail = Session.getActiveUser().getEmail();

  // Search inbox for unread emails not yet handled by the clone
  var threads = GmailApp.search("in:inbox is:unread -label:" + LABEL_NAME);
  Logger.log("Found " + threads.length + " candidate threads.");

  for (var i = 0; i < threads.length; i++) {
    try {
      var thread = threads[i];
      var messages = thread.getMessages();
      var lastMsg = messages[messages.length - 1];

      // Skip if YOU sent the last message (already replied)
      if (lastMsg.getFrom().indexOf(myEmail) !== -1) continue;

      var subject = thread.getFirstMessageSubject();
      var originalBody = lastMsg.getPlainBody().slice(0, 1000);
      Logger.log("Generating reply for: " + subject);

      var reply = generateFollowUp(persona, subject, originalBody);

      // Reply directly to the sender
      lastMsg.reply(reply);
      thread.addLabel(label);
      thread.markRead();
      Logger.log("Sent reply for: " + subject);
      Utilities.sleep(1500);
    } catch(err) {
      Logger.log("Error on thread: " + err);
    }
  }
}

function generateFollowUp(persona, subject, originalBody) {
  var systemPrompt = "You are writing a reply email on behalf of " + persona.name + ", a " + persona.role + ". " +
    "Communication style: " + persona.vibe + ". " +
    "Traits: " + persona.traits.join(", ") + ". " +
    "Passion: " + persona.passion + ". " +
    "Write a SHORT reply (2-4 sentences). Directly reference what was discussed. " +
    "Sound exactly like them. Body text only, no greeting or sign-off.";

  var payload = JSON.stringify({
    model: GROQ_MODEL,
    max_tokens: 200,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Subject: " + subject + "\nEmail received: " + originalBody + "\n\nWrite the reply body only." }
    ]
  });

  var response = UrlFetchApp.fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "post",
    headers: { "Authorization": "Bearer " + GROQ_KEY, "Content-Type": "application/json" },
    payload: payload,
    muteHttpExceptions: true
  });

  var json = JSON.parse(response.getContentText());
  if (!json.choices) {
    Logger.log("Groq error: " + response.getContentText());
    return "Hey, got your email about " + subject + "! Let me get back to you on that...";
  }
  return json.choices[0].message.content.trim();
}

function getPersona() {
  var raw = PropertiesService.getScriptProperties().getProperty("CLONE_PERSONA");
  return raw ? JSON.parse(raw) : null;
}

function getOrCreateLabel(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function formatDateForSearch(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1);
  var d = String(date.getDate());
  if (m.length < 2) m = "0" + m;
  if (d.length < 2) d = "0" + d;
  return y + "/" + m + "/" + d;
}
