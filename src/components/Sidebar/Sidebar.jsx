import React, { useState, useContext, useEffect, useRef } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context.jsx'; // Correct import path

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    
    // Ref to detect clicks outside of the menu container
    const menuRef = useRef(null);
    
    // Destructure new functions from Context
    const { 
        prevPrompts, 
        onSent, 
        newChat, 
        renamePrompt, 
        deletePrompt, 
        pinPrompt 
    } = useContext(Context);

    // This useEffect hook handles closing the dropdown menu on an outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuIndex(null);
            }
        };

        // Add the event listener when the component mounts
        document.addEventListener("mousedown", handleClickOutside);
        
        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const loadPrompt = async (prompt) => {
        await onSent(prompt);
        setOpenMenuIndex(null);
    };

    const toggleMenu = (index, e) => {
        e.stopPropagation();
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };


    const handleDelete = (index, e) => {
    // This is the key fix: It stops the click from triggering the parent div's onClick.
    e.stopPropagation();
    deletePrompt(index);
    setOpenMenuIndex(null);
};


    return (
        <div className='sidebar'>
            <div className='top'>
                <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="" />
                
                <div onClick={newChat} className='new-chat'>
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>

                {extended ?
                    <div className='recent'>
                        <p className='recent-title'>Recent</p>
                        {prevPrompts.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => loadPrompt(item)}
                                className='recent-entry'
                            >
                                <img src={assets.message_icon} alt="" />
                                <p>{item.length > 18 ? item.substring(0, 15) + '...' : item}</p>

                                {/* Attach the ref to the container of the menu */}
                                <div className="menu-container" ref={menuRef}>
                                    <div className="three-dots" onClick={(e) => toggleMenu(index, e)}>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>

                                    {openMenuIndex === index && (
                                        <div className="dropdown-menu">
                                            <div className="menu-item" onClick={(e) => handleDelete(index, e)}>
                                                <img src={assets.delete_icon} alt="" />
                                                Delete
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div> : null
                }
            </div>
            
            {/* ... (rest of the bottom section) ... */}
            <div className="bottom">
                <div className='bottom-entry recent-entry'>
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className='bottom-entry recent-entry'>
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>History</p> : null}
                </div>
                <div className='bottom-entry recent-entry'>
                    <img src={assets.setting_icon} alt="" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;