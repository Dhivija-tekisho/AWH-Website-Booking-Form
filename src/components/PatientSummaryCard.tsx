import { User, CheckCircle2 } from 'lucide-react';

interface PatientSummaryCardProps {
  details: {
    patientRef: string;
  };
  onContinue: () => void;
  onNotYou: () => void;
}

export default function PatientSummaryCard({ details, onContinue, onNotYou }: PatientSummaryCardProps) {
  return (
    <div className="confirmation-card mt-2 bg-white rounded-lg p-4 border border-emerald-100 shadow-sm w-full max-w-sm text-left">
      <div className="card-header-badge mb-4">
        <CheckCircle2 size={20} className="text-emerald-500" />
        <span className="card-title font-semibold text-[#043b2d]">Patient Found</span>
      </div>

      <div className="card-body-details space-y-3 mb-4">
        <div className="detail-row flex gap-2">
          <User size={15} className="detail-icon text-gray-400 mt-1" />
          <div>
            <span className="detail-label text-xs text-gray-500 block">Patient Profile:</span>
            <span className="detail-val text-sm font-medium">Record ID: {details.patientRef}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={onContinue}
          className="w-full bg-[#043b2d] text-white py-2 rounded-full font-medium text-sm hover:bg-[#032e22] transition-colors flex items-center justify-center gap-2"
        >
          Continue Booking
        </button>
        <button 
          onClick={onNotYou}
          className="w-full text-xs text-[#043b2d] font-medium py-1 hover:underline"
        >
          Not you?
        </button>
      </div>
    </div>
  );
}
