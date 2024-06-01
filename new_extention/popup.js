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

    function handleMouseOver(event) {
        if (!event.target.classList.contains('highlighted') && !event.target.classList.contains('prompt-box')) {
            event.target.style.border = '2px solid orange';
        }
    }

    function handleMouseOut(event) {
        if (!event.target.classList.contains('highlighted') && !event.target.classList.contains('prompt-box')) {
            event.target.style.border = '';
        }
    }

    function handleClick(event) {
        if (event.target.classList.contains('prompt-box') || event.target.classList.contains('submit-button')) {
            return; // Ignore clicks on the prompt box or submit button
        }

        event.preventDefault();
        event.stopPropagation();

        if (selectedElement === event.target) {
            event.target.classList.remove('highlighted');
            event.target.style.border = '';
            selectedElement = null;
            if (inputBox) {
                inputBox.remove();
                inputBox = null;
            }
            if (submitButton) {
                submitButton.remove();
                submitButton = null;
            }
        } else {
            if (selectedElement) {
                selectedElement.classList.remove('highlighted');
                selectedElement.style.border = '';
            }
            selectedElement = event.target;
            selectedElement.classList.add('highlighted');
            selectedElement.style.border = '2px solid red';

            if (inputBox) {
                inputBox.remove();
            }
            if (submitButton) {
                submitButton.remove();
            }

            inputBox = document.createElement('textarea');
            inputBox.classList.add('prompt-box');
            inputBox.style.position = 'absolute';
            inputBox.style.left = `${event.pageX}px`;
            inputBox.style.top = `${event.pageY}px`;
            inputBox.placeholder = 'Enter your prompt here...';
            document.body.appendChild(inputBox);

            submitButton = document.createElement('button');
            submitButton.classList.add('submit-button');
            submitButton.style.position = 'absolute';
            submitButton.style.left = `${event.pageX}px`;
            submitButton.style.top = `${event.pageY + 100}px`;
            submitButton.innerText = 'Submit';
            document.body.appendChild(submitButton);

            submitButton.addEventListener('click', () => {
                const elementXPath = generateXPath(selectedElement);
                const elementHTML = selectedElement.outerHTML;
                const elementCSS = getComputedStyle(selectedElement).cssText;

                chrome.runtime.sendMessage({
                    type: 'SUBMIT_TEXT',
                    xpath: elementXPath,
                    html: elementHTML,
                    css: elementCSS,
                    prompt: inputBox.value
                });

                inputBox.remove();
                inputBox = null;
                submitButton.remove();
                submitButton = null;
            });
        }
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);

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
}