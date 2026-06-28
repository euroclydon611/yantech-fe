import React, { useState } from "react";

// List of activity options
const activities = [
  "Formulation", "Manufacture", "Importation", "Warehouse", "Repackaging",
  "Distribution", "Transportation", "Retail", "Commercial application"
];

const YesNoRadio = ({ value, onChange, name }) => (
  <div className="flex gap-4">
    <label className="flex items-center gap-2">
      <input type="radio" name={name} checked={value === "Yes"} onChange={() => onChange("Yes")} /> Yes
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name={name} checked={value === "No"} onChange={() => onChange("No")} /> No
    </label>
  </div>
);

const PesticideLicenseRenewalForm = () => {
  // Section 1: Activity
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Section 2-4: Applicant info
  const [applicant, setApplicant] = useState({
    companyName: "",
    postal: "",
    physical: "",
    email: "",
    tel: "",
    fax: ""
  });

  // Section 5: Additional locations
  const [hasAdditional, setHasAdditional] = useState("");
  const [additionalLocations, setAdditionalLocations] = useState("");

  // Section 7: EPA inspection
  const [epaInspected, setEpaInspected] = useState("");
  // Section 8: Violation after inspection
  const [violation, setViolation] = useState("");
  const [violationDetails, setViolationDetails] = useState("");

  // Section 10: Annual report submitted
  const [annualReport, setAnnualReport] = useState("");

  // Section 12: Pesticide training
  const [training, setTraining] = useState("");

  // Section 13: Employee information
  const [employees, setEmployees] = useState([
    { name: "", address: "", age: "", qualification: "" }
  ]);

  // Section 14: Declaration
  const [declaration, setDeclaration] = useState({
    name: "",
    role: "",
    title: "",
    signature: "",
    date: ""
  });

  const handleActivityChange = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleEmployeeChange = (idx: number, field: string, value: string) => {
    setEmployees(arr =>
      arr.map((emp, i) =>
        i === idx ? { ...emp, [field]: value } : emp
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl mb-12 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        Pesticide License Application Renewal <br />
        (Form A3)
      </h1>

      {/* 1. Activity selection */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          1. Indicate the activity for which you are applying to be licensed
        </h2>
        <div className="flex flex-wrap gap-4">
          {activities.map(activity => (
            <label key={activity} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedActivities.includes(activity)}
                onChange={() => handleActivityChange(activity)}
              />
              {activity}
            </label>
          ))}
        </div>
      </section>

      {/* 2-4. Applicant details */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          2. Full legal name of applicant company/business
        </h2>
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Full legal name"
          value={applicant.companyName}
          onChange={e => setApplicant(a => ({ ...a, companyName: e.target.value }))}
        />

        <h2 className="font-semibold text-lg mb-2">3. Postal address</h2>
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Postal address"
          value={applicant.postal}
          onChange={e => setApplicant(a => ({ ...a, postal: e.target.value }))}
        />

        <h2 className="font-semibold text-lg mb-2">4. Physical location of business to be licensed</h2>
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Physical location"
          value={applicant.physical}
          onChange={e => setApplicant(a => ({ ...a, physical: e.target.value }))}
        />
        <input className="border p-2 rounded w-full mb-2"
          placeholder="E-mail"
          value={applicant.email}
          onChange={e => setApplicant(a => ({ ...a, email: e.target.value }))}
        />
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Tel"
          value={applicant.tel}
          onChange={e => setApplicant(a => ({ ...a, tel: e.target.value }))}
        />
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Fax"
          value={applicant.fax}
          onChange={e => setApplicant(a => ({ ...a, fax: e.target.value }))}
        />
      </section>

      {/* 5-6. Additional locations */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          5. Are there additional locations?
        </h2>
        <YesNoRadio value={hasAdditional} onChange={setHasAdditional} name="additionalLocations" />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="List additional locations (Separate application required for EACH location)"
          value={additionalLocations}
          onChange={e => setAdditionalLocations(e.target.value)}
        />
      </section>

      {/* 7-9. EPA Inspection */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          7. Has your business/operation been inspected by the EPA within the past 12 months?
        </h2>
        <YesNoRadio value={epaInspected} onChange={setEpaInspected} name="epaInspected" />

        <h2 className="font-semibold text-lg mt-4 mb-2 border-b pb-1">
          8. If yes, has your business/operation been issued with any notice of violation following the inspection?
        </h2>
        <YesNoRadio value={violation} onChange={setViolation} name="violation" />

        <h2 className="font-semibold text-lg mt-4 mb-2">9. If yes, please indicate the violation notice issued and corrective measures taken</h2>
        <textarea className="border p-2 rounded w-full mb-2"
          value={violationDetails}
          onChange={e => setViolationDetails(e.target.value)}
          placeholder="Describe violation and corrective measures"
        />
      </section>

      {/* 10-11. Pesticides annual report */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          10. Have you submitted pesticides annual report for the previous calendar year?
        </h2>
        <YesNoRadio value={annualReport} onChange={setAnnualReport} name="annualReport" />

        <div className="text-sm text-gray-500 mt-2 mb-2">
          11. If no, complete the pesticide annual report form and submit together with your renewal form
        </div>
      </section>

      {/* 12. Training */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          12. List any pesticide handling training you or your business received/attended within the past 12 months.
        </h2>
        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="Attach copy of certificate received"
          value={training}
          onChange={e => setTraining(e.target.value)}
        />
      </section>

      {/* 13. Employee Information */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          13. Employee information (please attach copies of relevant certificates)
        </h2>
        <table className="w-full border text-xs mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">Name</th>
              <th className="border p-1">Postal address</th>
              <th className="border p-1">Age</th>
              <th className="border p-1">Education/Qualification</th>
              <th className="border p-1"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={i}>
                <td className="border"><input className="p-1 w-full" value={emp.name} onChange={e => handleEmployeeChange(i, "name", e.target.value)} /></td>
                <td className="border"><input className="p-1 w-full" value={emp.address} onChange={e => handleEmployeeChange(i, "address", e.target.value)} /></td>
                <td className="border"><input className="p-1 w-full" value={emp.age} onChange={e => handleEmployeeChange(i, "age", e.target.value)} /></td>
                <td className="border"><input className="p-1 w-full" value={emp.qualification} onChange={e => handleEmployeeChange(i, "qualification", e.target.value)} /></td>
                <td className="border text-center">
                  <button type="button" className="text-red-500 font-bold px-2" onClick={() => setEmployees(arr => arr.filter((_, idx) => idx !== i))}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="px-3 py-1 bg-gray-100 border rounded text-xs"
          onClick={() => setEmployees([...employees, { name: "", address: "", age: "", qualification: "" }])}
        >
          Add Employee
        </button>
      </section>

      {/* 14. Declaration */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          14. Individual, partnership, corporate or Authority acknowledgement:
        </h2>
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Name of owner, partner, designated corporate officer or agency representative"
          value={declaration.name}
          onChange={e => setDeclaration(d => ({ ...d, name: e.target.value }))}
        />

        <div className="flex gap-4 mb-2 flex-wrap">
          <label>
            <input type="radio" checked={declaration.role === "Owner"} onChange={() => setDeclaration(d => ({ ...d, role: "Owner" }))} /> Owner
          </label>
          <label>
            <input type="radio" checked={declaration.role === "Partner"} onChange={() => setDeclaration(d => ({ ...d, role: "Partner" }))} /> Partner
          </label>
          <label>
            <input type="radio" checked={declaration.role === "Designated corporate officer"} onChange={() => setDeclaration(d => ({ ...d, role: "Designated corporate officer" }))} /> Designated Corporate Officer
          </label>
          <label>
            <input type="radio" checked={declaration.role === "Agency representative"} onChange={() => setDeclaration(d => ({ ...d, role: "Agency representative" }))} /> Agency Representative
          </label>
        </div>

        <input className="border p-2 rounded w-full mb-2" placeholder="Title" value={declaration.title} onChange={e => setDeclaration(d => ({ ...d, title: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Signature" value={declaration.signature} onChange={e => setDeclaration(d => ({ ...d, signature: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" type="date" placeholder="Date" value={declaration.date} onChange={e => setDeclaration(d => ({ ...d, date: e.target.value }))} />
      </section>

      <div className="mt-8 text-center">
        <button
          type="submit"
          className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Submit Renewal
        </button>
      </div>
    </form>
  );
};

export default PesticideLicenseRenewalForm;
