// // src/components/PositionReq.jsx

// import { useState } from 'react';
// import { FaArrowLeft, FaBuilding, FaClipboardList, FaCheckCircle } from 'react-icons/fa';

// export default function PositionReqPage({ navigate }) {
//   const [formData, setFormData] = useState({
//     requisitionNumber: '',
//     originalId: '',
//     organization: '',
//     hrOrganization: '',
//     detailJobTitle: '',
//     grade: '',
//     eeoCode: '',
//     jobCategory: '',
//     corporateOfficer: false,
//     requestedBy: '',
//     requisitionDate: new Date().toISOString().substring(0, 10),
//     targetDate: '',
//     positionType: 'vacancy',
//     numberOfOpenings: 1,
//     newBusinessBudgetID: '',
//     newBusinessBudgetDescription: '',
//     comments: '',
//     status: 'Pending',
//     approver: '',
//     approvalDate: '',
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Position Requisition Submitted:', formData);
//     alert('Position Requisition form has been submitted.');
//     navigate('home');
//   };

//   const Card = ({ icon, title, children }) => (
//     <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200/50">
//       <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-200">
//         <div className="bg-gray-100 p-3 rounded-xl">{icon}</div>
//         <h3 className="text-xl font-bold text-gray-800">{title}</h3>
//       </div>
//       {children}
//     </div>
//   );

//   return (
//     <form onSubmit={handleSubmit} className="h-full flex flex-col bg-slate-50 text-gray-800">
//       <header className="bg-white shadow-md flex-shrink-0 z-10">
//         <div className="py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <button type="button" onClick={() => navigate('home')} className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200">
//               <FaArrowLeft size={16} />
//             </button>
//             <h1 className="text-xl font-bold text-gray-800">Position Requisition</h1>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button type="button" onClick={() => navigate('home')} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg">Cancel</button>
//             <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg">Submit</button>
//           </div>
//         </div>
//       </header>
//       <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow overflow-y-auto">
//         {/* Left Column */}
//         <div className="lg:col-span-2 flex flex-col gap-8">
//           <Card icon={<FaBuilding className="text-blue-600" />} title="Position Details">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//               <InputField label="Requisition Number" name="requisitionNumber" value={formData.requisitionNumber} onChange={handleChange} />
//               <InputField label="Original ID" name="originalId" value={formData.originalId} onChange={handleChange} />
//               <InputField label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
//               <InputField label="HR Organization" name="hrOrganization" value={formData.hrOrganization} onChange={handleChange} />
//               <InputField label="Detail Job Title" name="detailJobTitle" value={formData.detailJobTitle} onChange={handleChange} />
//               <InputField label="Grade" name="grade" value={formData.grade} onChange={handleChange} />
//               <InputField label="EEO Code" name="eeoCode" value={formData.eeoCode} onChange={handleChange} />
//               <InputField label="Job Category" name="jobCategory" value={formData.jobCategory} onChange={handleChange} />
//               <div className="md:col-span-2 flex items-center">
//                  <input type="checkbox" id="corporateOfficer" name="corporateOfficer" checked={formData.corporateOfficer} onChange={handleChange} className="h-4 w-4 rounded" />
//                  <label htmlFor="corporateOfficer" className="ml-2 text-sm font-medium text-gray-700">Corporate Officer</label>
//               </div>
//             </div>
//           </Card>
//           <Card icon={<FaClipboardList className="text-green-600" />} title="Requisition Information">
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                 <InputField label="Requested By" name="requestedBy" value={formData.requestedBy} onChange={handleChange} />
//                 <InputField label="Requisition Date" name="requisitionDate" type="date" value={formData.requisitionDate} onChange={handleChange} />
//                 <InputField label="Target Date" name="targetDate" type="date" value={formData.targetDate} onChange={handleChange} />
//                 <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Position Type</label>
//                     <div className="flex gap-4 mt-2">
//                         <RadioField label="Vacancy" name="positionType" value="vacancy" checked={formData.positionType === 'vacancy'} onChange={handleChange} />
//                         <RadioField label="New" name="positionType" value="new" checked={formData.positionType === 'new'} onChange={handleChange} />
//                     </div>
//                 </div>
//                 <InputField label="Number of Openings" name="numberOfOpenings" type="number" value={formData.numberOfOpenings} onChange={handleChange} />
//              </div>
//              <div className="mt-4 space-y-4">
//                 <InputField label="New Business Budget ID" name="newBusinessBudgetID" value={formData.newBusinessBudgetID} onChange={handleChange} />
//                 <InputField label="New Business Budget Description" name="newBusinessBudgetDescription" value={formData.newBusinessBudgetDescription} onChange={handleChange} />
//                 <label className="block text-sm font-medium text-gray-600">Comments</label>
//                 <textarea name="comments" value={formData.comments} onChange={handleChange} rows="4" className="w-full p-2 border rounded-lg bg-gray-50"></textarea>
//              </div>
//           </Card>
//         </div>
//         {/* Right Column */}
//         <div className="lg:col-span-1 flex flex-col gap-8">
//             <Card icon={<FaCheckCircle className="text-purple-600" />} title="Approval Information">
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
//                         <div className="space-y-2">
//                             <RadioField label="Pending" name="status" value="Pending" checked={formData.status === 'Pending'} onChange={handleChange} />
//                             <RadioField label="Approved" name="status" value="Approved" checked={formData.status === 'Approved'} onChange={handleChange} />
//                             <RadioField label="Rejected" name="status" value="Rejected" checked={formData.status === 'Rejected'} onChange={handleChange} />
//                             <RadioField label="Partially Filled" name="status" value="Partially Filled" checked={formData.status === 'Partially Filled'} onChange={handleChange} />
//                             <RadioField label="Filled" name="status" value="Filled" checked={formData.status === 'Filled'} onChange={handleChange} />
//                         </div>
//                     </div>
//                     <InputField label="Approver" name="approver" value={formData.approver} onChange={handleChange} />
//                     <InputField label="Approval Date" name="approvalDate" type="date" value={formData.approvalDate} onChange={handleChange} />
//                 </div>
//             </Card>
//         </div>
//       </main>
//     </form>
//   );
// }

