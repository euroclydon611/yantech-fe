import React, { useState } from "react";

const YesNoRadio = ({ value, onChange, name }: any) => (
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

const AER1ChecklistForm = () => {
  // Section 1: Company Profile
  const [company, setCompany] = useState({
    name: "",
    parent: "",
    year: "",
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
  });

  // Section 2: Site Description
  const [adjChange, setAdjChange] = useState("");
  const [adjCompat, setAdjCompat] = useState("");
  const [zoning, setZoning] = useState("");
  const [dist, setDist] = useState("");
  const [adjLand, setAdjLand] = useState("");
  const [geo, setGeo] = useState("");
  const [water, setWater] = useState("");

  // Section 3: Undertaking
  const [undertaking, setUndertaking] = useState({
    type: "",
    services: {
      dispensing: false,
      restaurant: false,
      lubeBay: false,
      bank: false,
      mart: false,
      lubeShop: false,
      wash: false,
      offices: false,
      others: "",
    },
    tanks: {
      type: "",
      placement: "",
      petrol: { cap: "", instYr: "", replYr: "" },
      diesel: { cap: "", instYr: "", replYr: "" },
      kerosene: { cap: "", instYr: "", replYr: "" },
    },
    workers: "",
  });

  // Section 4: Infrastructure and Utilities
  const [infra, setInfra] = useState({
    water: {
      gwc: false,
      tanker: false,
      borehole: false,
      others: "",
    },
    power: {
      ecg: false,
      gen: false,
      others: "",
    },
    drainage: "",
    forecourt: "",
    forecourtOther: "",
    washroomNum: "",
    washroomCond: "",
    comments: "",
  });

  // Section 5: Management of Impacts
  const [traffic, setTraffic] = useState({ access: "", parking: "", accident: "" });
  const [ohs, setOHS] = useState({
    training: "",
    firstAid: "",
    assembly: "",
    ppe: "",
    ppeList: "",
  });

  // Section 5.3: Emergency Response
  const [emergency, setEmergency] = useState({
    firePlan: "",
    spillKit: "",
    tanksBuried: "",
    fireTraining: "",
    fireDrills: "",
    spillTraining: "",
    safeProd: "",
  });

  // Section 6: Environmental Monitoring
  const [records, setRecords] = useState({
    wasteOil: "",
    spills: "",
    disposalOil: "",
    solidWaste: "",
    accidents: "",
    accReport: "",
    hydReport: "",
  });

  // Section 7: Neighbourhood Consultation
  const [neighbour, setNeighbour] = useState("");

  // Section 8: Comments and Recommendations
  const [comments, setComments] = useState("");

  // Section 9: Special Conditions
  const [special, setSpecial] = useState("");

  // Section 10: Officer Signatures
  const [officers, setOfficers] = useState([
    { name: "", date: "" },
    { name: "", date: "" },
    { name: "", date: "" },
  ]);

  // Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic.)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        FORM AER1: Site Verification Checklist <br />
        Fuel Service & Filling Stations
      </h1>
      <div className="mb-2">
        <label className="font-medium">Date of Inspection</label>
        <input
          type="date"
          className="border rounded p-2 ml-4"
        />
      </div>

      {/* 1.0 COMPANY PROFILE */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1.0 COMPANY PROFILE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Name of Service Station"
            value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Parent Oil Marketing Company"
            value={company.parent} onChange={e => setCompany({ ...company, parent: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Year of Establishment"
            value={company.year} onChange={e => setCompany({ ...company, year: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Location"
            value={company.location} onChange={e => setCompany({ ...company, location: e.target.value })} />
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

        <div className="font-medium mt-3 mb-2">Permits/Licences and Certificates (tick those available):</div>
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
        <div className="mb-2">
          <div>Has there been changes in adjacent land uses?</div>
          <YesNoRadio value={adjChange} onChange={setAdjChange} name="adjChange" />
          {adjChange === "Yes" && (
            <div>
              Are the changes compatible with the facility?
              <YesNoRadio value={adjCompat} onChange={setAdjCompat} name="adjCompat" />
            </div>
          )}
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Current Zoning" value={zoning} onChange={e => setZoning(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Approximate distance to the nearest facility" value={dist} onChange={e => setDist(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Adjacent land uses" value={adjLand} onChange={e => setAdjLand(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Geographical Coordinates (where available)" value={geo} onChange={e => setGeo(e.target.value)} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Nearness to a water body" value={water} onChange={e => setWater(e.target.value)} />
      </section>

      {/* 3.0 TYPE OF UNDERTAKING */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">3.0 TYPE OF UNDERTAKING</h2>
        <div className="flex gap-10 mb-2">
          <label>
            <input type="radio" checked={undertaking.type === "Fuel Filling Station"} onChange={() => setUndertaking(u => ({ ...u, type: "Fuel Filling Station" }))} />
            Fuel Filling Station
          </label>
          <label>
            <input type="radio" checked={undertaking.type === "Fuel Service Station"} onChange={() => setUndertaking(u => ({ ...u, type: "Fuel Service Station" }))} />
            Fuel Service Station
          </label>
        </div>
        <div className="font-medium mt-2 mb-1">Services Provided</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {["dispensing", "restaurant", "lubeBay", "bank", "mart", "lubeShop", "wash", "offices"].map((s) => (
            <label key={s} className="flex gap-1 items-center">
              <input
                type="checkbox"
                checked={undertaking.services[s]}
                onChange={() =>
                  setUndertaking((u) => ({
                    ...u,
                    services: { ...u.services, [s]: !u.services[s] }
                  }))
                }
              />
              {s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
          ))}
          <input className="border p-2 rounded col-span-2" placeholder="Others (specify)"
            value={undertaking.services.others}
            onChange={e => setUndertaking(u => ({ ...u, services: { ...u.services, others: e.target.value } }))}
          />
        </div>
        <div className="font-medium mt-2 mb-1">Storage Tanks</div>
        <div className="flex gap-4 mb-2">
          <label>
            <input type="radio" checked={undertaking.tanks.type === "Steel"} onChange={() => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, type: "Steel" } }))} />
            Steel
          </label>
          <label>
            <input type="radio" checked={undertaking.tanks.type === "Fibreglass-Reinforced Plastics (FRP)"} onChange={() => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, type: "Fibreglass-Reinforced Plastics (FRP)" } }))} />
            FRP
          </label>
        </div>
        <div className="flex gap-4 mb-2">
          <label>
            <input type="radio" checked={undertaking.tanks.placement === "Surface"} onChange={() => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, placement: "Surface" } }))} />
            Surface
          </label>
          <label>
            <input type="radio" checked={undertaking.tanks.placement === "Underground"} onChange={() => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, placement: "Underground" } }))} />
            Underground
          </label>
        </div>
        <div className="font-medium mt-2 mb-1">Installed Capacity of Storage Tanks</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="text-xs block">Petrol</label>
            <input className="border p-2 rounded w-full mb-1" placeholder="Number and Capacity"
              value={undertaking.tanks.petrol.cap}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, petrol: { ...u.tanks.petrol, cap: e.target.value } } }))}
            />
            <input className="border p-2 rounded w-full mb-1" placeholder="Year of Installation"
              value={undertaking.tanks.petrol.instYr}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, petrol: { ...u.tanks.petrol, instYr: e.target.value } } }))}
            />
            <input className="border p-2 rounded w-full" placeholder="Year of Replacement"
              value={undertaking.tanks.petrol.replYr}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, petrol: { ...u.tanks.petrol, replYr: e.target.value } } }))}
            />
          </div>
          <div>
            <label className="text-xs block">Diesel</label>
            <input className="border p-2 rounded w-full mb-1" placeholder="Number and Capacity"
              value={undertaking.tanks.diesel.cap}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, diesel: { ...u.tanks.diesel, cap: e.target.value } } }))}
            />
            <input className="border p-2 rounded w-full mb-1" placeholder="Year of Installation"
              value={undertaking.tanks.diesel.instYr}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, diesel: { ...u.tanks.diesel, instYr: e.target.value } } }))}
            />
            <input className="border p-2 rounded w-full" placeholder="Year of Replacement"
              value={undertaking.tanks.diesel.replYr}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, diesel: { ...u.tanks.diesel, replYr: e.target.value } } }))}
            />
          </div>
          <div>
            <label className="text-xs block">Kerosene</label>
            <input className="border p-2 rounded w-full mb-1" placeholder="Number and Capacity"
              value={undertaking.tanks.kerosene.cap}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, kerosene: { ...u.tanks.kerosene, cap: e.target.value } } }))}
            />
            <input className="border p-2 rounded w-full mb-1" placeholder="Year of Installation"
              value={undertaking.tanks.kerosene.instYr}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, kerosene: { ...u.tanks.kerosene, instYr: e.target.value } } }))}
            />
            <input className="border p-2 rounded w-full" placeholder="Year of Replacement"
              value={undertaking.tanks.kerosene.replYr}
              onChange={e => setUndertaking(u => ({ ...u, tanks: { ...u.tanks, kerosene: { ...u.tanks.kerosene, replYr: e.target.value } } }))}
            />
          </div>
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of Workers"
          value={undertaking.workers} onChange={e => setUndertaking(u => ({ ...u, workers: e.target.value }))} />
      </section>

      {/* 4.0 INFRASTRUCTURE & UTILITIES */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">4.0 INFRASTRUCTURE AND UTILITIES</h2>
        <div className="font-medium mb-1">Water (Sources, availability and storage):</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.water.gwc} onChange={() => setInfra(i => ({ ...i, water: { ...i.water, gwc: !i.water.gwc } }))} />
            GWC
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.water.tanker} onChange={() => setInfra(i => ({ ...i, water: { ...i.water, tanker: !i.water.tanker } }))} />
            Water Tanker Service
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.water.borehole} onChange={() => setInfra(i => ({ ...i, water: { ...i.water, borehole: !i.water.borehole } }))} />
            Well/Borehole
          </label>
          <input className="border p-2 rounded" placeholder="Others (specify)" value={infra.water.others}
            onChange={e => setInfra(i => ({ ...i, water: { ...i.water, others: e.target.value } }))}
          />
        </div>
        <div className="font-medium mb-1 mt-2">Power (Source(s)):</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.power.ecg} onChange={() => setInfra(i => ({ ...i, power: { ...i.power, ecg: !i.power.ecg } }))} />
            ECG
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={infra.power.gen} onChange={() => setInfra(i => ({ ...i, power: { ...i.power, gen: !i.power.gen } }))} />
            Stand-by Generator
          </label>
          <input className="border p-2 rounded" placeholder="Others (specify)" value={infra.power.others}
            onChange={e => setInfra(i => ({ ...i, power: { ...i.power, others: e.target.value } }))}
          />
        </div>
        <div className="font-medium mt-2 mb-1">Forecourt Facilities</div>
        <div className="flex gap-6 mb-2">
          <label>
            <input type="radio" checked={infra.drainage === "Available"} onChange={() => setInfra(i => ({ ...i, drainage: "Available" }))} />
            Site Drainage Available
          </label>
          <label>
            <input type="radio" checked={infra.drainage === "Not-Available"} onChange={() => setInfra(i => ({ ...i, drainage: "Not-Available" }))} />
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
        <input className="border p-2 rounded w-full mb-2" placeholder="Condition of washrooms" value={infra.washroomCond} onChange={e => setInfra(i => ({ ...i, washroomCond: e.target.value }))} />
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
        <div>Have attendant(s) received training in environment, health and safety?</div>
        <YesNoRadio value={ohs.training} onChange={v => setOHS(o => ({ ...o, training: v }))} name="ohsTraining" />
        <div>First aid kit</div>
        <YesNoRadio value={ohs.firstAid} onChange={v => setOHS(o => ({ ...o, firstAid: v }))} name="ohsFirstAid" />
        <div>An assembly point for emergency?</div>
        <YesNoRadio value={ohs.assembly} onChange={v => setOHS(o => ({ ...o, assembly: v }))} name="ohsAssembly" />
        <input className="border p-2 rounded w-full mb-2" placeholder="Protective Clothing (List)" value={ohs.ppeList} onChange={e => setOHS(o => ({ ...o, ppeList: e.target.value }))} />

        <div className="font-medium mt-4 mb-2">Emergency Response Measures</div>
        <div>Emergency response plan for Fire, Oil Spill and Vehicular Accidents</div>
        <YesNoRadio value={emergency.firePlan} onChange={v => setEmergency(e => ({ ...e, firePlan: v }))} name="emgFirePlan" />
        <div>Emergency response spill kit</div>
        <YesNoRadio value={emergency.spillKit} onChange={v => setEmergency(e => ({ ...e, spillKit: v }))} name="emgSpillKit" />
        <div>Are tanks buried in concrete bunkers?</div>
        <YesNoRadio value={emergency.tanksBuried} onChange={v => setEmergency(e => ({ ...e, tanksBuried: v }))} name="emgTanksBuried" />

        <div className="font-medium mt-4 mb-2">Training</div>
        <div>Have staff received training in fire fighting?</div>
        <YesNoRadio value={emergency.fireTraining} onChange={v => setEmergency(e => ({ ...e, fireTraining: v }))} name="emgFireTraining" />
        <input className="border p-2 rounded w-full mb-2" placeholder="Number of fire drills in a year" value={emergency.fireDrills} onChange={e => setEmergency(emg => ({ ...emg, fireDrills: e.target.value }))} />
        <div>Have staff received training in oil spill management?</div>
        <YesNoRadio value={emergency.spillTraining} onChange={v => setEmergency(e => ({ ...e, spillTraining: v }))} name="emgSpillTraining" />
        <div>Have attendants received training in safe product handling?</div>
        <YesNoRadio value={emergency.safeProd} onChange={v => setEmergency(e => ({ ...e, safeProd: v }))} name="emgSafeProd" />
      </section>

      {/* 6.0 ENVIRONMENTAL MONITORING */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">6.0 ENVIRONMENTAL MONITORING</h2>
        <div className="font-medium mb-2">Record Keeping (Inspect records on the following):</div>
        {[
          ["Waste oil and sludge generation", "wasteOil"],
          ["Spills and Leaks", "spills"],
          ["Disposal of waste oil and sludge", "disposalOil"],
          ["Disposal of solid waste", "solidWaste"],
          ["Accidents", "accidents"]
        ].map(([label, key]) => (
          <div key={key} className="mb-2">
            <div>{label}</div>
            <YesNoRadio value={records[key]} onChange={v => setRecords(r => ({ ...r, [key]: v }))} name={`records-${key}`} />
          </div>
        ))}
        <div className="font-medium mt-2 mb-2">Investigation Reports</div>
        <div>Accidents (fire, spillage, leaks, etc) reports</div>
        <YesNoRadio value={records.accReport} onChange={v => setRecords(r => ({ ...r, accReport: v }))} name="accReport" />
        <div>Hydraulic pressure tests Report</div>
        <YesNoRadio value={records.hydReport} onChange={v => setRecords(r => ({ ...r, hydReport: v }))} name="hydReport" />
      </section>

      {/* 7.0 NEIGHBOURHOOD CONSULTATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">7.0 NEIGHBOURHOOD CONSULTATION</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Neighbourhood Consultation" value={neighbour} onChange={e => setNeighbour(e.target.value)} />
      </section>

      {/* 8.0 GENERAL COMMENTS AND RECOMMENDATIONS */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">8.0 GENERAL COMMENTS AND RECOMMENDATIONS</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Comments and Recommendations" value={comments} onChange={e => setComments(e.target.value)} />
      </section>

      {/* 9.0 ANY SPECIAL CONDITIONS FOR CERTIFICATION */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">9.0 ANY SPECIAL CONDITIONS FOR CERTIFICATION</h2>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Special Conditions" value={special} onChange={e => setSpecial(e.target.value)} />
      </section>

      {/* 10.0 Name and Signature of Officers */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Name and Signature of Officers</h2>
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

export default AER1ChecklistForm;
