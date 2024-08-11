const serverAddress = process.env.SERVER_ADDRESS || 'http://localhost:5051';
export const RequestExplanation = async (prompt : string) : Promise<string> => {
    return fetch(`${serverAddress}/api/LLM`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({prompt})
    }).then(res => res.json()).then(data => data.response).catch(error => {
        // Handle the error here
        console.debug(error);
        return "An error occurred while trying to request an explanation.";
    });
    };
    