chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SUBMIT_TEXT') {
        console.log('Request body:', request.body);
        fetch('YOUR_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: request.text, body: request.body })
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ message: data.message || 'No response from server' });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ message: 'Error submitting text' });
            });
        return true; // Indicates that the response is sent asynchronously
    }
});