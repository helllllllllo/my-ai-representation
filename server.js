require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');
const fs = require('fs');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const app = express();
app.use(express.static('public'));
app.use(cors()); 
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  let messages = req.body.messages; // get the conversation history from the request

  // Check if there's a system message in the messages array
  const includesSystemMessage = messages.some(message => message.role === 'system');

  // If not, read the context from context.txt and add a system message
  if (!includesSystemMessage) {
    const context = fs.readFileSync('./context.txt', 'utf8');
    messages.unshift({
      "role": "system",
      "content": context
    });
  }

  // Add the user's message to the conversation.
  messages.push({
    "role": "user",
    "content": "Interviewer: " + userMessage + "\n Joe: "
  });

  try {
    const gptResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages
    });

    const botMessage = gptResponse.data.choices[0].message.content;
    // Add the bot's response to the conversation as context for next iteration.
    messages.push({
      "role": "assistant",
      "content": botMessage.trim()
    });

    console.log(messages);
    res.json({ response: botMessage.trim(), messages: messages }); // send the updated conversation history back to the client

  } catch (error) {
    res.json({ response: 'Sorry, I am unable to respond at the moment.'+error });
  }
});

app.listen(3000, () => console.log('Server running'));

