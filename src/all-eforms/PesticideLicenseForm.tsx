import React, { useState } from "react";

// Reusable Yes/No radio buttons
const YesNoRadio = ({ value, onChange, name }) => (
  <div className="flex gap-4">
    <label className="flex items-center gap-1">
      <input type="radio" name={name} checked={value === "Yes"} onChange={() => onChange("Yes")} /> Yes
    </label>
    <label className="flex items-center gap-1">
      <input type="radio" name={name} checked={value === "No"} onChange={() => onChange("No")} /> No
    </label>
  </div>
);

const PesticideLicenseForm = () => {
  // SECTION: Activity selection
  const activitiesList = [
    "Formulation", "Manufacture", "Importation", "Warehouse",
    "Repackaging", "Distribution", "Transportation", "Retail", "Commercial application"
  ];
  const [activities, setActivities] = useState<string[]>([]);

  // SECTION A: Background
  const [background, setBackground] = useState({
    applicantName: "",
    presentOccupation: "",
    applicantPostal: "",
    businessName: "",
    businessPostal: "",
    businessLocation: "",
    email: "",
    tel: "",
    fax: "",
    regCert: "",
    compCert: "",
  });

  const [evidenceReg, setEvidenceReg] = useState("");
  const [compCert, setCompCert] = useState("");

  // Employees
  const [employees, setEmployees] = useState([
    { name: "", address: "", age: "", qualification: "" },
  ]);

  // SECTION B: Importers, Distributors, Retailers
  const [sectionB, setSectionB] = useState({
    category: "",
    storageFacility: "",
    storageSize: "",
    retailFacility: "",
    retailSize: "",
    displayFacility: "",
    obsoleteDisposal: "",
  });

  // SECTION C: Commercial Applicators/Pest Controllers
  const [sectionC, setSectionC] = useState({
    equipNumType: "",
    training: "",
    ppe: "",
    storageMethod: "",
    disposalMethod: "",
  });

  // Safety measures (for all)
  const [ppeMeasures, setPpeMeasures] = useState("");

  // SECTION D: Manufacturers/Formulators/Repackaging
  const [sectionD, setSectionD] = useState({
    pesticideTypes: "",
    capacity: "",
    rawMaterials: "",
    packaging: "",
    wasteTypes: "",
    wasteMgmt: "",
    eiaEmp: "",
  });

  // Declaration
  const [declaration, setDeclaration] = useState({
    name: "",
    role: "",
    title: "",
    signature: "",
    date: "",
  });

  // Attachments
  // (You can use file inputs if you want to upload certificates. Here, just fields for note.)
  const [attachments, setAttachments] = useState({
    regCert: "",
    compCert: "",
    other: "",
  });

  // Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mb-12 space-y-8" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-center mb-4">Application for Pesticide License (Form A1)</h1>

      {/* 1. Activity Selection */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1. Activity for Which License is Sought</h2>
        <div className="flex flex-wrap gap-4">
          {activitiesList.map(activity => (
            <label key={activity} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={activities.includes(activity)}
                onChange={() => setActivities(prev =>
                  prev.includes(activity)
                    ? prev.filter(a => a !== activity)
                    : [...prev, activity]
                )}
              />
              {activity}
            </label>
          ))}
        </div>
      </section>

      {/* 2. SECTION A: BACKGROUND INFORMATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">SECTION A: Background Information</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Full legal name of applicant/company/business"
          value={background.applicantName}
          onChange={e => setBackground(b => ({ ...b, applicantName: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Present Occupation"
          value={background.presentOccupation}
          onChange={e => setBackground(b => ({ ...b, presentOccupation: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Applicant's Full Postal Address"
          value={background.applicantPostal}
          onChange={e => setBackground(b => ({ ...b, applicantPostal: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Business Name"
          value={background.businessName}
          onChange={e => setBackground(b => ({ ...b, businessName: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Business Postal Address"
          value={background.businessPostal}
          onChange={e => setBackground(b => ({ ...b, businessPostal: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Business Physical Location"
          value={background.businessLocation}
          onChange={e => setBackground(b => ({ ...b, businessLocation: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Email"
          value={background.email}
          onChange={e => setBackground(b => ({ ...b, email: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Tel"
          value={background.tel}
          onChange={e => setBackground(b => ({ ...b, tel: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Fax"
          value={background.fax}
          onChange={e => setBackground(b => ({ ...b, fax: e.target.value }))} />

        <div className="mb-2">
          <label className="block font-medium mb-1">Evidence of registration of business?</label>
          <YesNoRadio value={evidenceReg} onChange={setEvidenceReg} name="regCert" />
          <input className="border p-2 rounded w-full mt-2" placeholder="Attach registration certificate (file name/note)" value={attachments.regCert} onChange={e => setAttachments(a => ({ ...a, regCert: e.target.value }))} />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Certificate of competence in pesticide handling?</label>
          <YesNoRadio value={compCert} onChange={setCompCert} name="compCert" />
          <input className="border p-2 rounded w-full mt-2" placeholder="Attach competence certificate (file name/note)" value={attachments.compCert} onChange={e => setAttachments(a => ({ ...a, compCert: e.target.value }))} />
        </div>
        <div className="mb-2">
          <label className="font-medium">Employee Information</label>
          <table className="w-full border text-xs mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1">Name</th>
                <th className="border p-1">Postal Address</th>
                <th className="border p-1">Age</th>
                <th className="border p-1">Qualification</th>
                <th className="border p-1"></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i}>
                  <td className="border"><input className="p-1 w-full" value={emp.name} onChange={e => setEmployees(arr => arr.map((em, idx) => idx === i ? { ...em, name: e.target.value } : em))} /></td>
                  <td className="border"><input className="p-1 w-full" value={emp.address} onChange={e => setEmployees(arr => arr.map((em, idx) => idx === i ? { ...em, address: e.target.value } : em))} /></td>
                  <td className="border"><input className="p-1 w-full" value={emp.age} onChange={e => setEmployees(arr => arr.map((em, idx) => idx === i ? { ...em, age: e.target.value } : em))} /></td>
                  <td className="border"><input className="p-1 w-full" value={emp.qualification} onChange={e => setEmployees(arr => arr.map((em, idx) => idx === i ? { ...em, qualification: e.target.value } : em))} /></td>
                  <td className="border text-center">
                    <button type="button" className="text-red-500 font-bold px-2" onClick={() => setEmployees(arr => arr.filter((_, idx) => idx !== i))}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="px-3 py-1 bg-gray-100 border rounded text-xs" onClick={() => setEmployees([...employees, { name: "", address: "", age: "", qualification: "" }])}>Add Employee</button>
        </div>
      </section>

      {/* SECTION B (Importers, Distributors, Retailers) */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">SECTION B: Importers, Distributors, Retailers</h2>
        <div className="mb-2">
          <label className="block font-medium mb-1">Category of pesticide</label>
          <div className="flex gap-6">
            <label><input type="radio" checked={sectionB.category === "General use"} onChange={() => setSectionB(b => ({ ...b, category: "General use" }))} /> General use</label>
            <label><input type="radio" checked={sectionB.category === "Restricted use"} onChange={() => setSectionB(b => ({ ...b, category: "Restricted use" }))} /> Restricted use</label>
            <label><input type="radio" checked={sectionB.category === "All"} onChange={() => setSectionB(b => ({ ...b, category: "All" }))} /> All</label>
          </div>
        </div>
        <div className="mb-2">
          <label>Is storage facility available?</label>
          <YesNoRadio value={sectionB.storageFacility} onChange={val => setSectionB(b => ({ ...b, storageFacility: val }))} name="storageFacility" />
          <input className="border p-2 rounded w-full mt-2" placeholder="If yes, indicate size" value={sectionB.storageSize} onChange={e => setSectionB(b => ({ ...b, storageSize: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Type and size of retail facility" value={sectionB.retailFacility} onChange={e => setSectionB(b => ({ ...b, retailFacility: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Type of display facility at storage/retail premise" value={sectionB.displayFacility} onChange={e => setSectionB(b => ({ ...b, displayFacility: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Method and place of final disposal of obsolete pesticides" value={sectionB.obsoleteDisposal} onChange={e => setSectionB(b => ({ ...b, obsoleteDisposal: e.target.value }))} />
      </section>

      {/* SECTION C (Commercial Applicators, Pest Controllers) */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">SECTION C: Commercial Applicators, Pest Controllers</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Numbers and type of pesticide application equipment" value={sectionC.equipNumType} onChange={e => setSectionC(c => ({ ...c, equipNumType: e.target.value }))} />
        <div className="mb-2">
          <label>Professional training in pest control?</label>
          <YesNoRadio value={sectionC.training} onChange={val => setSectionC(c => ({ ...c, training: val }))} name="training" />
          <input className="border p-2 rounded w-full mt-2" placeholder="If yes, provide evidence (file name/note)" value={attachments.other} onChange={e => setAttachments(a => ({ ...a, other: e.target.value }))} />
        </div>
        <div className="mb-2">
          <label>Presence of personal protective equipment (PPE)?</label>
          <YesNoRadio value={sectionC.ppe} onChange={val => setSectionC(c => ({ ...c, ppe: val }))} name="ppe" />
          <input className="border p-2 rounded w-full mt-2" placeholder="If yes, provide list and type in item 19" value={ppeMeasures} onChange={e => setPpeMeasures(e.target.value)} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Method of storage of pesticides and unused chemicals" value={sectionC.storageMethod} onChange={e => setSectionC(c => ({ ...c, storageMethod: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Method of disposal of used pesticide containers and excess chemicals" value={sectionC.disposalMethod} onChange={e => setSectionC(c => ({ ...c, disposalMethod: e.target.value }))} />
      </section>

      {/* Safety Measures (All Applicants) */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">SECTION (All Applicants): Safety Measures</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Safety measures (PPEs) in place, including security options" value={ppeMeasures} onChange={e => setPpeMeasures(e.target.value)} />
      </section>

      {/* SECTION D: Manufacturers & Formulators */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">SECTION D: Manufacturers and Formulators/Repackaging</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Types of pesticides to be formulated/repackaged/manufactured" value={sectionD.pesticideTypes} onChange={e => setSectionD(d => ({ ...d, pesticideTypes: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Production capacity per annum (unit/processes)" value={sectionD.capacity} onChange={e => setSectionD(d => ({ ...d, capacity: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Type and sources of raw materials" value={sectionD.rawMaterials} onChange={e => setSectionD(d => ({ ...d, rawMaterials: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Type of packaging of products" value={sectionD.packaging} onChange={e => setSectionD(d => ({ ...d, packaging: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Type and quantities of waste generated (solid, liquid, gases)" value={sectionD.wasteTypes} onChange={e => setSectionD(d => ({ ...d, wasteTypes: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Describe waste management practices" value={sectionD.wasteMgmt} onChange={e => setSectionD(d => ({ ...d, wasteMgmt: e.target.value }))} />
        <div className="mb-2">
          <label>Evidence of EIA/EMP?</label>
          <YesNoRadio value={sectionD.eiaEmp} onChange={val => setSectionD(d => ({ ...d, eiaEmp: val }))} name="eiaEmp" />
          <input className="border p-2 rounded w-full mt-2" placeholder="Attach EIA/EMP certificate (file name/note)" value={attachments.other} onChange={e => setAttachments(a => ({ ...a, other: e.target.value }))} />
        </div>
      </section>

      {/* Declaration */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Declaration and Acknowledgement</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Full Name of Declarant" value={declaration.name} onChange={e => setDeclaration(d => ({ ...d, name: e.target.value }))} />
        <div className="flex gap-4 mb-2 flex-wrap">
          <label><input type="radio" checked={declaration.role === "Owner"} onChange={() => setDeclaration(d => ({ ...d, role: "Owner" }))} /> Owner</label>
          <label><input type="radio" checked={declaration.role === "Partner"} onChange={() => setDeclaration(d => ({ ...d, role: "Partner" }))} /> Partner</label>
          <label><input type="radio" checked={declaration.role === "Designated corporate officer"} onChange={() => setDeclaration(d => ({ ...d, role: "Designated corporate officer" }))} /> Designated Corporate Officer</label>
          <label><input type="radio" checked={declaration.role === "Agency representative"} onChange={() => setDeclaration(d => ({ ...d, role: "Agency representative" }))} /> Agency Representative</label>
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Title" value={declaration.title} onChange={e => setDeclaration(d => ({ ...d, title: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Signature" value={declaration.signature} onChange={e => setDeclaration(d => ({ ...d, signature: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" type="date" placeholder="Date" value={declaration.date} onChange={e => setDeclaration(d => ({ ...d, date: e.target.value }))} />
      </section>

      <div className="text-sm mb-2 text-gray-600">
        <b>Note:</b> A fee must accompany this application.<br />
        If the space provided on this form is not sufficient, provide additional info on a separate document and attach.<br />
        The Authority may request more information.
      </div>

      <div className="mt-8 text-center">
        <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
          Submit Application
        </button>
      </div>
    </form>
  );
};

export default PesticideLicenseForm;
