'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiShoppingBag,
  FiTrendingUp,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiCamera,
  FiExternalLink,
  FiUpload,
  FiTrash2
} from 'react-icons/fi';

export default function EditShopPage({ params }) {
  const [shopData, setShopData] = useState({
    name: '',
    ownerName: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    status: 'active',
    statusReason: '',
    shopImage: '/api/placeholder/150/150',
    category: 'Electronics',
    establishedDate: '',
    businessLicense: '',
    taxId: '',
    // Additional fields for comprehensive shop management
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: false }
    },
    paymentMethods: ['credit_card', 'bank_transfer', 'cash_on_delivery'],
    shippingZones: ['jakarta', 'bogor', 'depok', 'tangerang', 'bekasi']
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Load shop data if editing existing shop
  useEffect(() => {
    if (params?.id) {
      // In real app, fetch shop data by ID
      loadShopData(params.id);
    }
  }, [params?.id]);

  const loadShopData = async (shopId) => {
    setLoading(true);
    try {
      // Simulate API call - replace with real API
      const mockData = {
        name: 'Hakkam Store',
        ownerName: 'Hakkam Robbani',
        address: 'Jl. Lodaya, Kota Bogor',
        email: 'hakkam@botmail.com',
        phone: '+62 812 3456 7890',
        website: 'https://hakkamstore.com',
        description: 'Premium electronics and gadgets store specializing in quality products with excellent customer service.',
        status: 'active',
        statusReason: '',
        shopImage: '/api/placeholder/150/150',
        category: 'Electronics',
        establishedDate: '2022-01-15',
        businessLicense: 'BL-2022-001234',
        taxId: 'TAX-567890123',
        socialMedia: {
          facebook: 'https://facebook.com/hakkamstore',
          instagram: '@hakkamstore',
          twitter: '@hakkamstore'
        },
        businessHours: {
          monday: { open: '09:00', close: '18:00', isOpen: true },
          tuesday: { open: '09:00', close: '18:00', isOpen: true },
          wednesday: { open: '09:00', close: '18:00', isOpen: true },
          thursday: { open: '09:00', close: '18:00', isOpen: true },
          friday: { open: '09:00', close: '18:00', isOpen: true },
          saturday: { open: '10:00', close: '16:00', isOpen: true },
          sunday: { open: '10:00', close: '16:00', isOpen: false }
        },
        paymentMethods: ['credit_card', 'bank_transfer', 'cash_on_delivery'],
        shippingZones: ['jakarta', 'bogor', 'depok', 'tangerang', 'bekasi']
      };
      setShopData(mockData);
    } catch (error) {
      console.error('Error loading shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setShopData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setShopData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setShopData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleArrayFieldChange = (field, value, isChecked) => {
    setShopData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setShopData(prev => ({
          ...prev,
          shopImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!shopData.name.trim()) newErrors.name = 'Shop name is required';
    if (!shopData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!shopData.email.trim()) newErrors.email = 'Email is required';
    if (!shopData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shopData.address.trim()) newErrors.address = 'Address is required';
    if (!shopData.category) newErrors.category = 'Category is required';
    if (!shopData.establishedDate) newErrors.establishedDate = 'Established date is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shopData.email && !emailRegex.test(shopData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (shopData.phone && !phoneRegex.test(shopData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - replace with real API
      console.log('Saving shop data:', shopData);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message (you can add toast notification here)
      alert('Shop information updated successfully!');
      
      // Redirect back to shops list or shop view
      // router.push('/admin/shops');
    } catch (error) {
      console.error('Error saving shop data:', error);
      alert('Error saving shop data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !shopData.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/shops"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {params?.id ? 'Edit Shop' : 'Add New Shop'}
            </h1>
            <p className="text-gray-600">
              {params?.id ? 'Update shop information and settings' : 'Create a new online shop profile'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/shops"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiX className="mr-2 h-4 w-4" />
            Cancel
          </Link>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Shop'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Shop Preview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shop Image Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Image</h3>
            <div className="text-center">
              <div className="relative inline-block">
                <Image
                  src={imagePreview || shopData.shopImage}
                  alt="Shop preview"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto border-2 border-gray-200"
                  unoptimized
                />
                <label className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 cursor-pointer">
                  <FiCamera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FiUpload className="inline h-4 w-4 mr-2" />
                  Upload Image
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setShopData(prev => ({ ...prev, shopImage: '/api/placeholder/150/150' }));
                    }}
                    className="w-full px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    <FiTrash2 className="inline h-4 w-4 mr-2" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Shop Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">{shopData.name || 'Shop Name'}</h4>
              <p className="text-gray-600 text-sm">{shopData.ownerName || 'Owner Name'}</p>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shopData.status)}`}>
                  {shopData.status}
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center justify-center">
                  <FiMapPin className="h-4 w-4 mr-1" />
                  {shopData.address || 'Address'}
                </p>
                <p className="flex items-center justify-center mt-1">
                  <FiMail className="h-4 w-4 mr-1" />
                  {shopData.email || 'Email'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"   
                  value={shopData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter shop name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.ownerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter owner name"
                />
                {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={shopData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={shopData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border  text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={shopData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={shopData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://yourshop.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={shopData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe your shop and what you sell..."
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={shopData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={shopData.establishedDate}
                  onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.establishedDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.establishedDate && <p className="mt-1 text-sm text-red-600">{errors.establishedDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
                <input
                  type="text"
                  value={shopData.businessLicense}
                  onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter business license number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                <input
                  type="text"
                  value={shopData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter tax identification number"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Hours</h2>
            <div className="space-y-4">
              {Object.entries(shopData.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) => handleBusinessHoursChange(day, 'isOpen', e.target.checked)}
                      className="rounded border-gray-300 text-gray-600 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-600">Open</span>
                  </div>
                  {hours.isOpen && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                        className="px-3 py-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                        className="px-3 py-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Status Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={shopData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Change Reason</label>
                <textarea
                  value={shopData.statusReason}
                  onChange={(e) => handleInputChange('statusReason', e.target.value)}
                  placeholder="Provide reason for status change..."
                  rows={3}
                  className="w-full px-3 py-2 border text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
