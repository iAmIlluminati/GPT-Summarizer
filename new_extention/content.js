//content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PAGE_CONTENT') {
        sendResponse({ content: document.body.innerHTML });
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SUBMIT_TEXT') {
        console.log('XPath:', request.xpath);
        console.log('HTML:', request.html);
        console.log('CSS:', request.css);
        // Perform additional actions here if necessary
    }
});


