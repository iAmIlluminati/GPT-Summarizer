document.getElementById('submitButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: selectElement
        });
    });
});
// Function to generate XPath for any element
function generateXPath(element) {
    console.log(element)
    if (element.id) return 'id("' + element.id + '")';
    if (element === document.body) return element.tagName;

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) return generateXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
}

function selectElement() {
    let selectedElement = null;

    function handleMouseOver(event) {
        if (!event.target.classList.contains('highlighted')) {
            event.target.style.border = '2px solid orange';
        }
    }

    function handleMouseOut(event) {
        if (!event.target.classList.contains('highlighted')) {
            event.target.style.border = '';
        }
    }

    function handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        if (selectedElement === event.target) {
            event.target.classList.remove('highlighted');
            event.target.style.border = '';
            selectedElement = null;
        } else {
            if (selectedElement) {
                selectedElement.classList.remove('highlighted');
                selectedElement.style.border = '';
            }
            selectedElement = event.target;
            selectedElement.classList.add('highlighted');
            selectedElement.style.border = '2px solid red';

            const elementXPath = generateXPath(selectedElement);
            const elementHTML = selectedElement.outerHTML;
            const elementCSS = getComputedStyle(selectedElement).cssText;

            chrome.runtime.sendMessage({
                type: 'SUBMIT_TEXT',
                xpath: elementXPath,
                html: elementHTML,
                css: elementCSS
            });
        }
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
}

// Add the generateXPath function from your content.js here if not already included
