import React, { useState } from "react";

// Radio for YES/NO/N/A checklist
const YesNoNA = ({ value, onChange, label }: { value: string, onChange: (v: string) => void, label: string }) => (
  <div className="my-2">
    <div className="font-medium">{label}</div>
    <div className="flex gap-6 mt-1">
      {["YES", "NO", "N/A"].map(opt => (
        <label key={opt} className="flex items-center gap-1">
          <input
            type="radio"
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="accent-green-700"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

// Employee dynamic table
const EmployeeTable = ({ employees, setEmployees }: { employees: any[], setEmployees: (e: any[]) => void }) => (
  <div className="mb-3">
    <div className="font-medium mb-1">Employee Information</div>
    <table className="min-w-full border bg-white">
      <thead>
        <tr>
          <th className="border px-2">Name</th>
          <th className="border px-2">Sex</th>
          <th className="border px-2">Age</th>
          <th className="border px-2">Position</th>
          <th className="border px-2">Qualification/Training</th>
          <th className="border px-2"></th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp, idx) => (
          <tr key={idx}>
            {["name", "sex", "age", "position", "qualification"].map(field => (
              <td key={field} className="border px-2">
                <input
                  className="border rounded p-1 w-full"
                  value={emp[field] || ""}
                  onChange={e => {
                    const copy = [...employees];
                    copy[idx][field] = e.target.value;
                    setEmployees(copy);
                  }}
                />
              </td>
            ))}
            <td>
              <button
                type="button"
                className="text-red-500"
                onClick={() => setEmployees(employees.filter((_, i) => i !== idx))}
              >Remove</button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={6}>
            <button type="button" className="text-blue-600" onClick={() => setEmployees([...employees, {}])}>
              Add Employee
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const checklistFields = [
  // C. SITING OF PREMISE
  { section: "C. SITING OF PREMISE", fields: [
    { label: "Pesticides storage /retail premises located at least 10-15m from sensitive areas such as playgrounds, watercourses, feedlots, animal shelters, schools, food market, flammable materials, explosives etc?", key: "sit_dist_sens" },
    { label: "Site subject/prone to flooding?", key: "sit_flood" },
    { label: "Possibility of run-off from site contaminating surface or ground water?", key: "sit_runoff" },
    { label: "Easy access for pesticides delivery vehicles, fire fighting vehicles and equipment?", key: "sit_access" },
  ]},
  // D. STORAGE /RETAIL STRUCTURE AND AREA
  { section: "D. STORAGE /RETAIL STRUCTURE AND AREA", fields: [
    { label: "Structure made of metal?", key: "st_metal" },
    { label: "Structure made of sandcrete?", key: "st_sandcrete" },
    { label: "Structure made of wood?", key: "st_wood" },
    { label: "Presence of drainage system to contain run-off?", key: "st_drainage" },
    { label: "Storage structure fireproof, child proof, animal-proof and burglar-proof?", key: "st_fireproof" },
    { label: "Storage floor resistant to chemical attack?", key: "st_floor_resist" },
    { label: "Storekeepers’ office separate from storage area?", key: "st_office_sep" },
    { label: "Internal walls smooth and free from cracks to allow easy cleaning?", key: "st_walls_smooth" },
    { label: "Provision made for washing facilities?", key: "st_wash_fac" },
    { label: "Protective clothing and respiratory masks?", key: "st_ppe" },
    { label: "Where store is a wooden structure, is there a concrete bonding?", key: "st_wood_bond" },
    { label: "Store marked with 1-metre wide gangways between shelves or stacks that permit easy inspection and allow airflow?", key: "st_gangways" },
    { label: "Timber or brick used as pallets on floor?", key: "st_pallets" },
  ]},
  // E. STORAGE CAPACITY
  { section: "E. STORAGE CAPACITY", fields: [
    { label: "Storage capacity adequate for easy access, movement and stacking of pesticides?", key: "cap_adequate" },
    { label: "Need to move containers to select pesticides?", key: "cap_move_to_select" },
    { label: "Sufficient space for storing out-of-date stocks?", key: "cap_outofdate" },
    { label: "Sufficient space for storing empty containers awaiting disposal?", key: "cap_empty_containers" },
    { label: "Stocks arranged to use the oldest first (first in first out principle) to prevent stocks from accumulating?", key: "cap_fifo" },
  ]},
  // F. SPILLAGE CONTAINMENT
  { section: "F. SPILLAGE CONTAINMENT", fields: [
    { label: "Ramp at entrance to contain leakage/spills?", key: "spill_ramp" },
    { label: "Presence of absorbent material eg. Sand, sawdust, activated charcoal, absorptive clay, for emergency spillage situations?", key: "spill_absorbent" },
    { label: "Floor concrete bonding available (if wooden structure)?", key: "spill_bond" },
  ]},
  // G. VENTILATION & LIGHT
  { section: "G. VENTILATION & LIGHT", fields: [
    { label: "Building well ventilated?", key: "vent_ventilated" },
    { label: "Pesticides stored away from direct sunlight?", key: "vent_sunlight" },
    { label: "Working area for dispensing and repacking pesticides well ventilated and some distance from store entrance?", key: "vent_dispense" },
    { label: "Store well illuminated?", key: "vent_illuminated" },
  ]},
  // H. ENVIRONMENTAL HEALTH AND SAFETY
  { section: "H. ENVIRONMENTAL HEALTH AND SAFETY", fields: [
    { label: "Fire-fighting equipment (fire extinguisher, fire-proof blanket etc.)?", key: "ehs_fire" },
    { label: "Containers arranged to minimize handling to avoid mechanical damage?", key: "ehs_arranged" },
    { label: "Firefighting and decontamination equipment positioned at strategic, well lit points and clearly indicated?", key: "ehs_strategic" },
    { label: "Soap and water readily available for washing?", key: "ehs_soap" },
    { label: "Drum spanners and metal funnels available?", key: "ehs_spanners" },
    { label: "Area well marked and secured with weatherproof bright warning signs?", key: "ehs_marked" },
    { label: "‘No Smoking’, No Eating’ No Drinking’ signs inside and outside of stores?", key: "ehs_nosmoke" },
    { label: "Warning signs eg. ‘Danger’ and ‘Keep off’ adequate and visible?", key: "ehs_danger" },
    { label: "Stock cards available?", key: "ehs_stock_cards" },
    { label: "Pesticide containers adequately and legibly labelled?", key: "ehs_labels" },
    { label: "Container labels intact?", key: "ehs_label_intact" },
    { label: "Presence of personal protective equipment?", key: "ehs_ppe" },
    { label: "First Aid box available?", key: "ehs_firstaid" },
  ]},
  // I. ENTRANCE AND EXIT
  { section: "I. ENTRANCE AND EXIT", fields: [
    { label: "The premise has direct access to outside?", key: "exit_access" },
    { label: "Sufficient emergency exits without passing through another room/building?", key: "exit_emergency" },
    { label: "Doors and windows have secured locks to prevent unauthorized entry?", key: "exit_locks" },
    { label: "All access doors open outward in the direction of escape?", key: "exit_outward" },
    { label: "Presence of security guard?", key: "exit_guard" },
  ]},
  // J. PESTICIDES DISPOSAL OPTIONS
  { section: "J. PESTICIDES DISPOSAL OPTIONS", fields: [
    { label: "Existence of pesticide disposal system?", key: "dispose_system" },
  ]},
];

const ChecklistPesticidesForm1 = () => {
  // A. Background
  const [background, setBackground] = useState({
    company: "",
    owner: "",
    contact: "",
    position: "",
    location: "",
    postal: "",
    license: "",
    gps: "",
    district: "",
    region: "",
    town: "",
    tel: "",
    email: "",
  });

  // B. Employee Info
  const [numEmployed, setNumEmployed] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);

  // C-J. Checklist
  const [checklist, setChecklist] = useState<{ [key: string]: string }>({});

  // Comments, Recommendations, and Inspectors
  const [comments, setComments] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [contactPerson, setContactPerson] = useState({ name: "", signature: "" });
  const [inspectors, setInspectors] = useState([
    { name: "", signature: "" },
    { name: "", signature: "" },
  ]);
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (implement logic as needed)");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-10">
      <h1 className="text-2xl font-bold text-center mb-6">Checklist for Inspection of Pesticides Storage/Retail Premises</h1>

      {/* A. BACKGROUND INFORMATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">A. Background Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          <input className="border p-2 rounded" placeholder="Company Name" value={background.company}
            onChange={e => setBackground({ ...background, company: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Owner of Company" value={background.owner}
            onChange={e => setBackground({ ...background, owner: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Contact Person" value={background.contact}
            onChange={e => setBackground({ ...background, contact: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Position" value={background.position}
            onChange={e => setBackground({ ...background, position: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Location of Premise" value={background.location}
            onChange={e => setBackground({ ...background, location: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Postal Address of Premise" value={background.postal}
            onChange={e => setBackground({ ...background, postal: e.target.value })} />
          <input className="border p-2 rounded" placeholder="License Number (if any)" value={background.license}
            onChange={e => setBackground({ ...background, license: e.target.value })} />
          <input className="border p-2 rounded" placeholder="GPS Reading" value={background.gps}
            onChange={e => setBackground({ ...background, gps: e.target.value })} />
          <input className="border p-2 rounded" placeholder="District" value={background.district}
            onChange={e => setBackground({ ...background, district: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Region" value={background.region}
            onChange={e => setBackground({ ...background, region: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Town" value={background.town}
            onChange={e => setBackground({ ...background, town: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Tel/Fax" value={background.tel}
            onChange={e => setBackground({ ...background, tel: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Email" value={background.email}
            onChange={e => setBackground({ ...background, email: e.target.value })} />
        </div>
      </section>

      {/* B. EMPLOYEE INFORMATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">B. Employee Information</h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Number of Persons Employed"
          value={numEmployed}
          onChange={e => setNumEmployed(e.target.value)}
        />
        <EmployeeTable employees={employees} setEmployees={setEmployees} />
      </section>

      {/* C-J. Checklist */}
      {checklistFields.map(({ section, fields }) => (
        <section key={section}>
          <h2 className="font-semibold text-lg mb-2 border-b pb-1">{section}</h2>
          {fields.map(({ label, key }) => (
            <YesNoNA
              key={key}
              label={label}
              value={checklist[key] || ""}
              onChange={v => setChecklist(c => ({ ...c, [key]: v }))}
            />
          ))}
        </section>
      ))}

      {/* K. OTHER INFORMATION AND COMMENTS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">K. Other Information and Comments on Inspection</h2>
        <textarea className="border p-2 rounded w-full" rows={3}
          value={comments}
          onChange={e => setComments(e.target.value)}
          placeholder="Enter any other comments or observations here"
        />
      </section>

      {/* L. RECOMMENDATIONS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">L. Recommendations</h2>
        <textarea className="border p-2 rounded w-full" rows={3}
          value={recommendations}
          onChange={e => setRecommendations(e.target.value)}
          placeholder="Enter recommendations here"
        />
      </section>

      {/* Contact Person present */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Contact Person present</h2>
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-2 rounded" placeholder="Name"
            value={contactPerson.name} onChange={e => setContactPerson({ ...contactPerson, name: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Signature"
            value={contactPerson.signature} onChange={e => setContactPerson({ ...contactPerson, signature: e.target.value })} />
        </div>
      </section>

      {/* Inspectors */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Pesticide Inspectors</h2>
        <div className="grid grid-cols-2 gap-2">
          {inspectors.map((insp, idx) => (
            <React.Fragment key={idx}>
              <input className="border p-2 rounded" placeholder="Name"
                value={insp.name} onChange={e => {
                  const copy = [...inspectors]; copy[idx].name = e.target.value; setInspectors(copy);
                }} />
              <input className="border p-2 rounded" placeholder="Signature"
                value={insp.signature} onChange={e => {
                  const copy = [...inspectors]; copy[idx].signature = e.target.value; setInspectors(copy);
                }} />
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input className="border p-2 rounded" type="date" value={inspectionDate}
            onChange={e => setInspectionDate(e.target.value)} />
          <input className="border p-2 rounded" type="time" value={inspectionTime}
            onChange={e => setInspectionTime(e.target.value)} />
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

export default ChecklistPesticidesForm1;
