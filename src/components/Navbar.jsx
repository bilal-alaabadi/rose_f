import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png";
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';
import log from "../assets/ChatGPT_Image_Jul_7__2025__11_12_01_PM-removebg-preview.png"

const Navbar = () => {
    const products = useSelector((state) => state.cart.products);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const handleCartToggle = () => {
        setIsCartOpen(!isCartOpen);
        // إغلاق القوائم الأخرى عند فتح السلة
        setIsDropDownOpen(false);
        setIsMobileMenuOpen(false);
    };
    const handleSearchClick = () => navigate('/search');

    // User authentication
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();

    // Dropdown menus
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const handleDropDownToggle = () => {
        setIsDropDownOpen(!isDropDownOpen);
        // إغلاق السلة عند فتح القائمة
        if (isCartOpen) setIsCartOpen(false);
    };

    // Mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // إغلاق السلة عند فتح القائمة
        if (isCartOpen) setIsCartOpen(false);
    };

    // Admin dropdown menus
    const adminDropDownMenus = [
        { label: "لوحة التحكم", path: "/dashboard/admin" },
        { label: "تعديل المنتج", path: "/dashboard/manage-products" },
        { label: "إضافة منتج", path: "/dashboard/add-product" },
    ];

    // User dropdown menus
    const userDropDownMenus = [
        { label: "لوحة التحكم", path: "/dashboard" },
        { label: "الملف الشخصي", path: "/dashboard/profile" },
        { label: "المدفوعات", path: "/dashboard/payments" },
        { label: "الطلبات", path: "/dashboard/orders" },
    ];

    const dropdownMenus = user?.role === 'admin' ? [...adminDropDownMenus] : [...userDropDownMenus];

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <header className='fixed-nav-bar w-full bg-white pb-20 pt-8'>
            <nav className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative'>
                {/* Mobile Menu Button (Hamburger Icon) */}
                <button
                    onClick={handleMobileMenuToggle}
                    className='sm:hidden text-gray-700 hover:text-primary focus:outline-none'
                    aria-label="قائمة الجوال"
                >
                    <i className="ri-menu-line text-2xl"></i>
                </button>

                {/* Nav Links (Desktop) */}
                <ul className='hidden sm:flex gap-6 md:gap-8 items-center' dir='rtl'>
                    <li>
                        <Link to="" className='text-gray-700 hover:text-primary focus:text-primary active:text-primary transition-colors duration-300 text-lg font-medium'>
                            الرئيسية
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop" className='text-gray-700 hover:text-primary focus:text-primary active:text-primary transition-colors duration-300 text-lg font-medium'>
                            المتجر
                        </Link>
                    </li>
                    <li className="relative group">
                        <button 
                            onClick={handleSearchClick}
                            aria-label="بحث"
                            className="text-gray-700 hover:text-primary focus:text-primary active:text-primary text-2xl transition-colors duration-300"
                        >
                            <i className="ri-search-line"></i>
                        </button>
                    </li>
                </ul>

                {/* Logo (Centered) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pt-14 pb-7">
                    <Link to="/" className="inline-block">
                        <img 
                            src={log} 
                            alt="شعار رؤية" 
                            className="w-48 h-52 pt-6"  
                            loading="lazy" 
                        />
                    </Link>
                </div>

                {/* Nav Icons */}
                <div className='flex items-center gap-4 sm:gap-6'>
                    {/* Improved Cart Button */}
                    <div className="relative group">
                        <button 
                            onClick={handleCartToggle}
                            aria-label="سلة التسوق"
                            className="p-2 text-gray-700 hover:text-primary focus:text-primary active:text-primary text-2xl transition-all duration-300 transform hover:scale-110 focus:scale-110 relative"
                        >
                            <i className="ri-shopping-cart-2-line"></i>
                            {products.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs bg-primary text-white rounded-full animate-pulse">
                                    {products.length}
                                </span>
                            )}
                        </button>
                        <span className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            سلة التسوق
                        </span>
                    </div>

                    {user ? (
                        <div className='relative group'>
                            <img
                                onClick={handleDropDownToggle}
                                src={user?.profileImage || avatarImg}
                                alt="صورة المستخدم"
                                className='size-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-300'
                            />
                            {isDropDownOpen && (
                                <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn'>
                                    <ul className='space-y-2 p-2'>
                                        {dropdownMenus.map((menu, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={menu.path}
                                                    onClick={() => setIsDropDownOpen(false)}
                                                    className='block px-4 py-2 text-base text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors duration-300'
                                                >
                                                    {menu.label}
                                                </Link>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className='block w-full text-left px-4 py-2 text-base text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors duration-300'
                                            >
                                                تسجيل الخروج
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className='text-gray-700 hover:text-primary focus:text-primary active:text-primary transition-colors duration-300'
                            aria-label="تسجيل الدخول"
                        >
                            <i className="ri-user-line text-2xl"></i>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu (Links for Small Screens) */}
                <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                        <div className="px-6 py-6 flex flex-col items-center gap-4">
                            <button 
                                onClick={handleMobileMenuToggle}
                                className="absolute top-4 left-4 text-gray-500 hover:text-primary text-2xl transition-colors duration-300"
                                aria-label="إغلاق القائمة"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                            
                            <Link 
                                to="/shop" 
                                onClick={handleMobileMenuToggle}
                                className="w-full text-center py-4 px-6 font-medium text-gray-700 hover:text-primary active:text-primary rounded-lg transition-all duration-300 text-lg"
                            >
                                المنتجات
                            </Link>
                            <Link 
                                to="/" 
                                onClick={handleMobileMenuToggle}
                                className="w-full text-center py-4 px-6 font-medium text-gray-700 hover:text-primary active:text-primary rounded-lg transition-all duration-300 text-lg"
                            >
                                الصفحة الرئيسية
                            </Link>

                            <button 
                                onClick={() => {
                                    handleSearchClick();
                                    handleMobileMenuToggle();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 font-medium text-gray-700 hover:text-primary active:text-primary rounded-lg transition-all duration-300 text-lg"
                            >
                                <i className="ri-search-line"></i>
                                بحث
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Cart Modal */}
            {isCartOpen && (
                <CartModal 
                    products={products} 
                    isOpen={isCartOpen} 
                    onClose={handleCartToggle} 
                />
            )}
        </header>
    );
};

export default Navbar;