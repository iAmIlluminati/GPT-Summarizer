chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PAGE_CONTENT') {
        sendResponse({ content: document.body.innerHTML });
    }
});