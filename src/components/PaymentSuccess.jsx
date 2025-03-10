import React, { useEffect, useState } from 'react';
import { getBaseUrl } from '../utils/baseURL'; // استيراد دالة للحصول على الرابط الأساسي
import TimelineStep from './Timeline'; // استيراد مكون الخطوة الزمنية

// مكون يعرض صفحة نجاح الدفع
const PaymentSuccess = () => {
    const [order, setOrder] = useState(null); // حالة لتخزين بيانات الطلب
    const [error, setError] = useState(null); // حالة لتخزين الأخطاء

    // استخدام useEffect لتحميل بيانات الطلب عند تحميل الصفحة
    useEffect(() => {
        const query = new URLSearchParams(window.location.search); // استخراج معلمات البحث من عنوان URL
        const sessionId = query.get('session_id'); // الحصول على معرف الجلسة

        if (sessionId) {
            // طلب API لتأكيد الدفع
            fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ session_id: sessionId }) // إرسال معرف الجلسة
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json(); // تحويل الاستجابة إلى JSON
                })
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.error); // معالجة الأخطاء القادمة من السيرفر
                    }
                    setOrder(data.order); // تعيين بيانات الطلب في الحالة
                })
                .catch((err) => {
                    console.error("Error confirming payment", err); // طباعة الخطأ
                    setError(err.message); // تخزين رسالة الخطأ
                });
        } else {
            setError("No session ID found in the URL"); // إذا لم يتم العثور على معرف الجلسة
        }
    }, []);

    // في حال وجود خطأ، عرض رسالة خطأ
    if (error) {
        return <div>Error: {error}</div>;
    }

    // أثناء تحميل بيانات الطلب، عرض رسالة "جارِ التحميل"
    if (!order) {
        return <div>Loading...</div>;
    }

    // دالة للتحقق مما إذا كانت الخطوة مكتملة بناءً على الحالة الحالية
    const isCompleted = (status) => {
        const statuses = ["pending", "processing", "shipped", "completed"];
        return statuses.indexOf(status) < statuses.indexOf(order.status);
    };

    // دالة للتحقق مما إذا كانت الخطوة الحالية هي نفس الخطوة الحالية للطلب
    const isCurrent = (status) => order.status === status;

    // تعريف الخطوات الزمنية للطلب
    const steps = [
        {
            status: 'pending',
            label: 'قيد الانتظار',
            description: <span className="font-bold">تم إنشاء طلبك وهو قيد الانتظار للمعالجة.</span>,
            icon: { iconName: 'time-line', bgColor: 'red-500', textColor: 'gray-800' },
        },
        {
            status: 'processing',
            label: 'قيد المعالجة',
            description: 'طلبك يتم معالجته حالياً.',
            icon: { iconName: 'loader-line', bgColor: 'yellow-800', textColor: 'yellow-800' },
        },
        // {
        //     status: 'shipped',
        //     label: 'تم الشحن',
        //     description: 'تم شحن طلبك.',
        //     icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-800' },
        // },
        // {
        //     status: 'completed',
        //     label: 'مكتمل',
        //     description: 'تم إكمال طلبك بنجاح.',
        //     icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'green-900' },
        // },
    ];

    // عرض صفحة نجاح الدفع
    return (
        <section className='section__container rounded p-6'>
            <h2 className='text-2xl font-semibold mb-4'>حالة الدفع: {order?.status}</h2>
            <p className='mb-4'>معرف الطلب: {order?.orderId}</p>
            <p className='mb-8'>الحالة: {order?.status}</p>

            {/* عرض الخط الزمني للخطوات */}
            <ol className='sm:flex items-center relative'>
                {steps.map((step, index) => (
                    <TimelineStep
                        key={index} // مفتاح فريد للخطوة
                        step={step} // بيانات الخطوة
                        order={order} // بيانات الطلب
                        isCompleted={isCompleted(step.status)} // التحقق إذا كانت الخطوة مكتملة
                        isCurrent={isCurrent(step.status)} // التحقق إذا كانت الخطوة الحالية
                        isLastStep={index === steps.length - 1} // التحقق إذا كانت الخطوة الأخيرة
                        icon={step.icon} // بيانات الأيقونة
                        description={step.description} // وصف الخطوة
                    />
                ))}
            </ol>
        </section>
    );
};

export default PaymentSuccess;
