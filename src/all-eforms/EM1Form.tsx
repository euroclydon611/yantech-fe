import React, { useState } from "react";

const initialPermits = [
  { label: "Certificate of Incorporation", date: "" },
  { label: "Certificate of Commencement of Business", date: "" },
  { label: "Building Permit", date: "" },
  { label: "Environmental Permit", date: "" },
  { label: "Chemicals Clearance Certificate", date: "" },
  { label: "Others (Specify)", date: "" }
];

const initialReports = [
  { label: "Environmental Impact Statement (EIS)", date: "" },
  { label: "Preliminary Environmental Report (PER)", date: "" },
  { label: "Environmental Management Plan (EMP)", date: "" },
  { label: "Annual Environmental Report (AER)", date: "" },
  { label: "Monthly/Quarterly Environmental Report", date: "" },
  { label: "Others (Specify)", date: "" }
];

const initialWasteTypes = [
  { key: "solid", label: "Solid Waste (e.g. Plastics/Paper/Metal/Wood/Chemicals)", value: "" },
  { key: "liquid", label: "Liquid Waste", value: "" },
  { key: "air", label: "Air Emissions (e.g. Smoke/Dust/Gases/Solvent(s)Vapour)", value: "" },
  { key: "noise", label: "Noise/Vibration", value: "" },
  { key: "odour", label: "Odour (e.g. Smell/Stench/Aroma)", value: "" },
  { key: "visual", label: "Visual", value: "" },
  { key: "socio", label: "Socio-cultural", value: "" },
  { key: "other", label: "Others (Specify)", value: "" }
];

const initialMeasures = [
  { key: "solid", label: "Solid Waste (e.g. Plastics/Paper/Metal/Wood/Chemicals)", value: "" },
  { key: "liquid", label: "Liquid Waste", value: "" },
  { key: "air", label: "Air Emissions (e.g. Smoke/Dust/Gases/Solvent(s) Vapour)", value: "" },
  { key: "noise", label: "Noise/Vibration", value: "" },
  { key: "odour", label: "Odour (e.g. Smell/Stench/Aroma)", value: "" },
  { key: "visual", label: "Visual", value: "" },
  { key: "socio", label: "Socio-cultural", value: "" },
  { key: "other", label: "Others (Specify)", value: "" }
];

