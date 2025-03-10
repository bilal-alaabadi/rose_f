import React, { useState } from 'react';
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { formatDate } from '../../../../utils/formateDate';
import UpdateOrderModal from './UpdateOrderModal';
import html2pdf from 'html2pdf.js'; // مكتبة لتحويل HTML إلى PDF

const ManageOrders = () => {
    const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState(null); // حالة لعرض تفاصيل الطلب
    const [deleteOrder] = useDeleteOrderMutation();

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDeleteOder = async (orderId) => {
        try {
            await deleteOrder(orderId).unwrap();
            alert("Order deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    };

    const handleViewOrder = (order) => {
        setViewOrder(order); // تعيين الطلب المحدد لعرض تفاصيله
    };

    const handleCloseViewModal = () => {
        setViewOrder(null); // إغلاق عرض التفاصيل
    };

    const handlePrintOrder = () => {
        window.print(); // طباعة الصفحة
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('order-details'); // العنصر الذي يحتوي على تفاصيل الطلب
        const options = {
            margin: [10, 10],
            filename: `order_${viewOrder.orderId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().from(element).set(options).save(); // تحويل HTML إلى PDF وحفظه
    };

    if (isLoading) return <div>Loading....</div>;
    if (error) return <div>Something went wrong!</div>;

    return (
        <div className='section__container p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Manage Orders</h2>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='py-3 px-4 border-b'>Order Id</th>
                        <th className='py-3 px-4 border-b'>Customer</th>
                        <th className='py-3 px-4 border-b'>Status</th>
                        <th className='py-3 px-4 border-b'>Date</th>
                        <th className='py-3 px-4 border-b'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders &&
                        orders.map((order, index) => (
                            <tr key={index}>
                                <td className='py-3 px-4 border-b'>{order?.orderId}</td>
                                <td className='py-3 px-4 border-b'>{order?.email}</td>
                                <td className='py-3 px-4 border-b'>
                                    <span
                                        className={`inline-block px-3 py-1 text-xs text-white rounded-full ${getStatusColor(
                                            order?.status
                                        )}`}
                                    >
                                        {order?.status}
                                    </span>
                                </td>
                                <td className='py-3 px-4 border-b'>{formatDate(order?.updatedAt)}</td>
                                <td className='py-3 px-4 border-b flex items-center space-x-4'>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => handleViewOrder(order)} // عرض تفاصيل الطلب
                                    >
                                        View
                                    </button>
                                    <button
                                        className="text-green-500 hover:underline"
                                        onClick={() => handleEditOrder(order)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDeleteOder(order?._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Update Order Modal */}
            {selectedOrder && (
                <UpdateOrderModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}

            {/* View Order Details Modal */}
            {viewOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl print-modal" id="order-details">
                        <style>
                            {`
                                @media print {
                                    body * {
                                        visibility: hidden;
                                    }
                                    .print-modal, .print-modal * {
                                        visibility: visible;
                                    }
                                    .print-modal {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        max-width: 100%;
                                        box-shadow: none;
                                        border: none;
                                        padding: 20px;
                                    }
                                    .print-modal button {
                                        display: none;
                                    }
                                    .print-modal h2 {
                                        font-size: 24px;
                                        margin-bottom: 20px;
                                    }
                                    .print-modal p {
                                        font-size: 16px;
                                        margin-bottom: 10px;
                                    }
                                }
                            `}
                        </style>
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="space-y-4">
                            {viewOrder.orderId && <p><strong>Order ID:</strong> {viewOrder.orderId}</p>}
                            {viewOrder.email && <p><strong>Customer Email:</strong> {viewOrder.email}</p>}
                            {viewOrder.phoneNumber && <p><strong>Phone:</strong> {viewOrder.phoneNumber}</p>}
                            {viewOrder.shippingAddress?.province && <p><strong>Province:</strong> {viewOrder.shippingAddress.province}</p>}
                            {viewOrder.shippingAddress?.wilayat && <p><strong>Wilayat:</strong> {viewOrder.shippingAddress.wilayat}</p>}
                            {viewOrder.shippingAddress?.streetAddress && <p><strong>Street Address:</strong> {viewOrder.shippingAddress.streetAddress}</p>}
                            {viewOrder.orderNotes && <p><strong>Order Notes:</strong> {viewOrder.orderNotes}</p>}
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={handleCloseViewModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={handlePrintOrder}
                            >
                                Print
                            </button>
                            <button
                                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                                onClick={handleDownloadPDF}
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-500';
        case 'processing':
            return 'bg-blue-500';
        case 'shipped':
            return 'bg-green-500';
        case 'completed':
            return 'bg-gray-500';
        default:
            return 'bg-gray-300';
    }
};

export default ManageOrders;