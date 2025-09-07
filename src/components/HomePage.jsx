// src/components/HomePage.jsx

const ActionButton = ({ bgColor, textColor, text, onClick, className = '' }) => (
  <button 
    onClick={onClick}
    className={`w-full ${bgColor} ${textColor} font-bold py-4 px-6 rounded-xl shadow-lg hover:opacity-90 transition-all transform hover:scale-105 ${className}`}
  >
    {text}
  </button>
);

export default function HomePage({ navigate }) {
  return (
    <div className="flex items-center justify-center p-8 h-full">
      <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full max-w-5xl text-center">
        <h2 className="text-5xl font-bold mb-2 text-gray-800">Welcome to the Payroll Portal</h2>
        <p className="text-gray-600 text-lg mb-10">
          {/* Your centralized platform for managing your workforce data efficiently. */}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Actions */}
          <ActionButton onClick={() => navigate('payroll')} bgColor="bg-green-500" textColor="text-white" text="Manage Payroll" />
          <ActionButton onClick={() => navigate('position-req')} bgColor="bg-yellow-500" textColor="text-white" text="Position Requisition" />
          <ActionButton onClick={() => navigate('user-profile')} bgColor="bg-blue-500" textColor="text-white" text="User Profile" />
          {/* <ActionButton onClick={() => alert('Navigate to Settings page!')} bgColor="bg-gray-200" textColor="text-gray-700" text="Settings" /> */}
        </div>
      </div>
    </div>
  );
}
