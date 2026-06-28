import React, { useState } from "react";

const YesNoCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
);

const HealthcareSiteVerificationForm = () => {
  const [profile, setProfile] = useState({
    facilityName: "",
    company: "",
    year: "",
    permitDate: "",
    contact: "",
    position: "",
    address: "",
    tel: "",
    fax: "",
    email: "",
    locationTown: "",
    locationDistrict: "",
    locationRegion: "",
    landTake: "",
    east: "",
    west: "",
    north: "",
    south: "",
  });

  const [permits, setPermits] = useState({
    envPermit: false,
    healthService: false,
    envCert: false,
    buildingPermit: false,
    fireCert: false,
  });

  const [nature, setNature] = useState({
    hospital: false,
    clinic: false,
    maternity: false,
    healthPost: false,
    diagnostic: false,
    veterinary: false,
    funeral: false,
    lab: false,
    traditional: false,
    others: "",
  });

  const [services, setServices] = useState({
    pharmacy: false,
    radiotherapy: false,
    cardio: false,
    theatre: false,
    laboratory: false,
    incinerators: false,
    fitness: false,
    eye: false,
    xray: false,
    wards: false,
    mortuary: false,
    opd: false,
    others: "",
  });

  const [beds, setBeds] = useState("");
  const [parking, setParking] = useState("");
  const [waste, setWaste] = useState({
    liquid: "",
    solid: "",
    hazardous: "",
    incinerator: "",
  });

  const [attachments, setAttachments] = useState({
    envPermit: false,
    healthLicense: false,
    sitePlan: false,
    photos: false,
  });

  const [officers, setOfficers] = useState([
    { name: "", signature: "", date: "" },
    { name: "", signature: "", date: "" },
    { name: "", signature: "", date: "" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl mb-12 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        Healthcare Facility - Site Verification
      </h1>
      <p className="mb-4 text-center text-gray-700">
        This form is for official use only and must be completed by at least two (2) officers of the Agency during compliance and enforcement exercise.
      </p>

      {/* 1.0 COMPANY PROFILE */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1.0 COMPANY PROFILE</h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Name of Healthcare Facility"
          value={profile.facilityName}
          onChange={e => setProfile(p => ({ ...p, facilityName: e.target.value }))}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Facility Management Company"
          value={profile.company}
          onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Year of Establishment"
            value={profile.year}
            onChange={e => setProfile(p => ({ ...p, year: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Date of First Permit"
            value={profile.permitDate}
            onChange={e => setProfile(p => ({ ...p, permitDate: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Contact Person"
            value={profile.contact}
            onChange={e => setProfile(p => ({ ...p, contact: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Position"
            value={profile.position}
            onChange={e => setProfile(p => ({ ...p, position: e.target.value }))}
          />
        </div>
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Address"
          value={profile.address}
          onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
        />
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Tel"
            value={profile.tel}
            onChange={e => setProfile(p => ({ ...p, tel: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Fax"
            value={profile.fax}
            onChange={e => setProfile(p => ({ ...p, fax: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="E-mail"
            value={profile.email}
            onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div className="font-medium mb-1 mt-3">Location of Facility</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Town"
            value={profile.locationTown}
            onChange={e => setProfile(p => ({ ...p, locationTown: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="District"
            value={profile.locationDistrict}
            onChange={e => setProfile(p => ({ ...p, locationDistrict: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Region"
            value={profile.locationRegion}
            onChange={e => setProfile(p => ({ ...p, locationRegion: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Land take"
            value={profile.landTake}
            onChange={e => setProfile(p => ({ ...p, landTake: e.target.value }))}
          />
        </div>

        <div className="font-medium mb-1 mt-3">Site Description</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="To the East"
            value={profile.east}
            onChange={e => setProfile(p => ({ ...p, east: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="To the West"
            value={profile.west}
            onChange={e => setProfile(p => ({ ...p, west: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="To the North"
            value={profile.north}
            onChange={e => setProfile(p => ({ ...p, north: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="To the South"
            value={profile.south}
            onChange={e => setProfile(p => ({ ...p, south: e.target.value }))}
          />
        </div>

        <div className="font-medium mb-1 mt-3">Permits/Licenses and Certificates</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <YesNoCheckbox checked={permits.envPermit} onChange={() => setPermits(p => ({ ...p, envPermit: !p.envPermit }))} label="Environmental Permit" />
          <YesNoCheckbox checked={permits.healthService} onChange={() => setPermits(p => ({ ...p, healthService: !p.healthService }))} label="Health Service License" />
          <YesNoCheckbox checked={permits.envCert} onChange={() => setPermits(p => ({ ...p, envCert: !p.envCert }))} label="Environmental Certificate" />
          <YesNoCheckbox checked={permits.buildingPermit} onChange={() => setPermits(p => ({ ...p, buildingPermit: !p.buildingPermit }))} label="Building/Development Permit" />
          <YesNoCheckbox checked={permits.fireCert} onChange={() => setPermits(p => ({ ...p, fireCert: !p.fireCert }))} label="Fire Permit/Certificate" />
        </div>
      </section>

      {/* 1.8 Nature of Undertaking */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Nature of Undertaking</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <YesNoCheckbox checked={nature.hospital} onChange={() => setNature(n => ({ ...n, hospital: !n.hospital }))} label="Hospital" />
          <YesNoCheckbox checked={nature.clinic} onChange={() => setNature(n => ({ ...n, clinic: !n.clinic }))} label="Clinic" />
          <YesNoCheckbox checked={nature.maternity} onChange={() => setNature(n => ({ ...n, maternity: !n.maternity }))} label="Maternity Home" />
          <YesNoCheckbox checked={nature.healthPost} onChange={() => setNature(n => ({ ...n, healthPost: !n.healthPost }))} label="Health-Post" />
          <YesNoCheckbox checked={nature.diagnostic} onChange={() => setNature(n => ({ ...n, diagnostic: !n.diagnostic }))} label="Diagnostic Centre" />
          <YesNoCheckbox checked={nature.veterinary} onChange={() => setNature(n => ({ ...n, veterinary: !n.veterinary }))} label="Veterinary" />
          <YesNoCheckbox checked={nature.funeral} onChange={() => setNature(n => ({ ...n, funeral: !n.funeral }))} label="Funeral Homes/Mortuary" />
          <YesNoCheckbox checked={nature.lab} onChange={() => setNature(n => ({ ...n, lab: !n.lab }))} label="Medical Laboratory" />
          <YesNoCheckbox checked={nature.traditional} onChange={() => setNature(n => ({ ...n, traditional: !n.traditional }))} label="Traditional Health Care" />
        </div>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Others (specify)"
          value={nature.others}
          onChange={e => setNature(n => ({ ...n, others: e.target.value }))}
        />
      </section>

      {/* 1.9 Services Provided and Facilities */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Services Provided and Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <YesNoCheckbox checked={services.pharmacy} onChange={() => setServices(s => ({ ...s, pharmacy: !s.pharmacy }))} label="Pharmacy" />
          <YesNoCheckbox checked={services.radiotherapy} onChange={() => setServices(s => ({ ...s, radiotherapy: !s.radiotherapy }))} label="Radiotherapy" />
          <YesNoCheckbox checked={services.cardio} onChange={() => setServices(s => ({ ...s, cardio: !s.cardio }))} label="Cardio Centre" />
          <YesNoCheckbox checked={services.theatre} onChange={() => setServices(s => ({ ...s, theatre: !s.theatre }))} label="Theatre(s)" />
          <YesNoCheckbox checked={services.laboratory} onChange={() => setServices(s => ({ ...s, laboratory: !s.laboratory }))} label="Laboratory" />
          <YesNoCheckbox checked={services.incinerators} onChange={() => setServices(s => ({ ...s, incinerators: !s.incinerators }))} label="Incinerators" />
          <YesNoCheckbox checked={services.fitness} onChange={() => setServices(s => ({ ...s, fitness: !s.fitness }))} label="Fitness Centre" />
          <YesNoCheckbox checked={services.eye} onChange={() => setServices(s => ({ ...s, eye: !s.eye }))} label="Eye Centre" />
          <YesNoCheckbox checked={services.xray} onChange={() => setServices(s => ({ ...s, xray: !s.xray }))} label="X-ray" />
          <YesNoCheckbox checked={services.wards} onChange={() => setServices(s => ({ ...s, wards: !s.wards }))} label="Wards" />
          <YesNoCheckbox checked={services.mortuary} onChange={() => setServices(s => ({ ...s, mortuary: !s.mortuary }))} label="Mortuary" />
          <YesNoCheckbox checked={services.opd} onChange={() => setServices(s => ({ ...s, opd: !s.opd }))} label="Out Patient Department (OPD)" />
        </div>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Others (specify)"
          value={services.others}
          onChange={e => setServices(s => ({ ...s, others: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Number of Beds"
            value={beds}
            onChange={e => setBeds(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Number of Parking Lots"
            value={parking}
            onChange={e => setParking(e.target.value)}
          />
        </div>
      </section>

      {/* 1.11 Waste Management */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Waste Management</h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Liquid Waste"
          value={waste.liquid}
          onChange={e => setWaste(w => ({ ...w, liquid: e.target.value }))}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Solid Waste"
          value={waste.solid}
          onChange={e => setWaste(w => ({ ...w, solid: e.target.value }))}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Hazardous/Biomedical Waste"
          value={waste.hazardous}
          onChange={e => setWaste(w => ({ ...w, hazardous: e.target.value }))}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Management of Incinerator (If Any)"
          value={waste.incinerator}
          onChange={e => setWaste(w => ({ ...w, incinerator: e.target.value }))}
        />
      </section>

      {/* Attachments */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Attachments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <YesNoCheckbox checked={attachments.envPermit} onChange={() => setAttachments(a => ({ ...a, envPermit: !a.envPermit }))} label="Environmental Permit" />
          <YesNoCheckbox checked={attachments.healthLicense} onChange={() => setAttachments(a => ({ ...a, healthLicense: !a.healthLicense }))} label="Health Service License" />
          <YesNoCheckbox checked={attachments.sitePlan} onChange={() => setAttachments(a => ({ ...a, sitePlan: !a.sitePlan }))} label="Site Plan / Block Plan" />
          <YesNoCheckbox checked={attachments.photos} onChange={() => setAttachments(a => ({ ...a, photos: !a.photos }))} label="Pictures of the facility" />
        </div>
      </section>

      {/* Declaration */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">Declaration</h2>
        <div className="text-gray-700 mb-2">
          We the undersigned, hereby declare that the information provided on this form is true and accurate.
        </div>
        {officers.map((off, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input
              className="border p-2 rounded"
              placeholder={`Name (Officer ${i + 1})`}
              value={off.name}
              onChange={e => setOfficers(arr => arr.map((o, idx) => idx === i ? { ...o, name: e.target.value } : o))}
            />
            <input
              className="border p-2 rounded"
              placeholder="Signature"
              value={off.signature}
              onChange={e => setOfficers(arr => arr.map((o, idx) => idx === i ? { ...o, signature: e.target.value } : o))}
            />
            <input
              className="border p-2 rounded"
              type="date"
              placeholder="Date"
              value={off.date}
              onChange={e => setOfficers(arr => arr.map((o, idx) => idx === i ? { ...o, date: e.target.value } : o))}
            />
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

export default HealthcareSiteVerificationForm;
