"use client";
import React, { useState } from 'react';
import ReusableButton from '../forms/ReusableButton';

const SalesContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    productsOfInterest: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        productsOfInterest: checked
          ? [...prev.productsOfInterest, value]
          : prev.productsOfInterest.filter(product => product !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      productsOfInterest: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First name*
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="First name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last name*
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email*
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="you@yourcompany.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message*
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Leave us a message..."
        ></textarea>
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">
          Which products are you interested in?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <div className="flex items-center">
            <input
              id="untitledMail"
              name="productsOfInterest"
              type="checkbox"
              value="Untitled Mail"
              checked={formData.productsOfInterest.includes('Untitled Mail')}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="untitledMail" className="ml-2 block text-sm text-gray-900">
              Untitled Mail
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="untitledVPN"
              name="productsOfInterest"
              type="checkbox"
              value="Untitled VPN"
              checked={formData.productsOfInterest.includes('Untitled VPN')}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="untitledVPN" className="ml-2 block text-sm text-gray-900">
              Untitled VPN
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="untitledCalendar"
              name="productsOfInterest"
              type="checkbox"
              value="Untitled Calendar"
              checked={formData.productsOfInterest.includes('Untitled Calendar')}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="untitledCalendar" className="ml-2 block text-sm text-gray-900">
              Untitled Calendar
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="untitledWorkspace"
              name="productsOfInterest"
              type="checkbox"
              value="Untitled Workspace"
              checked={formData.productsOfInterest.includes('Untitled Workspace')}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="untitledWorkspace" className="ml-2 block text-sm text-gray-900">
              Untitled Workspace
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="untitledDrive"
              name="productsOfInterest"
              type="checkbox"
              value="Untitled Drive"
              checked={formData.productsOfInterest.includes('Untitled Drive')}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="untitledDrive" className="ml-2 block text-sm text-gray-900">
              Untitled Drive
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="otherProduct"
              name="productsOfInterest"
              type="checkbox"
              value="Other"
              checked={formData.productsOfInterest.includes('Other')}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="otherProduct" className="ml-2 block text-sm text-gray-900">
              Other
            </label>
          </div>
        </div>
      </div>

      <ReusableButton
        type="submit"
        className='w-full cursor-pointer'
        label='Send message'
      />
    </form>
  );
};

export default SalesContactForm;