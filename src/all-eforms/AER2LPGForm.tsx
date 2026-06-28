import React, { useState } from "react";

const YesNoRadio = ({ value, onChange, name }: { value: string, onChange: (v: string) => void, name: string }) => (
  <div className="flex gap-6">
    <label className="flex items-center gap-1">
      <input type="radio" name={name} checked={value === "Yes"} onChange={() => onChange("Yes")} />
      Yes
    </label>
    <label className="flex items-center gap-1">
      <input type="radio" name={name} checked={value === "No"} onChange={() => onChange("No")} />
      No
    </label>
  </div>
);

const AER2LPGForm = () => {
  // 1. COMPANY PROFILE
  const [company, setCompany] = useState({
    name: "",
    parent: "",
    year: "",
    contact: "",
    position: "",
    address: "",
    tel: "",
    fax: "",
    email: "",
    ehs: "",
  });
  const [permits, setPermits] = useState({
    envPermit: false,
    constrPermit: false,
    envCert: false,
    opLicense: false,
    firePermit: false,
    devPermit: false,
    fireCert: false,
    bldPermit: false,
    nonDestructive: false,
    fidCert: false,
    insurance: false,
    gsbCert: false,
  });

  // 2. SITE DESCRIPTION
  const [site, setSite] = useState({
    location: "",
    geo: "",
    zoning: "",
    dist: "",
    adjLand: "",
  });

  // 3. SERVICES
  const [services, setServices] = useState({
    lpgRefill: false,
    autoGas: false,
    saleCylinders: false,
    saleBottles: false,
    offices: false,
    others: "",
  });

  const [storage, setStorage] = useState({
    numTanks: "",
    capTanks: "",
    instYr: "",
    replYr: "",
    workers: "",
  });

  // 3.4 Safety Accessories
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
    extinguishers: false,
  });

  // 4. INFRASTRUCTURE AND UTILITIES
  const [infra, setInfra] = useState({
    east: "",
    west: "",
    north: "",
    south: "",
    waterGWCL: false,
    waterTanker: false,
    waterBorehole: false,
    waterReservoir: false,
    waterOther: "",
    powerECG: false,
    powerGen: false,
    powerOther: "",
    drainage: "",
    forecourt: "",
    washroomNum: "",
    washroomFreq: "",
    forecourtRestrict: "",
    procedures: "",
    fenced: "",
  });

  // 5. POTENTIAL ENVIRONMENTAL IMPACTS
  const blankImpactRows = (n: number) => Array.from({ length: n }, () => ({ sources: "", impacts: "" }));
  const [voc, setVOC] = useState(blankImpactRows(3));
  const [effluent, setEffluent] = useState(blankImpactRows(3));
  const [solid, setSolid] = useState(blankImpactRows(4));
  const [fire, setFire] = useState(blankImpactRows(5));
  const [noise, setNoise] = useState(blankImpactRows(2));
  const [traffic, setTraffic] = useState(blankImpactRows(2));
  const [ohs, setOHS] = useState(blankImpactRows(7));

  // 6. MANAGEMENT OF IMPACTS
  const [mgmt, setMgmt] = useState({
    voc: "",
    effluent: "",
    solid: "",
    fireEquip: {
      smoke: false,
      alarm: false,
      hydrants: false,
      hose: false,
      signs: false,
      extinguishers: false,
    },
    noise: "",
    trafficAccess: "",
    parking: "",
    accidents: "",
    ohs: blankImpactRows(7).map(() => ({ impacts: "", mgmt: "" })),
  });

  // 7. EMERGENCY RESPONSE MEASURES
  const [emergency, setEmergency] = useState({
    dry: "",
    co2: "",
    foam: "",
    hydrant: "",
    sand: "",
    lastInsp: "",
    recharge: "",
    rechargeComp: "",
    fireTraining: "",
    fireDrills: "",
    gasFireProc: "",
    leakExplosionProc: "",
    erPlan: "",
    attachErPlan: false,
    safeProduct: "",
    ehsTraining: "",
    ehsFreq: "",
    ehsOrg: "",
    defDriving: "",
    defDrivingWhen: "",
    discharge: "",
    dischargeWhen: "",
    dischargeOrg: "",
    awareAccident: "",
    awareBreakdown: "",
  });

  // 8. ENVIRONMENTAL MONITORING
  const [monitor, setMonitor] = useState({
    forecourt: "",
    forecourtAttach: false,
    leaks: "",
    solidWaste: "",
    accidents: "",
    investigation: "",
    investigationCount: "",
    nonDestructive: "",
    lastTest: "",
  });

  // 9. Complaints
  const [complaint, setComplaint] = useState({
    received: "",
    count: "",
    nature: "",
    action: "",
  });

  // 10. Challenges
  const [challenges, setChallenges] = useState("");
  // 11. Environmental enhancement
  const [enhance, setEnhance] = useState("");

  // Declaration
  const [declarant, setDeclarant] = useState({
    name: "",
    signature: "",
    date: "",
  });
  const [attachments, setAttachments] = useState({
    fireCert: false,
    insurance: false,
    ndt: false,
    npa: false,
    permits: false,
    photos: false,
    epa: false,
  });

  // Table Component
  function ImpactTable({ rows, setRows, label1, label2 }: any) {
    return (
      <table className="min-w-full border bg-white mb-2">
        <thead>
          <tr>
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">{label1}</th>
            <th className="border px-2 py-1">{label2}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, i: number) => (
            <tr key={i}>
              <td className="border px-2">{i + 1}</td>
              <td className="border px-2">
                <input className="w-full p-1 border rounded" value={row.sources}
                  onChange={e => {
                    const copy = [...rows];
                    copy[i].sources = e.target.value;
                    setRows(copy);
                  }}
                />
              </td>
              <td className="border px-2">
                <input className="w-full p-1 border rounded" value={row.impacts}
                  onChange={e => {
                    const copy = [...rows];
                    copy[i].impacts = e.target.value;
                    setRows(copy);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-2xl mb-12 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        FORM AER2 <br /> LPG Re-Filling Plant – Annual Environmental Report
      </h1>

      {/* 1.0 COMPANY PROFILE */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1.0 COMPANY PROFILE</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Name of LPG Re-filling Plant"
          value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Parent Oil Marketing Company"
          value={company.parent} onChange={e => setCompany({ ...company, parent: e.target.value })} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Year of establishment"
          value={company.year} onChange={e => setCompany({ ...company, year: e.target.value })} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Contact Person"
            value={company.contact} onChange={e => setCompany({ ...company, contact: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Position"
            value={company.position} onChange={e => setCompany({ ...company, position: e.target.value })} />
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Address"
          value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} />
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Tel"
            value={company.tel} onChange={e => setCompany({ ...company, tel: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Fax"
            value={company.fax} onChange={e => setCompany({ ...company, fax: e.target.value })} />
          <input className="border p-2 rounded" placeholder="E-mail"
            value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} />
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Company Policy on EHS"
          value={company.ehs} onChange={e => setCompany({ ...company, ehs: e.target.value })} />

        <div className="font-medium mt-4 mb-1">Permits/Licences and Certificates</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          {Object.keys(permits).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={permits[key as keyof typeof permits]} onChange={() => setPermits(p => ({ ...p, [key]: !p[key as keyof typeof permits] }))} />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, m => m.toUpperCase())}
            </label>
          ))}
        </div>
      </section>

      {/* 2.0 SITE DESCRIPTION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">2.0 SITE DESCRIPTION</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Location (Major Landmarks)" value={site.location} onChange={e => setSite(s => ({ ...s, location: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Geographical Coordinates" value={site.geo} onChange={e => setSite(s => ({ ...s, geo: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Current Zoning" value={site.zoning} onChange={e => setSite(s => ({ ...s, zoning: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Approx. distance to nearest facility" value={site.dist} onChange={e => setSite(s => ({ ...s, dist: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Adjacent land uses" value={site.adjLand} onChange={e => setSite(s => ({ ...s, adjLand: e.target.value }))} />
      </section>

      {/* 3.0 SERVICES PROVIDED */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">3.0 SERVICES PROVIDED & STORAGE</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Number of Tanks" value={storage.numTanks} onChange={e => setStorage(s => ({ ...s, numTanks: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Capacity of Tanks" value={storage.capTanks} onChange={e => setStorage(s => ({ ...s, capTanks: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Year of Installation" value={storage.instYr} onChange={e => setStorage(s => ({ ...s, instYr: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Year of Replacement" value={storage.replYr} onChange={e => setStorage(s => ({ ...s, replYr: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of Workers" value={storage.workers} onChange={e => setStorage(s => ({ ...s, workers: e.target.value }))} />

        <div className="font-medium mt-2 mb-1">Safety Accessories</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {Object.keys(safety).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={safety[key as keyof typeof safety]} onChange={() => setSafety(sec => ({ ...sec, [key]: !sec[key as keyof typeof safety] }))} />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, m => m.toUpperCase())}
            </label>
          ))}
        </div>
      </section>

      {/* 4.0 INFRASTRUCTURE & UTILITIES */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">4.0 INFRASTRUCTURE & UTILITIES</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="East" value={infra.east} onChange={e => setInfra(i => ({ ...i, east: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="West" value={infra.west} onChange={e => setInfra(i => ({ ...i, west: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="North" value={infra.north} onChange={e => setInfra(i => ({ ...i, north: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="South" value={infra.south} onChange={e => setInfra(i => ({ ...i, south: e.target.value }))} />
        </div>
        <div className="font-medium mt-2 mb-1">Water (Sources, availability and storage)</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.waterGWCL} onChange={() => setInfra(i => ({ ...i, waterGWCL: !i.waterGWCL }))} />
            GWCL
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.waterTanker} onChange={() => setInfra(i => ({ ...i, waterTanker: !i.waterTanker }))} />
            Water Tanker
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.waterBorehole} onChange={() => setInfra(i => ({ ...i, waterBorehole: !i.waterBorehole }))} />
            Well/Borehole
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.waterReservoir} onChange={() => setInfra(i => ({ ...i, waterReservoir: !i.waterReservoir }))} />
            Overhead Reservoir
          </label>
          <input className="border p-2 rounded" placeholder="Others (specify)" value={infra.waterOther} onChange={e => setInfra(i => ({ ...i, waterOther: e.target.value }))} />
        </div>
        <div className="font-medium mt-2 mb-1">Power (Source)</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.powerECG} onChange={() => setInfra(i => ({ ...i, powerECG: !i.powerECG }))} />
            ECG
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.powerGen} onChange={() => setInfra(i => ({ ...i, powerGen: !i.powerGen }))} />
            Stand-by Generator
          </label>
          <input className="border p-2 rounded" placeholder="Others (specify)" value={infra.powerOther} onChange={e => setInfra(i => ({ ...i, powerOther: e.target.value }))} />
        </div>
        <div className="font-medium mt-2 mb-1">Forecourt Facilities</div>
        <div className="mb-2">
          <div>Do you have Site Drainage system?</div>
          <YesNoRadio value={infra.drainage} onChange={v => setInfra(i => ({ ...i, drainage: v }))} name="drainage" />
          <div>Forecourt Condition</div>
          <YesNoRadio value={infra.forecourt} onChange={v => setInfra(i => ({ ...i, forecourt: v }))} name="forecourt" />
          <input className="border p-2 rounded w-full my-1" placeholder="How many washrooms?" value={infra.washroomNum} onChange={e => setInfra(i => ({ ...i, washroomNum: e.target.value }))} />
          <input className="border p-2 rounded w-full my-1" placeholder="How often do you clean the washrooms?" value={infra.washroomFreq} onChange={e => setInfra(i => ({ ...i, washroomFreq: e.target.value }))} />
          <div>Is your forecourt divided into restricted and public areas?</div>
          <YesNoRadio value={infra.forecourtRestrict} onChange={v => setInfra(i => ({ ...i, forecourtRestrict: v }))} name="forecourtRestrict" />
          <div>Have you displayed emergency procedures?</div>
          <YesNoRadio value={infra.procedures} onChange={v => setInfra(i => ({ ...i, procedures: v }))} name="procedures" />
          <div>Have you fenced your facility?</div>
          <YesNoRadio value={infra.fenced} onChange={v => setInfra(i => ({ ...i, fenced: v }))} name="fenced" />
        </div>
      </section>

      {/* 5.0 POTENTIAL ENVIRONMENTAL IMPACTS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">5.0 POTENTIAL ENVIRONMENTAL IMPACTS</h2>
        <div className="mb-3">
          <div className="font-medium">VOCs Emissions</div>
          <ImpactTable rows={voc} setRows={setVOC} label1="Sources" label2="Impacts" />
          <div className="font-medium">Effluent/Liquid Waste</div>
          <ImpactTable rows={effluent} setRows={setEffluent} label1="Sources" label2="Impacts" />
          <div className="font-medium">Solid Waste/Sludge</div>
          <ImpactTable rows={solid} setRows={setSolid} label1="Sources" label2="Impacts" />
          <div className="font-medium">Fire</div>
          <ImpactTable rows={fire} setRows={setFire} label1="Sources" label2="Impacts" />
          <div className="font-medium">Noise</div>
          <ImpactTable rows={noise} setRows={setNoise} label1="Sources" label2="Impacts" />
          <div className="font-medium">Traffic</div>
          <ImpactTable rows={traffic} setRows={setTraffic} label1="Sources" label2="Impacts" />
          <div className="font-medium">Occupational Health & Safety</div>
          <ImpactTable rows={ohs} setRows={setOHS} label1="Sources" label2="Impacts" />
        </div>
      </section>

      {/* 6.0 MANAGEMENT OF IMPACTS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">6.0 MANAGEMENT OF IMPACTS</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="VOCs Emissions into the atmosphere"
          value={mgmt.voc} onChange={e => setMgmt(m => ({ ...m, voc: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Effluent/Liquid Waste"
          value={mgmt.effluent} onChange={e => setMgmt(m => ({ ...m, effluent: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Solid Waste/Sludge"
          value={mgmt.solid} onChange={e => setMgmt(m => ({ ...m, solid: e.target.value }))} />
        <div className="font-medium mt-2 mb-1">Fire Fighting Equipment</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {Object.keys(mgmt.fireEquip).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={mgmt.fireEquip[key as keyof typeof mgmt.fireEquip]} onChange={() => setMgmt(m => ({ ...m, fireEquip: { ...m.fireEquip, [key]: !m.fireEquip[key as keyof typeof mgmt.fireEquip] } }))} />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, m => m.toUpperCase())}
            </label>
          ))}
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Noise"
          value={mgmt.noise} onChange={e => setMgmt(m => ({ ...m, noise: e.target.value }))} />
        <div className="font-medium mt-2 mb-1">Traffic Management</div>
        <div>Access to facility: Entry and Exit:</div>
        <YesNoRadio value={mgmt.trafficAccess} onChange={v => setMgmt(m => ({ ...m, trafficAccess: v }))} name="trafficAccess" />
        <input className="border p-2 rounded w-full mb-2" placeholder="Parking spaces (capacity)" value={mgmt.parking} onChange={e => setMgmt(m => ({ ...m, parking: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of accidents in last year" value={mgmt.accidents} onChange={e => setMgmt(m => ({ ...m, accidents: e.target.value }))} />
        <div className="font-medium mt-2 mb-1">Occupational Health and Safety</div>
        <ImpactTable rows={mgmt.ohs} setRows={v => setMgmt(m => ({ ...m, ohs: v }))} label1="Impacts" label2="Management" />
      </section>

      {/* 7.0 EMERGENCY RESPONSE MEASURES */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">7.0 EMERGENCY RESPONSE MEASURES</h2>
        {/* 7.1 Fire Extinguishers */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {["Dry chemicals", "CO2", "Foam", "Hydrant", "Sand"].map((label, i) => (
            <label key={label} className="flex items-center gap-2">
              <input type="checkbox" checked={emergency[["dry","co2","foam","hydrant","sand"][i] as keyof typeof emergency] === "Yes"} onChange={() => setEmergency(e => ({ ...e, [["dry","co2","foam","hydrant","sand"][i] as keyof typeof emergency]: e[["dry","co2","foam","hydrant","sand"][i] as keyof typeof emergency] === "Yes" ? "No" : "Yes" }))} />
              {label}
            </label>
          ))}
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Last Inspection Date" value={emergency.lastInsp} onChange={e => setEmergency(emg => ({ ...emg, lastInsp: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Date extinguisher recharged" value={emergency.recharge} onChange={e => setEmergency(emg => ({ ...emg, recharge: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Recharge company name" value={emergency.rechargeComp} onChange={e => setEmergency(emg => ({ ...emg, rechargeComp: e.target.value }))} />
        {/* 7.2 Fire Fighting */}
        <div>Have staffs received training in fire fighting?</div>
        <YesNoRadio value={emergency.fireTraining} onChange={v => setEmergency(e => ({ ...e, fireTraining: v }))} name="fireTraining" />
        <input className="border p-2 rounded w-full mb-2" placeholder="How many fire drills in a year?" value={emergency.fireDrills} onChange={e => setEmergency(emg => ({ ...emg, fireDrills: e.target.value }))} />
        <div>Do you have company procedures for handling LPG fires?</div>
        <YesNoRadio value={emergency.gasFireProc} onChange={v => setEmergency(e => ({ ...e, gasFireProc: v }))} name="gasFireProc" />
        {/* 7.3 Responding to Gas Leaks & Explosions */}
        <div>Procedures for leaks & explosions?</div>
        <YesNoRadio value={emergency.leakExplosionProc} onChange={v => setEmergency(e => ({ ...e, leakExplosionProc: v }))} name="leakExplosionProc" />
        <div>Emergency response plan for fire, explosion, spills?</div>
        <YesNoRadio value={emergency.erPlan} onChange={v => setEmergency(e => ({ ...e, erPlan: v }))} name="erPlan" />
        {/* 7.4 Education and Training */}
        <div>Attendants received training in safe product handling?</div>
        <YesNoRadio value={emergency.safeProduct} onChange={v => setEmergency(e => ({ ...e, safeProduct: v }))} name="safeProduct" />
        <div>Attendants received training in EHS?</div>
        <YesNoRadio value={emergency.ehsTraining} onChange={v => setEmergency(e => ({ ...e, ehsTraining: v }))} name="ehsTraining" />
        <input className="border p-2 rounded w-full mb-2" placeholder="EHS Training Frequency" value={emergency.ehsFreq} onChange={e => setEmergency(emg => ({ ...emg, ehsFreq: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Who organized?" value={emergency.ehsOrg} onChange={e => setEmergency(emg => ({ ...emg, ehsOrg: e.target.value }))} />
        <div>Drivers received training in defensive driving?</div>
        <YesNoRadio value={emergency.defDriving} onChange={v => setEmergency(e => ({ ...e, defDriving: v }))} name="defDriving" />
        <input className="border p-2 rounded w-full mb-2" placeholder="If yes, when?" value={emergency.defDrivingWhen} onChange={e => setEmergency(emg => ({ ...emg, defDrivingWhen: e.target.value }))} />
        <div>Drivers received training in safe product discharge?</div>
        <YesNoRadio value={emergency.discharge} onChange={v => setEmergency(e => ({ ...e, discharge: v }))} name="discharge" />
        <input className="border p-2 rounded w-full mb-2" placeholder="If yes, when?" value={emergency.dischargeWhen} onChange={e => setEmergency(emg => ({ ...emg, dischargeWhen: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Who organized?" value={emergency.dischargeOrg} onChange={e => setEmergency(emg => ({ ...emg, dischargeOrg: e.target.value }))} />
        <div>Drivers aware of company procedures for accident?</div>
        <YesNoRadio value={emergency.awareAccident} onChange={v => setEmergency(e => ({ ...e, awareAccident: v }))} name="awareAccident" />
        <div>Drivers aware of procedures for breakdown?</div>
        <YesNoRadio value={emergency.awareBreakdown} onChange={v => setEmergency(e => ({ ...e, awareBreakdown: v }))} name="awareBreakdown" />
      </section>

      {/* 8.0 ENVIRONMENTAL MONITORING */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">8.0 ENVIRONMENTAL MONITORING</h2>
        <div>Forecourt Monitoring (Regular inspection?)</div>
        <YesNoRadio value={monitor.forecourt} onChange={v => setMonitor(m => ({ ...m, forecourt: v }))} name="forecourt" />
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={monitor.forecourtAttach} onChange={() => setMonitor(m => ({ ...m, forecourtAttach: !m.forecourtAttach }))} />
          Attach copy of inspection report
        </div>
        <div>Do you keep records of:</div>
        {["Leaks", "Disposal of solid waste", "Accidents"].map((label, i) => (
          <div key={label} className="flex items-center gap-3 mb-1">
            <span>{label}:</span>
            <YesNoRadio value={monitor[["leaks", "solidWaste", "accidents"][i] as keyof typeof monitor] as any} onChange={v => setMonitor(m => ({ ...m, [["leaks", "solidWaste", "accidents"][i] as keyof typeof monitor]: v }))} name={label} />
          </div>
        ))}
        <div>Do you carry out investigation of leaks and accidents?</div>
        <YesNoRadio value={monitor.investigation} onChange={v => setMonitor(m => ({ ...m, investigation: v }))} name="investigation" />
        <input className="border p-2 rounded w-full mb-2" placeholder="How many in last year?" value={monitor.investigationCount} onChange={e => setMonitor(m => ({ ...m, investigationCount: e.target.value }))} />
        <div>Do you conduct non-destructive tests of your tanks?</div>
        <YesNoRadio value={monitor.nonDestructive} onChange={v => setMonitor(m => ({ ...m, nonDestructive: v }))} name="nonDestructive" />
        <input className="border p-2 rounded w-full mb-2" placeholder="If yes, when?" value={monitor.lastTest} onChange={e => setMonitor(m => ({ ...m, lastTest: e.target.value }))} />
      </section>

      {/* 9.0 COMPLAINTS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">9.0 COMPLAINTS</h2>
        <div>Complaints from neighbours in last year?</div>
        <YesNoRadio value={complaint.received} onChange={v => setComplaint(c => ({ ...c, received: v }))} name="complaintReceived" />
        <input className="border p-2 rounded w-full mb-2" placeholder="How many?" value={complaint.count} onChange={e => setComplaint(c => ({ ...c, count: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Nature of complaints" value={complaint.nature} onChange={e => setComplaint(c => ({ ...c, nature: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="How did you deal with complaints?" value={complaint.action} onChange={e => setComplaint(c => ({ ...c, action: e.target.value }))} />
      </section>

      {/* 10.0 CHALLENGES/CONCERNS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">10.0 CHALLENGES/CONCERNS</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="List major challenges you face in your operations" value={challenges} onChange={e => setChallenges(e.target.value)} />
      </section>

      {/* 11.0 ENHANCEMENT MEASURES */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">11.0 ENVIRONMENTAL ENHANCEMENT MEASURES</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="List environmental enhancement measures for the ensuing year" value={enhance} onChange={e => setEnhance(e.target.value)} />
      </section>

      {/* DECLARATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Declaration</h2>
        <div className="mb-2 text-gray-800">
          I <input className="border p-2 rounded mx-2" placeholder="Declarant Name" value={declarant.name} onChange={e => setDeclarant(d => ({ ...d, name: e.target.value }))} />
          hereby declare that the information provided on this form is true to the best of my knowledge and shall provide any additional information that shall come to my notice in the course of processing this application.
        </div>
        <div className="flex gap-6 mb-2">
          <input className="border p-2 rounded" placeholder="Signature" value={declarant.signature} onChange={e => setDeclarant(d => ({ ...d, signature: e.target.value }))} />
          <input className="border p-2 rounded" type="date" value={declarant.date} onChange={e => setDeclarant(d => ({ ...d, date: e.target.value }))} />
        </div>
      </section>

      {/* ATTACHMENTS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Attachments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries({
            fireCert: "Fire Certificate",
            insurance: "Valid Insurance Cover",
            ndt: "Non-Destructive Test Report",
            npa: "NPA Operation License",
            permits: "Development and Building Permits",
            photos: "Photographs of Re-filling Plant",
            epa: "EPA’s Environmental Permit"
          }).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={attachments[key as keyof typeof attachments]} onChange={() => setAttachments(a => ({ ...a, [key]: !a[key as keyof typeof attachments] }))} />
              {label}
            </label>
          ))}
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

export default AER2LPGForm;
