import React from 'react';
import { Link } from 'react-router-dom';
import img1 from "../../assets/close-up-skin-regeneration-products.jpg";
import img2 from "../../assets/combination-makeup-textures.jpg";
import img3 from "../../assets/front-view-perfume-bottle-with-pink-roses.jpg";
import img4 from "../../assets/Screenshot 2025-07-20 195925.png";
import img5 from "../../assets/top-view-foundation-advertising.jpg";
import img6 from "../../assets/high-angle-view-cosmetic-beauty-products-white-backdrop.jpg";
import img7 from "../../assets/stack-sweaters-wooden-table.jpg";
import img8 from "../../assets/composition-with-colorful-cosmetics-white-background.jpg";

const cards = [
    { id: 1, image: img1, trend: '', title: "منتجات عناية", mainCategory: "منتجات عناية" },
    { id: 2, image: img2, trend: '', title: "مكياج نباتي", mainCategory: "مكياج نباتي" },
    { id: 3, image: img3, trend: '', title: "عطور", mainCategory: "عطور" },
    { id: 4, image: img4, trend: '', title: "أجهزة", mainCategory: "أجهزة" },
    { id: 5, image: img5, trend: '', title: "أدوات صحيه", mainCategory: "أدوات صحيه" },
    { id: 6, image: img6, trend: '', title: "توزيعات", mainCategory: "توزيعات" },
    { id: 7, image: img7, trend: '', title: "ملابس", mainCategory: "ملابس" },
    { id: 8, image: img8, trend: '', title: "خصومات٪", mainCategory: "خصومات٪" },
];

const HeroSection = () => {
    return (
        <section className='section__container grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
            {cards.map((card) => (
                <Link 
                    to={{
                        pathname: "/Shop",
                        search: `?mainCategory=${encodeURIComponent(card.mainCategory)}`
                    }}
                    key={card.id}
                    className='block aspect-square group'
                >
                    <div className='hero__card relative w-full h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-100'>
                        <img 
                            src={card.image} 
                            alt={card.title} 
                            className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                        <div className='absolute inset-0 flex flex-col justify-end'>
                            <div className='bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white text-center'>
                                <p className='text-xs sm:text-sm font-semibold text-gray-300'>{card.trend}</p>
                                <h4 className='text-lg sm:text-xl font-bold mt-1'>{card.title}</h4>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </section>
    );
};

export default HeroSection;