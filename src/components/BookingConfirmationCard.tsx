import { User, Phone, Stethoscope, Calendar, CheckCircle2 } from 'lucide-react';

interface BookingConfirmationCardProps {
  details: {
    name?: string;
    age?: string | number;
    phone?: string;
    doctor?: { id: string; name?: string };
    department?: { id: string; name?: string };
    date?: string;
    slot?: string;
    reference?: string;
  };
  onConfirm: () => void;
  onChangeTime: () => void;
  onCancel: () => void;
}

export default function BookingConfirmationCard({ details, onConfirm, onChangeTime, onCancel }: BookingConfirmationCardProps) {
  return (
    <div className="confirmation-card mt-2 bg-white rounded-lg p-4 border border-emerald-100 shadow-sm w-full max-w-sm text-left">
      <div className="card-header-badge mb-4">
        <span className="card-title font-semibold text-[#043b2d]">Appointment Summary</span>
      </div>

      <div className="card-body-details space-y-3 mb-4">
        <div className="detail-row flex gap-2">
          <User size={15} className="detail-icon text-gray-400 mt-1" />
          <div>
            <span className="detail-label text-xs text-gray-500 block">Patient:</span>
            <span className="detail-val text-sm font-medium">{details.name || 'Not provided'} {details.age ? `(${details.age} yrs)` : ''}</span>
          </div>
        </div>

        <div className="detail-row flex gap-2">
          <Phone size={15} className="detail-icon text-gray-400 mt-1" />
          <div>
            <span className="detail-label text-xs text-gray-500 block">Contact:</span>
            <span className="detail-val text-sm font-medium">{details.phone || 'Not provided'}</span>
          </div>
        </div>

        <div className="detail-row flex gap-2">
          <Stethoscope size={15} className="detail-icon text-gray-400 mt-1" />
          <div>
            <span className="detail-label text-xs text-gray-500 block">Doctor:</span>
            <span className="detail-val text-sm font-medium">
              {details.doctor?.name || 'Dr. K.V.N.N. Santosh Murthy'}
              {details.department?.name ? ` (${details.department.name})` : ''}
            </span>
          </div>
        </div>

        <div className="detail-row flex gap-2">
          <Calendar size={15} className="detail-icon text-gray-400 mt-1" />
          <div>
            <span className="detail-label text-xs text-gray-500 block">Date & Time:</span>
            <span className="detail-val text-sm font-medium">
              {details.date ? new Date(details.date).toLocaleDateString() : ''} {details.slot ? `at ${details.slot}` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={onConfirm}
          className="w-full bg-[#043b2d] text-white py-2 rounded-full font-medium text-sm hover:bg-[#032e22] transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} /> Confirm Booking
        </button>
        <button 
          onClick={onChangeTime}
          className="w-full border border-[#043b2d] text-[#043b2d] py-2 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Change Date & Time
        </button>
        <button 
          onClick={onCancel}
          className="w-full text-xs text-red-600 font-medium py-1 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
