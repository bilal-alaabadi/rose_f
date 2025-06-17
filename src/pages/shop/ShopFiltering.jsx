import React, { useState } from 'react';

const ShopFiltering = ({ categories, filtersState, setFiltersState, clearFilters }) => {
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(cat => cat !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const handleMainCategoryClick = (mainCategory) => {
    setFiltersState({
      mainCategory,
      subCategory: ''
    });
    // توسيع التصنيف تلقائياً عند النقر عليه
    if (!expandedCategories.includes(mainCategory) {
      setExpandedCategories([...expandedCategories, mainCategory]);
    }
  };

  const handleSubCategoryClick = (mainCategory, subCategory) => {
    setFiltersState({
      mainCategory,
      subCategory
    });
  };

  return (
    <div className='space-y-5 flex-shrink-0 w-64'>
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium'>الفئات</h4>
        <hr />
        <div className='space-y-2'>
          {categories.map((category) => (
            <div key={category.mainCategory} className='space-y-1'>
              <div 
                className={`flex items-center cursor-pointer ${category.mainCategory === filtersState.mainCategory && !filtersState.subCategory ? 'font-bold text-primary-dark' : ''}`}
                onClick={() => handleMainCategoryClick(category.mainCategory)}
              >
                <span>{category.mainCategory}</span>
                {category.subCategories.length > 0 && (
                  <span 
                    className='mr-auto px-2'
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category.mainCategory);
                    }}
                  >
                    {expandedCategories.includes(category.mainCategory) ? '−' : '+'}
                  </span>
                )}
              </div>

              {expandedCategories.includes(category.mainCategory) && category.subCategories.length > 0 && (
                <div className='pr-4 space-y-1'>
                  {category.subCategories.map((subCat) => (
                    <div 
                      key={subCat}
                      className={`flex items-center cursor-pointer ${filtersState.subCategory === subCat ? 'font-bold text-primary-dark' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubCategoryClick(category.mainCategory, subCat);
                      }}
                    >
                      <span className='mr-2'>•</span>
                      <span>{subCat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='mt-4'>
        <button 
          onClick={clearFilters}
          className='bg-primary-dark py-2 px-4 text-white rounded hover:bg-primary-dark transition duration-300'
        >
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
};

export default ShopFiltering;