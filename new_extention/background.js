chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SUBMIT_TEXT') {
        console.log('XPath:', request.xpath);
        console.log('HTML:', request.html);
        console.log('CSS:', request.css);
        console.log('Prompt:', request.prompt);
        fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`,  // Ensure to replace with actual env variable if needed
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: request.text }, // Assuming prompt contains the user input
                    { role: "user", content: request.html }  // Assuming prompt contains the user input
                ],
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.choices[0].message)
                sendResponse({ message: data.choices[0].message || 'No response from server' });  // Adjusted to handle the expected API response
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ message: 'Error submitting text' });
            });
        return true;
    }
});
