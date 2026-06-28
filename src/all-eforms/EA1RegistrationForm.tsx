import React, { useState } from "react";

// For stakeholder consultations table
const StakeholderTable = ({ rows, setRows }) => (
  <div className="mb-4">
    <table className="w-full border mb-2 text-xs">
      <thead>
        <tr>
          <th className="border p-1">No.</th>
          <th className="border p-1">Name</th>
          <th className="border p-1">Contact (Tel/Email)</th>
          <th className="border p-1">Location (N/S/E/W of Project Site)</th>
          <th className="border p-1">Concerns/Issues</th>
          <th className="border p-1"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td className="border text-center">{i + 1}</td>
            <td className="border"><input className="p-1 w-full" value={row.name || ""} onChange={e => setRows(rs => rs.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))} /></td>
            <td className="border"><input className="p-1 w-full" value={row.contact || ""} onChange={e => setRows(rs => rs.map((r, idx) => idx === i ? { ...r, contact: e.target.value } : r))} /></td>
            <td className="border"><input className="p-1 w-full" value={row.location || ""} onChange={e => setRows(rs => rs.map((r, idx) => idx === i ? { ...r, location: e.target.value } : r))} /></td>
            <td className="border"><input className="p-1 w-full" value={row.concerns || ""} onChange={e => setRows(rs => rs.map((r, idx) => idx === i ? { ...r, concerns: e.target.value } : r))} /></td>
            <td className="border text-center">
              <button type="button" className="text-red-500 font-bold px-2" onClick={() => setRows(rs => rs.filter((_, idx) => idx !== i))}>×</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button type="button" className="px-3 py-1 bg-gray-100 border rounded text-xs" onClick={() => setRows([...rows, {}])}>Add Row</button>
  </div>
);

