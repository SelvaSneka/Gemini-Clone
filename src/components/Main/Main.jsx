// src/components/Main.jsx

import React, { useContext } from 'react';
import './Main.css'; // Your existing CSS file
import { assets } from '../../assets/assets'; // Your existing assets import
import { Context } from '../../context/Context.jsx'; // Import the Context

const Main = () => {
    // Destructure the necessary state and functions from your Context
    const {
        onSent,        // Function to send the prompt to Gemini
        input,         // Current value of the input textbox
        setInput,      // Function to update the input textbox value
        recentPrompt,  // The last prompt sent by the user
        showResult,    // Boolean to control visibility of result area
        loading,       // Boolean to indicate if AI is generating a response
        resultData,    // The AI's generated response (HTML formatted)
        // You might also want to expose prevPrompts from Context if Main handles history display
    } = useContext(Context);

    // Function to handle the "Send" button click (or send icon click)
    const handleSend = () => {
        if (input.trim()) { // Only send if the input is not empty or just whitespace
            onSent(input);    // Call the onSent function from Context with the current input
        }
    };

    // Handle Enter key press in the input field
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className='Main'>
            <div className='nav'>
                <p>Gemini</p>
                <img src={assets.sneka_icon} alt="User Icon" />
            </div>

            <div className="main-container">
                {/* Conditional rendering based on showResult */}
                {!showResult ? (
                    // Display greeting and suggestion cards when no result is shown
                    <>
                        <div className="greet">
                            <p><span>Hello! Sneka.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => onSent("Suggest places for road trip.")}>
                                <p>Suggest places for road trip.</p>
                                <img src={assets.compass_icon} alt="Compass Icon" />
                            </div>
                            <div className="card" onClick={() => onSent("Suggest a home decor with recycle things")}>
                                <p>Suggest a home decor with recycle things</p>
                                <img src={assets.bulb_icon} alt="Bulb Icon" />
                            </div>
                            <div className="card" onClick={() => onSent("Learn more about history of India")}>
                                <p>Learn more about history of India</p>
                                <img src={assets.message_icon} alt="Message Icon" />
                            </div>
                            <div className="card" onClick={() => onSent("Improve the readability of the following code")}>
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt="Code Icon" />
                            </div>
                        </div>
                    </>
                ) : (
                    // Display result area when showResult is true
                    <div className="result">
                        <div className="result-title">
                            <img src={assets.sneka_icon} alt="User Icon" /> {/* User icon for prompt */}
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="Gemini Icon" /> {/* Gemini icon for response */}
                            {loading ? (
                                <div className="loader">
                                    <hr /><hr /><hr /> {/* Simple loading animation */}
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Bottom (Input and Send Area) - always visible */}
            <div className="main-bottom">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder='Enter a prompt here'
                        value={input} // Bind input value to state
                        onChange={(e) => setInput(e.target.value)} // Update state on change
                        onKeyPress={handleKeyPress} // Handle Enter key press
                    />
                    <div>
                        <img src={assets.gallery_icon} alt="Gallery Icon" />
                        <img src={assets.mic_icon} alt="Mic Icon" />
                        {/* Attach handleSend to the send icon */}
                        {input ? <img onClick={handleSend} src={assets.send_icon} alt="Send Icon" className="cursor-pointer" /> : null}
                        {/* Only show send icon if there's input */}
                    </div>
                </div>
                <p className='bottom-info'>
                    Gemini may display inaccurate info, including about people, so double-check its responese. Your privacy and Gemini Apps.
                </p>
            </div>

            {/* Minimal CSS for the loader if not already in Main.css */}
            <style>{`
                .loader {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .loader hr {
                    border: none;
                    height: 20px;
                    background: linear-gradient(90deg, #f6f7f8 8%, #edeef0 18%, #f6f7f8 33%);
                    background-size: 800px 50px;
                    animation: loader 2s infinite linear;
                }
                .loader hr:nth-child(2) {
                    background-position: -600px 0;
                    animation-delay: 0.2s;
                }
                .loader hr:nth-child(3) {
                    background-position: -400px 0;
                    animation-delay: 0.4s;
                }
                @keyframes loader {
                    0% {
                        background-position: -800px 0;
                    }
                    100% {
                        background-position: 800px 0;
                    }
                }
            `}</style>
        </div>
    );
}

export default Main;
