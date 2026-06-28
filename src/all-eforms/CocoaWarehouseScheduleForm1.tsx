import React, { useState } from "react";

// Helper: Render a section header
const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-semibold text-lg mb-2 border-b pb-1 mt-8">{children}</h2>
);

const CocoaWarehouseScheduleForm = () => {
  // Entity Profile State
  const [profile, setProfile] = useState({
    entityName: "",
    address: "",
    tin: "",
    contactNo: "",
    contactPerson: "",
    designation: "",
    typeOfUndertaking: "",
  });

  // Permit Details State
  const [permit, setPermit] = useState({
    fileNo: "",
    permitNo: "",
    dateOfIssue: "",
    dateOfExpiry: "",
    placeOfIssue: "",
  });

  // Project Description State
  const [description, setDescription] = useState({
    size: "",
    activities: "",
    facilities: "",
    location: "",
    geoCoords: "",
    landTake: "",
  });

  // Environmental Impact and Management
  const [impacts, setImpacts] = useState([
    { impact: "Ambient Noise", source: "", management: "", timeline: "" },
    { impact: "Land & Water Resources", source: "", management: "", timeline: "" },
    { impact: "Solid Waste", source: "", management: "", timeline: "" },
    { impact: "Land/Property (Fire)", source: "", management: "", timeline: "" },
    { impact: "Occupational, Health & Safety", source: "", management: "", timeline: "" },
    { impact: "Traffic", source: "", management: "", timeline: "" },
    { impact: "Pest Infestation", source: "", management: "", timeline: "" },
  ]);
  // Add or edit rows dynamically if needed

  // Environmental Monitoring State
  const [monitoring, setMonitoring] = useState({
    ambientNoise: "",
    liquidWaste: "",
    solidWaste: "",
    oHS: "",
    traffic: "",
    fire: "",
  });

  // Annual Environmental Report
  const [aerSubmitted, setAerSubmitted] = useState("");
  const [aerDueDate, setAerDueDate] = useState("");

  // Notification & Miscellaneous
  const [changes, setChanges] = useState("");
  const [complaints, setComplaints] = useState("");
  const [permitDisplay, setPermitDisplay] = useState("");
  const [scheduleAwareness, setScheduleAwareness] = useState("");
  const [grm, setGrm] = useState("");
  const [decommissioning, setDecommissioning] = useState("");
  const [otherComments, setOtherComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Add your submission logic here)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl mb-12"
    >
      <h1 className="text-2xl font-bold text-center mb-8">
        Cocoa Warehouse Environmental Permit Schedule
      </h1>

      {/* ENTITY PROFILE */}
      <SectionHeader>1. ENTITY PROFILE</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Name of Entity"
          value={profile.entityName}
          onChange={(e) =>
            setProfile({ ...profile, entityName: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Address"
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="TIN"
          value={profile.tin}
          onChange={(e) =>
            setProfile({ ...profile, tin: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Contact No."
          value={profile.contactNo}
          onChange={(e) =>
            setProfile({ ...profile, contactNo: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Contact Person"
          value={profile.contactPerson}
          onChange={(e) =>
            setProfile({ ...profile, contactPerson: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Designation"
          value={profile.designation}
          onChange={(e) =>
            setProfile({ ...profile, designation: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Type of Undertaking"
          value={profile.typeOfUndertaking}
          onChange={(e) =>
            setProfile({ ...profile, typeOfUndertaking: e.target.value })
          }
        />
      </div>

      {/* PERMIT IDENTIFICATION DETAILS */}
      <SectionHeader>2. PERMIT IDENTIFICATION DETAILS</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="File No."
          value={permit.fileNo}
          onChange={(e) => setPermit({ ...permit, fileNo: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Permit No."
          value={permit.permitNo}
          onChange={(e) => setPermit({ ...permit, permitNo: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          type="date"
          placeholder="Date of Issue"
          value={permit.dateOfIssue}
          onChange={(e) =>
            setPermit({ ...permit, dateOfIssue: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          type="date"
          placeholder="Date of Expiry"
          value={permit.dateOfExpiry}
          onChange={(e) =>
            setPermit({ ...permit, dateOfExpiry: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Place of Issue"
          value={permit.placeOfIssue}
          onChange={(e) =>
            setPermit({ ...permit, placeOfIssue: e.target.value })
          }
        />
      </div>

      {/* PROJECT DESCRIPTION */}
      <SectionHeader>3. PROJECT DESCRIPTION</SectionHeader>
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Warehouse size, e.g. 44m x 30m"
        value={description.size}
        onChange={(e) => setDescription({ ...description, size: e.target.value })}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Describe activities (e.g., warehousing, loading/offloading cocoa beans)"
        value={description.activities}
        onChange={(e) =>
          setDescription({ ...description, activities: e.target.value })
        }
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Facilities (e.g., offices, parking space, generator set)"
        value={description.facilities}
        onChange={(e) =>
          setDescription({ ...description, facilities: e.target.value })
        }
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Location"
        value={description.location}
        onChange={(e) =>
          setDescription({ ...description, location: e.target.value })
        }
      />
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Geographical Coordinates"
        value={description.geoCoords}
        onChange={(e) =>
          setDescription({ ...description, geoCoords: e.target.value })
        }
      />
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Land Take (e.g., 0.75 Acres)"
        value={description.landTake}
        onChange={(e) =>
          setDescription({ ...description, landTake: e.target.value })
        }
      />

      {/* ENVIRONMENTAL IMPACT AND MANAGEMENT */}
      <SectionHeader>4. ENVIRONMENTAL IMPACT AND MANAGEMENT</SectionHeader>
      <table className="min-w-full bg-white border mb-4">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">Impact</th>
            <th className="py-2 px-3 border-b">Source</th>
            <th className="py-2 px-3 border-b">Management/Mitigation</th>
            <th className="py-2 px-3 border-b">Timeline</th>
          </tr>
        </thead>
        <tbody>
          {impacts.map((row, i) => (
            <tr key={i}>
              <td className="border-b px-2">{row.impact}</td>
              <td className="border-b px-2">
                <input
                  className="border rounded p-1 w-full"
                  value={row.source}
                  onChange={e => {
                    const updated = [...impacts];
                    updated[i].source = e.target.value;
                    setImpacts(updated);
                  }}
                />
              </td>
              <td className="border-b px-2">
                <input
                  className="border rounded p-1 w-full"
                  value={row.management}
                  onChange={e => {
                    const updated = [...impacts];
                    updated[i].management = e.target.value;
                    setImpacts(updated);
                  }}
                />
              </td>
              <td className="border-b px-2">
                <input
                  className="border rounded p-1 w-full"
                  value={row.timeline}
                  onChange={e => {
                    const updated = [...impacts];
                    updated[i].timeline = e.target.value;
                    setImpacts(updated);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ENVIRONMENTAL MONITORING */}
      <SectionHeader>5. ENVIRONMENTAL MONITORING</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Ambient Noise Monitoring"
          value={monitoring.ambientNoise}
          onChange={e => setMonitoring({ ...monitoring, ambientNoise: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Liquid Waste Monitoring"
          value={monitoring.liquidWaste}
          onChange={e => setMonitoring({ ...monitoring, liquidWaste: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Solid Waste Monitoring"
          value={monitoring.solidWaste}
          onChange={e => setMonitoring({ ...monitoring, solidWaste: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Occupational Health & Safety Monitoring"
          value={monitoring.oHS}
          onChange={e => setMonitoring({ ...monitoring, oHS: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Traffic Monitoring"
          value={monitoring.traffic}
          onChange={e => setMonitoring({ ...monitoring, traffic: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Fire Incident Monitoring"
          value={monitoring.fire}
          onChange={e => setMonitoring({ ...monitoring, fire: e.target.value })}
        />
      </div>

      {/* ENVIRONMENTAL REPORTING */}
      <SectionHeader>6. ENVIRONMENTAL REPORTING</SectionHeader>
      <div className="mb-2">
        <label className="block font-medium mb-1">Annual Environmental Report Submitted?</label>
        <select
          className="border p-2 rounded w-full"
          value={aerSubmitted}
          onChange={e => setAerSubmitted(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <input
        className="border p-2 rounded w-full mb-2"
        type="date"
        placeholder="AER Due Date"
        value={aerDueDate}
        onChange={e => setAerDueDate(e.target.value)}
      />

      {/* NOTIFICATION & MISCELLANEOUS */}
      <SectionHeader>7. NOTIFICATION & MISCELLANEOUS</SectionHeader>
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Describe any changes to the project (for notification to EPA)"
        value={changes}
        onChange={e => setChanges(e.target.value)}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Complaint Management Mechanism (describe GRM, stakeholder engagement, etc.)"
        value={complaints}
        onChange={e => setComplaints(e.target.value)}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Permit Display (describe status)"
        value={permitDisplay}
        onChange={e => setPermitDisplay(e.target.value)}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Permit Schedule Awareness (staff training, communication)"
        value={scheduleAwareness}
        onChange={e => setScheduleAwareness(e.target.value)}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Grievance Redress Mechanism"
        value={grm}
        onChange={e => setGrm(e.target.value)}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Decommissioning (plan, date, etc.)"
        value={decommissioning}
        onChange={e => setDecommissioning(e.target.value)}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Other Comments"
        value={otherComments}
        onChange={e => setOtherComments(e.target.value)}
      />

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

export default CocoaWarehouseScheduleForm;
