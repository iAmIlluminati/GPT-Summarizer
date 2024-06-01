document.getElementById('submitButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => document.body.innerHTML
        }, (results) => {
            if (chrome.runtime.lastError || results.length === 0) {
                console.error('Scripting failed:', chrome.runtime.lastError);
                return;
            }
            const pageContent = results[0].result;
            const textInput = document.getElementById('textInput').value;
            chrome.runtime.sendMessage({
                type: 'SUBMIT_TEXT',
                text: textInput,
                body: pageContent
            }, (response) => {
                const message = response?.message ?? 'No response from server';
                document.getElementById('response').innerText = message;
            });
        });
    });
});

document.getElementById('textInput').addEventListener('click', function () {
    this.classList.toggle('fullscreen');
});
