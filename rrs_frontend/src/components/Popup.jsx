import React, { useEffect } from 'react';
import './../app/globals.css'

const Popup = ({ title, message, isOpen, autoCloseDuration = 3000 }) => {

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
            }, autoCloseDuration);

            return () => clearTimeout(timer); 
        }
    }, [isOpen, autoCloseDuration,]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center w-1/3">
                <h2 className="text-xl font-semibold mb-4 text-black">{title}</h2>
                <p className="mb-6 text-black">{message}</p>
                {/* <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                    onClick={onClose}
                >
                    {primaryBtnLabel}
                </button> */}
            </div>
        </div>
    );
};

export default Popup;
