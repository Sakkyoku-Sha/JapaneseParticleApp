const serverAddress = process.env.VUE_APP_FRONT_END_API_ADDRESS || 'https://localhost';

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
    