chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SUBMIT_TEXT') {
        console.log('XPath:', request.xpath);
        console.log('HTML:', request.html);
        console.log('CSS:', request.css);
        console.log('Prompt:', request.prompt);
        // Replace 'YOUR_API_ENDPOINT' with the actual endpoint
        // Replace 'OPENROUTER_API_KEY' with your actual API key
        // Replace 'YOUR_SITE_URL' and 'YOUR_SITE_NAME' with your actual site details
        // fetch('https://openrouter.ai/api/v1/chat/completions', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        //         'HTTP-Referer': `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
        //         'X-Title': `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         model: "openai/gpt-3.5-turbo",
        //         messages: [
        //             { role: "system", content: request.body }, // This could be HTML or any other data from the webpage
        //             { role: "user", content: request.text } // User-entered text
        //         ],
        //     })
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         sendResponse({ message: data.message || 'No response from server' });
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //         sendResponse({ message: 'Error submitting text' });
        //     });
        // return true; // Indicates that the response will be sent asynchronously
    }
});
