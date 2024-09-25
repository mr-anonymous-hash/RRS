import React, { useEffect, useState } from 'react';
import './../app/globals.css';

const Toast = ({ message, isOpen, autoCloseDuration = 600 }) => {
    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, autoCloseDuration);

            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [isOpen, autoCloseDuration]);

    if (!visible) return null;

    return( 
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="toast bg-gray-600 rounded-lg p-4 shadow-lg flex items-center">
                <div className="toast-icon mr-2">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M15.795 8.342l-5.909 9.545a1 1 0 0 1-1.628 0l-3.182-4.909a1 1 0 0 1 1.629-1.165l2.556 3.953L14.165 7.51a1 1 0 0 1 1.63 1.165z"></path>
                    </svg>
                </div>
                <div className="toast-content text-white">{message}</div>
            </div>
        </div>
    )
};

export default Toast;
