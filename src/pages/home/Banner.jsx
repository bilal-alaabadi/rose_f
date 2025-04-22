import React from 'react';
import { Link } from 'react-router-dom';
import timings from "../../assets/A high-contrast, low-key photograph of sculpted, layered papier-mâché incense, perfumes, lotions, and oils, showing refined features, deep shadows, and a graceful, elegant aesthetic.jpg";

const Banner = () => {
    return (
        <div className="py-3 px-4">
            <div className="text-right" dir='rtl'>
                {/* يمكن إضافة محتوى هنا إذا لزم الأمر */}
            </div>
            
            <div className="mt-8">
                <img
                    src={timings}
                    alt="صورة البانر"
                    className="w-full h-auto object-contain max-w-[100%] mx-auto"
                />
            </div>
        </div>
    );
};

export default Banner;