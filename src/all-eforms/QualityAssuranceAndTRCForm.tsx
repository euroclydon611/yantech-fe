import React, { useState } from "react";

// Checkbox for Satisfactory/Unsatisfactory
const SatUnsatRadio = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="flex gap-4">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name={name}
        checked={value === "Satisfactory"}
        onChange={() => onChange("Satisfactory")}
      />
      Satisfactory
    </label>
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name={name}
        checked={value === "Unsatisfactory"}
        onChange={() => onChange("Unsatisfactory")}
      />
      Unsatisfactory
    </label>
  </div>
);

const QualityAssuranceAndTRCForm = () => {
  // QUALITY ASSURANCE CHECKLIST STATE
  const [qa, setQA] = useState({
    proponent: "",
    proposalType: "",
    location: "",
    period: "",
    sitePlan: "",
    blockPlan: "",
    zoning: "",
    screening: "",
    photograph: "",
    approval: "",
    schedule: "",
    processingFee: "",
    permitFee: "",
    comments: "",
    attachments: "",
    areaHead: { name: "", signature: "", date: "" },
    regionalDirector: { name: "", signature: "", date: "" },
  });

  // EIA TECHNICAL REVIEW COMMITTEE STATE
  const [trc, setTRC] = useState({
    proponent: "",
    address: "",
    undertaking: "",
    recommendation: "",
    date: "",
    members: Array.from({ length: 10 }, () => ({
      name: "",
      department: "",
      signature: "",
    })),
  });

  // Handlers
  const handleTRCMemberChange = (idx: number, field: string, val: string) => {
    setTRC((prev) => ({
      ...prev,
      members: prev.members.map((m, i) =>
        i === idx ? { ...m, [field]: val } : m
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Implement backend logic here.)");
  };

  // S/N items
  const snList = [
    { label: "Site Plan (Authenticated)", field: "sitePlan" },
    { label: "Block Plan", field: "blockPlan" },
    { label: "Zoning (where applicable)", field: "zoning" },
    { label: "Screening Report", field: "screening" },
    { label: "Photograph", field: "photograph" },
    { label: "Approval Sheet", field: "approval" },
    { label: "Schedule", field: "schedule" },
    { label: "Processing Fee Payment", field: "processingFee" },
    { label: "Permit Fee Payment", field: "permitFee" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl mb-12 space-y-8"
    >
      <h1 className="text-2xl font-bold text-center mb-4">
        Quality Assurance Checklist <br /> & <br /> EIA Technical Review Committee Approval Sheet
      </h1>
      <h2 className="font-semibold text-lg mb-2 border-b pb-1">QUALITY ASSURANCE CHECKLIST <span className="block font-normal text-sm text-gray-500">(EA1 Applications, Akim Oda Area Office)</span></h2>

      {/* Section 1: QA Header */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input
          className="border p-2 rounded"
          placeholder="Name of Proponent"
          value={qa.proponent}
          onChange={e => setQA(q => ({ ...q, proponent: e.target.value }))}
        />
        <input
          className="border p-2 rounded"
          placeholder="Type of Proposal"
          value={qa.proposalType}
          onChange={e => setQA(q => ({ ...q, proposalType: e.target.value }))}
        />
        <input
          className="border p-2 rounded"
          placeholder="Location"
          value={qa.location}
          onChange={e => setQA(q => ({ ...q, location: e.target.value }))}
        />
        <input
          className="border p-2 rounded"
          placeholder="Processing Period"
          value={qa.period}
          onChange={e => setQA(q => ({ ...q, period: e.target.value }))}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Attachments</label>
        <textarea
          className="border p-2 rounded w-full"
          placeholder="List any attachments"
          value={qa.attachments}
          onChange={e => setQA(q => ({ ...q, attachments: e.target.value }))}
        />
      </div>

      {/* S/N Table */}
      <table className="w-full border text-xs mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1">S/N</th>
            <th className="border p-1">Requirement</th>
            <th className="border p-1">Satisfactory</th>
            <th className="border p-1">Unsatisfactory</th>
          </tr>
        </thead>
        <tbody>
          {snList.map((row, i) => (
            <tr key={i}>
              <td className="border text-center">{5.1 + i * 0.1}</td>
              <td className="border px-2">{row.label}</td>
              <td className="border text-center">
                <input
                  type="radio"
                  name={row.field}
                  checked={qa[row.field as keyof typeof qa] === "Satisfactory"}
                  onChange={() => setQA(q => ({ ...q, [row.field]: "Satisfactory" }))}
                />
              </td>
              <td className="border text-center">
                <input
                  type="radio"
                  name={row.field}
                  checked={qa[row.field as keyof typeof qa] === "Unsatisfactory"}
                  onChange={() => setQA(q => ({ ...q, [row.field]: "Unsatisfactory" }))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Comments */}
      <div className="mb-3">
        <label className="font-medium">Comments</label>
        <textarea
          className="border p-2 rounded w-full"
          rows={3}
          value={qa.comments}
          onChange={e => setQA(q => ({ ...q, comments: e.target.value }))}
        />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="font-medium mb-1">Area Head (Akim Oda)</div>
          <input
            className="border p-2 rounded mb-2 w-full"
            placeholder="Name"
            value={qa.areaHead.name}
            onChange={e => setQA(q => ({ ...q, areaHead: { ...q.areaHead, name: e.target.value } }))}
          />
          <input
            className="border p-2 rounded mb-2 w-full"
            placeholder="Signature"
            value={qa.areaHead.signature}
            onChange={e => setQA(q => ({ ...q, areaHead: { ...q.areaHead, signature: e.target.value } }))}
          />
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={qa.areaHead.date}
            onChange={e => setQA(q => ({ ...q, areaHead: { ...q.areaHead, date: e.target.value } }))}
          />
        </div>
        <div>
          <div className="font-medium mb-1">Regional Director</div>
          <input
            className="border p-2 rounded mb-2 w-full"
            placeholder="Name"
            value={qa.regionalDirector.name}
            onChange={e => setQA(q => ({ ...q, regionalDirector: { ...q.regionalDirector, name: e.target.value } }))}
          />
          <input
            className="border p-2 rounded mb-2 w-full"
            placeholder="Signature"
            value={qa.regionalDirector.signature}
            onChange={e => setQA(q => ({ ...q, regionalDirector: { ...q.regionalDirector, signature: e.target.value } }))}
          />
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={qa.regionalDirector.date}
            onChange={e => setQA(q => ({ ...q, regionalDirector: { ...q.regionalDirector, date: e.target.value } }))}
          />
        </div>
      </div>

      {/* TRC APPROVAL SHEET */}
      <h2 className="font-semibold text-lg mb-2 border-b pb-1 mt-8">EIA TECHNICAL REVIEW COMMITTEE APPROVAL SHEET <span className="block font-normal text-sm text-gray-500">(Akim Oda Area Office - Eastern Region)</span></h2>
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Name of Proponent"
        value={trc.proponent}
        onChange={e => setTRC(t => ({ ...t, proponent: e.target.value }))}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Address"
        value={trc.address}
        onChange={e => setTRC(t => ({ ...t, address: e.target.value }))}
      />
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Undertaking"
        value={trc.undertaking}
        onChange={e => setTRC(t => ({ ...t, undertaking: e.target.value }))}
      />
      <textarea
        className="border p-2 rounded w-full mb-2"
        placeholder="Recommendation (We hereby recommend that ... be issued with Environmental Permit)"
        value={trc.recommendation}
        onChange={e => setTRC(t => ({ ...t, recommendation: e.target.value }))}
      />
      <input
        type="date"
        className="border p-2 rounded w-full mb-2"
        value={trc.date}
        onChange={e => setTRC(t => ({ ...t, date: e.target.value }))}
      />

      <div className="mb-2 font-medium">Committee Members</div>
      <table className="w-full border text-xs mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1">No.</th>
            <th className="border p-1">Name</th>
            <th className="border p-1">Department</th>
            <th className="border p-1">Signature</th>
          </tr>
        </thead>
        <tbody>
          {trc.members.map((m, i) => (
            <tr key={i}>
              <td className="border text-center">{i + 1}</td>
              <td className="border">
                <input
                  className="p-1 w-full"
                  value={m.name}
                  onChange={e => handleTRCMemberChange(i, "name", e.target.value)}
                />
              </td>
              <td className="border">
                <input
                  className="p-1 w-full"
                  value={m.department}
                  onChange={e => handleTRCMemberChange(i, "department", e.target.value)}
                />
              </td>
              <td className="border">
                <input
                  className="p-1 w-full"
                  value={m.signature}
                  onChange={e => handleTRCMemberChange(i, "signature", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 text-center">
        <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
          Submit Form
        </button>
      </div>
    </form>
  );
};

export default QualityAssuranceAndTRCForm;
