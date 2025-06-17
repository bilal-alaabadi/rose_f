import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCards from './ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const ShopPage = () => {
    const location = useLocation();
    const [filtersState, setFiltersState] = useState({
        mainCategory: '',
        subCategory: '',
        brand: ''
    });

    const [expandedCategories, setExpandedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProductsPerPage] = useState(8);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const mainCategory = searchParams.get('mainCategory');
        
        if (mainCategory) {
            setFiltersState({
                mainCategory: decodeURIComponent(mainCategory),
                subCategory: '',
                brand: ''
            });
            setExpandedCategories([decodeURIComponent(mainCategory)]);
        }
    }, [location.search]);

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        mainCategory: filtersState.mainCategory,
        subCategory: filtersState.subCategory,
        brand: filtersState.brand,
        page: currentPage,
        limit: ProductsPerPage,
    });

    const categoryStructure = [
        {
            mainCategory: 'كل المنتجات',
            subCategories: []
        },
        {
            mainCategory: 'العناية بالبشرة',
            subCategories: [
                'العناية الكورية',
                'أدوات العناية',
                'منتجات العناية'
            ]
        },
        {
            mainCategory: 'المكياج',
            subCategories: [
                'أساس الوجه',
                'أحمر خدود',
                'باليتات',
                'العيون',
                'الشفاه',
                'ملمعات شفاه',
                'الحواجب',
                'الأظافر',
                'فرش المكياج'
            ]
        },
        {
            mainCategory: 'العطور',
            subCategories: ['عطور']
        },
        {
            mainCategory: 'الجسم',
            subCategories: ['كريمات جسم']
        },
        {
            mainCategory: 'مثبتات',
            subCategories: ['مثبتات']
        },
        {
            mainCategory: 'مجموعات',
            subCategories: ['مجموعات']
        },
        {
            mainCategory: 'منتجات أخرى',
            subCategories: ['منتجات أخرى']
        },
        {
            mainCategory: 'خصومات',
            subCategories: ['خصومات']
        }
    ];

    const toggleCategory = (mainCategory) => {
        setExpandedCategories(prev => 
            prev.includes(mainCategory) 
                ? prev.filter(cat => cat !== mainCategory)
                : [...prev, mainCategory]
        );
    };

    const handleMainCategoryClick = (mainCategory) => {
        if (mainCategory === 'كل المنتجات') {
            clearFilters();
        } else {
            setFiltersState({ 
                mainCategory, 
                subCategory: '', 
                brand: '' 
            });
            setCurrentPage(1);
        }
    };

    const handleSubCategoryClick = (mainCategory, subCategory) => {
        setFiltersState({
            mainCategory,
            subCategory,
            brand: ''
        });
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFiltersState({ mainCategory: '', subCategory: '', brand: '' });
        setExpandedCategories([]);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    if (isLoading) return <div className="text-center py-8 text-xl text-pink-600 animate-pulse">جاري التحميل...</div>;
    if (error) return <div className="text-center py-8 text-xl text-red-500">حدث خطأ أثناء تحميل المنتجات</div>;

    const startProduct = (currentPage - 1) * ProductsPerPage + 1;
    const endProduct = Math.min(startProduct + ProductsPerPage - 1, totalProducts);

    return (
        <>
            <section className='section__container bg-[#f8d7d0] py-8 md:py-16'>
                <div className="px-4 md:px-0">
                    <h2 className='section__header text-2xl md:text-4xl font-bold text-gray-800'>صفحة المتجر</h2>
                    <p className='section__subheader text-base md:text-xl text-gray-600 mt-2' dir='rtl'> 
                        اكتشفي عالم الجمال مع تشكيلتنا الواسعة من منتجات المكياج التي تلبي كل احتياجاتكِ، من أساسيات المكياج إلى أحدث الصيحات العالمية.
                    </p>
                </div>
            </section>

            <section className='section__container py-6 md:py-12 pb-10'>
                <div className='flex flex-col md:flex-row md:gap-8 gap-4'>
                    {/* زر عرض/إخفاء الفلاتر للجوال */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className='md:hidden bg-pink-600 py-2 px-4 text-white rounded-lg mb-2 w-full flex items-center justify-center gap-2 transition-all hover:bg-pink-700'
                    >
                        {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* قسم الفلاتر */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 md:sticky md:top-4 h-fit`}>
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-right text-gray-800'>تصفية المنتجات</h3>
                            <hr className='my-2' />

                            {/* فلتر الفئات */}
                            <div className="space-y-2">
                                {categoryStructure.map((categoryGroup) => (
                                    <div key={categoryGroup.mainCategory} className="border-b border-gray-100 last:border-0 pb-2">
                                        <div 
                                            className={`p-3 text-right cursor-pointer rounded-lg transition-all duration-200 flex justify-between items-center
                                                ${filtersState.mainCategory === categoryGroup.mainCategory ? 
                                                    'bg-pink-50 text-pink-700 font-medium' : 
                                                    'hover:bg-gray-50 text-gray-600'}`}
                                            onClick={() => {
                                                handleMainCategoryClick(categoryGroup.mainCategory);
                                                if (categoryGroup.subCategories.length > 0) {
                                                    toggleCategory(categoryGroup.mainCategory);
                                                }
                                            }}
                                        >
                                            <span>{categoryGroup.mainCategory}</span>
                                            {categoryGroup.subCategories.length > 0 && (
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className={`h-5 w-5 transform transition-transform duration-200 ${expandedCategories.includes(categoryGroup.mainCategory) ? 'rotate-180' : ''}`} 
                                                    viewBox="0 0 20 20" 
                                                    fill="currentColor"
                                                >
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* الأقسام الفرعية */}
                                        {expandedCategories.includes(categoryGroup.mainCategory) && categoryGroup.subCategories.length > 0 && (
                                            <div className="pr-4 pl-2 py-2 space-y-1">
                                                {categoryGroup.subCategories.map((subCategory) => (
                                                    <div 
                                                        key={subCategory}
                                                        className={`p-2 text-right cursor-pointer rounded transition-all duration-200 text-sm
                                                            ${filtersState.subCategory === subCategory ? 
                                                                'bg-pink-100 text-pink-700 font-medium border-r-2 border-pink-500' : 
                                                                'hover:bg-gray-50 text-gray-600'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSubCategoryClick(categoryGroup.mainCategory, subCategory);
                                                        }}
                                                    >
                                                        {subCategory}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* زر مسح الفلاتر */}
                            <button 
                                onClick={clearFilters}
                                className='w-full py-2.5 px-4 bg-pink-500 text-white hover:bg-pink-600 rounded-lg transition-colors duration-200 
                                flex items-center justify-center gap-2 font-medium mt-4'
                            >
                                مسح الفلاتر
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* قسم المنتجات */}
                    <div className='flex-1'>
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3'>
                            <div>
                                <h3 className='text-sm md:text-lg font-medium text-gray-700'>
                                    عرض <span className="font-bold text-pink-600">{startProduct}-{endProduct}</span> من <span className="font-bold text-pink-600">{totalProducts}</span> منتج
                                </h3>
                                {(filtersState.mainCategory || filtersState.subCategory) && (
                                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                                        تصفية حسب: 
                                        {filtersState.mainCategory && <span className="font-medium mx-1">{filtersState.mainCategory}</span>}
                                        {filtersState.subCategory && <span className="font-medium"> - {filtersState.subCategory}</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {products.length > 0 ? (
                            <>
                                <ProductCards products={products} gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
                                
                                {/* ترقيم الصفحات */}
                                {totalPages > 1 && (
                                    <div className='mt-8 flex justify-center'>
                                        <div className="flex flex-wrap items-center justify-center gap-1">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                className='px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg mr-1 disabled:opacity-40 transition-all 
                                                hover:bg-pink-100 hover:text-pink-700 flex items-center gap-1 text-sm md:text-base'
                                            >
                                                السابق
                                            </button>

                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                                                let pageNumber;
                                                if (totalPages <= 5) {
                                                    pageNumber = index + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNumber = index + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNumber = totalPages - 4 + index;
                                                } else {
                                                    pageNumber = currentPage - 2 + index;
                                                }

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`px-3 py-1.5 md:px-4 md:py-2 mx-0.5 rounded-lg transition-all text-sm md:text-base ${currentPage === pageNumber ? 
                                                            'bg-pink-600 text-white shadow-md' : 
                                                            'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700'}`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}

                                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}

                                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    className={`px-3 py-1.5 md:px-4 md:py-2 mx-0.5 rounded-lg transition-all text-sm md:text-base ${currentPage === totalPages ? 
                                                        'bg-pink-600 text-white shadow-md' : 
                                                        'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700'}`}
                                                >
                                                    {totalPages}
                                                </button>
                                            )}

                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                className='px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg ml-1 disabled:opacity-40 transition-all
                                                hover:bg-pink-100 hover:text-pink-700 flex items-center gap-1 text-sm md:text-base'
                                            >
                                                التالي
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 md:py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                                <p className="text-base md:text-lg text-gray-500 mt-4">لا توجد منتجات متاحة حسب الفلتر المحدد</p>
                                <button 
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 md:px-6 md:py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm md:text-base"
                                >
                                    عرض جميع المنتجات
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopPage;