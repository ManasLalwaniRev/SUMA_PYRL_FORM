// src/components/ViewAndEditDataPage.jsx

import { FaArrowLeft, FaEdit } from 'react-icons/fa';

export default function ViewAndEditDataPage({ data, onEdit, navigate }) {
  return (
    <div className="h-full flex flex-col">
      <header className="bg-white/70 backdrop-blur-sm shadow-sm flex-shrink-0 z-10">
        <div className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('home')} className="text-gray-500 hover:text-gray-800"><FaArrowLeft size={20} /></button>
            <h1 className="text-xl font-semibold text-gray-700">View & Edit Payroll Data</h1>
          </div>
          <button onClick={() => navigate('add')} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">
            Add New Entry
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 flex-grow overflow-y-auto">
        {data.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <h2 className="text-2xl font-semibold">No Data Found</h2>
            <p>Click "Add New Entry" to get started.</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Salary</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.employeeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.newJobTitle || entry.currentJobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.newSalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.effectiveDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onEdit(entry)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
