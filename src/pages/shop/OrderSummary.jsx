import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';

const OrderSummary = ({ onClose }) => {
    const dispatch = useDispatch();
    const { products, selectedItems, totalPrice } = useSelector((store) => store.cart);
    const shippingFee = 2;

    const handleClearCart = () => {
        if (window.confirm('هل أنت متأكد من تفريغ السلة؟')) {
            dispatch(clearCart());
        }
    };

    const createWhatsAppMessage = () => {
        let message = "الطلب\n\n";
        
        products.forEach((product) => {
            message += ` ${product.name}\n`;
            message += ` الكمية: ${product.quantity}\n`;
            message += `السعر: ر.ع ${product.price.toFixed(2)}\n`;
            message += `----------------\n`;
        });
        
        message += `\n *المجموع الكلي*: ر.ع ${totalPrice.toFixed(2)}`;
        message += `\n *سعر الشحن*: ر.ع ${shippingFee.toFixed(2)}`;
        message += `\n *المجموع النهائي*: ر.ع ${(totalPrice + shippingFee).toFixed(2)}`;
        message += "\n\nشكراً لاختياركم! ";
        
        return message;
    };

    const whatsappLink = `https://wa.me/96892693710?text=${encodeURIComponent(createWhatsAppMessage())}`;

    return (
        <div className='bg-[#f8d7d0] rounded-lg mx-4 my-2 shadow-md'>
            <div className='p-4 space-y-4'>
                <h2 className='text-xl font-bold text-gray-800 text-center'>ملخص الطلب</h2>
                
                <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div className='bg-white p-2 rounded'>
                        <p className='text-gray-600'>عدد العناصر</p>
                        <p className='font-semibold'>{selectedItems}</p>
                    </div>
                    <div className='bg-white p-2 rounded'>
                        <p className='text-gray-600'>سعر الشحن</p>
                        <p className='font-semibold'>ر.ع {shippingFee.toFixed(2)}</p>
                    </div>
                    <div className='bg-white p-2 rounded col-span-2'>
                        <p className='text-gray-600'>المجموع الكلي</p>
                        <p className='font-bold text-lg'>ر.ع {totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <div className='bg-white p-3 rounded-lg'>
                    <p className='text-center font-bold text-primary text-lg'>
                        المجموع النهائي: ر.ع {(totalPrice + shippingFee).toFixed(2)}
                    </p>
                </div>

                <div className='flex flex-col space-y-3'>
                    <button
                        onClick={handleClearCart}
                        className='bg-red-500 px-4 py-2 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors'
                    >
                        <span>تفريغ السلة</span>
                        <i className="ri-delete-bin-7-line"></i>
                    </button>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className='block'
                    >
                        <button className='bg-green-600 w-full px-4 py-2 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors'>
                            <span>إتمام الشراء عبر واتساب</span>
                            <i className="ri-whatsapp-line"></i>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;