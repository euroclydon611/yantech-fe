import React, { useState } from "react";

// Yes/No toggle helper
const YesNo = ({ value, onChange, label }: { value: boolean | null, onChange: (val: boolean) => void, label: string }) => (
  <div className="flex items-center gap-4 my-2">
    <span className="font-medium min-w-[150px]">{label}</span>
    <button
      type="button"
      className={`px-4 py-1 rounded-l border ${value === true ? "bg-green-600 text-white" : "bg-gray-100"}`}
      onClick={() => onChange(true)}
    >Yes</button>
    <button
      type="button"
      className={`px-4 py-1 rounded-r border ${value === false ? "bg-red-600 text-white" : "bg-gray-100"}`}
      onClick={() => onChange(false)}
    >No</button>
  </div>
);

const MultiCheck = ({ options, selected, onChange, label }: { options: string[], selected: string[], onChange: (arr: string[]) => void, label: string }) => (
  <div className="mb-3">
    <span className="block font-medium mb-1">{label}</span>
    <div className="flex flex-wrap gap-4">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => {
              onChange(
                selected.includes(opt)
                  ? selected.filter(o => o !== opt)
                  : [...selected, opt]
              );
            }}
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const DynamicTable = ({ columns, rows, setRows, addRowLabel = "Add Row" }: {
  columns: { name: string, label: string }[],
  rows: any[],
  setRows: (rows: any[]) => void,
  addRowLabel?: string
}) => (
  <div className="mb-6 overflow-x-auto">
    <table className="min-w-full bg-white border mb-2">
      <thead>
        <tr>
          {columns.map(col => <th key={col.name} className="py-2 px-3 border-b">{col.label}</th>)}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td key={col.name} className="py-1 px-2 border-b">
                <input
                  type="text"
                  className="border rounded p-1 w-full"
                  value={row[col.name] || ''}
                  onChange={e => {
                    const copy = [...rows];
                    copy[idx][col.name] = e.target.value;
                    setRows(copy);
                  }}
                />
              </td>
            ))}
            <td>
              <button type="button" className="text-red-500" onClick={() => setRows(rows.filter((_, i) => i !== idx))}>Remove</button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={columns.length + 1}>
            <button type="button" className="text-blue-600" onClick={() => setRows([...rows, {}])}>{addRowLabel}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const AERHospitalityForm = () => {
  // 1.0 Company Profile
  const [profile, setProfile] = useState({
    name: "", managementCompany: "", year: "", location: "",
    contactPerson: "", position: "", address: "", tel: "", fax: "", email: "",
    permits: {
      epaPermit: false, epaCert: false, touristLicense: false, firePermit: false, fireCert: false, devPermit: false, buildPermit: false,
    },
    workForce: { management: "", senior: "", junior: "", casual: "", temp: "" },
  });
  // 2.0 Site Description
  const [site, setSite] = useState({
    location: "", geo: "", zoning: "", dist: "", adjacent: "", waterbody: ""
  });
  // 3.0 Nature of Undertaking
  const [undertaking, setUndertaking] = useState({
    type: [] as string[],
    star: [] as string[],
    eco: [] as string[],
    accommodationRooms: "",
    conferenceHalls: "",
    conferenceCapacity: "",
    restaurantNo: "",
    restaurantCapacity: "",
    others: [] as string[],
  });
  // 4.0 Infrastructure & Utilities
  const [structures, setStructures] = useState({
    east: "", west: "", north: "", south: ""
  });
  const [water, setWater] = useState({
    sources: [] as string[], otherSource: "", availability: "", storageTank: "", storageCapacity: "", monthlyQty: ""
  });
  const [power, setPower] = useState({
    sources: [] as string[], otherSource: "", consumption: ""
  });
  const [drainage, setDrainage] = useState({
    plan: null as boolean | null, facility: ""
  });
  const [traffic, setTraffic] = useState({
    road: "", parking: ""
  });
  // 5.0 Potential Environmental Impacts
  const [impactSources, setImpactSources] = useState([
    { no: "1", source: "Solid", impact: "" },
    { no: "2", source: "Liquid/Effluent", impact: "" },
    { no: "3", source: "Gaseous", impact: "" },
    { no: "4", source: "Odour", impact: "" },
    { no: "5", source: "Fire", impact: "" },
  ]);
  const [receivingEnv, setReceivingEnv] = useState([
    { env: "Vegetation", yes: false, no: false, remarks: "" },
    { env: "Soil/Land", yes: false, no: false, remarks: "" },
    { env: "Surface water", yes: false, no: false, remarks: "" },
    { env: "Air", yes: false, no: false, remarks: "" },
  ]);
  // 6.0 Management of Significant Environmental Impacts
  const [manageImpacts, setManageImpacts] = useState([
    { impact: "Odour from waste Treatment Facility", adequate: false, inadequate: false, remarks: "" },
    { impact: "Odour from Sewerage Systems", adequate: false, inadequate: false, remarks: "" },
    { impact: "Pantry Services", adequate: false, inadequate: false, remarks: "" },
    { impact: "Runoff/rainwater", adequate: false, inadequate: false, remarks: "" },
    { impact: "Wastewater from Landry, washroom and sewage", adequate: false, inadequate: false, remarks: "" },
    { impact: "Kitchen", adequate: false, inadequate: false, remarks: "" },
    { impact: "Dining room", adequate: false, inadequate: false, remarks: "" },
    { impact: "Washroom", adequate: false, inadequate: false, remarks: "" },
    { impact: "Others", adequate: false, inadequate: false, remarks: "" },
  ]);
  const [manageHazards, setManageHazards] = useState([
    { impact: "Fire", adequate: false, inadequate: false, remarks: "" },
    { impact: "Accident", adequate: false, inadequate: false, remarks: "" },
    { impact: "Others", adequate: false, inadequate: false, remarks: "" },
  ]);
  // 7.0 Emergency Response
  const [fire, setFire] = useState({ staffTrained: null as boolean | null, firePlan: null as boolean | null, exits: null as boolean | null, assembly: null as boolean | null });
  const [training, setTraining] = useState({ trained: null as boolean | null, when: "" });
  // 8.0 Environmental Monitoring
  const [monitoring, setMonitoring] = useState({
    air: null as boolean | null,
    discharge: null as boolean | null,
    noise: null as boolean | null,
    accidents: null as boolean | null,
    waste: null as boolean | null,
    guests: null as boolean | null,
  });
  // 9-10 General comments
  const [comments, setComments] = useState({ general: "", special: "" });
  // Signature
  const [officers, setOfficers] = useState([{ name: "", date: "" }, { name: "", date: "" }, { name: "", date: "" }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (implement logic as needed)");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-10">
      <h1 className="text-2xl font-bold text-center mb-6">Annual Environmental Report – Hospitality Industry</h1>

      {/* 1.0 Company Profile */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">1.0 Company Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="1.1 Name of Hospitality Industry" value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })} />
          <input className="border p-2 rounded" placeholder="1.2 Facility Management Company" value={profile.managementCompany}
            onChange={e => setProfile({ ...profile, managementCompany: e.target.value })} />
          <input className="border p-2 rounded" placeholder="1.3 Year of Establishment" value={profile.year}
            onChange={e => setProfile({ ...profile, year: e.target.value })} />
          <input className="border p-2 rounded" placeholder="1.4 Location" value={profile.location}
            onChange={e => setProfile({ ...profile, location: e.target.value })} />
          <input className="border p-2 rounded" placeholder="1.5 Contact Person" value={profile.contactPerson}
            onChange={e => setProfile({ ...profile, contactPerson: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Position" value={profile.position}
            onChange={e => setProfile({ ...profile, position: e.target.value })} />
          <textarea className="border p-2 rounded col-span-2" rows={2} placeholder="1.6 Address" value={profile.address}
            onChange={e => setProfile({ ...profile, address: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Tel" value={profile.tel}
            onChange={e => setProfile({ ...profile, tel: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Fax" value={profile.fax}
            onChange={e => setProfile({ ...profile, fax: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Email" value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })} />
        </div>
        <div className="mt-3">
          <span className="block font-medium mb-1">1.7 Permits/Licenses and Certificates</span>
          <div className="flex flex-wrap gap-6">
            {[
              ["epaPermit", "Environmental Permit"],
              ["epaCert", "Environmental Certificate"],
              ["touristLicense", "Tourist Board License"],
              ["firePermit", "Fire Permit"],
              ["fireCert", "Fire Certificate"],
              ["devPermit", "Development Permit"],
              ["buildPermit", "Building Permit"]
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.permits[key as keyof typeof profile.permits]}
                  onChange={e => setProfile({
                    ...profile,
                    permits: { ...profile.permits, [key]: e.target.checked }
                  })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
          {[
            ["management", "Management Staff"],
            ["senior", "Senior Staff"],
            ["junior", "Junior Staff"],
            ["casual", "Casuals"],
            ["temp", "Temporary"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block font-medium">{label}</label>
              <input className="border p-2 rounded w-full" value={profile.workForce[key as keyof typeof profile.workForce]}
                onChange={e => setProfile({ ...profile, workForce: { ...profile.workForce, [key]: e.target.value } })} />
            </div>
          ))}
        </div>
      </section>

      {/* 2.0 SITE DESCRIPTION */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">2.0 Site Description</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="2.1 Location (landmarks)" value={site.location}
          onChange={e => setSite({ ...site, location: e.target.value })} />
        <input className="border p-2 rounded w-full mb-2" placeholder="2.2 Geographical Coordinates" value={site.geo}
          onChange={e => setSite({ ...site, geo: e.target.value })} />
        <input className="border p-2 rounded w-full mb-2" placeholder="2.3 Current Zoning" value={site.zoning}
          onChange={e => setSite({ ...site, zoning: e.target.value })} />
        <input className="border p-2 rounded w-full mb-2" placeholder="2.4 Approximate distance to nearest facility" value={site.dist}
          onChange={e => setSite({ ...site, dist: e.target.value })} />
        <input className="border p-2 rounded w-full mb-2" placeholder="2.5 Adjacent Land Uses" value={site.adjacent}
          onChange={e => setSite({ ...site, adjacent: e.target.value })} />
        <input className="border p-2 rounded w-full mb-2" placeholder="2.6 Nearness to a water body" value={site.waterbody}
          onChange={e => setSite({ ...site, waterbody: e.target.value })} />
      </section>

      {/* 3.0 Nature of Undertaking */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">3.0 Nature of Undertaking</h2>
        <MultiCheck
          label="3.1 Title of Undertaking"
          options={["Hotel", "Guest House", "Hostels", "Social Centre", "Restaurant", "Nite Club/Pub", "Rest Stop", "Others"]}
          selected={undertaking.type}
          onChange={arr => setUndertaking({ ...undertaking, type: arr })}
        />
        <MultiCheck
          label="3.2 Star Ratings"
          options={["Five Star (5)", "Four (4) Stars", "Three (3) Star", "Two (2) Star", "One (1) Star", "Budget"]}
          selected={undertaking.star}
          onChange={arr => setUndertaking({ ...undertaking, star: arr })}
        />
        <MultiCheck
          label="3.3 Eco-Tourism Facilities"
          options={["Water Falls", "Game Reserves", "National Parks", "Botanical Gardens", "Para Gliding", "Beaches", "Heritage/Archaeological Sites"]}
          selected={undertaking.eco}
          onChange={arr => setUndertaking({ ...undertaking, eco: arr })}
        />
        <div className="mt-2 mb-2">
          <label className="block font-medium mb-1">3.4.1 Accommodation - Number of Rooms</label>
          <input className="border p-2 rounded w-full" value={undertaking.accommodationRooms}
            onChange={e => setUndertaking({ ...undertaking, accommodationRooms: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block font-medium mb-1">3.4.2 Conference - Number of Hall(s)</label>
            <input className="border p-2 rounded w-full" value={undertaking.conferenceHalls}
              onChange={e => setUndertaking({ ...undertaking, conferenceHalls: e.target.value })} />
          </div>
          <div>
            <label className="block font-medium mb-1">Seating Capacity</label>
            <input className="border p-2 rounded w-full" value={undertaking.conferenceCapacity}
              onChange={e => setUndertaking({ ...undertaking, conferenceCapacity: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block font-medium mb-1">3.4.3 Restaurant(s) - Number</label>
            <input className="border p-2 rounded w-full" value={undertaking.restaurantNo}
              onChange={e => setUndertaking({ ...undertaking, restaurantNo: e.target.value })} />
          </div>
          <div>
            <label className="block font-medium mb-1">Seating Capacity</label>
            <input className="border p-2 rounded w-full" value={undertaking.restaurantCapacity}
              onChange={e => setUndertaking({ ...undertaking, restaurantCapacity: e.target.value })} />
          </div>
        </div>
        <MultiCheck
          label="3.4.4 Others"
          options={["Swimming Pool", "Fitness Centre", "Cruising", "Casino", "Shops", "Saloon"]}
          selected={undertaking.others}
          onChange={arr => setUndertaking({ ...undertaking, others: arr })}
        />
      </section>

      {/* 4.0 INFRASTRUCTURE AND UTILITIES */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">4.0 Infrastructure and Utilities</h2>
        <div className="mb-3">
          <span className="block font-medium mb-1">4.1 Structures (buildings & facilities in area)</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["east", "west", "north", "south"].map(d => (
              <input key={d} className="border p-2 rounded w-full" placeholder={`To the ${d.charAt(0).toUpperCase() + d.slice(1)}`} value={structures[d as keyof typeof structures]}
                onChange={e => setStructures({ ...structures, [d]: e.target.value })} />
            ))}
          </div>
        </div>
        <div className="mb-3">
          <span className="block font-medium mb-1">4.2 Water (Source, Availability/Storage)</span>
          <MultiCheck
            label="Source"
            options={["GWCL", "Tanker Services", "Well", "Others"]}
            selected={water.sources}
            onChange={arr => setWater({ ...water, sources: arr })}
          />
          {water.sources.includes("Others") && (
            <input className="border p-2 rounded mb-2" placeholder="Specify other water source"
              value={water.otherSource}
              onChange={e => setWater({ ...water, otherSource: e.target.value })} />
          )}
          <MultiCheck
            label="Availability"
            options={["Reliable", "Seasonal", "Scarce"]}
            selected={[water.availability].filter(Boolean)}
            onChange={arr => setWater({ ...water, availability: arr[0] })}
          />
          <MultiCheck
            label="Storage Tank"
            options={["Yes", "No"]}
            selected={[water.storageTank].filter(Boolean)}
            onChange={arr => setWater({ ...water, storageTank: arr[0] })}
          />
          {water.storageTank === "Yes" && (
            <input className="border p-2 rounded mb-2" placeholder="Specify tank capacity"
              value={water.storageCapacity}
              onChange={e => setWater({ ...water, storageCapacity: e.target.value })} />
          )}
          <input className="border p-2 rounded w-full mb-2" placeholder="Approx. quantity of Water Consumed/Month"
            value={water.monthlyQty}
            onChange={e => setWater({ ...water, monthlyQty: e.target.value })} />
        </div>
        <div className="mb-3">
          <span className="block font-medium mb-1">4.3 Power (type, source, consumption)</span>
          <MultiCheck
            label="Source"
            options={["ECG", "Standby Generator", "Others"]}
            selected={power.sources}
            onChange={arr => setPower({ ...power, sources: arr })}
          />
          {power.sources.includes("Others") && (
            <input className="border p-2 rounded mb-2" placeholder="Specify other power source"
              value={power.otherSource}
              onChange={e => setPower({ ...power, otherSource: e.target.value })} />
          )}
          <input className="border p-2 rounded w-full mb-2" placeholder="Consumption details"
            value={power.consumption}
            onChange={e => setPower({ ...power, consumption: e.target.value })} />
        </div>
        <div className="mb-3">
          <YesNo
            label="4.4 Site Drainage Plan?"
            value={drainage.plan}
            onChange={val => setDrainage({ ...drainage, plan: val })}
          />
          <input className="border p-2 rounded w-full mb-2" placeholder="Type of sewage treatment facility"
            value={drainage.facility}
            onChange={e => setDrainage({ ...drainage, facility: e.target.value })} />
        </div>
        <div className="mb-3">
          <span className="block font-medium mb-1">4.5 Traffic Management</span>
          <MultiCheck
            label="Access Road"
            options={["Paved", "Unpaved"]}
            selected={[traffic.road].filter(Boolean)}
            onChange={arr => setTraffic({ ...traffic, road: arr[0] })}
          />
          <input className="border p-2 rounded w-full" placeholder="Parking lot (capacity)"
            value={traffic.parking}
            onChange={e => setTraffic({ ...traffic, parking: e.target.value })} />
        </div>
      </section>

      {/* 5.0 Potential Environmental Impacts */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">5.0 Potential Environmental Impacts</h2>
        <DynamicTable
          columns={[
            { name: "no", label: "No" },
            { name: "source", label: "Sources" },
            { name: "impact", label: "Impacts" }
          ]}
          rows={impactSources}
          setRows={setImpactSources}
        />
        <div>
          <span className="block font-medium mb-1">5.2 Receiving Environment</span>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-3 border-b">Environment</th>
                <th className="py-2 px-3 border-b">Yes</th>
                <th className="py-2 px-3 border-b">No</th>
                <th className="py-2 px-3 border-b">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {receivingEnv.map((row, i) => (
                <tr key={row.env}>
                  <td className="border-b px-2">{row.env}</td>
                  <td className="border-b px-2 text-center">
                    <input type="checkbox" checked={row.yes} onChange={() => {
                      const copy = [...receivingEnv];
                      copy[i].yes = !copy[i].yes; copy[i].no = false; setReceivingEnv(copy);
                    }} />
                  </td>
                  <td className="border-b px-2 text-center">
                    <input type="checkbox" checked={row.no} onChange={() => {
                      const copy = [...receivingEnv];
                      copy[i].no = !copy[i].no; copy[i].yes = false; setReceivingEnv(copy);
                    }} />
                  </td>
                  <td className="border-b px-2">
                    <input type="text" className="border rounded p-1 w-full"
                      value={row.remarks}
                      onChange={e => {
                        const copy = [...receivingEnv];
                        copy[i].remarks = e.target.value;
                        setReceivingEnv(copy);
                      }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6.0 Management of Significant Environmental Impacts */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">6.0 Management of Significant Environmental Impacts</h2>
        <div className="mb-4">
          <span className="block font-medium mb-1">6.1 Management of impacts</span>
          <table className="min-w-full bg-white border mb-2">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Impacts</th>
                <th className="border-b py-1 px-2">Adequate</th>
                <th className="border-b py-1 px-2">Inadequate</th>
                <th className="border-b py-1 px-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {manageImpacts.map((row, idx) => (
                <tr key={row.impact}>
                  <td className="border-b px-2">{row.impact}</td>
                  <td className="border-b px-2 text-center">
                    <input type="checkbox" checked={row.adequate} onChange={() => {
                      const copy = [...manageImpacts]; copy[idx].adequate = !copy[idx].adequate; copy[idx].inadequate = false; setManageImpacts(copy);
                    }} />
                  </td>
                  <td className="border-b px-2 text-center">
                    <input type="checkbox" checked={row.inadequate} onChange={() => {
                      const copy = [...manageImpacts]; copy[idx].inadequate = !copy[idx].inadequate; copy[idx].adequate = false; setManageImpacts(copy);
                    }} />
                  </td>
                  <td className="border-b px-2">
                    <input type="text" className="border rounded p-1 w-full"
                      value={row.remarks}
                      onChange={e => {
                        const copy = [...manageImpacts];
                        copy[idx].remarks = e.target.value;
                        setManageImpacts(copy);
                      }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <span className="block font-medium mb-1">6.2 Management of Occupational Hazards and Safety</span>
          <table className="min-w-full bg-white border mb-2">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Impacts</th>
                <th className="border-b py-1 px-2">Adequate</th>
                <th className="border-b py-1 px-2">Inadequate</th>
                <th className="border-b py-1 px-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {manageHazards.map((row, idx) => (
                <tr key={row.impact}>
                  <td className="border-b px-2">{row.impact}</td>
                  <td className="border-b px-2 text-center">
                    <input type="checkbox" checked={row.adequate} onChange={() => {
                      const copy = [...manageHazards]; copy[idx].adequate = !copy[idx].adequate; copy[idx].inadequate = false; setManageHazards(copy);
                    }} />
                  </td>
                  <td className="border-b px-2 text-center">
                    <input type="checkbox" checked={row.inadequate} onChange={() => {
                      const copy = [...manageHazards]; copy[idx].inadequate = !copy[idx].inadequate; copy[idx].adequate = false; setManageHazards(copy);
                    }} />
                  </td>
                  <td className="border-b px-2">
                    <input type="text" className="border rounded p-1 w-full"
                      value={row.remarks}
                      onChange={e => {
                        const copy = [...manageHazards];
                        copy[idx].remarks = e.target.value;
                        setManageHazards(copy);
                      }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7.0 EMERGENCY RESPONSE PLAN */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">7.0 Emergency Response Plan</h2>
        <YesNo label="7.1 Staff trained in fire fighting" value={fire.staffTrained} onChange={v => setFire({ ...fire, staffTrained: v })} />
        <YesNo label="Emergency response plan for fire outbreak?" value={fire.firePlan} onChange={v => setFire({ ...fire, firePlan: v })} />
        <YesNo label="Emergency exit points?" value={fire.exits} onChange={v => setFire({ ...fire, exits: v })} />
        <YesNo label="Assembly point in case of emergency?" value={fire.assembly} onChange={v => setFire({ ...fire, assembly: v })} />
        <YesNo label="7.2 Staff received training in Environment, Health & Safety?" value={training.trained} onChange={v => setTraining({ ...training, trained: v })} />
        {training.trained && (
          <input className="border p-2 rounded w-full mb-2" placeholder="If yes, when?" value={training.when}
            onChange={e => setTraining({ ...training, when: e.target.value })} />
        )}
      </section>

      {/* 8.0 ENVIRONMENTAL MONITORING */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">8.0 Environmental Monitoring</h2>
        <YesNo label="8.1 (a) Compliance with Ambient Air Quality?" value={monitoring.air} onChange={v => setMonitoring({ ...monitoring, air: v })} />
        <YesNo label="8.1 (b) Efficient Discharge?" value={monitoring.discharge} onChange={v => setMonitoring({ ...monitoring, discharge: v })} />
        <YesNo label="8.1 (c) Ambient Noise Level?" value={monitoring.noise} onChange={v => setMonitoring({ ...monitoring, noise: v })} />
        <YesNo label="8.2 Accidents records kept?" value={monitoring.accidents} onChange={v => setMonitoring({ ...monitoring, accidents: v })} />
        <YesNo label="Volume of waste generated records kept?" value={monitoring.waste} onChange={v => setMonitoring({ ...monitoring, waste: v })} />
        <YesNo label="Number of guests per annum records kept?" value={monitoring.guests} onChange={v => setMonitoring({ ...monitoring, guests: v })} />
      </section>

      {/* 9.0 General Comments & Recommendations */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">9.0 General Comments & Recommendations</h2>
        <textarea className="border p-2 rounded w-full" rows={4}
          value={comments.general}
          onChange={e => setComments({ ...comments, general: e.target.value })} />
      </section>
      {/* 10.0 Special Conditions */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">10.0 Any Special Conditions for Certification</h2>
        <textarea className="border p-2 rounded w-full" rows={3}
          value={comments.special}
          onChange={e => setComments({ ...comments, special: e.target.value })} />
      </section>
      {/* Name/Signature/Date */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">Name and Signature of Officers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {officers.map((off, idx) => (
            <div key={idx}>
              <input className="border p-2 rounded w-full mb-1" placeholder="Name" value={off.name}
                onChange={e => {
                  const copy = [...officers]; copy[idx].name = e.target.value; setOfficers(copy);
                }} />
              <input className="border p-2 rounded w-full" type="date" placeholder="Date" value={off.date}
                onChange={e => {
                  const copy = [...officers]; copy[idx].date = e.target.value; setOfficers(copy);
                }} />
            </div>
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

export default AERHospitalityForm;
