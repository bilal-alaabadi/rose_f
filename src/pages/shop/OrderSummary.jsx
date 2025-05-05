import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';

const OrderSummary = ({ onClose }) => {
    const dispatch = useDispatch();
    const { selectedItems, totalPrice } = useSelector((store) => store.cart);

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    // إنشاء رسالة تلقائية لإرسالها عبر واتساب
    const whatsappMessage = `مرحبًا، أرغب في إتمام طلب يحتوي على ${selectedItems} عنصر/عناصر بقيمة إجمالية ${totalPrice.toFixed(2)} ر.ع.`;

    // ترميز الرسالة لتكون صالحة كرابط URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // رابط واتساب يحتوي على الرسالة
    const whatsappLink = `https://wa.me/96897596380?text=${encodedMessage}`;

    return (
        <div className='bg-[#f8d7d0] mt-5 rounded text-base'>
            <div className='px-6 py-4 space-y-5'>
                <h2 className='text-xl text-text-dark'>ملخص الطلب</h2>
                <p className='text-text-dark mt-2'>العناصر المحددة: {selectedItems}</p>
                <p className='font-bold'>السعر الإجمالي: ر.ع {totalPrice.toFixed(2)}</p>
                <div className='px-4 mb-6'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearCart();
                        }}
                        className='bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4'
                    >
                        <span className='mr-2'>تفريغ السلة</span>
                        <i className="ri-delete-bin-7-line"></i>
                    </button>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose} // إغلاق السلة عند الضغط
                    >
                        <button
                            className='bg-green-600 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center'
                        >
                            <span className='mr-2'>إتمام الشراء</span>
                            <i className="ri-bank-card-line"></i>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
