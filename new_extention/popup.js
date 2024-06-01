document.getElementById('submitButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: selectElement
        });
    });
});

// Function to highlight and select an element
function selectElement() {
    // Remove any existing event listeners to prevent duplicates
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
    document.removeEventListener('click', handleClick);

    // Highlight elements on mouse over
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleClick, true);

    function handleMouseOver(event) {
        event.target.style.border = '2px solid red';
    }

    function handleMouseOut(event) {
        event.target.style.border = '';
    }

    function handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        // Remove highlighting functionality
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleClick);

        // Dim other elements
        document.body.style.backgroundColor = 'rgba(0,0,0,0.5)';
        event.target.style.border = '';
        event.target.style.backgroundColor = 'white';

        // Send selected element's HTML to the background script
        chrome.runtime.sendMessage({
            type: 'SUBMIT_TEXT',
            text: document.getElementById('textInput').value,
            body: event.target.outerHTML
        }, (response) => {
            const message = response?.message ?? 'No response from server';
            document.getElementById('response').innerText = message;
            // Reset the body's background color
            document.body.style.backgroundColor = '';
        });
    }
}

document.getElementById('textInput').addEventListener('click', function () {
    this.classList.toggle('fullscreen');
});
