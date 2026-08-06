import React, { useState } from 'react';

interface PatientIntakeFormProps {
  onSubmit: (answers: any) => void;
}

export default function PatientIntakeForm({ onSubmit }: PatientIntakeFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    otp: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = () => {
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm w-full max-w-sm mt-2 text-left">
      <h3 className="font-semibold text-[#043b2d] mb-4">New patient intake</h3>
      
      {step === 1 ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
              placeholder="e.g. Ramesh Kumar"
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
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mobile number</label>
            <div className="flex border border-gray-200 rounded-md overflow-hidden focus-within:border-emerald-500">
              <span className="bg-gray-50 px-3 py-2 text-sm text-gray-500 border-r border-gray-200">+91</span>
              <input 
                type="tel" 
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full text-sm p-2 focus:outline-none" 
                placeholder="90000 00000"
              />
            </div>
          </div>
          <button 
            onClick={handleSendOTP}
            disabled={!formData.fullName || !formData.age || !formData.gender || formData.mobileNumber.length < 10}
            className="w-full mt-4 bg-[#043b2d] text-white py-2 rounded-full font-medium text-sm disabled:opacity-50 hover:bg-[#032e22] transition-colors"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Enter OTP</label>
            <p className="text-xs text-gray-500 mb-2">Code sent to +91 {formData.mobileNumber}</p>
            <input 
              type="text" 
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full text-center tracking-widest text-lg p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
              placeholder="----"
              maxLength={4}
            />
          </div>
          <button 
            type="submit"
            disabled={formData.otp.length < 4}
            className="w-full bg-[#cca66a] text-white py-2 rounded-full font-medium text-sm disabled:opacity-50 hover:bg-[#b8945a] transition-colors"
          >
            Verify & Continue
          </button>
          <button 
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-xs text-emerald-700 font-medium mt-2"
          >
            Go back
          </button>
        </form>
      )}
    </div>
  );
}
