import React, { useState } from "react";

const TableInput = ({ columns, rows, setRows, addLabel = "Add Row" }: {
  columns: string[],
  rows: any[],
  setRows: (r: any[]) => void,
  addLabel?: string
}) => (
  <div className="mb-3">
    <table className="w-full border mb-2 text-xs">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="border p-1 bg-gray-100">{col}</th>
          ))}
          <th className="border p-1 bg-gray-100"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j} className="border">
                <input
                  className="p-1 w-full text-xs"
                  value={row[j] || ""}
                  onChange={e => setRows(
                    rows.map((r, idx) => idx === i ? { ...r, [j]: e.target.value } : r)
                  )}
                />
              </td>
            ))}
            <td className="border text-center">
              <button
                type="button"
                onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                className="text-red-500 font-bold px-2"
              >×</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button
      type="button"
      className="px-3 py-1 bg-gray-100 border rounded text-xs"
      onClick={() => setRows([...rows, {}])}
    >{addLabel}</button>
  </div>
);

const PER1D1FProjectsForm = () => {
  // 1.0 Introduction & Company Info
  const [company, setCompany] = useState({
    name: "",
    tin: "",
    type: "",
    sector: "",
    date: "",
    postal: "",
    postcode: "",
    tel: "",
    email: "",
    head: "",
    contact: "",
    contactPosition: "",
    contactMobile: "",
    contactEmail: "",
  });
  const [location, setLocation] = useState({
    plot: "",
    town: "",
    street: "",
    district: "",
    landmark: "",
    region: "",
    zoning: "",
    lat: "",
    lng: "",
    landSize: "",
    siteDesc: "",
    north: "",
    south: "",
    east: "",
    west: "",
    distNearest: ""
  });
  const [objective, setObjective] = useState("");
  const [justification, setJustification] = useState("");
  const [policy, setPolicy] = useState("");
  const [frameworkRows, setFrameworkRows] = useState([{}]);
  const [experience, setExperience] = useState("");

  // 2.0 Study Methodology
  const [methodRows, setMethodRows] = useState([{}]);

  // 3.0 Baseline Info
  const [baselineMap, setBaselineMap] = useState("");
  const [componentRows, setComponentRows] = useState([{}]);
  const [socioRows, setSocioRows] = useState([{}]);
  const [alternativesRows, setAlternativesRows] = useState([{}]);

  // 4.0 Description
  const [processRows, setProcessRows] = useState([{}]);
  const [rawConstructRows, setRawConstructRows] = useState([{}]);
  const [rawOpRows, setRawOpRows] = useState([{}]);
  const [machConstructRows, setMachConstructRows] = useState([{}]);
  const [machOpRows, setMachOpRows] = useState([{}]);

  // 5.0 Consultation
  const [stakeholderRows, setStakeholderRows] = useState([{}]);

  // 6.0 Impacts
  const [impactsRows, setImpactsRows] = useState([{}]);

  // 7.0 Mitigation
  const [mitigationRows, setMitigationRows] = useState([{}]);

  // 8.0 Monitoring
  const [monitorRows, setMonitorRows] = useState([{}]);

  // 9.0 Decommissioning
  const [decomRows, setDecomRows] = useState([{}]);

  // 10.0 Conclusion
  const [conclusion, setConclusion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-2xl mb-12 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        Preliminary Environmental Report<br />
        “One District – One Factory Projects”
      </h1>
      <p className="text-xs text-gray-700 mb-2">All sections must be completed per EPA requirements.</p>

      {/* 1.0 Introduction */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1.0 Introduction</h2>
        <div className="mb-1 font-medium">1.1 Company Information</div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Registered Name of Company"
          value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Company TIN"
          value={company.tin} onChange={e => setCompany(c => ({ ...c, tin: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Type of Undertaking"
          value={company.type} onChange={e => setCompany(c => ({ ...c, type: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Sector"
          value={company.sector} onChange={e => setCompany(c => ({ ...c, sector: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Date of Submission (dd/mm/yy)"
          value={company.date} onChange={e => setCompany(c => ({ ...c, date: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Postal Address"
          value={company.postal} onChange={e => setCompany(c => ({ ...c, postal: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Post code"
          value={company.postcode} onChange={e => setCompany(c => ({ ...c, postcode: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Tel. No."
            value={company.tel} onChange={e => setCompany(c => ({ ...c, tel: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="E-mail"
            value={company.email} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Name of Head of Company"
          value={company.head} onChange={e => setCompany(c => ({ ...c, head: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Name of Contact Person"
            value={company.contact} onChange={e => setCompany(c => ({ ...c, contact: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Position"
            value={company.contactPosition} onChange={e => setCompany(c => ({ ...c, contactPosition: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Mobile No."
            value={company.contactMobile} onChange={e => setCompany(c => ({ ...c, contactMobile: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Email"
            value={company.contactEmail} onChange={e => setCompany(c => ({ ...c, contactEmail: e.target.value }))} />
        </div>
        <div className="mb-2 font-medium mt-2">1.2 Proposed Project Location</div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Plot/House No."
          value={location.plot} onChange={e => setLocation(l => ({ ...l, plot: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Town"
            value={location.town} onChange={e => setLocation(l => ({ ...l, town: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Street/Area Name"
            value={location.street} onChange={e => setLocation(l => ({ ...l, street: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="District"
            value={location.district} onChange={e => setLocation(l => ({ ...l, district: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Major Land Mark"
            value={location.landmark} onChange={e => setLocation(l => ({ ...l, landmark: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Region"
            value={location.region} onChange={e => setLocation(l => ({ ...l, region: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Zoning Status"
            value={location.zoning} onChange={e => setLocation(l => ({ ...l, zoning: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Latitude"
            value={location.lat} onChange={e => setLocation(l => ({ ...l, lat: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Longitude"
            value={location.lng} onChange={e => setLocation(l => ({ ...l, lng: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Land Size"
          value={location.landSize} onChange={e => setLocation(l => ({ ...l, landSize: e.target.value }))} />

        <div className="font-medium mt-2 mb-1">Site and External/Neighbourhood Environment</div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Description of site"
          value={location.siteDesc} onChange={e => setLocation(l => ({ ...l, siteDesc: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="North" value={location.north} onChange={e => setLocation(l => ({ ...l, north: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="South" value={location.south} onChange={e => setLocation(l => ({ ...l, south: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="East" value={location.east} onChange={e => setLocation(l => ({ ...l, east: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="West" value={location.west} onChange={e => setLocation(l => ({ ...l, west: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Approximate distance to the nearest community"
          value={location.distNearest} onChange={e => setLocation(l => ({ ...l, distNearest: e.target.value }))} />
      </section>

      {/* 1.3-1.6 Objective/Justification/Framework */}
      <section>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Objectives of Undertaking"
          value={objective} onChange={e => setObjective(e.target.value)} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Project Justification"
          value={justification} onChange={e => setJustification(e.target.value)} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Company Environmental Policy Statement"
          value={policy} onChange={e => setPolicy(e.target.value)} />
        <div className="font-medium mt-2 mb-1">Relevant policies, legislative and regulatory framework</div>
        <TableInput
          columns={["No.", "Policy/Legislation/Regulatory Framework", "Relevance to Project"]}
          rows={frameworkRows}
          setRows={setFrameworkRows}
        />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Summary of previous experiences in similar projects"
          value={experience} onChange={e => setExperience(e.target.value)} />
      </section>

      {/* 2.0 Methodology */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">2.0 Study Methodology</h2>
        <TableInput
          columns={["Activity", "Methodology", "Remarks"]}
          rows={methodRows}
          setRows={setMethodRows}
        />
      </section>

      {/* 3.0 Baseline Info */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">3.0 Baseline Information</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Baseline information (location map, topo sheet, etc.)"
          value={baselineMap} onChange={e => setBaselineMap(e.target.value)} />
        <div className="font-medium mt-2 mb-1">Environmental Components</div>
        <TableInput
          columns={["Environmental Components", "Baseline Information", "Source of data/information"]}
          rows={componentRows}
          setRows={setComponentRows}
        />
        <div className="font-medium mt-2 mb-1">Socio-economic Components</div>
        <TableInput
          columns={["Socio-economic Components", "Data/Information", "Source of data/information"]}
          rows={socioRows}
          setRows={setSocioRows}
        />
        <div className="font-medium mt-2 mb-1">Alternative sites, processes, technologies, pollution controls considered</div>
        <TableInput
          columns={["Item/Description", "Alternative 1", "Alternative 2", "Alternative 3", "Preferred Choice", "Reasons for the preferred choice"]}
          rows={alternativesRows}
          setRows={setAlternativesRows}
        />
      </section>

      {/* 4.0 Description */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">4.0 Description of the Undertaking</h2>
        <div className="font-medium mt-2 mb-1">Proposed Production Process</div>
        <TableInput
          columns={["Process Stage/Unit Operation", "Description of process stage/unit operation", "Types of waste (Waste Streams)", "Minimisation/Control and Mitigation Measures in place"]}
          rows={processRows}
          setRows={setProcessRows}
        />
        <div className="font-medium mt-2 mb-1">4.2.1 Raw Materials (Construction Phase)</div>
        <TableInput
          columns={["Raw Material/chemicals", "Sources", "Type of packaging", "Characterization (Toxic/Corrosive/Flammable/Non-hazardous)", "Estimate consumption levels"]}
          rows={rawConstructRows}
          setRows={setRawConstructRows}
        />
        <div className="font-medium mt-2 mb-1">4.2.2 Raw Materials (Operational Phase)</div>
        <TableInput
          columns={["Raw Material/chemicals", "Sources", "Type of packaging", "Characterization (Toxic/Corrosive/Flammable/Non-hazardous)", "Estimate consumption levels"]}
          rows={rawOpRows}
          setRows={setRawOpRows}
        />
        <div className="font-medium mt-2 mb-1">4.3.1 Machinery/Equipment (Construction Phase)</div>
        <TableInput
          columns={["Type", "Quantity", "Capacity", "Power Rating", "Year of Manufacture", "Country of Origin"]}
          rows={machConstructRows}
          setRows={setMachConstructRows}
        />
        <div className="font-medium mt-2 mb-1">4.3.2 Machinery/Equipment (Operational Phase)</div>
        <TableInput
          columns={["Type", "Quantity", "Capacity", "Power Rating", "Year of Manufacture", "Country of Origin"]}
          rows={machOpRows}
          setRows={setMachOpRows}
        />
      </section>

      {/* 5.0 Consultation */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">5.0 Consultations</h2>
        <TableInput
          columns={["Identified Stakeholders", "Classification", "Date of consultation", "Concerns", "Suggested measures to address concerns"]}
          rows={stakeholderRows}
          setRows={setStakeholderRows}
        />
      </section>

      {/* 6.0 Impacts */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">6.0 Identification, Analysis and Evaluation of Impacts</h2>
        <TableInput
          columns={["Environmental/Socio-economic impacts", "Impact Receptor", "Significance of Impact"]}
          rows={impactsRows}
          setRows={setImpactsRows}
        />
      </section>

      {/* 7.0 Mitigation */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">7.0 Mitigation Measures</h2>
        <TableInput
          columns={["Impact", "Mitigation Measures"]}
          rows={mitigationRows}
          setRows={setMitigationRows}
        />
      </section>

      {/* 8.0 Monitoring */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">8.0 Environmental Monitoring</h2>
        <TableInput
          columns={["Performance indicator", "Parameters to be monitored", "Frequency", "Reporting Regime", "Budget (GHS)", "Responsible Officer"]}
          rows={monitorRows}
          setRows={setMonitorRows}
        />
      </section>

      {/* 9.0 Decommissioning Plan */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">9.0 Decommissioning Plan (where applicable)</h2>
        <TableInput
          columns={["Project Component(s)", "Associated Impact", "Mitigation Measures", "Timeline", "Budget", "Responsibility"]}
          rows={decomRows}
          setRows={setDecomRows}
        />
      </section>

      {/* 10.0 Conclusions */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">10.0 Conclusions</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Summary justification for acceptance of the report"
          value={conclusion} onChange={e => setConclusion(e.target.value)} />
      </section>

      <div className="mt-8 text-center">
        <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
          Submit Form
        </button>
      </div>
    </form>
  );
};

export default PER1D1FProjectsForm;
