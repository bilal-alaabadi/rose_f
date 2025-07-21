import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCards from '../shop/ProductCards';
import { useSearchProductsQuery } from '../../redux/features/products/productsApi';
import { toast } from 'react-toastify';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const {
        data: searchResults = [],
        isLoading,
        isError,
        error,
        refetch
    } = useSearchProductsQuery(searchQuery, {
        skip: !searchQuery.trim(),
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (isError) {
            console.error('Search error:', error);
            toast.error(error?.data?.message || 'حدث خطأ أثناء البحث');
        }
    }, [isError, error]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Search Header Section */}
            <section className='py-16 bg-[#f8d7d0] text-gray-800'>
                <div className='container mx-auto px-4 text-center'>
                    <h2 className='text-3xl md:text-4xl font-bold mb-4'>ابحث عن منتجاتك المفضلة</h2>
                    <p className='text-lg md:text-xl max-w-2xl mx-auto'>
                        اكتشف مجموعة واسعة من المنتجات التي تناسب ذوقك واحتياجاتك
                    </p>
                </div>
            </section>

            {/* Search Section */}
            <section className='container mx-auto px-4 py-12'>
                <div className='max-w-4xl mx-auto mb-12'>
                    <div className='relative flex items-center'>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full py-4 px-6 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg'
                            placeholder='ابحث عن منتجات...'
                            dir='rtl'
                        />
                        <button
                            onClick={() => refetch()}
                            className='absolute left-4 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className='flex justify-center my-12'>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Search Results */}
                {!isLoading && (
                    <div className='mb-8'>
                        {searchQuery && searchResults.length > 0 ? (
                            <>
                                <h3 className='text-2xl font-semibold mb-6 text-gray-800'>
                                    نتائج البحث ({searchResults.length})
                                </h3>
                                <ProductCards 
                                    products={searchResults} 
                                    onProductClick={handleProductClick}
                                />
                            </>
                        ) : (
                            searchQuery && !isLoading && (
                                <div className='text-center py-12'>
                                    <p className='text-xl text-gray-600'>لا توجد نتائج لبحثك "{searchQuery}"</p>
                                    <p className='mt-2 text-gray-500'>حاول استخدام كلمات بحث مختلفة</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Search;