DEFAULT_PROMPT = `
YOU ARE SPECICIALISED IN UNDERSTANDING UX COPY WRITING.
YOU WILL ANALYSE THE HTML PROVIDED, SEE WHATS THE THING IS ABOUT AND SUGGEST ME  BETTER COPY


GIVE THE RESPONSE AS A HTML THTA I CAN SWAP. GIVE IT WITH INLINE CSS
ONLY HTML CODE AS RESPONSE


NOTE : GIVE AS DIRECT HTML
`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'SUBMIT_TEXT') {

        fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`,  // Ensure to replace with actual env variable if needed
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "user", content: DEFAULT_PROMPT + request.prompt }, // Assuming prompt contains the user input
                    { role: "user", content: request.html }  // Assuming prompt contains the user input
                ],
            })
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ message: data.choices[0].message || 'No response from server' });  // Adjusted to handle the expected API response
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ message: 'Error submitting text' });
            });

        return true; // Indicates that the response will be sent asynchronously
    }
});