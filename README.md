# Web App for Practicing 助詞

This web app is designed to help users practice **助詞** (particles) in Japanese through automated sentence mining and AI-driven explanations.

## Features

- **Text Parsing**: Copy and paste any Japanese text (e.g., from NHK articles) into the main page and click *Submit*.
- **Automated Sentence Mining**: The app automatically parses the text and removes all 助詞 from the sentence.
- **Answer Input**: Users can fill in the blanks with the 助詞 they think are correct.
- **Answer Evaluation**: After submission, users can mark their answers and get feedback.

## How to Use

1. Copy and paste Japanese text into the main page.
2. Click *Submit*.
3. The app will parse the sentence and remove the 助詞.
4. Type your answers into the blank spaces and submit.
5. The app will evaluate your answers and provide feedback.

### Example:

You can use articles from websites like NHK for practice. 

![Text Parsing Example](https://github.com/user-attachments/assets/6629ade8-5690-4fc6-a196-5b6e958c6caf)

### Answering the Blanks:

Users will fill in the blanks with their guesses for the missing 助詞. Once answered, they can mark their responses.

![Answering the Blanks](https://github.com/user-attachments/assets/dc2e4d86-4991-4dcb-8f27-f5af6be1f595)

### Feedback & AI Explanations:

If a user’s answer is incorrect, a red button will appear. When clicked, it will call the OpenAPI to provide an explanation of why the answer was wrong and why the correct answer is right.

![Feedback and AI Explanation](https://github.com/user-attachments/assets/ddfd119a-fbe1-4bfc-9ba9-6028eb90292c)

## Get Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Provide your OpenAI API key in the .env file, and configure your node servers desired port.
4. Run the app with `npm start`, and run the server.js using node.
5. Start practicing 助詞 and improve your Japanese!

---

For more information, check out the project documentation or open an issue if you need help.
