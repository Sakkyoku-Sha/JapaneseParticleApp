const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const express = require('express');
const CHATGPT_API = require('./LLM_API/CHATGPT_API');

const app = express();
const expressPort = process.env.EXPRESS_SERVER_PORT || 5051;

// Middleware to parse proxied request from NGINX host. 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to allow CORS Uncomment for Local Developement  
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// }); 

// Example route that uses the CHATGPT_API
app.post('/api/LLM', async (req, res) => {

   const prompt = req.body.prompt;
   if(prompt == undefined){
        res.json({message: "Please provide a prompt"});
        return;
   }

  const response = await CHATGPT_API.sendPromptToGPT4(prompt);
  res.json({response : response});
});


app.listen(expressPort, () => {
  console.log(`Server running at http://localhost:${expressPort}`);
});

