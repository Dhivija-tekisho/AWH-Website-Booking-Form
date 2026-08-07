import React, { useState } from 'react';

interface PhoneVerificationFormProps {
  onSubmit: (answers: { phone: string; otp: string }) => void;
}

export default function PhoneVerificationForm({ onSubmit }: PhoneVerificationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <h3 className="font-semibold text-[#043b2d] mb-4">Phone Verification</h3>
      
      {step === 1 ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mobile number</label>
            <div className="flex border border-gray-200 rounded-md overflow-hidden focus-within:border-emerald-500">
              <span className="bg-gray-50 px-3 py-2 text-sm text-gray-500 border-r border-gray-200">+91</span>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-sm p-2 focus:outline-none" 
                placeholder=""
              />
            </div>
          </div>
          <button 
            onClick={handleSendOTP}
            disabled={formData.phone.length < 10}
            className="w-full mt-4 bg-[#043b2d] text-white py-2 rounded-full font-medium text-sm disabled:opacity-50 hover:bg-[#032e22] transition-colors"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Enter OTP</label>
            <p className="text-xs text-gray-500 mb-2">Code sent to +91 {formData.phone}</p>
            <input 
              type="text" 
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full text-center tracking-widest text-lg p-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500" 
              placeholder=""
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
            Change mobile number
          </button>
        </form>
      )}
    </div>
  );
}
