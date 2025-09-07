// src/components/PayrollFormPage.jsx

import { useState, useEffect } from 'react';
import { FaUser, FaRegListAlt, FaMoneyBillWave, FaQuestionCircle, FaCommentDots, FaArrowLeft } from 'react-icons/fa';

const FontInjector = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      body {
        font-family: 'Inter', sans-serif;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return null;
};

export default function PayrollFormPage() {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    dateOfHire: '',
    reviewDate: '',
    currentJobTitle: '',
    workLocation: '',
    todayDate: new Date().toISOString().substring(0, 10),
    employeeClassCode: '',
    employeeCode: '',
    description: '',
    rateType: '',
    flsaExempt: false,
    reasonForChange: {
      annualIncrease: false,
      jobChange: false,
      transfer: false,
      promotion: false,
      other: false,
      demotion: false,
    },
    currentSalary: '',
    newSalary: '',
    percentageAdjustment: '',
    effectiveDate: '',
    newJobTitle: '',
    newSupervisorName: '',
    newSupervisorId: '',
    newProgram: '',
    newDepartment: '',
    nextReviewDate: '',
    newEmployeeCode: '',
    newRateType: '',
    newFlsaExempt: false,
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [section, field] = name.split('.');

    if (section === 'reasonForChange') {
      setFormData(prevData => ({
        ...prevData,
        reasonForChange: { ...prevData.reasonForChange, [field]: checked },
      }));
    } else if (type === 'checkbox') {
      setFormData(prevData => ({ ...prevData, [name]: checked }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted!', formData);
    alert(`Payroll change form for ${formData.employeeName} has been submitted.`);
  };

  const Card = ({ icon, title, children, className = '' }) => (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col ${className}`}>
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="bg-indigo-100 p-2 rounded-lg">{icon}</div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );

  return (
    <>
      <FontInjector />
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <header className="bg-white/70 backdrop-blur-sm shadow-sm flex-shrink-0 z-10">
          <div className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button type="button" className="text-gray-500 hover:text-gray-800"><FaArrowLeft size={20} /></button>
              <h1 className="text-xl font-semibold text-gray-700">Update Employee Compensation</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button type="button" className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">Save Changes</button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6 flex-grow">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card icon={<FaUser className="text-indigo-600" size={20} />} title="Employee Information">
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
                <InputField label="Current Salary" name="currentSalary" value={formData.currentSalary} onChange={handleChange} />
                <InputField label="New Salary" name="newSalary" value={formData.newSalary} onChange={handleChange} />
                <InputField label="Percentage Adjustment" name="percentageAdjustment" value={formData.percentageAdjustment} onChange={handleChange} />
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
                <div className="flex items-center mt-2 md:col-span-2">
                  <input type="checkbox" id="newFlsaExempt" name="newFlsaExempt" checked={formData.newFlsaExempt} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="newFlsaExempt" className="ml-2 block text-sm text-gray-900">New FLSA Exempt</label>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card icon={<FaRegListAlt className="text-purple-600" size={20} />} title="Classification & Rate">
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
                <div className="flex items-center mt-2">
                  <input type="checkbox" id="flsaExempt" name="flsaExempt" checked={formData.flsaExempt} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="flsaExempt" className="ml-2 block text-sm text-gray-900">FLSA Exempt</label>
                </div>
              </div>
            </Card>

            <Card icon={<FaQuestionCircle className="text-red-600" size={20} />} title="Reason For Change">
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.reasonForChange).map(reason => (
                  <div key={reason} className="flex items-center">
                    <input type="checkbox" id={reason} name={`reasonForChange.${reason}`} checked={formData.reasonForChange[reason]} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor={reason} className="ml-2 block text-sm text-gray-900 capitalize">{reason.replace(/([A-Z])/g, ' $1').trim()}</label>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card icon={<FaCommentDots className="text-blue-600" size={20} />} title="Comments" className="flex-grow">
              <textarea id="comments" name="comments" className="w-full h-full px-3 py-2 border border-gray-300 rounded-md bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500" value={formData.comments} onChange={handleChange}></textarea>
            </Card>
          </div>
        </main>
      </form>
    </>
  );
}

const InputField = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={props.id || props.name} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white/50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={props.id || props.name} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white/50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      {children}
    </select>
  </div>
);