const EA1RegistrationForm = () => {
  // Section 1
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    scope: "",
  });

  // Section 2
  const [site, setSite] = useState({
    plot: "",
    street: "",
    town: "",
    district: "",
    region: "",
    landmarks: "",
    zoning: "",
    distance: "",
    adjLandUse: "",
    siteDesc: "",
  });

  // Section 3
  const [infra, setInfra] = useState({
    structures: "",
    water: "",
    power: "",
    drainage: "",
    waterbody: "",
    road: "",
    utilities: "",
  });

  // Section 4
  const [impact, setImpact] = useState({
    construction: "",
    operation: "",
  });

  // Section 5
  const [stakeholders, setStakeholders] = useState([
    { name: "", contact: "", location: "", concerns: "" },
  ]);

  // Section 6
  const [management, setManagement] = useState({
    construction: "",
    operation: "",
  });

  // Section 7: Attachments
  const [attachments, setAttachments] = useState({
    sitePlan: false,
    blockPlan: false,
    photos: false,
    zoningLetter: false,
    npaLetter: false,
  });

  // Section 8: Declaration
  const [declaration, setDeclaration] = useState({
    name: "",
    signature: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mb-12 space-y-10"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        ENVIRONMENTAL ASSESSMENT REGISTRATION FORM (FORM EA 1)
      </h1>

      {/* Section 1 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1. PROPOSED UNDERTAKING/DEVELOPMENT</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Title of proposal" value={proposal.title} onChange={e => setProposal(p => ({ ...p, title: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" rows={5} placeholder="Description of proposed undertaking (include flow diagram, raw materials, chemicals, storage, wastes, etc)" value={proposal.description} onChange={e => setProposal(p => ({ ...p, description: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" rows={4} placeholder="Scope of proposal (labour, machinery, capacity, product, area, market)" value={proposal.scope} onChange={e => setProposal(p => ({ ...p, scope: e.target.value }))} />
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">2. PROJECT SITE</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Plot/House No." value={site.plot} onChange={e => setSite(s => ({ ...s, plot: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Street/Area Name" value={site.street} onChange={e => setSite(s => ({ ...s, street: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Town" value={site.town} onChange={e => setSite(s => ({ ...s, town: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="District" value={site.district} onChange={e => setSite(s => ({ ...s, district: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Region" value={site.region} onChange={e => setSite(s => ({ ...s, region: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Major Landmarks (if any)" value={site.landmarks} onChange={e => setSite(s => ({ ...s, landmarks: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Current Zoning" value={site.zoning} onChange={e => setSite(s => ({ ...s, zoning: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Distance to nearest residential/other facilities (meters); provide coordinates if possible" value={site.distance} onChange={e => setSite(s => ({ ...s, distance: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Adjacent land uses (existing/proposed) – describe and attach pictures" value={site.adjLandUse} onChange={e => setSite(s => ({ ...s, adjLandUse: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Site description (describe immediate activities and adjacent land uses)" value={site.siteDesc} onChange={e => setSite(s => ({ ...s, siteDesc: e.target.value }))} />
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">3. INFRASTRUCTURE AND UTILITIES</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Structures (buildings/facilities proposed or existing on site)" value={infra.structures} onChange={e => setInfra(i => ({ ...i, structures: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Access to water (source, quantity)" value={infra.water} onChange={e => setInfra(i => ({ ...i, water: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Access to power (type, source, quantity)" value={infra.power} onChange={e => setInfra(i => ({ ...i, power: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Drainage provision in the project area" value={infra.drainage} onChange={e => setInfra(i => ({ ...i, drainage: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Nearness to water body" value={infra.waterbody} onChange={e => setInfra(i => ({ ...i, waterbody: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Access road to project site" value={infra.road} onChange={e => setInfra(i => ({ ...i, road: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Other major utilities (e.g., sewerage, etc)" value={infra.utilities} onChange={e => setInfra(i => ({ ...i, utilities: e.target.value }))} />
      </section>

      {/* Section 4 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">4. ENVIRONMENTAL IMPACTS</h2>
        <div className="mb-1 font-medium">Potential environmental impacts of proposed undertaking (both constructional and operational phases):</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <textarea className="border p-2 rounded w-full mb-2" rows={6} placeholder="CONSTRUCTION PHASE" value={impact.construction} onChange={e => setImpact(im => ({ ...im, construction: e.target.value }))} />
          <textarea className="border p-2 rounded w-full mb-2" rows={6} placeholder="OPERATION PHASE" value={impact.operation} onChange={e => setImpact(im => ({ ...im, operation: e.target.value }))} />
        </div>
      </section>

      {/* Section 5 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">5. CONCERNS</h2>
        <div className="mb-1">
          Views of immediate adjoining neighbours and relevant stakeholders (if applicable, provide evidence of consultation).
        </div>
        <StakeholderTable rows={stakeholders} setRows={setStakeholders} />
      </section>

      {/* Section 6 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">6. MANAGEMENT OF IMPACTS & ENVIRONMENTAL ENHANCEMENT MEASURES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <textarea className="border p-2 rounded w-full mb-2" rows={5} placeholder="CONSTRUCTION PHASE" value={management.construction} onChange={e => setManagement(m => ({ ...m, construction: e.target.value }))} />
          <textarea className="border p-2 rounded w-full mb-2" rows={5} placeholder="OPERATION PHASE" value={management.operation} onChange={e => setManagement(m => ({ ...m, operation: e.target.value }))} />
        </div>
      </section>

      {/* Section 7 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">7. ATTACHMENTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.sitePlan} onChange={e => setAttachments(a => ({ ...a, sitePlan: !a.sitePlan }))} />
            Authentic site plan (signed by licensed surveyor & certified by survey dept.)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.blockPlan} onChange={e => setAttachments(a => ({ ...a, blockPlan: !a.blockPlan }))} />
            Block plan of the site
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.photos} onChange={e => setAttachments(a => ({ ...a, photos: !a.photos }))} />
            Photographs of the site
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.zoningLetter} onChange={e => setAttachments(a => ({ ...a, zoningLetter: !a.zoningLetter }))} />
            Zoning letter from TCPD
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.npaLetter} onChange={e => setAttachments(a => ({ ...a, npaLetter: !a.npaLetter }))} />
            No objection letter from NPA (for petroleum retail outlets)
          </label>
        </div>
      </section>

      {/* Section 8 */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">8. DECLARATION</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Name of Declarant" value={declaration.name} onChange={e => setDeclaration(d => ({ ...d, name: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Signature" value={declaration.signature} onChange={e => setDeclaration(d => ({ ...d, signature: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" type="date" placeholder="Date" value={declaration.date} onChange={e => setDeclaration(d => ({ ...d, date: e.target.value }))} />
        <div className="text-xs text-gray-500 mt-1">
          By submitting, you declare that the information provided is true to the best of your knowledge and you will provide additional info if required.
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

export default EA1RegistrationForm;
