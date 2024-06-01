document.getElementById('analyzeButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: selectElement
        });
    });
});

function selectElement() {
    let selectedElement = null;
    let inputBox = null;
    let submitButton = null;
    let container = null; // Declare the container variable here

    function generateXPath(element) {
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

    function handleMouseOver(event) {
        if (!event.target.classList.contains('highlighted') &&
            !event.target.closest('.input-container')) { // Use closest to check for parent as well
            event.target.style.border = '2px solid orange';
        }
    }

    function handleMouseOut(event) {
        if (!event.target.classList.contains('highlighted') &&
            !event.target.closest('.input-container')) { // Use closest to check for parent as well
            event.target.style.border = '';
        }
    }

    function handleClick(event) {
        if (event.target.closest('.input-container')) {
            event.stopPropagation(); // Prevents event from propagating to other elements
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (selectedElement === event.target) {
            event.target.classList.remove('highlighted');
            event.target.style.border = '';
            selectedElement = null;
            if (container) {
                container.remove();
                container = null;
            }
        } else {
            if (selectedElement) {
                selectedElement.classList.remove('highlighted');
                selectedElement.style.border = '';
            }
            selectedElement = event.target;
            selectedElement.classList.add('highlighted');
            selectedElement.style.border = '2px solid red';

            if (container) {
                container.remove();
            }

            // Create a container for the input box and submit button
            container = document.createElement('div');
            container.classList.add('input-container'); // Add a class to identify the container
            container.style.position = 'absolute';
            container.style.left = `${event.pageX}px`;
            container.style.top = `${event.pageY}px`;
            container.style.zIndex = '1000';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            container.style.padding = '10px';
            container.style.borderRadius = '5px';
            container.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            container.style.width = '400px';

            // Create the input box
            inputBox = document.createElement('textarea');
            inputBox.classList.add('prompt-box');
            inputBox.style.width = '100%';
            inputBox.style.height = '100px';
            inputBox.style.border = '1px solid #ccc';
            inputBox.style.outline = 'none';
            inputBox.style.marginBottom = '10px';
            inputBox.placeholder = 'Enter your prompt here...';

            // Create the submit button
            submitButton = document.createElement('button');
            submitButton.classList.add('submit-button');
            submitButton.innerText = 'Submit';
            submitButton.style.width = '100%';
            submitButton.style.padding = '10px';
            submitButton.style.border = 'none';
            submitButton.style.backgroundColor = '#007BFF';
            submitButton.style.color = 'white';
            submitButton.style.borderRadius = '5px';

            // Append elements to the container and then to the body
            container.appendChild(inputBox);
            container.appendChild(submitButton);
            document.body.appendChild(container);

            submitButton.addEventListener('click', () => {
                const elementXPath = generateXPath(selectedElement);
                const elementHTML = selectedElement.outerHTML;
                const elementCSS = getComputedStyle(selectedElement).cssText;
                console.log({
                    type: 'SUBMIT_TEXT',
                    xpath: elementXPath,
                    html: elementHTML,
                    css: elementCSS,
                    prompt: inputBox.value
                })
                chrome.runtime.sendMessage({
                    type: 'SUBMIT_TEXT',
                    xpath: elementXPath,
                    html: elementHTML,
                    css: elementCSS,
                    prompt: inputBox.value
                });

            });
        }
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);

}


