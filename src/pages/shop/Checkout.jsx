import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RiBankCardLine } from "react-icons/ri";
import { loadStripe } from "@stripe/stripe-js";
import { getBaseUrl } from '../../utils/baseURL';

const Checkout = () => {
  const [province, setProvince] = useState('');
  const [wilayat, setWilayat] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const { products, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (products.length === 0) {
      setError("لا توجد منتجات في السلة. الرجاء إضافة منتجات قبل المتابعة إلى الدفع.");
    } else {
      setError('');
    }
  }, [products]);

  const makePayment = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
        setError("لا توجد منتجات في السلة. الرجاء إضافة منتجات قبل المتابعة إلى الدفع.");
        return;
    }

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);
    const body = {
        products: products.map(product => ({
            ...product,
            image: Array.isArray(product.image) ? product.image[0] : product.image
        })),
        userId: user?._id,
        province,
        wilayat,
        streetAddress,
        phone,
        email,
        orderNotes,
        firstName,
        lastName,
    };

    console.log("Data sent to server:", JSON.stringify(body, null, 2));

    const headers = {
        "Content-Type": "application/json"
    };

    try {
        const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        const session = await response.json();
        console.log("Server response:", session);

        if (session.id) {
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                console.log("Error:", result.error);
            }
        } else {
            console.error("No session ID received from server:", session);
        }
    } catch (error) {
        console.error("Error during payment process:", error);
    }
  };

  const omanProvinces = [
    "مسقط",
    "ظفار",
    "مسندم",
    "البريمي",
    "الوسطى",
    "الشمالية الشرقية",
    "الجنوبية الشرقية",
    "الداخلية",
    "الظاهرة",
  ];

  const provincesWithWilayats = {
    "مسقط": ["مسقط", "مطرح", "بوشر", "السيب", "العامرات"],
    "ظفار": ["صلالة", "طاقة", "مرباط", "ثمريت", "ضلكوت"],
    "مسندم": ["خصب", "دبا", "بخا"],
    "البريمي": ["البريمي", "محضة", "السنينة"],
    "الوسطى": ["هيما", "محوت", "الدقم"],
    "الشمالية الشرقية": ["إبراء", "المضيبي", "بدية", "القابل", "وادي بني خالد"],
    "الجنوبية الشرقية": ["صور", "جعلان بني بو حسن", "جعلان بني بو علي", "الكامل والوافي"],
    "الداخلية": ["نزوى", "بهلا", "منح", "الحمراء", "سمائل", "أدم", "بدبد"],
    "الظاهرة": ["عبري", "ينقل", "ضنك"],
  };

  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setWilayat('');
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* تفاصيل الفاتورة */}
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">تفاصيل الفاتورة</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={makePayment} className="space-y-4 md:space-y-6">
          {/* الاسم الأول واسم العائلة */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">الاسم الأول</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">اسم العائلة</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* المنطقة والولاية */}
          <div>
            <label className="block text-sm font-medium text-gray-700">المنطقة</label>
            <select
              value={province}
              onChange={handleProvinceChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">اختر المنطقة</option>
              {omanProvinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">الولاية</label>
            <select
              value={wilayat}
              onChange={(e) => setWilayat(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={!province}
            >
              <option value="">اختر الولاية</option>
              {province &&
                provincesWithWilayats[province]?.map((wilayat, index) => (
                  <option key={index} value={wilayat}>
                    {wilayat}
                  </option>
                ))}
            </select>
          </div>

          {/* العنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700">العنوان</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="رقم المنزل واسم الشارع"
              required
            />
            <input
              type="text"
              onChange={(e) => setStreetAddress(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="الشقة، الطابق، إلخ. (اختياري)"
            />
          </div>

          {/* رقم الهاتف والبريد الإلكتروني */}
          <div>
            <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* ملاحظات الطلب */}
          <div>
            <label className="block text-sm font-medium text-gray-700">ملاحظات الطلب (اختياري)</label>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="ملاحظات حول طلبك، مثلاً ملاحظات خاصة للتوصيل."
            />
          </div>

          {/* زر إتمام الطلب */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 w-full"
            disabled={products.length === 0}
          >
            إتمام الطلب
          </button>
        </form>
      </div>

      {/* تفاصيل الطلب */}
      <div className="w-full md:w-1/3 p-4 md:p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">طلبك</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">{product.name} × {product.quantity}</span>
              <span className="text-gray-900 font-medium">{product.price * product.quantity} ر.ع.</span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-gray-800 font-semibold">الإجمالي</span>
            <p className="text-gray-900 font-bold">ر.ع.{totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">دفع Stripe</h3>
          <button
            onClick={makePayment}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
            disabled={products.length === 0}
          >
            <RiBankCardLine className="text-xl" />
            <span>الدفع باستخدام Stripe</span>
          </button>
          <p className="mt-4 text-sm text-gray-600">
            سيتم استخدام بياناتك الشخصية لمعالجة طلبك، ودعم تجربتك عبر هذا الموقع، ولأغراض أخرى موضحة في{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">سياسة الخصوصية</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;