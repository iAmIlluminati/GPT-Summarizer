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
    let container = null;

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
            !event.target.closest('.input-container')) {
            event.target.style.border = '2px solid orange';
        }
    }

    function handleMouseOut(event) {
        if (!event.target.classList.contains('highlighted') &&
            !event.target.closest('.input-container')) {
            event.target.style.border = '';
        }
    }

    function createInfoIconSVG() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.style.cursor = "pointer";

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "10");
        circle.setAttribute("fill", "#007BFF");  // Blue background

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M11 7h2v2h-2zM11 11h2v5h-2z");
        path.setAttribute("fill", "#ffffff");  // White text

        svg.appendChild(circle);
        svg.appendChild(path);

        return svg;
    }



    function handleClick(event) {
        if (event.target.closest('.input-container')) {
            event.stopPropagation();
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

            container = document.createElement('div');
            container.classList.add('input-container');
            container.style.position = 'absolute';
            container.style.left = `${event.pageX}px`;
            container.style.top = `${event.pageY}px`;
            container.style.zIndex = '1000';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            container.style.padding = '10px';
            container.style.borderRadius = '5px';
            container.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            container.style.width = '400px';

            const inputBox = document.createElement('textarea');
            inputBox.classList.add('prompt-box');
            inputBox.style.width = '100%';
            inputBox.style.height = '100px';
            inputBox.style.border = '1px solid #ccc';
            inputBox.style.outline = 'none';
            inputBox.style.marginBottom = '10px';
            inputBox.style.color = 'black';
            inputBox.placeholder = 'Enter your prompt here...';

            const submitButton = document.createElement('button');
            submitButton.classList.add('submit-button');
            submitButton.innerText = 'Submit';
            submitButton.style.width = '100%';
            submitButton.style.padding = '10px';
            submitButton.style.border = 'none';
            submitButton.style.backgroundColor = '#007BFF';
            submitButton.style.color = 'white';
            submitButton.style.borderRadius = '5px';

            container.appendChild(inputBox);
            container.appendChild(submitButton);
            document.body.appendChild(container);

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
                }, (response) => {
                    if (response && response.message) {
                        let output = JSON.parse(response.message.choices[0].message.content);
                        console.log(output);

                        selectedElement.innerHTML = output.html;

                        // Create and append info icon
                        const infoIcon = createInfoIconSVG();
                        infoIcon.title = 'Click for explanation';
                        selectedElement.appendChild(infoIcon);

                        // Add event listener to info icon
                        infoIcon.addEventListener('click', (event) => {
                            const explanationBox = document.createElement('div');
                            explanationBox.style.cssText = `
            position: absolute; left: ${event.pageX}px; top: ${event.pageY}px;
            z-index: 2000; background-color: rgba(255, 255, 255, 0.9);
            padding: 10px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 300px; color: black;`;
                            explanationBox.innerText = output.explanation;
                            document.body.appendChild(explanationBox);

                            // Remove the explanation box when clicked outside
                            document.addEventListener('click', (e) => {
                                if (!explanationBox.contains(e.target) && e.target !== infoIcon) {
                                    explanationBox.remove();
                                }
                            }, { once: true });
                        });
                    }


                });

                container.remove();
                container = null;
            });
        }
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
}