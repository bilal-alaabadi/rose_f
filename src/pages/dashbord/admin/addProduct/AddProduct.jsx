import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categoryStructure = [
  {
    mainCategory: "منتجات عناية",
    subCategories: [
      "عناية القدمين (بدكير)",
      "عناية بالجسم (صابونيات)",
      "أدوات عناية",
      "ماسكات بشره",
      "غسول فم"
    ]
  },
  {
    mainCategory: "مكياج نباتي",
    subCategories: [
      "الوجه",
      "العيون",
      "الشفاه",
      "ملمع شفايف",
      "أحمر خدود",
      "باليتات",
      "فرش المكياج",
      "مزيل مكياج",
      "آخر"
    ]
  },
  {
    mainCategory: "عطور",
    subCategories: [
      "عطور للملابس",
      "عطور الشعر",
      "عطور مفارش",
      "فواحات عطريه",
      "آخر"
    ]
  },
  {
    mainCategory: "أجهزة",
    subCategories: [
      "أستشوار جوي",
      "اجهزه"
    ]
  },
  {
    mainCategory: "أدوات صحيه",
    subCategories: [
      "مستلزمات"
    ]
  },
  {
    mainCategory: "توزيعات",
    subCategories: [
      "توزيعات بأقل سعر"
    ]
  },
  {
    mainCategory: "ملابس",
    subCategories: [
      "مخاوير"
    ]
  },
  {
    mainCategory: "خصومات٪",
    subCategories: [
      "جميع الخصومات"
    ]
  }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [product, setProduct] = useState({
        name: '',
        category: '', // الفئة الرئيسية
        subCategory: '', // الفئة الفرعية
        price: '',
        description: ''
    });
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [AddProduct, { isLoading }] = useAddProductMutation();
    const navigate = useNavigate();

    const handleMainCategoryChange = (e) => {
        const mainCategory = e.target.value;
        setSelectedMainCategory(mainCategory);
        setProduct({
            ...product,
            category: mainCategory,
            subCategory: ''
        });
    };

    const handleSubCategoryChange = (e) => {
        setProduct({
            ...product,
            subCategory: e.target.value
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // التحقق من الحقول المطلوبة
        if (!product.name || !product.category || !product.subCategory || !product.price || !product.description || images.length === 0) {
            setErrorMessage('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        // التحقق من أن السعر رقم موجب
        if (isNaN(product.price) || parseFloat(product.price) <= 0) {
            setErrorMessage('السعر يجب أن يكون رقمًا موجبًا');
            return;
        }

        try {
            const productData = {
                name: product.name,
                category: product.category,
                subCategory: product.subCategory,
                price: parseFloat(product.price),
                description: product.description,
                image: images,
                author: user?._id
            };

            const response = await AddProduct(productData).unwrap();
            
            if (response) {
                alert('تمت إضافة المنتج بنجاح');
                setProduct({
                    name: '',
                    category: '',
                    subCategory: '',
                    price: '',
                    description: ''
                });
                setImages([]);
                setSelectedMainCategory('');
                navigate("/shop");
            }
        } catch (error) {
            console.error("فشل في إضافة المنتج", error);
            setErrorMessage(error.data?.message || 'حدث خطأ أثناء إضافة المنتج');
        }
    };

    const getCurrentSubCategories = () => {
        if (!selectedMainCategory) return [];
        const category = categoryStructure.find(cat => cat.mainCategory === selectedMainCategory);
        return category ? category.subCategories : [];
    };

    return (
        <div className="container mx-auto mt-8 p-4 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-right">إضافة منتج جديد</h2>
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-right">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="اسم المنتج"
                    name="name"
                    placeholder="أدخل اسم المنتج"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
                
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                            الفئة الرئيسية
                        </label>
                        <select
                            value={selectedMainCategory}
                            onChange={handleMainCategoryChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            required
                        >
                            <option value="">اختر الفئة الرئيسية</option>
                            {categoryStructure.map((category, index) => (
                                <option key={index} value={category.mainCategory}>
                                    {category.mainCategory}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedMainCategory && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                                الفئة الفرعية
                            </label>
                            <select
                                value={product.subCategory}
                                onChange={handleSubCategoryChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                required
                            >
                                <option value="">اختر الفئة الفرعية</option>
                                {getCurrentSubCategories().map((subCat, idx) => (
                                    <option key={idx} value={subCat}>
                                        {subCat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <TextInput
                    label="السعر (ريال)"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                />
                
                <UploadImage
                    name="image"
                    id="image"
                    setImage={setImages}
                    required
                />
                
                <div>
                    <label htmlFor="description" className='block text-sm font-medium text-gray-700 text-right'>
                        وصف المنتج
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right'
                        rows="5"
                        value={product.description}
                        placeholder='أدخل وصفًا تفصيليًا للمنتج'
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                
                <div className="flex justify-end">
                    <button 
                        type='submit' 
                        className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        disabled={isLoading}
                    >
                        {isLoading ? "جاري الإضافة..." : "إضافة المنتج"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;