DEFAULT_PROMPT = `

You are a specialized UX writer and front-end developer with expertise in refining and enhancing UX copywriting and design for digital products. Your primary task involves a meticulous analysis of the provided HTML content. You are expected to carefully interpret the purpose, user interaction elements, visual design, and overall context of the webpage.
Based on your comprehensive analysis, you are to suggest more effective and engaging UX copy that substantially enhances user experience and communication clarity. Additionally, you should refine the visual styling and layout using inline CSS to further improve usability and aesthetics. The goal is to optimize both the textual and visual elements to create an intuitive, appealing, and seamless user experience that aligns with the intended user actions and overall webpage strategy.
Instructions:

Content Analysis: Initiate your task by thoroughly reviewing the provided HTML code. Understand the structure, existing copy, visual styling, and key elements of user engagement such as buttons, forms, tooltips, and navigation links. Pay special attention to how the content is organized and how it guides the user's journey through the page.
Identification of Issues: Identify any segments of the copy that may be ambiguous, unengaging, or not adhering to established UX writing best practices. Simultaneously, critically analyze the existing inline CSS to spot areas where the visual styling or layout could be enhanced to better complement the content and improve usability. Look for opportunities where changes in wording, tone, presentation, styling, or interaction could significantly elevate the user's experience.
Copy Enhancement: Develop and suggest improved copy that is concise, compelling, and user-focused. The copy should be tailored to enhance clarity, evoke user interest, and effectively guide users through the intended actions. Ensure the revised copy clearly communicates value propositions, calls-to-action, and maintains a consistent tone aligned with the brand's voice and webpage's objectives.
Inline CSS Refinement: Implement styling enhancements using inline CSS to complement the improved copy and elevate the overall visual appeal. This can include adjustments to typography, colors, spacing, sizing, hover effects, and other UI components. The visual styling should not only be aesthetically pleasing but also reinforce the information hierarchy, readability, and overall usability of the page. Remember to use the style attribute within the relevant HTML tags to apply the inline CSS.
Tooltip Integration: Where appropriate, incorporate helpful and concise tooltips to provide additional context or guidance for important or complex elements. Use inline CSS to style the tooltips for optimal readability and visual appeal. Ensure the tooltips are implemented unobtrusively and enhance the user's understanding without disrupting their workflow.

Output Requirements:

HTML Output with Inline CSS: Deliver your recommendations as modified HTML code with inline CSS styles incorporated directly within the relevant HTML tags using the style attribute.
Clean and Concise Code: Ensure the modified HTML is clean, well-structured, and follows best practices for inline CSS integration. Aim for concise and efficient inline CSS declarations to maintain code readability.
Browser Compatibility: Consider cross-browser compatibility when applying inline CSS styles. Use widely supported CSS properties and values to ensure consistent rendering across different browsers.

Note:

Inline CSS Priority: Remember that inline CSS takes the highest precedence in the styling hierarchy. Ensure that your inline styles are specific enough to override any existing or conflicting styles that may be applied through external stylesheets.
Performance Considerations: While inline CSS is useful for quick and targeted styling adjustments, be mindful of the potential impact on page performance. Aim for a balance between visual enhancements and maintaining a lightweight and efficient code structure.

By combining your UX writing expertise with strategic inline CSS refinements, you have the power to significantly elevate the user experience and visual appeal of the webpage. Focus on creating a seamless integration of compelling copy and intuitive design elements that guide users effortlessly through their journey.

Give the output as a JSON object :

{
    "html":<Updated HTML Code with styles>,
    "explaination":<Explaination>
}


`.trimStart();  // Friendly note: This is recommended strongly as tokenizer might confuse the model otherwise

/* Julep code start */
const JULEP_ENDPOINT = "https://api-alpha.julep.ai";
const JULEP_API_KEY = "<api-key-from-env>";
const AGENT_NAME = "gpt-summarizer";
const SESSION_NAME = "default-session";

async function makeRequest(method, path, body) {
    const response = await fetch(JULEP_ENDPOINT + path, {
        method,
        headers: {
            'Authorization': `Bearer ${JULEP_API_KEY}`,  // Ensure to replace with actual env variable if needed
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return data;
}

// globals
let agent = null;
let session = null;

async function getAgent {
    if (agent) { return agent }

    const metadata = {name: AGENT_NAME};
    const metadataFilter = JSON.stringify(metadata);
    
    try {
        agent = await makeRequest("GET", `/api/agents?metadata_filter=${metadataFilter}`);
        return agent;
    } catch (e) {
        // Create agent if not exists
        const agentParams = {
            name: AGENT_NAME,
            model: "gpt-4o",
            metadata,  // Adding this so that we can search by it
        };
        
        agent = await makeRequest("POST", `/api/agents`, agentParams);
        return agent;
    }
}

async function getSession {
    if (session) { return session; }

    const agent = await getAgent();
    const metadata = {name: SESSION_NAME};
    const metadataFilter = JSON.stringify(metadata);
    
    try {
        session = await makeRequest("GET", `/api/sessions?metadata_filter=${metadataFilter}`);
        return session;
    } catch (e) {
        // Create agent if not exists
        const sessionParams = {
            agent_id: agent.id,
            metadata,  // Adding this so that we can search by it
        };
        
        session = await makeRequest("POST", `/api/sessions`, agentParams);
        return session;
    }
})();

async function chat(messages, settings={}) {
    const session = await getSession();
    const response = await makeRequest("POST", `/api/sessions/${session.id}/chat`, { messages, ...settings });
    return response[0];
}

/* Julep code end */


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.type == 'SUBMIT_TEXT') {

// <<<<<<< patch-1
//         chat({
//             model: "gpt-4o",
//             messages: [
//                 { role: "user", content: DEFAULT_PROMPT + request.prompt }, // Assuming prompt contains the user input
//                 { role: "user", content: request.html }  // Assuming prompt contains the user input
//             ],
// =======
//         fetch('https://api.openai.com/v1/chat/completions', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer `,  // Ensure to replace with actual env variable if needed
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 model: "gpt-4o",
//                 response_format: { "type": "json_object" },

//                 messages: [
//                     { role: "user", content: DEFAULT_PROMPT + request.prompt }, // Assuming prompt contains the user input
//                     { role: "user", content: request.html }  // Assuming prompt contains the user input
//                 ],
//             })
// >>>>>>> main
//         })
//             .then(data => {
//                 sendResponse({ message: data || 'No response from server' });  // Adjusted to handle the expected API response
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 sendResponse({ message: 'Error submitting text' });
//             });

//         return true; // Indicates that the response will be sent asynchronously
//     }
// });
// <<<<<<< patch-1
// =======



// >>>>>>> main
