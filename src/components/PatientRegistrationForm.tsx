import React, { useState } from 'react';

interface PatientRegistrationFormProps {
  onSubmit: (answers: any) => void;
}

export default function PatientRegistrationForm({ onSubmit }: PatientRegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    email: '',
    reasonForVisit: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm w-full max-w-sm mt-2 text-left">
      <h3 className="font-semibold text-[#043b2d] mb-4">Patient Registration</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full name</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
            placeholder="e.g. Ramesh Kumar"
            required
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
            <input 
              type="number" 
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
              placeholder="45"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500 bg-white"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
            placeholder="ramesh@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Reason for Visit</label>
          <textarea 
            name="reasonForVisit"
            value={formData.reasonForVisit}
            onChange={handleChange}
            className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500 resize-none h-20" 
            placeholder="E.g., Diabetic foot ulcer on right heel"
            required
          />
        </div>
        <button 
          type="submit"
          disabled={!formData.fullName || !formData.age || !formData.gender || !formData.email || !formData.reasonForVisit}
          className="w-full mt-4 bg-[#043b2d] text-white py-2 rounded-full font-medium text-sm disabled:opacity-50 hover:bg-[#032e22] transition-colors"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}
