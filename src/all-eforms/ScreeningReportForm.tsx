import React, { useState } from "react";

// Dynamic rows for table-style entries
const TableInput = ({ columns, rows, setRows, placeholder }) => (
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
                  placeholder={placeholder ? placeholder[j] : ""}
                  value={row[j] || ""}
                  onChange={e =>
                    setRows(rows.map((r, idx) =>
                      idx === i ? { ...r, [j]: e.target.value } : r
                    ))
                  }
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
    >
      Add Row
    </button>
  </div>
);

const ScreeningReportForm = () => {
  // Section 1: Header info
  const [fileNo, setFileNo] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [proponent, setProponent] = useState("");
  const [company, setCompany] = useState("");

  // Section A: Info Analysis & Results
  const [type, setType] = useState("");
  const [components, setComponents] = useState([
    {}, {}, {}, {}, {}, {}
  ]); // 6 component rows
  const [capacity, setCapacity] = useState("");
  const [landTake, setLandTake] = useState("");
  const [waste, setWaste] = useState({
    liquid: "",
    solid: "",
    gaseous: ""
  });
  const [descComments, setDescComments] = useState("");

  // Section B: Site Information
  const [site, setSite] = useState({
    plot: "", street: "", town: "", district: "", region: "",
    landmark: "", zoning: "", adjacent: "",
    north: "", south: "", east: "", west: "", coord1: "", coord2: "",
    infrastructure: "", siteComments: ""
  });

  // Section C: Impacts
  const [impacts, setImpacts] = useState({
    construction: "",
    operation: "",
    addressed: "",
    mitigation: ""
  });

  // Section D: Consultations
  const [consultRows, setConsultRows] = useState([
    {}, {}, {}
  ]); // initial 3 rows

  // Section E: Observations, Comments & Recommendations
  const [observations, setObservations] = useState("");
  const [comments, setComments] = useState("");
  const [recommendations, setRecommendations] = useState({
    permit: "",
    addInfo: "",
    per: "",
    eia: "",
    declined: "",
    declineReason: ""
  });

  // Section F: Declarations (up to 3 officers)
  const [officers, setOfficers] = useState([
    { name: "", signature: "", date: "" },
    { name: "", signature: "", date: "" },
    { name: "", signature: "", date: "" },
  ]);

  // Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl mb-12 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        Screening Report<br /> (Existing Health Institution)
      </h1>

      {/* HEADER */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input className="border p-2 rounded" placeholder="Registration/File No." value={fileNo} onChange={e => setFileNo(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Date of Receipt of Form EA1" value={receiptDate} onChange={e => setReceiptDate(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Inspection Date" value={inspectionDate} onChange={e => setInspectionDate(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Name of Proponent/Contact Person" value={proponent} onChange={e => setProponent(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Company’s Name" value={company} onChange={e => setCompany(e.target.value)} />
      </div>

      {/* Section A */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Section A: Information Analysis and Inspection Results</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="1.1 Type of Undertaking" value={type} onChange={e => setType(e.target.value)} />
        <TableInput
          columns={["Component"]}
          rows={components}
          setRows={setComponents}
          placeholder={["Component (e.g., Building, Equipment, etc.)"]}
        />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="1.3 Capacity (Installed/Production/Volumes)" value={capacity} onChange={e => setCapacity(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="1.4 Land Take" value={landTake} onChange={e => setLandTake(e.target.value)} />

        <div className="font-medium mb-1">1.5 Wastes (type, quantity and the receiving medium)</div>
        <input className="border p-2 rounded w-full mb-1" placeholder="Liquid Waste" value={waste.liquid} onChange={e => setWaste(w => ({ ...w, liquid: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-1" placeholder="Solid Waste" value={waste.solid} onChange={e => setWaste(w => ({ ...w, solid: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Gaseous Waste" value={waste.gaseous} onChange={e => setWaste(w => ({ ...w, gaseous: e.target.value }))} />

        <textarea className="border p-2 rounded w-full mb-2" placeholder="*Comments on the description of the undertaking" value={descComments} onChange={e => setDescComments(e.target.value)} />
      </section>

      {/* Section B */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Section B: Site Information</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="2.1 Plot No." value={site.plot} onChange={e => setSite(s => ({ ...s, plot: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Street/Area Name" value={site.street} onChange={e => setSite(s => ({ ...s, street: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Town" value={site.town} onChange={e => setSite(s => ({ ...s, town: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="District" value={site.district} onChange={e => setSite(s => ({ ...s, district: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Region" value={site.region} onChange={e => setSite(s => ({ ...s, region: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Major Landmark (if any)" value={site.landmark} onChange={e => setSite(s => ({ ...s, landmark: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Current Zoning" value={site.zoning} onChange={e => setSite(s => ({ ...s, zoning: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Adjacent Land use" value={site.adjacent} onChange={e => setSite(s => ({ ...s, adjacent: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="North" value={site.north} onChange={e => setSite(s => ({ ...s, north: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="South" value={site.south} onChange={e => setSite(s => ({ ...s, south: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="East" value={site.east} onChange={e => setSite(s => ({ ...s, east: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="West" value={site.west} onChange={e => setSite(s => ({ ...s, west: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Geographical Coordinate 1" value={site.coord1} onChange={e => setSite(s => ({ ...s, coord1: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Geographical Coordinate 2" value={site.coord2} onChange={e => setSite(s => ({ ...s, coord2: e.target.value }))} />
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="2.3 Existing Infrastructure & Facilities on site" value={site.infrastructure} onChange={e => setSite(s => ({ ...s, infrastructure: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="2.4 Comment on site information (appropriateness, sensitivity, compatibility etc.)" value={site.siteComments} onChange={e => setSite(s => ({ ...s, siteComments: e.target.value }))} />
      </section>

      {/* Section C */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Section C: Environmental Impacts</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="3.1 Constructional Phase" value={impacts.construction} onChange={e => setImpacts(im => ({ ...im, construction: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="3.2 Operational Phase" value={impacts.operation} onChange={e => setImpacts(im => ({ ...im, operation: e.target.value }))} />
        <div className="mb-2">
          <label className="block mb-1 font-medium">3.3 Have these impacts been addressed by the proponent in the Form EA1?</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="addressed" checked={impacts.addressed === "Yes"} onChange={() => setImpacts(im => ({ ...im, addressed: "Yes" }))} />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="addressed" checked={impacts.addressed === "No"} onChange={() => setImpacts(im => ({ ...im, addressed: "No" }))} />
              No
            </label>
          </div>
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="If not, indicate potential mitigation measures to be adopted" value={impacts.mitigation} onChange={e => setImpacts(im => ({ ...im, mitigation: e.target.value }))} />
      </section>

      {/* Section D: Consultations */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Section D: Consultations</h2>
        <TableInput
          columns={["No.", "Name", "Contact", "Location in relation to project site", "Comments"]}
          rows={consultRows}
          setRows={setConsultRows}
          placeholder={["No.", "Name", "Contact", "Location", "Comments"]}
        />
      </section>

      {/* Section E: Observations, Comments, Recommendations */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Section E: Observations, Comments and Recommendations</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="5.1 Observations" value={observations} onChange={e => setObservations(e.target.value)} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="5.2 Comments" value={comments} onChange={e => setComments(e.target.value)} />
        <div className="mb-2">
          <label className="block mb-1 font-medium">5.3 Recommendation</label>
          <input className="border p-2 rounded w-full mb-2" placeholder="Permit Recommended" value={recommendations.permit} onChange={e => setRecommendations(r => ({ ...r, permit: e.target.value }))} />
          <input className="border p-2 rounded w-full mb-2" placeholder="Additional Information Required" value={recommendations.addInfo} onChange={e => setRecommendations(r => ({ ...r, addInfo: e.target.value }))} />
          <input className="border p-2 rounded w-full mb-2" placeholder="PER Recommended" value={recommendations.per} onChange={e => setRecommendations(r => ({ ...r, per: e.target.value }))} />
          <input className="border p-2 rounded w-full mb-2" placeholder="EIA Recommended" value={recommendations.eia} onChange={e => setRecommendations(r => ({ ...r, eia: e.target.value }))} />
          <input className="border p-2 rounded w-full mb-2" placeholder="Permit Declined" value={recommendations.declined} onChange={e => setRecommendations(r => ({ ...r, declined: e.target.value }))} />
          <textarea className="border p-2 rounded w-full mb-2" placeholder="If permit declined, give reasons" value={recommendations.declineReason} onChange={e => setRecommendations(r => ({ ...r, declineReason: e.target.value }))} />
        </div>
      </section>

      {/* Section F: Declaration */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Section F: Declaration</h2>
        <div className="mb-2">We the undersigned, hereby declare that the information provided on this form is true and accurate.</div>
        {officers.map((o, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input className="border p-2 rounded" placeholder="Name" value={o.name} onChange={e => setOfficers(arr => arr.map((oo, idx) => idx === i ? { ...oo, name: e.target.value } : oo))} />
            <input className="border p-2 rounded" placeholder="Signature" value={o.signature} onChange={e => setOfficers(arr => arr.map((oo, idx) => idx === i ? { ...oo, signature: e.target.value } : oo))} />
            <input className="border p-2 rounded" type="date" placeholder="Date" value={o.date} onChange={e => setOfficers(arr => arr.map((oo, idx) => idx === i ? { ...oo, date: e.target.value } : oo))} />
          </div>
        ))}
      </section>

      <div className="mt-8 text-center">
        <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
          Submit Form
        </button>
      </div>
    </form>
  );
};

export default ScreeningReportForm;
