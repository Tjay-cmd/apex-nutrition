"use client";

import React from 'react';
import { User, Mail, Phone, MapPin, Building, Globe } from 'lucide-react';
import { useCheckout, ShippingAddress, BillingAddress } from '@/contexts/checkout-context';

interface AddressFormProps {
  type: 'shipping' | 'billing';
  title: string;
  description?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  type,
  title,
  description
}) => {
  const {
    shippingAddress,
    billingAddress,
    updateShippingAddress,
    updateBillingAddress,
    errors,
  } = useCheckout();

  const address = type === 'shipping' ? shippingAddress : billingAddress;
  const updateAddress = type === 'shipping' ? updateShippingAddress : updateBillingAddress;
  const addressErrors = type === 'shipping' ? errors.shipping : errors.billing;

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    updateAddress({ [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${type}-first-name`} className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={`${type}-first-name`}
                type="text"
                value={address.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  addressErrors?.first_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="First name"
              />
            </div>
            {addressErrors?.first_name && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.first_name}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${type}-last-name`} className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={`${type}-last-name`}
                type="text"
                value={address.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  addressErrors?.last_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Last name"
              />
            </div>
            {addressErrors?.last_name && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.last_name}</p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${type}-email`} className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={`${type}-email`}
                type="email"
                value={address.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  addressErrors?.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Email address"
              />
            </div>
            {addressErrors?.email && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${type}-phone`} className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={`${type}-phone`}
                type="tel"
                value={address.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  addressErrors?.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Phone number"
              />
            </div>
            {addressErrors?.phone && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.phone}</p>
            )}
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label htmlFor={`${type}-address-1`} className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id={`${type}-address-1`}
              type="text"
              value={address.address_line_1}
              onChange={(e) => handleChange('address_line_1', e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                addressErrors?.address_line_1 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Street address"
            />
          </div>
          {addressErrors?.address_line_1 && (
            <p className="mt-1 text-sm text-red-600">{addressErrors.address_line_1}</p>
          )}
        </div>

        <div>
          <label htmlFor={`${type}-address-2`} className="block text-sm font-medium text-gray-700 mb-2">
            Apartment, suite, etc. (optional)
          </label>
          <input
            id={`${type}-address-2`}
            type="text"
            value={address.address_line_2 || ''}
            onChange={(e) => handleChange('address_line_2', e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors"
            placeholder="Apartment, suite, etc."
          />
        </div>

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${type}-city`} className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={`${type}-city`}
                type="text"
                value={address.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  addressErrors?.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="City"
              />
            </div>
            {addressErrors?.city && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${type}-state`} className="block text-sm font-medium text-gray-700 mb-2">
              Province
            </label>
            <select
              id={`${type}-state`}
              value={address.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                addressErrors?.state ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Province</option>
              <option value="Gauteng">Gauteng</option>
              <option value="Western Cape">Western Cape</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="Free State">Free State</option>
              <option value="Limpopo">Limpopo</option>
              <option value="Mpumalanga">Mpumalanga</option>
              <option value="North West">North West</option>
              <option value="Northern Cape">Northern Cape</option>
            </select>
            {addressErrors?.state && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.state}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${type}-postal-code`} className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              id={`${type}-postal-code`}
              type="text"
              value={address.postal_code}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                addressErrors?.postal_code ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Postal code"
            />
            {addressErrors?.postal_code && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.postal_code}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label htmlFor={`${type}-country`} className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id={`${type}-country`}
              value={address.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors"
            >
              <option value="South Africa">South Africa</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};