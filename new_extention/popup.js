document.getElementById('submitButton').addEventListener('click', () => {
    const textInput = document.getElementById('textInput').value;
    const bodyContent = document.body.innerHTML;
    chrome.runtime.sendMessage({ type: 'SUBMIT_TEXT', text: textInput, body: bodyContent }, (response) => {
        const message = response && response.message ? response.message : 'No response from server';
        document.getElementById('response').innerText = message;
    });
});

document.getElementById('textInput').addEventListener('click', function () {
    this.classList.toggle('fullscreen');
});