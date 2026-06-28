import React, { useState } from "react";

const YesNoRadio = ({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  name: string;
}) => (
  <div className="flex gap-6">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name={name}
        checked={value === "Yes"}
        onChange={() => onChange("Yes")}
      />
      Yes
    </label>
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name={name}
        checked={value === "No"}
        onChange={() => onChange("No")}
      />
      No
    </label>
  </div>
);

const AER2LPGSiteVerificationChecklist = () => {
  // 1. COMPANY PROFILE
  const [company, setCompany] = useState({
    name: "",
    year: "",
    parent: "",
    location: "",
    contact: "",
    position: "",
    address: "",
    tel: "",
    fax: "",
    email: "",
  });
  const [permits, setPermits] = useState({
    envPermit: false,
    constrPermit: false,
    envCert: false,
    opPermit: false,
    firePermit: false,
    devPermit: false,
    fireCert: false,
    bldPermit: false,
    ndtCert: false,
    fidCert: false,
    insurance: false,
    gsbCert: false,
  });

  // 2. SITE DESCRIPTION
  const [adjChange, setAdjChange] = useState("");
  const [adjCompat, setAdjCompat] = useState("");
  const [zoning, setZoning] = useState("");
  const [geo, setGeo] = useState("");
  const [dist, setDist] = useState("");

  // 3. SERVICES AND FACILITIES
  const [services, setServices] = useState({
    lpgRefill: false,
    autoGas: false,
    saleCylinders: false,
    saleBottles: false,
    offices: false,
    others: "",
  });
  const [storage, setStorage] = useState({
    tanks: "",
    instYr: "",
    replYr: "",
    workers: "",
  });
  const [safety, setSafety] = useState({
    tempGauge: false,
    pressureGauge: false,
    sightGlass: false,
    reliefValve: false,
    bottomValve: false,
    sprinklers: false,
    balancer: false,
    stair: false,
    grounding: false,
    fireArresters: false,
  });

  // 4. INFRASTRUCTURE & UTILITIES
  const [infra, setInfra] = useState({
    gwc: false,
    tanker: false,
    borehole: false,
    reservoir: false,
    waterOther: "",
    ecg: false,
    gen: false,
    powerOther: "",
    drainage: "",
    forecourt: "",
    forecourtOther: "",
    washroomNum: "",
    washroomCond: "",
    forecourtDivided: "",
    procedures: "",
    fenced: "",
    comments: "",
  });

  // 5. MANAGEMENT OF IMPACTS
  const [traffic, setTraffic] = useState({ access: "", parking: "", accident: "" });
  const [ohs, setOHS] = useState({
    training: "",
    firstAid: "",
    assembly: "",
    ppeList: "",
  });
  const [fire, setFire] = useState({
    smoke: false,
    alarm: false,
    hydrants: false,
    hose: false,
    signs: false,
  });

  // 5.4 Emergency
  const [emergency, setEmergency] = useState({
    leakProc: "",
    erPlan: "",
    fireTraining: "",
    fireDrills: "",
    leakTraining: "",
    safeProd: "",
  });

  // 6. ENVIRONMENTAL MONITORING
  const [records, setRecords] = useState({
    gasLeaks: "",
    solidWaste: "",
    accidents: "",
    accReports: "",
    ndtReports: "",
  });

  // 7-9 Comments
  const [neighbour, setNeighbour] = useState("");
  const [comments, setComments] = useState("");
  const [special, setSpecial] = useState("");

  // Officer Declarations
  const [officers, setOfficers] = useState([
    { name: "", date: "" },
    { name: "", date: "" },
    { name: "", date: "" },
  ]);

  // Inspection Date
  const [inspectionDate, setInspectionDate] = useState("");

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
        FORM AER2 Site Verification Checklist<br />
        LPG Re-Filling Plant (Official Use Only)
      </h1>
      <div className="mb-2">
        <label className="font-medium">Date of Inspection</label>
        <input
          type="date"
          className="border rounded p-2 ml-4"
          value={inspectionDate}
          onChange={e => setInspectionDate(e.target.value)}
        />
      </div>

      {/* 1.0 COMPANY PROFILE */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1.0 COMPANY PROFILE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Name of Service Station"
            value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Year of Establishment"
            value={company.year} onChange={e => setCompany({ ...company, year: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Parent Oil Marketing Company"
            value={company.parent} onChange={e => setCompany({ ...company, parent: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Location"
            value={company.location} onChange={e => setCompany({ ...company, location: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Contact Person"
            value={company.contact} onChange={e => setCompany({ ...company, contact: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Position"
            value={company.position} onChange={e => setCompany({ ...company, position: e.target.value })} />
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Address"
          value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Tel"
            value={company.tel} onChange={e => setCompany({ ...company, tel: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Fax"
            value={company.fax} onChange={e => setCompany({ ...company, fax: e.target.value })} />
          <input className="border p-2 rounded" placeholder="E-mail"
            value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} />
        </div>
        <div className="font-medium mt-3 mb-2">Permits/Licences and Certificates:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          {Object.entries(permits).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={val} onChange={() => setPermits((p) => ({ ...p, [key]: !p[key] }))} />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (m) => m.toUpperCase())}
            </label>
          ))}
        </div>
      </section>

      {/* 2.0 SITE DESCRIPTION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">2.0 SITE DESCRIPTION</h2>
        <div className="font-medium mb-1">Adjacent Land Uses</div>
        <div>Has there been changes in adjacent land uses?</div>
        <YesNoRadio value={adjChange} onChange={setAdjChange} name="adjChange" />
        {adjChange === "Yes" && (
          <div>
            Are the changes compatible with the facility?
            <YesNoRadio value={adjCompat} onChange={setAdjCompat} name="adjCompat" />
          </div>
        )}
        <input className="border p-2 rounded w-full mb-2" placeholder="Current Zoning" value={zoning} onChange={e => setZoning(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Geographical Coordinates" value={geo} onChange={e => setGeo(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Approximate distance to nearest facility/water body" value={dist} onChange={e => setDist(e.target.value)} />
      </section>

      {/* 3.0 SERVICES AND FACILITIES PROVIDED */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">3.0 SERVICES AND FACILITIES PROVIDED</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={services.lpgRefill} onChange={() => setServices(s => ({ ...s, lpgRefill: !s.lpgRefill }))} />
            LPG Re-filling
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={services.autoGas} onChange={() => setServices(s => ({ ...s, autoGas: !s.autoGas }))} />
            Auto Gas Dispensing
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={services.saleCylinders} onChange={() => setServices(s => ({ ...s, saleCylinders: !s.saleCylinders }))} />
            Sale of filled LPG Cylinders
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={services.saleBottles} onChange={() => setServices(s => ({ ...s, saleBottles: !s.saleBottles }))} />
            Sale of LPG Bottles & Accessories
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={services.offices} onChange={() => setServices(s => ({ ...s, offices: !s.offices }))} />
            Offices
          </label>
          <input className="border p-2 rounded" placeholder="Others (Specify)" value={services.others} onChange={e => setServices(s => ({ ...s, others: e.target.value }))} />
        </div>
        <div className="font-medium mt-2 mb-1">Storage Tanks</div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Number and Capacity" value={storage.tanks} onChange={e => setStorage(s => ({ ...s, tanks: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Year of Installation" value={storage.instYr} onChange={e => setStorage(s => ({ ...s, instYr: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Year of Replacement" value={storage.replYr} onChange={e => setStorage(s => ({ ...s, replYr: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of Workers" value={storage.workers} onChange={e => setStorage(s => ({ ...s, workers: e.target.value }))} />
        <div className="font-medium mt-2 mb-1">Safety Accessories</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {Object.entries(safety).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={val} onChange={() => setSafety(s => ({ ...s, [key]: !s[key] }))} />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (m) => m.toUpperCase())}
            </label>
          ))}
        </div>
      </section>

      {/* 4.0 INFRASTRUCTURE AND UTILITIES */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">4.0 INFRASTRUCTURE AND UTILITIES</h2>
        <div className="font-medium mb-1">Water (Sources, availability and storage):</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.gwc} onChange={() => setInfra(i => ({ ...i, gwc: !i.gwc }))} />
            GWC
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.tanker} onChange={() => setInfra(i => ({ ...i, tanker: !i.tanker }))} />
            Water Tanker Service
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.borehole} onChange={() => setInfra(i => ({ ...i, borehole: !i.borehole }))} />
            Well/Borehole
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.reservoir} onChange={() => setInfra(i => ({ ...i, reservoir: !i.reservoir }))} />
            Overhead Water Reservoir
          </label>
          <input className="border p-2 rounded" placeholder="Others (specify)" value={infra.waterOther} onChange={e => setInfra(i => ({ ...i, waterOther: e.target.value }))} />
        </div>
        <div className="font-medium mb-1 mt-2">Power (Source(s)):</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.ecg} onChange={() => setInfra(i => ({ ...i, ecg: !i.ecg }))} />
            ECG
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.gen} onChange={() => setInfra(i => ({ ...i, gen: !i.gen }))} />
            Stand-by Generator
          </label>
          <input className="border p-2 rounded" placeholder="Others (specify)" value={infra.powerOther} onChange={e => setInfra(i => ({ ...i, powerOther: e.target.value }))} />
        </div>
        <div className="font-medium mt-2 mb-1">Forecourt Facilities</div>
        <div className="flex gap-6 mb-2">
          <label>
            <input type="radio" checked={infra.drainage === "Available"} onChange={() => setInfra(i => ({ ...i, drainage: "Available" }))} />
            Site Drainage Available
          </label>
          <label>
            <input type="radio" checked={infra.drainage === "Non-Available"} onChange={() => setInfra(i => ({ ...i, drainage: "Non-Available" }))} />
            Not Available
          </label>
        </div>
        <div className="flex gap-6 mb-2">
          <label>
            <input type="radio" checked={infra.forecourt === "Paved"} onChange={() => setInfra(i => ({ ...i, forecourt: "Paved" }))} />
            Paved
          </label>
          <label>
            <input type="radio" checked={infra.forecourt === "Unpaved"} onChange={() => setInfra(i => ({ ...i, forecourt: "Unpaved" }))} />
            Unpaved
          </label>
          <input className="border p-2 rounded" placeholder="Others (specify)" value={infra.forecourtOther}
            onChange={e => setInfra(i => ({ ...i, forecourtOther: e.target.value }))}
          />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of washrooms" value={infra.washroomNum} onChange={e => setInfra(i => ({ ...i, washroomNum: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Condition of washroom(s)" value={infra.washroomCond} onChange={e => setInfra(i => ({ ...i, washroomCond: e.target.value }))} />
        <div className="flex gap-8 mb-2">
          <label>
            <input type="radio" checked={infra.forecourtDivided === "Yes"} onChange={() => setInfra(i => ({ ...i, forecourtDivided: "Yes" }))} />
            Forecourt divided into restricted/public
          </label>
          <label>
            <input type="radio" checked={infra.forecourtDivided === "No"} onChange={() => setInfra(i => ({ ...i, forecourtDivided: "No" }))} />
            Not divided
          </label>
        </div>
        <div className="flex gap-8 mb-2">
          <label>
            <input type="radio" checked={infra.procedures === "Yes"} onChange={() => setInfra(i => ({ ...i, procedures: "Yes" }))} />
            Emergency procedures displayed
          </label>
          <label>
            <input type="radio" checked={infra.procedures === "No"} onChange={() => setInfra(i => ({ ...i, procedures: "No" }))} />
            Not displayed
          </label>
        </div>
        <div className="flex gap-8 mb-2">
          <label>
            <input type="radio" checked={infra.fenced === "Yes"} onChange={() => setInfra(i => ({ ...i, fenced: "Yes" }))} />
            Facility fenced
          </label>
          <label>
            <input type="radio" checked={infra.fenced === "No"} onChange={() => setInfra(i => ({ ...i, fenced: "No" }))} />
            Not fenced
          </label>
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Comments and Observations" value={infra.comments} onChange={e => setInfra(i => ({ ...i, comments: e.target.value }))} />
      </section>

      {/* 5.0 MANAGEMENT OF IMPACTS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">5.0 MANAGEMENT OF IMPACTS</h2>
        <div className="font-medium mb-2">Traffic Management</div>
        <div>Access to facility: Entry and Exit:</div>
        <YesNoRadio value={traffic.access} onChange={v => setTraffic(t => ({ ...t, access: v }))} name="trafficAccess" />
        <input className="border p-2 rounded w-full mb-2" placeholder="Parking spaces (capacity)" value={traffic.parking} onChange={e => setTraffic(t => ({ ...t, parking: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of accidents in the last year" value={traffic.accident} onChange={e => setTraffic(t => ({ ...t, accident: e.target.value }))} />

        <div className="font-medium mt-4 mb-2">Occupational Health and Safety</div>
        <div>Have attendants received training in environment, health and safety?</div>
        <YesNoRadio value={ohs.training} onChange={v => setOHS(o => ({ ...o, training: v }))} name="ohsTraining" />
        <div>First aid kit</div>
        <YesNoRadio value={ohs.firstAid} onChange={v => setOHS(o => ({ ...o, firstAid: v }))} name="ohsFirstAid" />
        <div>An assembly point for emergency?</div>
        <YesNoRadio value={ohs.assembly} onChange={v => setOHS(o => ({ ...o, assembly: v }))} name="ohsAssembly" />
        <input className="border p-2 rounded w-full mb-2" placeholder="Protective Clothing (List)" value={ohs.ppeList} onChange={e => setOHS(o => ({ ...o, ppeList: e.target.value }))} />

        <div className="font-medium mt-4 mb-2">Fire Fighting Equipment</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {Object.entries(fire).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={val} onChange={() => setFire(f => ({ ...f, [key]: !f[key] }))} />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (m) => m.toUpperCase())}
            </label>
          ))}
        </div>

        <div className="font-medium mt-4 mb-2">Emergency Response Measures</div>
        <div>Procedures for handling gas leaks and explosions?</div>
        <YesNoRadio value={emergency.leakProc} onChange={v => setEmergency(e => ({ ...e, leakProc: v }))} name="leakProc" />
        <div>Emergency response plan</div>
        <YesNoRadio value={emergency.erPlan} onChange={v => setEmergency(e => ({ ...e, erPlan: v }))} name="erPlan" />

        <div className="font-medium mt-4 mb-2">Training</div>
        <div>Has staff received training in fire fighting?</div>
        <YesNoRadio value={emergency.fireTraining} onChange={v => setEmergency(e => ({ ...e, fireTraining: v }))} name="fireTraining" />
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of fire drills in a year" value={emergency.fireDrills} onChange={e => setEmergency(emg => ({ ...emg, fireDrills: e.target.value }))} />
        <div>Has staff received training in gas leak management?</div>
        <YesNoRadio value={emergency.leakTraining} onChange={v => setEmergency(e => ({ ...e, leakTraining: v }))} name="leakTraining" />
        <div>Have attendants received training in safe product handling?</div>
        <YesNoRadio value={emergency.safeProd} onChange={v => setEmergency(e => ({ ...e, safeProd: v }))} name="safeProd" />
      </section>

      {/* 6.0 ENVIRONMENTAL MONITORING */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">6.0 ENVIRONMENTAL MONITORING</h2>
        <div className="font-medium mb-2">Record Keeping (Inspect records on the following):</div>
        {[
          ["Gas Leaks and explosion", "gasLeaks"],
          ["Disposal of solid waste", "solidWaste"],
          ["Accidents", "accidents"]
        ].map(([label, key]) => (
          <div key={key} className="mb-2">
            <div>{label}</div>
            <YesNoRadio value={records[key]} onChange={v => setRecords(r => ({ ...r, [key]: v }))} name={`records-${key}`} />
          </div>
        ))}
        <div className="font-medium mt-2 mb-2">Investigation Reports</div>
        <div>Accidents (fire, leaks, etc) reports</div>
        <YesNoRadio value={records.accReports} onChange={v => setRecords(r => ({ ...r, accReports: v }))} name="accReports" />
        <div>Non-destructive tests report</div>
        <YesNoRadio value={records.ndtReports} onChange={v => setRecords(r => ({ ...r, ndtReports: v }))} name="ndtReports" />
      </section>

      {/* 7.0 NEIGHBOURHOOD CONSULTATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">7.0 NEIGHBOURHOOD CONSULTATION</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Concerns of Immediate Neighbours" value={neighbour} onChange={e => setNeighbour(e.target.value)} />
      </section>

      {/* 8.0 GENERAL COMMENTS AND RECOMMENDATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">8.0 GENERAL COMMENTS AND RECOMMENDATION</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Comments and Recommendations" value={comments} onChange={e => setComments(e.target.value)} />
      </section>

      {/* 9.0 ANY SPECIAL CONDITIONS FOR CERTIFICATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">9.0 ANY SPECIAL CONDITIONS FOR CERTIFICATION</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Special Conditions" value={special} onChange={e => setSpecial(e.target.value)} />
      </section>

      {/* 10.0 Names and Signatures */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Names and Signature of Officers</h2>
        {officers.map((o, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mb-2">
            <input className="border p-2 rounded" placeholder="Name & Signature"
              value={o.name} onChange={e => setOfficers(of => of.map((oo, j) => j === i ? { ...oo, name: e.target.value } : oo))} />
            <input className="border p-2 rounded" type="date" placeholder="Date"
              value={o.date} onChange={e => setOfficers(of => of.map((oo, j) => j === i ? { ...oo, date: e.target.value } : oo))} />
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

export default AER2LPGSiteVerificationChecklist;
