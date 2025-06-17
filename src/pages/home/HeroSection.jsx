import React from 'react';
import { Link } from 'react-router-dom';
import img1 from "../../assets/close-up-skin-regeneration-products.jpg";
import img2 from "../../assets/combination-makeup-textures.jpg";
import img3 from "../../assets/front-view-perfume-bottle-with-pink-roses.jpg";
import img4 from "../../assets/close-up-woman-trying-cream-hands.jpg";
import img5 from "../../assets/top-view-foundation-advertising.jpg";
import img6 from "../../assets/high-angle-view-cosmetic-beauty-products-white-backdrop.jpg";
import img7 from "../../assets/view-circular-arrangement-with-make-up-flowers.jpg";
import img8 from "../../assets/composition-with-colorful-cosmetics-white-background.jpg";

const cards = [
    { id: 1, image: img1, trend: '', title: 'العناية بالبشرة', mainCategory: 'العناية بالبشرة' },
    { id: 2, image: img2, trend: '', title: 'المكياج', mainCategory: 'المكياج' },
    { id: 3, image: img3, trend: '', title: 'العطور', mainCategory: 'العطور' },
    { id: 4, image: img4, trend: '', title: 'الجسم', mainCategory: 'الجسم' },
    { id: 5, image: img5, trend: '', title: 'مثبتات', mainCategory: 'مثبتات' },
    { id: 6, image: img6, trend: '', title: 'مجموعات', mainCategory: 'مجموعات' },
    { id: 7, image: img7, trend: '', title: 'خصومات', mainCategory: 'خصومات' },
    { id: 8, image: img8, trend: '', title: 'منتجات أخرى', mainCategory: 'منتجات أخرى' },
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