const EM1Form = () => {
  // Section A: General information
  const [general, setGeneral] = useState({
    name: "",
    type: "",
    address: "",
    tel: "",
    fax: "",
    email: "",
    plotNo: "",
    street: "",
    zoning: "",
    town: "",
    region: "",
    district: "",
    landmark: "",
    headName: "",
    envOfficer: ""
  });

  const [permits, setPermits] = useState([...initialPermits]);
  const [otherPermit, setOtherPermit] = useState("");

  const [reports, setReports] = useState([...initialReports]);
  const [otherReport, setOtherReport] = useState("");

  // Section B: Environmental management
  const [b, setB] = useState({
    scope: "",
    labour: "",
    capacity: "",
    landTake: "",
    turnover: "",
    materialsHandling: "",
    materialsList: "",
    storage: "",
    activities: "",
    outputs: "",
    impacts: "",
    risks: ""
  });

  const [wasteTypes, setWasteTypes] = useState([...initialWasteTypes]);
  const [measures, setMeasures] = useState([...initialMeasures]);

  const [contingency, setContingency] = useState("");
  const [contingencyAttach, setContingencyAttach] = useState(false);

  const [complaint, setComplaint] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [litigation, setLitigation] = useState("");
  const [litigationDescribe, setLitigationDescribe] = useState("");

  // Declaration
  const [declarant, setDeclarant] = useState({
    name: "",
    title: "",
    signature: "",
    date: ""
  });

  // Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (implement logic)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-10"
    >
      <h1 className="text-2xl font-bold text-center mb-6">
        FORM EM 1 — Registration of Existing Undertakings
      </h1>
      <div className="text-xs text-gray-500 mb-6">
        Environmental Assessment Regulations, 1999 (LI 1652)
      </div>

      {/* SECTION A */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">A. General Information</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Registered Name of undertaking"
          value={general.name} onChange={e => setGeneral(g => ({ ...g, name: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Type of undertaking"
          value={general.type} onChange={e => setGeneral(g => ({ ...g, type: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Address for Correspondence"
          value={general.address} onChange={e => setGeneral(g => ({ ...g, address: e.target.value }))} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Tel."
            value={general.tel} onChange={e => setGeneral(g => ({ ...g, tel: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Fax No."
            value={general.fax} onChange={e => setGeneral(g => ({ ...g, fax: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="E-mail"
            value={general.email} onChange={e => setGeneral(g => ({ ...g, email: e.target.value }))} />
        </div>
        <div className="font-medium mt-2 mb-2">Location of undertaking</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Plot/House No."
            value={general.plotNo} onChange={e => setGeneral(g => ({ ...g, plotNo: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Street/Area Name"
            value={general.street} onChange={e => setGeneral(g => ({ ...g, street: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Zoning Status"
            value={general.zoning} onChange={e => setGeneral(g => ({ ...g, zoning: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Town"
            value={general.town} onChange={e => setGeneral(g => ({ ...g, town: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Region"
            value={general.region} onChange={e => setGeneral(g => ({ ...g, region: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="District"
            value={general.district} onChange={e => setGeneral(g => ({ ...g, district: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Major Landmark"
          value={general.landmark} onChange={e => setGeneral(g => ({ ...g, landmark: e.target.value }))} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Name of Head of Company/Organization"
            value={general.headName} onChange={e => setGeneral(g => ({ ...g, headName: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Name of Environmental Officer"
            value={general.envOfficer} onChange={e => setGeneral(g => ({ ...g, envOfficer: e.target.value }))} />
        </div>
        <div className="font-medium mt-3 mb-2">
          Certificates, Permits, Licenses, and Approvals (attach copies as appropriate)
        </div>
        {permits.map((permit, idx) => (
          <div key={permit.label} className="flex gap-2 mb-2 items-center">
            <input
              className="border p-2 rounded w-full"
              placeholder={permit.label}
              value={permit.label === "Others (Specify)" ? otherPermit : permit.label}
              onChange={e => permit.label === "Others (Specify)" ? setOtherPermit(e.target.value) : null}
              disabled={permit.label !== "Others (Specify)"}
            />
            <input
              className="border p-2 rounded"
              type="date"
              placeholder="Date of Issue"
              value={permits[idx].date}
              onChange={e => {
                const copy = [...permits];
                copy[idx].date = e.target.value;
                setPermits(copy);
              }}
            />
          </div>
        ))}
        <div className="font-medium mt-3 mb-2">Environmental Reports Submitted to EPA</div>
        {reports.map((report, idx) => (
          <div key={report.label} className="flex gap-2 mb-2 items-center">
            <input
              className="border p-2 rounded w-full"
              placeholder={report.label}
              value={report.label === "Others (Specify)" ? otherReport : report.label}
              onChange={e => report.label === "Others (Specify)" ? setOtherReport(e.target.value) : null}
              disabled={report.label !== "Others (Specify)"}
            />
            <input
              className="border p-2 rounded"
              type="date"
              placeholder="Date Submitted"
              value={reports[idx].date}
              onChange={e => {
                const copy = [...reports];
                copy[idx].date = e.target.value;
                setReports(copy);
              }}
            />
          </div>
        ))}
      </section>

      {/* SECTION B */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">B. Environmental Management of Undertaking</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Scope of Undertaking"
          rows={2} value={b.scope} onChange={e => setB(s => ({ ...s, scope: e.target.value }))} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Size of Labour Force"
            value={b.labour} onChange={e => setB(s => ({ ...s, labour: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Capacity (Installed/Operating/Occupancy/etc.)"
            value={b.capacity} onChange={e => setB(s => ({ ...s, capacity: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Land Take"
            value={b.landTake} onChange={e => setB(s => ({ ...s, landTake: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Annual Turnover (¢/$)"
            value={b.turnover} onChange={e => setB(s => ({ ...s, turnover: e.target.value }))} />
        </div>
        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="Type of Raw Materials and Other Resources Used and Their Handling"
          rows={2} value={b.materialsHandling} onChange={e => setB(s => ({ ...s, materialsHandling: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="List Raw Materials and other Resources Including Chemicals, Water, Energy, etc. (Sources, Types, and Quantities Per Annum)"
          rows={2} value={b.materialsList} onChange={e => setB(s => ({ ...s, materialsList: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="Describe Mode of Handling and Storage"
          rows={2} value={b.storage} onChange={e => setB(s => ({ ...s, storage: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="Describe Nature/Processes/Activities Involved in the Undertaking"
          rows={2} value={b.activities} onChange={e => setB(s => ({ ...s, activities: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="Type of Products/Outputs/Services"
          rows={2} value={b.outputs} onChange={e => setB(s => ({ ...s, outputs: e.target.value }))} />

        <div className="font-medium mt-3 mb-1">
          Impacts and/or Waste Generated by Your Operation and the Receiving Environment
        </div>
        {wasteTypes.map((item, idx) => (
          <input
            key={item.key}
            className="border p-2 rounded w-full mb-2"
            placeholder={item.label}
            value={item.value}
            onChange={e => {
              const copy = [...wasteTypes];
              copy[idx].value = e.target.value;
              setWasteTypes(copy);
            }}
          />
        ))}
        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="Indicate other related effects (receiving environment, e.g., which water body/land is affected)"
          rows={2}
          value={b.impacts} onChange={e => setB(s => ({ ...s, impacts: e.target.value }))} />

        <div className="font-medium mt-3 mb-1">
          Measures Taken to Reduce/Minimize/Prevent Specified Impacts
        </div>
        {measures.map((item, idx) => (
          <input
            key={item.key}
            className="border p-2 rounded w-full mb-2"
            placeholder={item.label}
            value={item.value}
            onChange={e => {
              const copy = [...measures];
              copy[idx].value = e.target.value;
              setMeasures(copy);
            }}
          />
        ))}

        <textarea className="border p-2 rounded w-full mb-2"
          placeholder="Specify Perceived Risks of Impacts to the Environment (e.g. Health Hazard/Public Safety, Danger to Aquatic Life, etc.)"
          rows={2}
          value={b.risks} onChange={e => setB(s => ({ ...s, risks: e.target.value }))} />

        <div className="font-medium mt-4 mb-1">
          Do you have a contingency/Emergency Response Plan?
        </div>
        <div className="flex items-center gap-6 mb-2">
          <label className="flex items-center gap-2">
            <input type="radio" checked={contingency === "Yes"} onChange={() => setContingency("Yes")} /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={contingency === "No"} onChange={() => setContingency("No")} /> No
          </label>
          {contingency === "Yes" && (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={contingencyAttach} onChange={() => setContingencyAttach(!contingencyAttach)} />
              Attach a copy
            </label>
          )}
        </div>
        <div className="font-medium mt-4 mb-1">
          Complaints about your Undertaking?
        </div>
        <div className="flex items-center gap-6 mb-2">
          <label className="flex items-center gap-2">
            <input type="radio" checked={complaint === "Yes"} onChange={() => setComplaint("Yes")} /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={complaint === "No"} onChange={() => setComplaint("No")} /> No
          </label>
        </div>
        {complaint === "Yes" && (
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="If Yes, indicate the Type of Complaint"
            value={complaintType}
            onChange={e => setComplaintType(e.target.value)}
          />
        )}
        <div className="font-medium mt-4 mb-1">
          Is any aspect of the Undertaking a subject of litigation?
        </div>
        <div className="flex items-center gap-6 mb-2">
          <label className="flex items-center gap-2">
            <input type="radio" checked={litigation === "Yes"} onChange={() => setLitigation("Yes")} /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={litigation === "No"} onChange={() => setLitigation("No")} /> No
          </label>
        </div>
        {litigation === "Yes" && (
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="If Yes, describe"
            value={litigationDescribe}
            onChange={e => setLitigationDescribe(e.target.value)}
          />
        )}
      </section>

      {/* DECLARATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Declaration</h2>
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Name of applicant or authorized representative"
          value={declarant.name} onChange={e => setDeclarant(d => ({ ...d, name: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2"
          placeholder="Title/Position"
          value={declarant.title} onChange={e => setDeclarant(d => ({ ...d, title: e.target.value }))} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input className="border p-2 rounded" placeholder="Signature"
            value={declarant.signature}
            onChange={e => setDeclarant(d => ({ ...d, signature: e.target.value }))}
          />
          <input className="border p-2 rounded" type="date" placeholder="Date"
            value={declarant.date}
            onChange={e => setDeclarant(d => ({ ...d, date: e.target.value }))}
          />
        </div>
        <div className="text-gray-500 mt-2 text-sm">
          NB: Additional information or clarification and/or documentation may be required during the Authority review.
        </div>
      </section>

      <div className="mt-8 text-center">
        <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
          Submit Form
        </button>
      </div>
    </form>
  );
};

export default EM1Form;
