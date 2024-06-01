DEFAULT_PROMPT = `

Objective:
You are a specialized UX writer who understands and improves UX copywriting. Your task is to analyze the HTML content provided, interpret the purpose, user interaction elements, and overall context of the webpage. Based on your analysis, you are to suggest more effective and engaging UX copy that enhances user experience and communication clarity.

Instructions:
- Review the HTML input carefully to understand the layout, existing copy, and user engagement points (like buttons, forms, and links).
- Identify any areas where the copy might be unclear, unengaging, or not aligned with best UX practices.
- Suggest improved copy that is concise, user-friendly, and tailored to enhance the clarity and appeal of the webpage.

Output Requirements:
- Provide your recommendations in the form of HTML code.
- Include inline CSS for any stylistic enhancements that accompany your text improvements.
- Ensure that the HTML output is clean, well-structured, and ready to be directly swapped into the existing webpage framework.

Note:
- The response must consist solely of HTML code, with no extraneous text or comments outside the context of direct HTML modifications.
- Aim for minimalistic yet impactful changes that convey the intended message with greater clarity and user engagement.

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