import React, { createContext, useState } from 'react';

// Create a React Context to manage and share state across the application.
export const Context = createContext();

/**
 * A utility function to format raw text from the API response into
 * HTML with proper line breaks, bolding, and code blocks.
 * This function now handles markdown lists and formats the output
 * to look like the first image you provided.
 *
 * @param {string} text - The raw text content from the API.
 * @returns {string} - The formatted HTML string.
 */
const formatText = (text) => {
    // If there is no text, return an empty string to prevent errors.
    if (!text) return '';

    let formattedHtml = '';
    // Split the text into parts, separating code blocks from regular text.
    const parts = text.split('```');
    
    // Process each part of the split text.
    parts.forEach((part, index) => {
        // Parts at even indices are plain text.
        if (index % 2 === 0) {
            let textHtml = part;

            // Handle bolding: replace **text** with <strong>text</strong>.
            textHtml = textHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Handle lists: replace new line followed by an asterisk with a line break and a tab.
            textHtml = textHtml.replace(/\n\s*\*\s*/g, '<br/>&emsp;');
            
            // Handle regular line breaks: replace \n with <br/>
            textHtml = textHtml.replace(/\n/g, '<br/>');

            formattedHtml += textHtml;
        } else {
            // Parts at odd indices are code blocks.
            const codeContent = part.trim();
            // Extract the language name from the first line.
            const languageMatch = codeContent.match(/^(\w+)\n/);
            const language = languageMatch ? languageMatch[1] : '';
            // Get the actual code content without the language line.
            const codeText = languageMatch ? codeContent.substring(languageMatch[0].length) : codeContent;

            // Construct the HTML for the code block with a header, language label, and copy button.
            formattedHtml += `
                <div class="code-block">
                    <div class="code-header">
                        <span class="language-label">${language}</span>
                        <button class="copy-button">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1zM3 1a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4.5A.5.5 0 0 1 4 1.5V1H3z"/>
                                <path d="M9.5 2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v.5h-1a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 1 0v-.5a.5.5 0 0 1 .5-.5h2z"/>
                            </svg>
                            Copy
                        </button>
                    </div>
                    <pre><code class="language-${language}">${codeText.trim()}</code></pre>
                </div>
            `;
        }
    });

    return formattedHtml;
};


const ContextProvider = ({ children }) => {
    // State for managing user input and chat history.
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    // State for storing the formatted result.
    const [resultData, setResultData] = useState('');
    // State for loading indicator.
    const [loading, setLoading] = useState(false);
    // State to toggle the result display.
    const [showResult, setShowResult] = useState(false);

    // Function to reset chat state for a new conversation.
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setInput('');
        setResultData('');
        setRecentPrompt('');
    };

    /**
     * Function to handle sending a prompt to the API and loading the response.
     * This version sets the formatted result directly without a streaming animation.
     *
     * @param {string} prompt - The user's prompt to send to the API.
     */
    const loadPrompt = async (prompt) => {
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(prompt);
        setResultData(''); // Clear the result data before a new load.

        try {
            // Prepare the payload for the API call.
            const payload = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            };
            // Use an empty API key, as the Canvas environment will provide it.
            const apiKey = "AIzaSyAIacMu-_jZCj8Ry6OPQfIqmoU9V3tU3Oc";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`API call failed with status: ${res.status}`);
            }

            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!rawText) {
                setResultData('No response received from Gemini.');
            } else {
                // The main change is here: format the full text immediately
                // and set it as the result, instead of using the streaming effect.
                setResultData(formatText(rawText));
            }
        } catch (error) {
            console.error('Error:', error);
            setResultData('Error communicating with Gemini API. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };
    
    // Function called when the user sends a new message.
    const onSent = async (prompt) => {
        // If a new prompt is sent, add it to the history.
        if (!prevPrompts.includes(prompt)) {
            setPrevPrompts(prev => [prompt, ...prev]);
        }
        setInput('');
        await loadPrompt(prompt);
    };

    /**
     * The new function to delete a prompt from the history.
     * It filters the previous prompts array and updates the state.
     *
     * @param {number} index - The index of the prompt to be deleted.
     */
    const deletePrompt = (index) => {
        // Create a new array by filtering out the prompt at the specified index.
        const updatedPrompts = prevPrompts.filter((_, i) => i !== index);
        // Update the state with the new array.
        setPrevPrompts(updatedPrompts);
    };

    // The value provided to the context.
    const contextValue = {
        onSent,
        input,
        setInput,
        recentPrompt,
        prevPrompts,
        newChat,
        showResult,
        loading,
        resultData,
        loadPrompt,
        // The deletePrompt function is now correctly exposed to the context.
        deletePrompt
    };

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;