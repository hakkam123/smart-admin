'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft,
  FiUpload,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  // Mock order data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    const mockOrderData = {
      id: params.id,
      invoice: 'INV-123',
      customerName: 'Edward Timber',
      total: 100000,
      status: 'delivered',
      orderDate: '2024-10-22',
      address: 'Jl. Kol. Enjo Martadinata Jl. Kol. Ahmad Syam No.45 E, RT.04/RW.10, Tanah Baru, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16154',
      phone: '+62 812-3456-7890',
      email: 'edward.timber@email.com',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Standard Delivery',
      items: [
        {
          id: 1,
          name: 'Sandal Anak Toko Reva',
          price: 100000,
          quantity: 1,
          image: '/api/placeholder/60/60'
        },
        {
          id: 2,
          name: 'Baju Anak Toko Reva',
          price: 200000,
          quantity: 1,
          image: '/api/placeholder/60/60'
        }
      ],
      statusHistory: [
        {
          status: 'preparing',
          title: 'Preparing to ship',
          description: 'The seller is preparing your package, and will hand it over to our carrier for shipping.',
          timestamp: '2024-10-22T08:00:00Z',
          completed: true
        },
        {
          status: 'picked',
          title: 'Package picked up',
          description: 'Package collected by our carrier in East Depok City.',
          timestamp: '2024-10-22T10:05:00Z',
          completed: true
        },
        {
          status: 'transit',
          title: 'In transit',
          description: 'Package arrived at the Sukma jaya delivery hub in Depok City.',
          timestamp: '2024-10-22T12:47:00Z',
          completed: true
        },
        {
          status: 'delivery',
          title: 'Out for delivery',
          description: 'Your package is out for delivery.',
          timestamp: '2024-10-22T13:30:00Z',
          completed: true
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Your package has been delivered. Recipient: Hasan',
          timestamp: '2024-10-22T14:03:00Z',
          completed: true,
          photo: '/api/placeholder/200/150'
        }
      ],
      carrier: {
        name: 'Muhammad Alan Fahmi',
        waNumber: 'wa.me/6287141421031'
      }
    };
    setOrderData(mockOrderData);
    setStatusUpdate(mockOrderData.status);
  }, [params.id]);

  const [messages] = useState([
    {
      id: 1,
      sender: 'Edward Timber',
      message: 'sedang online',
      timestamp: '2024-10-22T14:05:00Z',
      isOnline: true
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = () => {
    // Update order status
    console.log('Updating status to:', statusUpdate);
    console.log('Notes:', notes);
    if (uploadedPhoto) {
      console.log('Photo uploaded:', uploadedPhoto);
    }
    // Here you would make API call to update the order
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
  };

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar - Quick Messages */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg"
            >
              <FiArrowLeft size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">Quick Messages</h3>
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {message.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{message.sender}</h4>
                  <p className="text-sm text-gray-600 italic">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Send Message
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Information */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Information</h2>
              
              {/* Order Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Invoice</label>
                  <p className="text-gray-900 font-medium">{orderData.invoice}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                  <p className="text-gray-900 font-medium">{orderData.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total</label>
                  <p className="text-gray-900 font-medium">{orderData.total.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(orderData.status)}`}>
                    {orderData.status === 'delivered' ? 'Delivery' : orderData.status}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                <p className="text-gray-700 leading-relaxed">{orderData.address}</p>
              </div>

              {/* Item List */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Item List</h3>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600 font-medium">{index + 1}.</span>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">{item.price.toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <FiUpload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Kirim Bukti</p>
                      </label>
                    </div>
                    {uploadedPhoto && (
                      <div className="mt-2">
                        <Image src={uploadedPhoto} alt="Uploaded proof" width={100} height={100} className="rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Add notes..."
                    />
                  </div>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
              
              <div className="space-y-6">
                {orderData.statusHistory.map((status, index) => {
                  const dateTime = formatDateTime(status.timestamp);
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            status.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {status.completed ? (
                              <FiCheckCircle className="w-4 h-4 text-white" />
                            ) : (
                              <FiClock className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          {index < orderData.statusHistory.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{status.title}</p>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{dateTime.date}</p>
                              <p className="text-xs text-gray-500">{dateTime.time}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                          
                          {status.status === 'delivery' && orderData.carrier && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-900">Carrier: {orderData.carrier.name}</p>
                              <p className="text-sm text-gray-600">{orderData.carrier.waNumber}</p>
                            </div>
                          )}
                          
                          {status.photo && (
                            <div className="mt-3">
                              <Image 
                                src={status.photo} 
                                alt="Delivery proof" 
                                width={200} 
                                height={150} 
                                className="rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