// const InputField = ({ label, ...props }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
//     <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
//   </div>
// );

// const RadioField = ({ label, ...props }) => (
//     <div className="flex items-center">
//         <input type="radio" {...props} className="h-4 w-4" />
//         <label className="ml-2 text-sm font-medium text-gray-700">{label}</label>
//     </div>
// );



// src/components/PositionReq.jsx
// src/components/PositionReq.jsx

// src/components/PositionReq.jsx

// src/components/PositionReq.jsx

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaBuilding, FaClipboardList, FaCheckCircle, FaPlus } from 'react-icons/fa';

// --- Notification Component ---
const Notification = ({ message, show, onDismiss }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 3000); // Notification disappears after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);

    if (!show) return null;

    return (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
            {message}
        </div>
    );
};


// --- Helper Components ---
const Card = ({ icon, title, children }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50">
      <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-200">
        <div className="bg-white p-3 rounded-xl">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 [color-scheme:light]" />
  </div>
);

const RadioField = ({ label, ...props }) => (
    <div className="flex items-center">
        <input type="radio" {...props} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
        <label className="ml-2 text-sm font-medium text-gray-700">{label}</label>
    </div>
);


// --- Requisition Form Component ---
const PositionReqForm = ({ onSave, onCancel, navigate }) => {
    const [formData, setFormData] = useState({
        requisitionNumber: '', originalId: '', organization: '', hrOrganization: '',
        detailJobTitle: '', grade: '', eeoCode: '', jobCategory: '', corporateOfficer: false,
        requestedBy: '', requisitionDate: new Date().toISOString().substring(0, 10),
        targetDate: '', positionType: 'vacancy', numberOfOpenings: 1,
        newBusinessBudgetID: '', newBusinessBudgetDescription: '', comments: '',
        status: 'Pending', approver: '', approvalDate: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <header className="bg-white/80 backdrop-blur-sm shadow-md flex-shrink-0 z-10">
                <div className="py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onCancel} className="bg-white/80 text-gray-700 p-2 rounded-lg hover:bg-gray-200">
                            <FaArrowLeft size={16} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">New Position Requisition</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg">Submit</button>
                    </div>
                </div>
            </header>
            <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow overflow-y-auto">
                {/* Form content */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <Card icon={<FaBuilding className="text-blue-600" />} title="Position Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <InputField label="Requisition Number" name="requisitionNumber" value={formData.requisitionNumber} onChange={handleChange} />
                      <InputField label="Original ID" name="originalId" value={formData.originalId} onChange={handleChange} />
                      <InputField label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
                      <InputField label="HR Organization" name="hrOrganization" value={formData.hrOrganization} onChange={handleChange} />
                      <InputField label="Detail Job Title" name="detailJobTitle" value={formData.detailJobTitle} onChange={handleChange} />
                      <InputField label="Grade" name="grade" value={formData.grade} onChange={handleChange} />
                      <InputField label="EEO Code" name="eeoCode" value={formData.eeoCode} onChange={handleChange} />
                      <InputField label="Job Category" name="jobCategory" value={formData.jobCategory} onChange={handleChange} />
                      <div className="md:col-span-2 flex items-center">
                         <input type="checkbox" id="corporateOfficer" name="corporateOfficer" checked={formData.corporateOfficer} onChange={handleChange} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                         <label htmlFor="corporateOfficer" className="ml-2 text-sm font-medium text-gray-700">Corporate Officer</label>
                      </div>
                    </div>
                  </Card>
                  <Card icon={<FaClipboardList className="text-green-600" />} title="Requisition Information">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField label="Requested By" name="requestedBy" value={formData.requestedBy} onChange={handleChange} />
                        <InputField label="Requisition Date" name="requisitionDate" type="date" value={formData.requisitionDate} onChange={handleChange} />
                        <InputField label="Target Date" name="targetDate" type="date" value={formData.targetDate} onChange={handleChange} />
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Position Type</label>
                            <div className="flex gap-4 mt-2">
                                <RadioField label="Vacancy" name="positionType" value="vacancy" checked={formData.positionType === 'vacancy'} onChange={handleChange} />
                                <RadioField label="New" name="positionType" value="new" checked={formData.positionType === 'new'} onChange={handleChange} />
                            </div>
                        </div>
                        <InputField label="Number of Openings" name="numberOfOpenings" type="number" value={formData.numberOfOpenings} onChange={handleChange} />
                     </div>
                     <div className="mt-4 space-y-4">
                        <InputField label="New Business Budget ID" name="newBusinessBudgetID" value={formData.newBusinessBudgetID} onChange={handleChange} />
                        <InputField label="New Business Budget Description" name="newBusinessBudgetDescription" value={formData.newBusinessBudgetDescription} onChange={handleChange} />
                        <label className="block text-sm font-medium text-gray-600">Comments</label>
                        <textarea name="comments" value={formData.comments} onChange={handleChange} rows="4" className="w-full p-2 border rounded-lg bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                     </div>
                  </Card>
                </div>
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <Card icon={<FaCheckCircle className="text-purple-600" />} title="Approval Information">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                                <div className="space-y-2">
                                    <RadioField label="Pending" name="status" value="Pending" checked={formData.status === 'Pending'} onChange={handleChange} />
                                    <RadioField label="Approved" name="status" value="Approved" checked={formData.status === 'Approved'} onChange={handleChange} />
                                    <RadioField label="Rejected" name="status" value="Rejected" checked={formData.status === 'Rejected'} onChange={handleChange} />
                                    <RadioField label="Partially Filled" name="status" value="Partially Filled" checked={formData.status === 'Partially Filled'} onChange={handleChange} />
                                    <RadioField label="Filled" name="status" value="Filled" checked={formData.status === 'Filled'} onChange={handleChange} />
                                </div>
                            </div>
                            <InputField label="Approver" name="approver" value={formData.approver} onChange={handleChange} />
                            <InputField label="Approval Date" name="approvalDate" type="date" value={formData.approvalDate} onChange={handleChange} />
                        </div>
                    </Card>
                </div>
            </main>
        </form>
    );
};

// --- View Table Component ---
const ViewTable = ({ requisitions, onAddNew, navigate }) => (
    <div className="h-full flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm shadow-md flex-shrink-0 z-10">
            <div className="py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate('home')} className="bg-white/80 text-gray-700 p-2 rounded-lg hover:bg-gray-200">
                        <FaArrowLeft size={16} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Position Requisitions</h1>
                </div>
                <button onClick={onAddNew} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2">
                    <FaPlus size={12} /> Add New
                </button>
            </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 flex-grow overflow-y-auto">
            {requisitions.length === 0 ? (
                <p className="text-center text-gray-500">No requisitions found.</p>
            ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requisition #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requisitions.map(req => (
                                <tr key={req.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.requisitionNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{req.detailJobTitle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{req.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{req.requestedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    </div>
);

// --- Main Page Component ---
export default function PositionReqPage({ navigate }) {
    const [mode, setMode] = useState('view'); // 'view' or 'form'
    const [requisitions, setRequisitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '' });

    useEffect(() => {
        const fetchRequisitions = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5001/api/requisitions');
                const data = await response.json();
                setRequisitions(data);
            } catch (error) {
                console.error("Failed to fetch requisitions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequisitions();
    }, []);

    const handleSave = async (formData) => {
        try {
            await fetch('http://localhost:5001/api/requisitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setMode('view');
            // Refetch data to show the new entry
            const response = await fetch('http://localhost:5001/api/requisitions');
            const data = await response.json();
            setRequisitions(data);
            // Show success notification
            setNotification({ show: true, message: 'Requisition submitted successfully!' });
        } catch (error) {
            console.error("Failed to save requisition:", error);
            setNotification({ show: true, message: 'Failed to submit requisition.' });
        }
    };

    if (isLoading && mode === 'view') {
        return <p className="text-center p-8">Loading requisitions...</p>;
    }

    return (
        <div className="h-full">
            <Notification 
                message={notification.message} 
                show={notification.show} 
                onDismiss={() => setNotification({ show: false, message: '' })}
            />
            {mode === 'view' ? (
                <ViewTable 
                    requisitions={requisitions} 
                    onAddNew={() => setMode('form')} 
                    navigate={navigate}
                />
            ) : (
                <PositionReqForm 
                    onSave={handleSave} 
                    onCancel={() => setMode('view')}
                    navigate={navigate}
                />
            )}
        </div>
    );
}
