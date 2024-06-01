chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.type === 'SUBMIT_TEXT') {
        console.log(request.body)
        fetch('https://api.example.com/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: request.text, body: request.body }),
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ message: data.message || 'No message in response' });
            })
            .catch(error => {
                sendResponse({ message: 'Error: ' + error.message });
            });
        return true;  // Will respond asynchronously.
    }
});