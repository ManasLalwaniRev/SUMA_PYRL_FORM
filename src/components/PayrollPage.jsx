// src/components/PayrollPage.jsx

import { useState, useEffect } from 'react';
import { FaUser, FaRegListAlt, FaMoneyBillWave, FaQuestionCircle, FaCommentDots, FaArrowLeft, FaCheck, FaEdit, FaPlus } from 'react-icons/fa';

// --- Reusable Form Component ---
const PayrollForm = ({ onSave, initialData, onCancel, isEditing }) => {
    const [formData, setFormData] = useState({
        employeeName: '', employeeId: '', dateOfHire: '', reviewDate: '', currentJobTitle: '',
        workLocation: '', todayDate: new Date().toISOString().substring(0, 10), employeeClassCode: '',
        employeeCode: '', description: '', rateType: '', flsaExempt: false,
        reasonForChange: { annualIncrease: false, jobChange: false, transfer: false, promotion: false, other: false, demotion: false },
        currentSalary: '', newSalary: '', percentageAdjustment: '', effectiveDate: '', newJobTitle: '',
        newSupervisorName: '', newSupervisorId: '', newProgram: '', newDepartment: '',
        nextReviewDate: '', newEmployeeCode: '', newRateType: '', newFlsaExempt: false, comments: '',
    });
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/employees');
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            }
        };
        if (!isEditing) {
            fetchEmployees();
        }
    }, [isEditing]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleEmployeeSelect = async (employeeId) => {
        if (!employeeId) {
            setFormData(prev => ({ ...prev, employeeName: '', employeeId: '', currentJobTitle: '', dateOfHire: '', workLocation: '', currentSalary: '', employeeClassCode: '' }));
            setSelectedEmployeeId('');
            return;
        }
        setSelectedEmployeeId(employeeId);
        try {
            const response = await fetch(`http://localhost:5001/api/employees/${employeeId}`);
            const data = await response.json();
            const hireDate = data.dateOfHire ? new Date(data.dateOfHire).toISOString().split('T')[0] : '';
            setFormData(prev => ({
                ...prev,
                employeeName: data.employeeName,
                employeeId: data.employeeId,
                currentJobTitle: data.currentJobTitle,
                dateOfHire: hireDate,
                workLocation: data.workLocation,
                currentSalary: data.currentSalary,
                employeeClassCode: data.employeeClassCode,
            }));
        } catch (error) {
            console.error("Failed to fetch employee details:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('reasonForChange.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, reasonForChange: { ...prev.reasonForChange, [field]: checked } }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 flex-shrink-0 z-10">
                <div className="py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">{isEditing ? `Editing: ${initialData.employeeName}` : 'Add New Employee Data'}</h1>
                    <div className="flex items-center space-x-3">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </header>
            <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6 flex-grow overflow-y-auto">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <Card icon={<FaUser className="text-blue-600" size={20} />} title="Employee Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {!isEditing ? (
                                <SelectField label="Select Employee *" value={selectedEmployeeId} onChange={(e) => handleEmployeeSelect(e.target.value)}>
                                    <option value="">Select...</option>
                                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.employeeName} ({emp.employeeId})</option>)}
                                </SelectField>
                            ) : (
                                <InputField label="Employee Name *" name="employeeName" value={formData.employeeName} readOnly />
                            )}
                            <InputField label="Employee ID" name="employeeId" value={formData.employeeId} readOnly />
                            <InputField label="Current Job Title" name="currentJobTitle" value={formData.currentJobTitle} readOnly />
                            <InputField label="Date of Hire" name="dateOfHire" type="date" value={formData.dateOfHire} readOnly />
                            <InputField label="Work Location" name="workLocation" value={formData.workLocation} readOnly />
                            <InputField label="Review Date" name="reviewDate" type="date" value={formData.reviewDate} onChange={handleChange} />
                            <InputField label="Today's Date" name="todayDate" type="date" value={formData.todayDate} onChange={handleChange} />
                        </div>
                    </Card>
                    <Card icon={<FaMoneyBillWave className="text-green-600" size={20} />} title="Compensation & Position Change">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <InputFieldWithIcon icon="$" label="Current Salary" name="currentSalary" value={formData.currentSalary} readOnly />
                            <InputFieldWithIcon icon="$" label="New Salary" name="newSalary" value={formData.newSalary} onChange={handleChange} />
                            <InputFieldWithIcon icon="%" label="Percentage Adjustment" name="percentageAdjustment" value={formData.percentageAdjustment} onChange={handleChange} />
                            <InputField label="Effective Date" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} />
                            <InputField label="New Job Title" name="newJobTitle" value={formData.newJobTitle} onChange={handleChange} />
                            <InputField label="New Supervisor Name" name="newSupervisorName" value={formData.newSupervisorName} onChange={handleChange} />
                            <InputField label="New Supervisor ID" name="newSupervisorId" value={formData.newSupervisorId} onChange={handleChange} />
                            <InputField label="New Program" name="newProgram" value={formData.newProgram} onChange={handleChange} />
                            <InputField label="New Department" name="newDepartment" value={formData.newDepartment} onChange={handleChange} />
                            <InputField label="Next Review Date" name="nextReviewDate" type="date" value={formData.nextReviewDate} onChange={handleChange} />
                            <SelectField label="New Employee Code" name="newEmployeeCode" value={formData.newEmployeeCode} onChange={handleChange}>
                                <option value="">-None-</option>
                                <option value="NE1">NE1</option>
                            </SelectField>
                            <SelectField label="New Rate Type" name="newRateType" value={formData.newRateType} onChange={handleChange}>
                                <option value="">-None-</option>
                                <option value="hourly-new">New Hourly</option>
                            </SelectField>
                            <div className="md:col-span-2"><CheckboxField id="newFlsaExempt" name="newFlsaExempt" checked={formData.newFlsaExempt} onChange={handleChange} label="New FLSA Exempt" /></div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card icon={<FaRegListAlt className="text-purple-600" size={20} />} title="Classification & Rate">
                        <div className="flex flex-col gap-4">
                            <InputField label="Employee Class Code" name="employeeClassCode" value={formData.employeeClassCode} readOnly />
                            <InputField label="Description" name="description" value={formData.description} onChange={handleChange} />
                            <SelectField label="Employee Code" name="employeeCode" value={formData.employeeCode} onChange={handleChange}>
                                <option value="">-None-</option>
                                <option value="E1">E1</option>
                            </SelectField>
                            <SelectField label="Rate Type" name="rateType" value={formData.rateType} onChange={handleChange}>
                                <option value="">-None-</option>
                                <option value="hourly">Hourly</option>
                            </SelectField>
                            <CheckboxField id="flsaExempt" name="flsaExempt" checked={formData.flsaExempt} onChange={handleChange} label="FLSA Exempt" />
                        </div>
                    </Card>
                    <div className="mt-auto"></div>
                    <div className="flex flex-col gap-6">
                        <Card icon={<FaQuestionCircle className="text-amber-600" size={20} />} title="Reason For Change">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(formData.reasonForChange).map(reason => <CheckboxField key={reason} id={reason} name={`reasonForChange.${reason}`} checked={formData.reasonForChange[reason]} onChange={handleChange} label={reason.replace(/([A-Z])/g, ' $1').trim()} />)}
                            </div>
                        </Card>
                        <Card icon={<FaCommentDots className="text-rose-600" size={20} />} title="Comments">
                            <textarea id="comments" name="comments" placeholder="Enter comments here..." rows="4" className="w-full p-3 border border-gray-300 rounded-lg bg-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" value={formData.comments} onChange={handleChange}></textarea>
                        </Card>
                    </div>
                </div>
            </main>
        </form>
    );
};

