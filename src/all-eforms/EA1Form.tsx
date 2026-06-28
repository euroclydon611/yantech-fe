import React, { useState } from "react";

// Dynamic table for stakeholder consultation
const StakeholderTable = ({ rows, setRows }: { rows: any[], setRows: (r: any[]) => void }) => (
  <div className="mb-3">
    <div className="font-medium mb-1">Stakeholder Consultation</div>
    <table className="min-w-full border bg-white">
      <thead>
        <tr>
          <th className="border px-2">No.</th>
          <th className="border px-2">Name</th>
          <th className="border px-2">Contact</th>
          <th className="border px-2">Tel/Email</th>
          <th className="border px-2">Location In Relation To Project Site</th>
          <th className="border px-2">Concerns / Issues</th>
          <th className="border px-2"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td className="border px-2">{idx + 1}</td>
            {["name", "contact", "tel", "location", "concerns"].map(field => (
              <td key={field} className="border px-2">
                <input
                  className="border rounded p-1 w-full"
                  value={row[field] || ""}
                  onChange={e => {
                    const copy = [...rows];
                    copy[idx][field] = e.target.value;
                    setRows(copy);
                  }}
                />
              </td>
            ))}
            <td>
              <button
                type="button"
                className="text-red-500"
                onClick={() => setRows(rows.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={7}>
            <button type="button" className="text-blue-600" onClick={() => setRows([...rows, {}])}>
              Add Stakeholder
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Dynamic attachments checklist
const AttachmentsChecklist = ({
  attachments,
  setAttachments
}: {
  attachments: { [key: string]: boolean },
  setAttachments: (a: { [key: string]: boolean }) => void
}) => {
  const options = [
    "Authentic site plan (signed by a licensed surveyor and certified by survey dept.)",
    "Block plan of the site",
    "Photographs of the site",
    "Zoning letter from Town and Country Planning Department (TCPD)",
    "No objection letter from the National Petroleum Authority (NPA) (For Petroleum Products retail outlets (FSS & LPG))",
  ];
  return (
    <div>
      <div className="font-medium mb-1">Attachments (Tick all that apply)</div>
      <div className="flex flex-col gap-1">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={attachments[opt] || false}
              onChange={() =>
                setAttachments({
                  ...attachments,
                  [opt]: !attachments[opt]
                })
              }
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

const EA1Form = () => {
  // Proponent details
  const [proponent, setProponent] = useState({
    name: "",
    address: "",
    contactPerson: "",
    position: "",
    phone: "",
    email: ""
  });

  // Proposed undertaking
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    scope: ""
  });

  // Project site
  const [site, setSite] = useState({
    plotNo: "",
    street: "",
    town: "",
    district: "",
    region: "",
    landmarks: "",
    zoning: "",
    gps: "",
    digital: "",
    distanceToFacilities: "",
    adjacentLandUses: "",
    siteDescription: ""
  });

  // Infrastructure & utilities
  const [infra, setInfra] = useState({
    structures: "",
    waterSource: "",
    waterPrimary: "",
    waterSecondary: "",
    waterQty: "",
    powerSource: "",
    powerPrimary: "",
    powerSecondary: "",
    powerQty: "",
    drainage: "",
    nearnessWaterBody: "",
    accessRoad: "",
    otherUtilities: ""
  });

  // Environmental impacts
  const [impacts, setImpacts] = useState({
    construction: "",
    operation: ""
  });

  // Stakeholder consultation table
  const [stakeholders, setStakeholders] = useState<any[]>([]);

  // Management of impacts
  const [management, setManagement] = useState({
    construction: "",
    operation: ""
  });

  // Attachments
  const [attachments, setAttachments] = useState<{ [key: string]: boolean }>({});

  // Declaration
  const [declarant, setDeclarant] = useState({
    name: "",
    signature: "",
    date: "",
    statement: ""
  });

  // Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (implement actual submission logic)");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        Environmental Assessment Registration Form (EA1)
      </h1>

      {/* Proponent Section */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Proponent Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Proponent Name"
            value={proponent.name}
            onChange={e => setProponent({ ...proponent, name: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Address for correspondence"
            value={proponent.address}
            onChange={e => setProponent({ ...proponent, address: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Contact person"
            value={proponent.contactPerson}
            onChange={e => setProponent({ ...proponent, contactPerson: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Position"
            value={proponent.position}
            onChange={e => setProponent({ ...proponent, position: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Phone"
            value={proponent.phone}
            onChange={e => setProponent({ ...proponent, phone: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Email"
            value={proponent.email}
            onChange={e => setProponent({ ...proponent, email: e.target.value })}
          />
        </div>
      </section>

      {/* Proposal Section */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Proposed Undertaking/Development</h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Title of proposal "
          value={proposal.title}
          onChange={e => setProposal({ ...proposal, title: e.target.value })}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Description of proposed undertaking including unit processes, raw materials, list of chemicals (source, types, quantities), storage facilities, waste by-products (soil, liquid, gaseous)"
          rows={4}
          value={proposal.description}
          onChange={e => setProposal({ ...proposal, description: e.target.value })}
        />
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Scope of proposal (labour force, equipment, machinery, capacity, product type, facility area, market)"
          rows={2}
          value={proposal.scope}
          onChange={e => setProposal({ ...proposal, scope: e.target.value })}
        />
      </section>

      {/* Project Site Section */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Project Site</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Plot/House No."
            value={site.plotNo}
            onChange={e => setSite({ ...site, plotNo: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Street/Area Name"
            value={site.street}
            onChange={e => setSite({ ...site, street: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Town"
            value={site.town}
            onChange={e => setSite({ ...site, town: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="District"
            value={site.district}
            onChange={e => setSite({ ...site, district: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Region"
            value={site.region}
            onChange={e => setSite({ ...site, region: e.target.value })}
          />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Major Landmarks (if any)"
          value={site.landmarks}
          onChange={e => setSite({ ...site, landmarks: e.target.value })}
        />
        <input className="border p-2 rounded w-full mb-2" placeholder="Current Zoning"
          value={site.zoning}
          onChange={e => setSite({ ...site, zoning: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="GPS Coordinates"
            value={site.gps}
            onChange={e => setSite({ ...site, gps: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Ghana Post Digital Address"
            value={site.digital}
            onChange={e => setSite({ ...site, digital: e.target.value })}
          />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Distance to nearest residential/other facilities (meters)"
          value={site.distanceToFacilities}
          onChange={e => setSite({ ...site, distanceToFacilities: e.target.value })}
        />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Adjacent land uses (existing/proposed)"
          rows={2}
          value={site.adjacentLandUses}
          onChange={e => setSite({ ...site, adjacentLandUses: e.target.value })}
        />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Site description (immediate activities/adjacent land uses)"
          rows={2}
          value={site.siteDescription}
          onChange={e => setSite({ ...site, siteDescription: e.target.value })}
        />
      </section>

      {/* Infrastructure & Utilities */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Infrastructure & Utilities</h2>
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Structures (building and other facilities proposed or existing on site)"
          rows={2}
          value={infra.structures}
          onChange={e => setInfra({ ...infra, structures: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          <input className="border p-2 rounded" placeholder="Access to water (source, quantity)"
            value={infra.waterSource}
            onChange={e => setInfra({ ...infra, waterSource: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Primary Water Source"
            value={infra.waterPrimary}
            onChange={e => setInfra({ ...infra, waterPrimary: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Secondary Water Source"
            value={infra.waterSecondary}
            onChange={e => setInfra({ ...infra, waterSecondary: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Estimated Water Quantity"
            value={infra.waterQty}
            onChange={e => setInfra({ ...infra, waterQty: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          <input className="border p-2 rounded" placeholder="Access to power (type, source, quantity)"
            value={infra.powerSource}
            onChange={e => setInfra({ ...infra, powerSource: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Primary Power Source"
            value={infra.powerPrimary}
            onChange={e => setInfra({ ...infra, powerPrimary: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Secondary Power Source"
            value={infra.powerSecondary}
            onChange={e => setInfra({ ...infra, powerSecondary: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Estimated Power Quantity"
            value={infra.powerQty}
            onChange={e => setInfra({ ...infra, powerQty: e.target.value })}
          />
        </div>
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Draining provision in the project area"
          rows={2}
          value={infra.drainage}
          onChange={e => setInfra({ ...infra, drainage: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Nearness to water body"
          value={infra.nearnessWaterBody}
          onChange={e => setInfra({ ...infra, nearnessWaterBody: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Access road to project site"
          value={infra.accessRoad}
          onChange={e => setInfra({ ...infra, accessRoad: e.target.value })}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Other major utilities proposed/existing (e.g. sewerage)"
          rows={2}
          value={infra.otherUtilities}
          onChange={e => setInfra({ ...infra, otherUtilities: e.target.value })}
        />
      </section>

      {/* Environmental Impacts */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Environmental Impacts</h2>
        <div>
          <span className="font-medium">Potential environmental impacts of proposed undertaking (constructional and operational phases)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <textarea className="border p-2 rounded w-full mb-2"
              placeholder="Construction Phase"
              rows={4}
              value={impacts.construction}
              onChange={e => setImpacts({ ...impacts, construction: e.target.value })}
            />
            <textarea className="border p-2 rounded w-full mb-2"
              placeholder="Operation Phase"
              rows={4}
              value={impacts.operation}
              onChange={e => setImpacts({ ...impacts, operation: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Stakeholder Consultation */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          Concerns: Stakeholder Consultation
        </h2>
        <StakeholderTable rows={stakeholders} setRows={setStakeholders} />
      </section>

      {/* Management of Impacts */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Management of Impacts & Environmental Enhancement Measures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea className="border p-2 rounded w-full mb-2"
            placeholder="Construction Phase"
            rows={3}
            value={management.construction}
            onChange={e => setManagement({ ...management, construction: e.target.value })}
          />
          <textarea className="border p-2 rounded w-full mb-2"
            placeholder="Operation Phase"
            rows={3}
            value={management.operation}
            onChange={e => setManagement({ ...management, operation: e.target.value })}
          />
        </div>
      </section>

      {/* Attachments */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Attachments</h2>
        <AttachmentsChecklist attachments={attachments} setAttachments={setAttachments} />
      </section>

      {/* Declaration */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Declaration</h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Declarant's Name"
          value={declarant.name}
          onChange={e => setDeclarant({ ...declarant, name: e.target.value })}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Declaration statement"
          rows={2}
          value={
            declarant.statement ||
            "I hereby declare that the information provided on this form is true to the best of my knowledge and shall provide any additional information that shall come to my notice in the course of processing the application. I also declare that the information provided is true."
          }
          onChange={e =>
            setDeclarant({ ...declarant, statement: e.target.value })
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Signature"
            value={declarant.signature}
            onChange={e => setDeclarant({ ...declarant, signature: e.target.value })}
          />
          <input className="border p-2 rounded" type="date" placeholder="Date"
            value={declarant.date}
            onChange={e => setDeclarant({ ...declarant, date: e.target.value })}
          />
        </div>
      </section>

      <div className="mt-8 text-center">
        <button
          type="submit"
          className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Submit Form
        </button>
      </div>
    </form>
  );
};

export default EA1Form;
