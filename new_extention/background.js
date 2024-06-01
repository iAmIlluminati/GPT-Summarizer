chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('XPath:', request.xpath);
    console.log('HTML:', request.html);
    if (request.type == 'SUBMIT_TEXT') {
        console.log('XPath:', request.xpath);
        console.log('HTML:', request.html);
        console.log('CSS:', request.css);
        console.log('Prompt:', request.prompt);

        fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer `,  // Ensure to replace with actual env variable if needed
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: request.prompt }, // Assuming prompt contains the user input
                    { role: "user", content: request.html }  // Assuming prompt contains the user input
                ],
            })
        })
            .then(response => { console.log(response); response.json() })
            .then(data => {
                console.log(data);
                sendResponse({ message: data || 'No response from server' });  // Adjusted to handle the expected API response
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ message: 'Error submitting text' });
            });

        return true; // Indicates that the response will be sent asynchronously
    }
});