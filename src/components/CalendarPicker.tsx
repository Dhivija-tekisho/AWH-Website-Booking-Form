import { useState } from 'react';

interface CalendarPickerProps {
  onSubmit: (answers: any) => void;
  form?: any;
}

export default function CalendarPicker({ onSubmit, form }: CalendarPickerProps) {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const rawDoctors = form?.data?.specialists || [];
  const doctors = rawDoctors.length > 0 ? rawDoctors : [
    { id: 'dr-santosh', name: 'Dr. K.V.N.N. Santosh Murthy', specialty: 'Senior Wound Specialist' },
  ];

  const rawSlots = form?.data?.slots || [];
  
  // Group slots by date
  const groupedSlots: Record<string, string[]> = {};
  rawSlots.forEach((slot: any) => {
    if (slot.available) {
      const dateObj = new Date(slot.startsAt);
      const dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      if (!groupedSlots[dateKey]) {
        groupedSlots[dateKey] = [];
      }
      groupedSlots[dateKey].push(timeStr);
    }
  });

  const availableDates = Object.keys(groupedSlots);
  const displayDates = availableDates.length > 0 ? availableDates.map((date, idx) => ({
    id: `date-${idx}`,
    label: date,
    date: date
  })) : [
    { id: 'today', label: 'Today', date: 'Aug 6' },
    { id: 'tomorrow', label: 'Tomorrow', date: 'Aug 7' },
    { id: 'day3', label: 'Wed', date: 'Aug 8' },
  ];

  const displaySlots = selectedDate && groupedSlots[selectedDate] 
    ? groupedSlots[selectedDate] 
    : (availableDates.length === 0 ? ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'] : []);

  const handleSubmit = () => {
    onSubmit({
      doctorId: selectedDoctor,
      date: selectedDate,
      slot: selectedSlot,
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm w-full max-w-sm mt-2 text-left">
      <h3 className="font-semibold text-[#043b2d] mb-4">Select Date & Time</h3>
      
      <div className="space-y-4">
        {/* Doctor Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Available Specialists</label>
          <div className="space-y-2">
            {doctors.map((doc: any) => (
              <div 
                key={doc.id}
                onClick={() => setSelectedDoctor(doc.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedDoctor === doc.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
              >
                <div className="font-medium text-sm text-[#043b2d]">{doc.name}</div>
                <div className="text-xs text-gray-500">{doc.specialty || doc.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        {selectedDoctor && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Select Date</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {displayDates.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDate(d.date)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl border transition-colors ${selectedDate === d.date ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200 hover:border-emerald-200 bg-white'}`}
                >
                  <span className={`text-[10px] font-medium uppercase ${selectedDate === d.date ? 'text-emerald-50' : 'text-gray-500'}`}>{d.label}</span>
                  <span className="text-lg font-bold">{d.date.split(' ')[1] || d.date}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        {selectedDate && displaySlots.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Select Time</label>
            <div className="grid grid-cols-2 gap-2">
              {displaySlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedSlot(time)}
                  className={`p-2 text-sm rounded-lg border font-medium transition-colors ${selectedSlot === time ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-300 text-gray-600 bg-white'}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {selectedDate && displaySlots.length === 0 && (
          <div className="text-sm text-gray-500 italic mt-2">
            No slots available on this date.
          </div>
        )}

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={!selectedDoctor || !selectedDate || !selectedSlot}
          className="w-full mt-4 bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Confirm Date & Time
        </button>
      </div>
    </div>
  );
}
