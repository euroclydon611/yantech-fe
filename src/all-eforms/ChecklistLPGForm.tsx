import React, { useState } from "react";

// Helper radio group
const RadioGroup = ({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="flex gap-6 flex-wrap my-2">
    {options.map((opt) => (
      <label key={opt} className="flex items-center gap-1 font-medium">
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="mr-1"
        />
        {opt}
      </label>
    ))}
  </div>
);

const ChecklistLPGForm = () => {
  // A. Background
  const [background, setBackground] = useState({
    company: "",
    location: "",
    district: "",
    year: "",
    contactPerson: "",
    position: "",
    address: "",
    telephone: "",
    email: "",
  });

  // B. Type of Activity
  const [activity, setActivity] = useState({
    tanks: "",
    capacity: "",
  });

  // C. Status of Environmental Permit
  const [permit, setPermit] = useState({
    status: "",
    dateOfIssue: "",
    permitNumber: "",
    purpose: "",
    validity: "",
    validityReason: "",
  });

  // D. Status of Operation
  const [operationStatus, setOperationStatus] = useState("");

  // E. Compliance to Conditions of Permit
  const [fireMgmt, setFireMgmt] = useState("");
  const [fireExtinguishers, setFireExtinguishers] = useState("");
  const [sandBuckets, setSandBuckets] = useState("");
  const [warningSigns, setWarningSigns] = useState("");
  const [pressureGauge, setPressureGauge] = useState("");
  const [temperatureGauge, setTemperatureGauge] = useState("");
  const [waterSprinkler, setWaterSprinkler] = useState("");
  const [ladder, setLadder] = useState("");
  const [fireTraining, setFireTraining] = useState("");

  const [trafficEntrance, setTrafficEntrance] = useState("");
  const [trafficParking, setTrafficParking] = useState("");

  const [wasteSolid, setWasteSolid] = useState("");
  const [wasteLiquid, setWasteLiquid] = useState("");
  const [wasteMgmt, setWasteMgmt] = useState("");
  const [wasteBins, setWasteBins] = useState("");
  const [washrooms, setWashrooms] = useState("");
  const [complianceComment, setComplianceComment] = useState("");

  // F. Assessment of Emergency Response Facilities
  const [fireFacilities, setFireFacilities] = useState("");
  const [spillFacilities, setSpillFacilities] = useState("");

  // G. Submission of Annual Report
  const [annualReport, setAnnualReport] = useState("");

  // H. Weighted Compliance Level
  const [complianceLevel, setComplianceLevel] = useState("");

  // I. Observations
  const [observations, setObservations] = useState("");

  // Assessor details
  const [assessors, setAssessors] = useState([
    { name: "", date: "", signature: "" },
    { name: "", date: "", signature: "" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (implement actual logic as needed)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        Checklist for Monitoring Energy Service Stations (LPG)
      </h1>

      {/* A. Background */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">A. Background</h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Name of Company"
          value={background.company}
          onChange={e => setBackground({ ...background, company: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Location"
            value={background.location}
            onChange={e => setBackground({ ...background, location: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="District"
            value={background.district}
            onChange={e => setBackground({ ...background, district: e.target.value })}
          />
        </div>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Year of Establishment"
          value={background.year}
          onChange={e => setBackground({ ...background, year: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Contact Person"
            value={background.contactPerson}
            onChange={e => setBackground({ ...background, contactPerson: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Position"
            value={background.position}
            onChange={e => setBackground({ ...background, position: e.target.value })}
          />
        </div>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Postal Address"
          value={background.address}
          onChange={e => setBackground({ ...background, address: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Telephone"
            value={background.telephone}
            onChange={e => setBackground({ ...background, telephone: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={background.email}
            onChange={e => setBackground({ ...background, email: e.target.value })}
          />
        </div>
      </section>

      {/* B. Type of Activity */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">B. Type of Activity</h2>
        <div className="flex gap-2 mb-2">
          <label className="font-medium flex items-center">
            Liquefied Petroleum Gas (LPG)
          </label>
        </div>
        <div className="flex gap-4 mb-2">
          <input
            className="border p-2 rounded w-1/2"
            placeholder="Number of Tank(s)"
            value={activity.tanks}
            onChange={e => setActivity({ ...activity, tanks: e.target.value })}
          />
          <input
            className="border p-2 rounded w-1/2"
            placeholder="Capacity"
            value={activity.capacity}
            onChange={e => setActivity({ ...activity, capacity: e.target.value })}
          />
        </div>
      </section>

      {/* C. Status of Environmental Permit */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">C. Status of Environmental Permit</h2>
        <div className="mb-2">
          <RadioGroup
            name="permit-status"
            options={["Acquired", "Not Acquired", "Being Processed"]}
            value={permit.status}
            onChange={v => setPermit({ ...permit, status: v })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Date of Issue"
            type="date"
            value={permit.dateOfIssue}
            onChange={e => setPermit({ ...permit, dateOfIssue: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Permit Number"
            value={permit.permitNumber}
            onChange={e => setPermit({ ...permit, permitNumber: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <RadioGroup
            name="permit-purpose"
            options={["LPG Plant Only", "Others"]}
            value={permit.purpose}
            onChange={v => setPermit({ ...permit, purpose: v })}
          />
        </div>
        <div className="mb-2">
          <RadioGroup
            name="permit-validity"
            options={["Valid", "Not Valid"]}
            value={permit.validity}
            onChange={v => setPermit({ ...permit, validity: v })}
          />
        </div>
        {permit.validity === "Not Valid" && (
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="If not valid, why?"
            value={permit.validityReason}
            onChange={e => setPermit({ ...permit, validityReason: e.target.value })}
          />
        )}
      </section>

      {/* D. Status of Operation */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">D. Status of Operation</h2>
        <RadioGroup
          name="operation-status"
          options={["Operational", "No more operational", "Under construction"]}
          value={operationStatus}
          onChange={setOperationStatus}
        />
      </section>

      {/* E. Compliance to Conditions of Permit */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          E. Compliance to Conditions of Permit
        </h2>
        <div>
          <span className="font-semibold block">Fire Management</span>
          <RadioGroup
            name="fire-mgmt"
            options={["Good", "Satisfactory", "Not satisfactory"]}
            value={fireMgmt}
            onChange={setFireMgmt}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
          <input
            className="border p-2 rounded"
            placeholder="No. of installed fire extinguishers"
            value={fireExtinguishers}
            onChange={e => setFireExtinguishers(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="No. of sand bucket(s)"
            value={sandBuckets}
            onChange={e => setSandBuckets(e.target.value)}
          />
        </div>
        <div className="my-2 flex gap-3 flex-wrap">
          <label className="flex items-center gap-1 font-medium">
            Warning signs (e.g. No smoking)
            <RadioGroup
              name="warning-signs"
              options={["Yes", "No"]}
              value={warningSigns}
              onChange={setWarningSigns}
            />
          </label>
          <label className="flex items-center gap-1 font-medium">
            Pressure gauge
            <RadioGroup
              name="pressure-gauge"
              options={["Yes", "No"]}
              value={pressureGauge}
              onChange={setPressureGauge}
            />
          </label>
          <label className="flex items-center gap-1 font-medium">
            Temperature gauge
            <RadioGroup
              name="temperature-gauge"
              options={["Yes", "No"]}
              value={temperatureGauge}
              onChange={setTemperatureGauge}
            />
          </label>
        </div>
        <div className="my-2 flex gap-3 flex-wrap">
          <label className="flex items-center gap-1 font-medium">
            Water Sprinkler
            <RadioGroup
              name="water-sprinkler"
              options={["Yes", "No"]}
              value={waterSprinkler}
              onChange={setWaterSprinkler}
            />
          </label>
          <label className="flex items-center gap-1 font-medium">
            Ladder/Stairway
            <RadioGroup
              name="ladder"
              options={["Yes", "No"]}
              value={ladder}
              onChange={setLadder}
            />
          </label>
          <label className="flex items-center gap-1 font-medium">
            Staff training against fire outbreak
            <RadioGroup
              name="fire-training"
              options={["Yes", "No"]}
              value={fireTraining}
              onChange={setFireTraining}
            />
          </label>
        </div>
        {/* Traffic management */}
        <div className="my-2">
          <span className="font-semibold">Traffic Management</span>
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="State of entrance and exit points"
            value={trafficEntrance}
            onChange={e => setTrafficEntrance(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Parking Space"
            value={trafficParking}
            onChange={e => setTrafficParking(e.target.value)}
          />
        </div>
        {/* Waste */}
        <div className="my-2">
          <span className="font-semibold">Waste</span>
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Mode of disposal - Solid waste"
            value={wasteSolid}
            onChange={e => setWasteSolid(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Mode of disposal - Liquid waste"
            value={wasteLiquid}
            onChange={e => setWasteLiquid(e.target.value)}
          />
          <RadioGroup
            name="waste-mgmt"
            options={["Available", "Not Available"]}
            value={wasteMgmt}
            onChange={setWasteMgmt}
          />
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 font-medium">
              Waste bins
              <RadioGroup
                name="waste-bins"
                options={["Yes", "No"]}
                value={wasteBins}
                onChange={setWasteBins}
              />
            </label>
            <label className="flex items-center gap-2 font-medium">
              Washrooms
              <RadioGroup
                name="washrooms"
                options={["Yes", "No"]}
                value={washrooms}
                onChange={setWashrooms}
              />
            </label>
          </div>
        </div>
        <textarea
          className="border p-2 rounded w-full mt-2"
          placeholder="Comment on status of compliance to permit conditions"
          rows={3}
          value={complianceComment}
          onChange={e => setComplianceComment(e.target.value)}
        />
      </section>

      {/* F. Assessment of Status of Emergency Response Facilities */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          F. Assessment of Status of Emergency Response Facilities
        </h2>
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="(a) Fire Prevention Facilities"
          rows={2}
          value={fireFacilities}
          onChange={e => setFireFacilities(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="(b) Spill Containment Manholes and Waste Oil Tanks"
          rows={2}
          value={spillFacilities}
          onChange={e => setSpillFacilities(e.target.value)}
        />
      </section>

      {/* G. Submission of Annual Environmental Report */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          G. Submission of Annual Environmental Report
        </h2>
        <RadioGroup
          name="annual-report"
          options={["Considered", "Not Considered"]}
          value={annualReport}
          onChange={setAnnualReport}
        />
      </section>

      {/* H. Weighted Compliance Level */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          H. Weighted Compliance Level
        </h2>
        <RadioGroup
          name="compliance-level"
          options={["Good", "Adequate", "Fair", "Needs Improvement"]}
          value={complianceLevel}
          onChange={setComplianceLevel}
        />
      </section>

      {/* I. General Observations and Comments */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          I. General Observations and Comments
        </h2>
        <textarea
          className="border p-2 rounded w-full"
          rows={4}
          placeholder="Enter observations/comments here"
          value={observations}
          onChange={e => setObservations(e.target.value)}
        />
      </section>

      {/* Assessor Details */}
      <section>
        <h2 className="font-semibold text-lg mb-2 border-b pb-1">
          Assessor(s) Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessors.map((ass, idx) => (
            <div key={idx} className="border rounded-lg p-3 space-y-2 bg-gray-50">
              <input
                className="border p-2 rounded w-full"
                placeholder="Name of Assessor"
                value={ass.name}
                onChange={e => {
                  const copy = [...assessors];
                  copy[idx].name = e.target.value;
                  setAssessors(copy);
                }}
              />
              <input
                className="border p-2 rounded w-full"
                type="date"
                placeholder="Date of Assessment"
                value={ass.date}
                onChange={e => {
                  const copy = [...assessors];
                  copy[idx].date = e.target.value;
                  setAssessors(copy);
                }}
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Signature of Assessor"
                value={ass.signature}
                onChange={e => {
                  const copy = [...assessors];
                  copy[idx].signature = e.target.value;
                  setAssessors(copy);
                }}
              />
            </div>
          ))}
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

export default ChecklistLPGForm;
