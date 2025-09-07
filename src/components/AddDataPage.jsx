// src/components/AddDataPage.jsx

import { useState, useEffect } from 'react';
import { FaUser, FaRegListAlt, FaMoneyBillWave, FaQuestionCircle, FaCommentDots, FaArrowLeft, FaCheck } from 'react-icons/fa';

// This is the Payroll Form, repurposed for adding and editing data
export default function AddDataPage({ onSave, initialData = null, isEditing = false, navigate }) {
  const [formData, setFormData] = useState({
    employeeName: '', employeeId: '', dateOfHire: '', reviewDate: '', currentJobTitle: '',
    workLocation: '', todayDate: new Date().toISOString().substring(0, 10), employeeClassCode: '',
    employeeCode: '', description: '', rateType: '', flsaExempt: false,
    reasonForChange: { annualIncrease: false, jobChange: false, transfer: false, promotion: false, other: false, demotion: false },
    currentSalary: '', newSalary: '', percentageAdjustment: '', effectiveDate: '', newJobTitle: '',
    newSupervisorName: '', newSupervisorId: '', newProgram: '', newDepartment: '',
    nextReviewDate: '', newEmployeeCode: '', newRateType: '', newFlsaExempt: false, comments: '',
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
    }
  }, [isEditing, initialData]);

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

  const Card = ({ icon, title, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-xl border border-gray-200/50 flex flex-col ${className}`}>
      <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-200 flex-shrink-0">
        <div className="bg-gray-100 p-3 rounded-xl">{icon}</div>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{title}</h3>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 text-gray-800">
      <header className="bg-white shadow-md flex-shrink-0 z-10">
        <div className="py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('home')} className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200">
                <FaArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Employee Data' : 'Add New Employee Data'}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={() => navigate(isEditing ? 'view' : 'home')} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">Save Changes</button>
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8 flex-grow overflow-y-auto">
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-8">
            <Card icon={<FaUser className="text-blue-600" size={20} />} title="Employee Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField label="Employee Name *" name="employeeName" value={formData.employeeName} onChange={handleChange} required />
                <InputField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} />
                <InputField label="Current Job Title" name="currentJobTitle" value={formData.currentJobTitle} onChange={handleChange} />
                <InputField label="Date of Hire" name="dateOfHire" type="date" value={formData.dateOfHire} onChange={handleChange} />
                <InputField label="Work Location" name="workLocation" value={formData.workLocation} onChange={handleChange} />
                <InputField label="Review Date" name="reviewDate" type="date" value={formData.reviewDate} onChange={handleChange} />
                <InputField label="Today's Date" name="todayDate" type="date" value={formData.todayDate} onChange={handleChange} />
              </div>
            </Card>

            <Card icon={<FaMoneyBillWave className="text-green-600" size={20} />} title="Compensation & Position Change">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputFieldWithIcon icon="$" label="Current Salary" name="currentSalary" value={formData.currentSalary} onChange={handleChange} />
                <InputFieldWithIcon icon="$" label="New Salary" name="newSalary" value={formData.newSalary} onChange={handleChange} />
                <InputFieldWithIcon icon="%" label="Percentage Adjustment" name="percentageAdjustment" value={formData.percentageAdjustment} onChange={handleChange} />
                <InputField label="Effective Date" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} />
                <InputField label="New Job Title" name="newJobTitle" value={formData.newJobTitle} onChange={handleChange} />
                <InputField label="New Supervisor Name" name="newSupervisorName" value={formData.newSupervisorName} onChange={handleChange} />
                <InputField label="New Supervisor ID" name="newSupervisorId" value={formData.newSupervisorId} onChange={handleChange} />
                <InputField label="New Program" name="newProgram" value={formData.newProgram} onChange={handleChange} />
                <InputField label="New Department" name="newDepartment" value={formData.newDepartment} onChange={handleChange} />
                <InputField label="Next Review Date (if Applicable)" name="nextReviewDate" type="date" value={formData.nextReviewDate} onChange={handleChange} />
                <SelectField label="New Employee Code" name="newEmployeeCode" value={formData.newEmployeeCode} onChange={handleChange}>
                  <option value="">-None-</option>
                  <option value="NE1">NE1 - New Associate</option>
                  <option value="NE2">NE2 - New Specialist</option>
                  <option value="NM1">NM1 - New Manager</option>
                </SelectField>
                <SelectField label="New Rate Type" name="newRateType" value={formData.newRateType} onChange={handleChange}>
                  <option value="">-None-</option>
                  <option value="hourly-new">New Hourly</option>
                  <option value="salary-new">New Salary</option>
                </SelectField>
                <div className="md:col-span-2">
                  <CheckboxField id="newFlsaExempt" name="newFlsaExempt" checked={formData.newFlsaExempt} onChange={handleChange} label="New FLSA Exempt" />
                </div>
              </div>
            </Card>
        </div>
        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
            <Card icon={<FaRegListAlt className="text-purple-600" size={20} />} title="Classification & Rate" className="flex-grow">
              <div className="flex flex-col gap-4">
                <InputField label="Employee Class Code" name="employeeClassCode" value={formData.employeeClassCode} onChange={handleChange} />
                <InputField label="Description" name="description" value={formData.description} onChange={handleChange} />
                <SelectField label="Employee Code" name="employeeCode" value={formData.employeeCode} onChange={handleChange}>
                  <option value="">-None-</option>
                  <option value="E1">E1 - Associate</option>
                  <option value="E2">E2 - Specialist</option>
                  <option value="M1">M1 - Manager</option>
                </SelectField>
                <SelectField label="Rate Type" name="rateType" value={formData.rateType} onChange={handleChange}>
                  <option value="">-None-</option>
                  <option value="hourly">Hourly</option>
                  <option value="salary">Salary</option>
                </SelectField>
                <CheckboxField id="flsaExempt" name="flsaExempt" checked={formData.flsaExempt} onChange={handleChange} label="FLSA Exempt" />
              </div>
            </Card>
            
            <Card icon={<FaQuestionCircle className="text-amber-600" size={20} />} title="Reason For Change">
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.reasonForChange).map(reason => (
                  <CheckboxField 
                    key={reason}
                    id={reason} 
                    name={`reasonForChange.${reason}`} 
                    checked={formData.reasonForChange[reason]} 
                    onChange={handleChange} 
                    label={reason.replace(/([A-Z])/g, ' $1').trim()}
                  />
                ))}
              </div>
            </Card>
            
            <Card icon={<FaCommentDots className="text-rose-600" size={20} />} title="Comments">
              <textarea id="comments" name="comments" placeholder="Enter comments here..." rows="4" className="w-full p-3 border border-gray-300 rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500" value={formData.comments} onChange={handleChange}></textarea>
            </Card>
        </div>
      </main>
    </form>
  );
}

const InputField = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
    <input id={props.id || props.name} {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400" />
  </div>
);

const InputFieldWithIcon = ({ label, icon, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">{icon}</span>
      </div>
      <input id={props.id || props.name} {...props} className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400" />
    </div>
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-semibold black mb-1">{label}</label>
    <select id={props.id || props.name} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
      {children}
    </select>
  </div>
);

const CheckboxField = ({ id, name, checked, onChange, label }) => (
    <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer group">
        <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className={`w-5 h-5 border-2 border-gray-300 rounded-md flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white group-hover:border-gray-400'}`}>
            {checked && <FaCheck className="text-white" size={12} />}
        </div>
        <span className="text-sm font-medium text-gray-700 capitalize">{label}</span>
    </label>
);