// --- Reusable View Component ---
const ViewTable = ({ data, onEdit, onAddNew }) => {
    return (
        <div className="h-full flex flex-col">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 flex-shrink-0 z-10">
                <div className="py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">View Payroll Data</h1>
                    <button onClick={onAddNew} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 flex items-center gap-2">
                        <FaPlus size={12} /> Add New Entry
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Salary</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.map((entry) => (
                                    <tr key={entry.id} className={`hover:bg-gray-50/50 ${entry.version > 1 ? 'bg-yellow-100/50' : ''}`}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.employeeName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{entry.newJobTitle || entry.currentJobTitle}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{entry.newSalary}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{entry.effectiveDate}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
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
};

// --- Main Page Component ---
export default function PayrollPage({ data, onAdd, onUpdate, isLoading, error }) {
    const [mode, setMode] = useState('view'); // 'view' or 'form'
    const [currentItem, setCurrentItem] = useState(null);

    const handleAddNew = () => {
        setCurrentItem(null);
        setMode('form');
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setMode('form');
    };

    const handleSave = (formData) => {
        if (currentItem) {
            onUpdate(formData);
        } else {
            onAdd(formData);
        }
        setMode('view');
    };

    const handleCancel = () => {
        setMode('view');
        setCurrentItem(null);
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        mode === 'view'
            ? <ViewTable data={data} onEdit={handleEdit} onAddNew={handleAddNew} />
            : <PayrollForm onSave={handleSave} initialData={currentItem} isEditing={!!currentItem} onCancel={handleCancel} />
    );
}

// --- Field Components ---
const Card = ({ icon, title, children, className = '' }) => <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col ${className}`}><div className="flex items-center gap-3 mb-6 flex-shrink-0"><div className="bg-white p-2 rounded-lg">{icon}</div><h3 className="text-lg font-semibold text-gray-700">{title}</h3></div><div className="flex-grow">{children}</div></div>;
const InputField = ({ label, ...props }) => <div><label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label><input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200/50" /></div>;
const InputFieldWithIcon = ({ label, icon, ...props }) => <div><label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">{icon}</span></div><input {...props} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200/50" /></div></div>;
const SelectField = ({ label, children, ...props }) => <div><label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label><select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500">{children}</select></div>;
const CheckboxField = ({ id, name, checked, onChange, label }) => <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer"><div className="relative"><input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="sr-only peer" /><div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600"></div><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div></div><span className="text-sm font-medium text-gray-700 capitalize">{label}</span></label>;
