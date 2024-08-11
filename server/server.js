const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const express = require('express');
const path = require('path');
const cors = require('cors');
const CHATGPT_API = require('./LLM_API/CHATGPT_API');

const app = express();
const port = process.env.PORT || 5051;
const frontEndOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';

//CORs Middleware to allow requests from the frontend
app.use(cors({
    origin: frontEndOrigin
}));
app.use(express.json());

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

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../jpa/dist')));


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

