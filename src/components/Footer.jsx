import React from 'react'



const Footer = () => {
    return (
        <>
<footer className='section__container footer__container  '>
    <div className='footer__col'>
        <h4 className='text-xl font-bold text-gray-800 mb-4'>معلومات الاتصال</h4>
        <p className='text-gray-600 flex items-center gap-2'>
            <span><i className="ri-map-pin-2-fill text-primary"></i></span>
            عمان
        </p>
        <p className='text-gray-600 flex items-center gap-2'>
            <span><i className="ri-mail-fill text-primary"></i></span>
            support@.com
        </p>
        <p className='text-gray-600 flex items-center gap-2'>
            <span><i className="ri-phone-fill text-primary"></i></span>
            (+968) 99999999
        </p>
    </div>
</footer>


        </>
    )
}

export default Footer