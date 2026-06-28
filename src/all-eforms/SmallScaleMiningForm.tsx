import React, { useState } from "react";

const SmallScaleMiningForm = () => {
  const [applicant, setApplicant] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    nationality: "",
    idNumber: "",
    idType: "",
  });

  const [company, setCompany] = useState({
    name: "",
    registrationNumber: "",
    tin: "",
    address: "",
    phone: "",
    email: "",
    principalOfficers: "",
  });

  const [site, setSite] = useState({
    district: "",
    region: "",
    gpsCoordinates: "",
    areaSize: "",
    landStatus: "",
    nearestTown: "",
    landOwner: "",
    consentStatus: "",
    mapFile: null as File | null,
  });

  const [miningDetails, setMiningDetails] = useState({
    mineralType: "",
    miningMethod: "",
    expectedProduction: "",
    processingMethod: "",
    equipment: "",
    waterSource: "",
    wasteDisposal: "",
  });

  const [environmental, setEnvironmental] = useState({
    eiaStatus: "",
    reclamationPlan: "",
    communityConsultation: "",
    environmentalPermit: "",
  });

  const [declaration, setDeclaration] = useState({
    name: "",
    position: "",
    signature: "",
    date: "",
  });

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSite((s) => ({ ...s, mapFile: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl mb-12 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        Small Scale Mining Application Form
      </h1>

      {/* 1. Applicant Details */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">1. Applicant Details</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Full Name" value={applicant.fullName}
            onChange={e => setApplicant(a => ({ ...a, fullName: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Nationality" value={applicant.nationality}
            onChange={e => setApplicant(a => ({ ...a, nationality: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Phone" value={applicant.phone}
            onChange={e => setApplicant(a => ({ ...a, phone: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Email" value={applicant.email}
            onChange={e => setApplicant(a => ({ ...a, email: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Postal Address" value={applicant.address}
          onChange={e => setApplicant(a => ({ ...a, address: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="ID Number" value={applicant.idNumber}
            onChange={e => setApplicant(a => ({ ...a, idNumber: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="ID Type (e.g. Voter, Passport, Driver’s License)" value={applicant.idType}
            onChange={e => setApplicant(a => ({ ...a, idType: e.target.value }))} />
        </div>
      </section>

      {/* 2. Company/Group Details */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">2. Company/Group Details</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Company/Group Name" value={company.name}
          onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Registration Number" value={company.registrationNumber}
            onChange={e => setCompany(c => ({ ...c, registrationNumber: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="TIN" value={company.tin}
            onChange={e => setCompany(c => ({ ...c, tin: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Address" value={company.address}
          onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Phone" value={company.phone}
            onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Email" value={company.email}
            onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} />
        </div>
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Principal Officers/Members (Names & Positions)"
          value={company.principalOfficers}
          onChange={e => setCompany(c => ({ ...c, principalOfficers: e.target.value }))} />
      </section>

      {/* 3. Site Details */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">3. Mining Site Details</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="District" value={site.district}
            onChange={e => setSite(s => ({ ...s, district: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Region" value={site.region}
            onChange={e => setSite(s => ({ ...s, region: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="GPS Coordinates" value={site.gpsCoordinates}
          onChange={e => setSite(s => ({ ...s, gpsCoordinates: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Site Area Size (in Hectares/Acres)" value={site.areaSize}
          onChange={e => setSite(s => ({ ...s, areaSize: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Land Status (e.g. Stool/Family/State Land)" value={site.landStatus}
          onChange={e => setSite(s => ({ ...s, landStatus: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Nearest Town/Community" value={site.nearestTown}
          onChange={e => setSite(s => ({ ...s, nearestTown: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Landowner’s Name & Consent Status" value={site.landOwner}
          onChange={e => setSite(s => ({ ...s, landOwner: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Attach Site Plan/Map" type="file"
          onChange={handleFileChange} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Consent/Status of Land (Attach Agreement if any)" value={site.consentStatus}
          onChange={e => setSite(s => ({ ...s, consentStatus: e.target.value }))} />
      </section>

      {/* 4. Mining Details */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">4. Mining Details</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="Type of Mineral to Mine" value={miningDetails.mineralType}
          onChange={e => setMiningDetails(m => ({ ...m, mineralType: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Proposed Mining Method (e.g. Alluvial, Hard Rock)" value={miningDetails.miningMethod}
          onChange={e => setMiningDetails(m => ({ ...m, miningMethod: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Expected Production/Output per Month" value={miningDetails.expectedProduction}
          onChange={e => setMiningDetails(m => ({ ...m, expectedProduction: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Ore Processing Method" value={miningDetails.processingMethod}
          onChange={e => setMiningDetails(m => ({ ...m, processingMethod: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Equipment to be Used (list major items)"
          value={miningDetails.equipment}
          onChange={e => setMiningDetails(m => ({ ...m, equipment: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Water Source (for Mining Operations)" value={miningDetails.waterSource}
          onChange={e => setMiningDetails(m => ({ ...m, waterSource: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Waste Disposal Methods (e.g. Tailings, Waste Rock)"
          value={miningDetails.wasteDisposal}
          onChange={e => setMiningDetails(m => ({ ...m, wasteDisposal: e.target.value }))} />
      </section>

      {/* 5. Environmental Details */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">5. Environmental Management</h2>
        <input className="border p-2 rounded w-full mb-2" placeholder="EIA/EMP Status (e.g. Prepared, Approved)" value={environmental.eiaStatus}
          onChange={e => setEnvironmental(env => ({ ...env, eiaStatus: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Site Reclamation/Restoration Plan"
          value={environmental.reclamationPlan}
          onChange={e => setEnvironmental(env => ({ ...env, reclamationPlan: e.target.value }))} />
        <textarea className="border p-2 rounded w-full mb-2" placeholder="Community Consultation/Engagement Conducted"
          value={environmental.communityConsultation}
          onChange={e => setEnvironmental(env => ({ ...env, communityConsultation: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" placeholder="Environmental Permit (attach copy if available)" value={environmental.environmentalPermit}
          onChange={e => setEnvironmental(env => ({ ...env, environmentalPermit: e.target.value }))} />
      </section>

      {/* 6. Declaration */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">6. Declaration</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 rounded" placeholder="Name" value={declaration.name}
            onChange={e => setDeclaration(d => ({ ...d, name: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="Position" value={declaration.position}
            onChange={e => setDeclaration(d => ({ ...d, position: e.target.value }))} />
        </div>
        <input className="border p-2 rounded w-full mb-2" placeholder="Signature" value={declaration.signature}
          onChange={e => setDeclaration(d => ({ ...d, signature: e.target.value }))} />
        <input className="border p-2 rounded w-full mb-2" type="date" placeholder="Date" value={declaration.date}
          onChange={e => setDeclaration(d => ({ ...d, date: e.target.value }))} />
        <div className="text-xs text-gray-500 mt-2">
          I declare that the information provided is true and complete to the best of my knowledge.
        </div>
      </section>

      <div className="mt-8 text-center">
        <button
          type="submit"
          className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
};

export default SmallScaleMiningForm;
