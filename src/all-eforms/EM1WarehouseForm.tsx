import React, { useState } from "react";

const initialPermits = [
  { label: "Certificate of Incorporation", date: "" },
  { label: "Certificate of Commencement of Business", date: "" },
  { label: "Environmental Permit", date: "" },
  { label: "Building Permit", date: "" },
  { label: "Fire Permit", date: "" },
  { label: "Chemicals Clearance Certificate", date: "" },
  { label: "Others (specify)", date: "" }
];

const initialAdjoining = { North: "", South: "", East: "", West: "" };

const EM1WarehouseForm = () => {
  // Section A - General Information
  const [entity, setEntity] = useState({
    name: "",
    type: "",
    address: "",
    contactPerson: "",
    position: "",
    tel: "",
    email: "",
    tin: ""
  });
  const [location, setLocation] = useState({
    plotNo: "",
    street: "",
    town: "",
    district: "",
    gps: "",
    landmark: "",
    adjacentLand: "",
    nearnessWater: "",
    distToFacilities: ""
  });
  const [permits, setPermits] = useState([...initialPermits]);
  const [otherPermit, setOtherPermit] = useState("");

  // Section B - Project Description
  const [project, setProject] = useState({
    components: "",
    areaDrying: "",
    capacity: "",
    labour: "",
    landTake: "",
    currentLandUse: "",
    adjoining: { ...initialAdjoining },
    cocoaQty: "",
    handling: "",
    impacts: "",
    mitigations: ""
  });

  // Section B - Contingency/GRM/Litigation
  const [emergencyPlan, setEmergencyPlan] = useState("");
  const [emergencyPlanAttached, setEmergencyPlanAttached] = useState(false);
  const [grm, setGrm] = useState("");
  const [complaint, setComplaint] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [complaintResolution, setComplaintResolution] = useState("");
  const [litigation, setLitigation] = useState("");
  
  // Section C - Attachments
  const [attachments, setAttachments] = useState({
    sitePlan: false,
    blockPlan: false,
    photo: false
  });

  // Declaration
  const [declarant, setDeclarant] = useState({
    name: "",
    title: "",
    signature: "",
    date: ""
  });

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement actual logic)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-6">EM1 Form for Warehouse</h1>

      {/* SECTION A: General Information */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">A. General Information</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Registered Name of Entity"
          value={entity.name}
          onChange={e => setEntity({ ...entity, name: e.target.value })}
        />
        <input className="border p-2 rounded w-full mb-2" placeholder="Type of Undertaking"
          value={entity.type}
          onChange={e => setEntity({ ...entity, type: e.target.value })}
        />
        <input className="border p-2 rounded w-full mb-2" placeholder="Address for Correspondence"
          value={entity.address}
          onChange={e => setEntity({ ...entity, address: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Contact Person"
            value={entity.contactPerson}
            onChange={e => setEntity({ ...entity, contactPerson: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Position"
            value={entity.position}
            onChange={e => setEntity({ ...entity, position: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Tel. No."
            value={entity.tel}
            onChange={e => setEntity({ ...entity, tel: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="E-mail"
            value={entity.email}
            onChange={e => setEntity({ ...entity, email: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="TIN"
            value={entity.tin}
            onChange={e => setEntity({ ...entity, tin: e.target.value })}
          />
        </div>

        <div className="font-medium mb-2 mt-4">Location of Undertaking</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Plot/House No."
            value={location.plotNo}
            onChange={e => setLocation({ ...location, plotNo: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Street/Area Name"
            value={location.street}
            onChange={e => setLocation({ ...location, street: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Town"
            value={location.town}
            onChange={e => setLocation({ ...location, town: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="District/Region"
            value={location.district}
            onChange={e => setLocation({ ...location, district: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="GPS Coordinates/Digital Address"
            value={location.gps}
            onChange={e => setLocation({ ...location, gps: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Major Land Mark"
            value={location.landmark}
            onChange={e => setLocation({ ...location, landmark: e.target.value })}
          />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Adjacent land uses"
          value={location.adjacentLand}
          onChange={e => setLocation({ ...location, adjacentLand: e.target.value })}
        />
        <input className="border p-2 rounded w-full mb-2" placeholder="Nearness to a water body"
          value={location.nearnessWater}
          onChange={e => setLocation({ ...location, nearnessWater: e.target.value })}
        />
        <input className="border p-2 rounded w-full mb-2" placeholder="Approx. distance to nearest residential/other facilities"
          value={location.distToFacilities}
          onChange={e => setLocation({ ...location, distToFacilities: e.target.value })}
        />

        <div className="font-medium mt-4 mb-2">
          Certificates, Permits, Licenses and Approvals granted by Government departments/agencies (attach copies as appropriate)
        </div>
        {permits.map((permit, idx) => (
          <div key={permit.label} className="flex gap-2 mb-2 items-center">
            <input
              className="border p-2 rounded w-full"
              placeholder={permit.label + (permit.label === "Others (specify)" ? "" : "")}
              value={permit.label === "Others (specify)" ? otherPermit : permit.label}
              onChange={e =>
                permit.label === "Others (specify)"
                  ? setOtherPermit(e.target.value)
                  : null
              }
              disabled={permit.label !== "Others (specify)"}
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
      </section>

      {/* SECTION B: Project Description */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">B. Project Description</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Components of the project"
          rows={2}
          value={project.components}
          onChange={e => setProject({ ...project, components: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Area for drying of cocoa beans"
            value={project.areaDrying}
            onChange={e => setProject({ ...project, areaDrying: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Capacity of warehouse (m³)"
            value={project.capacity}
            onChange={e => setProject({ ...project, capacity: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Size of labour force"
            value={project.labour}
            onChange={e => setProject({ ...project, labour: e.target.value })}
          />
          <input className="border p-2 rounded" placeholder="Land take"
            value={project.landTake}
            onChange={e => setProject({ ...project, landTake: e.target.value })}
          />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Current land use of the area"
          value={project.currentLandUse}
          onChange={e => setProject({ ...project, currentLandUse: e.target.value })}
        />
        <div className="font-medium mt-2 mb-1">Adjoining land uses</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="North"
            value={project.adjoining.North}
            onChange={e => setProject({ ...project, adjoining: { ...project.adjoining, North: e.target.value }})}
          />
          <input className="border p-2 rounded" placeholder="South"
            value={project.adjoining.South}
            onChange={e => setProject({ ...project, adjoining: { ...project.adjoining, South: e.target.value }})}
          />
          <input className="border p-2 rounded" placeholder="East"
            value={project.adjoining.East}
            onChange={e => setProject({ ...project, adjoining: { ...project.adjoining, East: e.target.value }})}
          />
          <input className="border p-2 rounded" placeholder="West"
            value={project.adjoining.West}
            onChange={e => setProject({ ...project, adjoining: { ...project.adjoining, West: e.target.value }})}
          />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Quantity of cocoa beans stored per year (kg/tonnes)"
          value={project.cocoaQty}
          onChange={e => setProject({ ...project, cocoaQty: e.target.value })}
        />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Describe mode of handling and storage"
          rows={2}
          value={project.handling}
          onChange={e => setProject({ ...project, handling: e.target.value })}
        />

        <div className="font-medium mt-2 mb-1">Impacts and Mitigation on water, air, land</div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Impacts"
          rows={2}
          value={project.impacts}
          onChange={e => setProject({ ...project, impacts: e.target.value })}
        />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Mitigation Measures"
          rows={2}
          value={project.mitigations}
          onChange={e => setProject({ ...project, mitigations: e.target.value })}
        />

        <div className="font-medium mt-2 mb-1">Contingency/Emergency Response Plan</div>
        <div className="flex items-center gap-4 mb-2">
          <label className="flex items-center gap-1">
            <input type="radio" checked={emergencyPlan === "Yes"} onChange={() => setEmergencyPlan("Yes")} />
            Yes
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={emergencyPlan === "No"} onChange={() => setEmergencyPlan("No")} />
            No
          </label>
          {emergencyPlan === "Yes" && (
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={emergencyPlanAttached} onChange={() => setEmergencyPlanAttached(!emergencyPlanAttached)} />
              Attach a copy
            </label>
          )}
        </div>

        <div className="font-medium mt-2 mb-1">Grievance Redress Mechanism (GRM)</div>
        <div className="flex items-center gap-4 mb-2">
          <label className="flex items-center gap-1">
            <input type="radio" checked={grm === "Yes"} onChange={() => setGrm("Yes")} />
            Yes
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={grm === "No"} onChange={() => setGrm("No")} />
            No
          </label>
        </div>
        <div className="font-medium mt-2 mb-1">Have there been any complaints about your undertaking?</div>
        <div className="flex items-center gap-4 mb-2">
          <label className="flex items-center gap-1">
            <input type="radio" checked={complaint === "Yes"} onChange={() => setComplaint("Yes")} />
            Yes
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={complaint === "No"} onChange={() => setComplaint("No")} />
            No
          </label>
        </div>
        {complaint === "Yes" && (
          <div className="mb-2">
            <input className="border p-2 rounded w-full mb-2" placeholder="Type of complaint"
              value={complaintType}
              onChange={e => setComplaintType(e.target.value)}
            />
            <input className="border p-2 rounded w-full mb-2" placeholder="How complaint was resolved"
              value={complaintResolution}
              onChange={e => setComplaintResolution(e.target.value)}
            />
          </div>
        )}
        <div className="font-medium mt-2 mb-1">Is any aspect of the Undertaking or the undertaking a subject of litigation?</div>
        <div className="flex items-center gap-4 mb-2">
          <label className="flex items-center gap-1">
            <input type="radio" checked={litigation === "Yes"} onChange={() => setLitigation("Yes")} />
            Yes
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={litigation === "No"} onChange={() => setLitigation("No")} />
            No
          </label>
        </div>
      </section>

      {/* SECTION C: Attachments */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">C. Attachments</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.sitePlan} onChange={() => setAttachments(a => ({ ...a, sitePlan: !a.sitePlan }))} />
            Authentic site plan
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.blockPlan} onChange={() => setAttachments(a => ({ ...a, blockPlan: !a.blockPlan }))} />
            Block plan of the warehouse
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={attachments.photo} onChange={() => setAttachments(a => ({ ...a, photo: !a.photo }))} />
            Photograph of the warehouse
          </label>
        </div>
      </section>

      {/* Declaration */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Declaration</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Name of applicant or authorized representative"
          value={declarant.name}
          onChange={e => setDeclarant({ ...declarant, name: e.target.value })}
        />
        <input className="border p-2 rounded w-full mb-2" placeholder="Title"
          value={declarant.title}
          onChange={e => setDeclarant({ ...declarant, title: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input className="border p-2 rounded" placeholder="Signature"
            value={declarant.signature}
            onChange={e => setDeclarant({ ...declarant, signature: e.target.value })}
          />
          <input className="border p-2 rounded" type="date" placeholder="Date"
            value={declarant.date}
            onChange={e => setDeclarant({ ...declarant, date: e.target.value })}
          />
        </div>
        <div className="text-gray-500 mt-2 text-sm">
          NB: Additional information or clarification and/or documentation may be required during the Department’s review.
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

export default EM1WarehouseForm;
