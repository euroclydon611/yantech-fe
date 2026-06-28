import React, { useState } from "react";

// Helper for table-like dynamic fields
const DynamicRows = ({
  rows,
  setRows,
  columns,
  label,
  addRowLabel = "Add Row"
}: {
  rows: any[];
  setRows: (r: any[]) => void;
  columns: { name: string; label: string; type?: string }[];
  label?: string;
  addRowLabel?: string;
}) => (
  <div className="mb-6">
    {label && <div className="font-medium mb-2">{label}</div>}
    <table className="min-w-full bg-white border mb-1">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.name} className="py-2 px-3 border-b">
              {col.label}
            </th>
          ))}
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.name} className="py-1 px-2 border-b">
                <input
                  type={col.type || "text"}
                  className="border rounded p-1 w-full"
                  value={row[col.name] || ""}
                  onChange={(e) => {
                    const copy = [...rows];
                    copy[idx][col.name] = e.target.value;
                    setRows(copy);
                  }}
                />
              </td>
            ))}
            <td>
              <button
                type="button"
                className="text-red-500"
                onClick={() => setRows(rows.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={columns.length + 1}>
            <button
              type="button"
              className="text-blue-600"
              onClick={() => setRows([...rows, {}])}
            >
              {addRowLabel}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const BoilerInventoryForm = () => {
  // SECTION A: Company Info
  const [company, setCompany] = useState({
    group: "",
    name: "",
    address: "",
    owner: "",
    tel: "",
    email: "",
    town: "",
    district: "",
    region: "",
    digital: "",
    contactPerson: "",
    contactTel: "",
    contactEmail: "",
    plantCapacity: "",
    staffStrength: "",
    workingDays: "",
    workingHours: "",
    shifts: "",
    majorMachinery: ""
  });

  // SECTION B: Production Info (all dynamic)
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [wastes, setWastes] = useState<any[]>([]);
  const [byproducts, setByproducts] = useState<any[]>([]);

  // SECTION C: Waste Management
  const [wasteSource, setWasteSource] = useState("");
  const [wasteMgmt, setWasteMgmt] = useState("");

  // SECTION D: Energy
  const [systems, setSystems] = useState<any[]>([]);

  // SECTION E: Fuel
  const [fuels, setFuels] = useState<any[]>([]);
  const [otherFuels, setOtherFuels] = useState("");

  // SECTION F: Water
  const [water, setWater] = useState({
    source: "",
    treatment: "",
    feedWaterCons: "",
    makeUpWater: "",
    tankCapacity: ""
  });

  // SECTION G: Management & Maintenance
  const [optimisation, setOptimisation] = useState("");
  const [maintenanceNature, setMaintenanceNature] = useState("");
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [inspectionFreq, setInspectionFreq] = useState("");
  const [inspectionRec, setInspectionRec] = useState("");

  // SECTION H: Emissions
  const [pollutants, setPollutants] = useState("");
  const [minimiseMeasures, setMinimiseMeasures] = useState("");
  const [effects, setEffects] = useState("");

  // SECTION I: Improvement
  const [improvements, setImprovements] = useState({
    upgrade: false,
    refurb: false,
    replace: false,
    newInstall: false,
    details: "",
    estCost: "",
    funding: "",
    date: "",
    techSupport: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (add real logic)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-2xl mb-10 space-y-10"
    >
      <h1 className="text-2xl font-bold text-center mb-6">
        Industrial Boiler/Cooker Inventory Form<br />
        <span className="text-base font-normal">(Informal Sector)</span>
      </h1>

      {/* Section A */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section A: Company Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Corporative/Group"
            value={company.group}
            onChange={(e) =>
              setCompany({ ...company, group: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={company.name}
            onChange={(e) =>
              setCompany({ ...company, name: e.target.value })
            }
          />
          <input
            className="border p-2 rounded col-span-2"
            placeholder="Address for correspondence"
            value={company.address}
            onChange={(e) =>
              setCompany({ ...company, address: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Name of Owner"
            value={company.owner}
            onChange={(e) =>
              setCompany({ ...company, owner: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Tel No."
            value={company.tel}
            onChange={(e) => setCompany({ ...company, tel: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Email Address"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Town"
            value={company.town}
            onChange={(e) =>
              setCompany({ ...company, town: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="District"
            value={company.district}
            onChange={(e) =>
              setCompany({ ...company, district: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Region"
            value={company.region}
            onChange={(e) =>
              setCompany({ ...company, region: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Digital Address"
            value={company.digital}
            onChange={(e) =>
              setCompany({ ...company, digital: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Name of Contact Person"
            value={company.contactPerson}
            onChange={(e) =>
              setCompany({ ...company, contactPerson: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Contact Person Tel No."
            value={company.contactTel}
            onChange={(e) =>
              setCompany({ ...company, contactTel: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Contact Person Email"
            value={company.contactEmail}
            onChange={(e) =>
              setCompany({ ...company, contactEmail: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Plant Capacity"
            value={company.plantCapacity}
            onChange={(e) =>
              setCompany({ ...company, plantCapacity: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Staff Strength"
            value={company.staffStrength}
            onChange={(e) =>
              setCompany({ ...company, staffStrength: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="No. of Working Days"
            value={company.workingDays}
            onChange={(e) =>
              setCompany({ ...company, workingDays: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Working hours per day"
            value={company.workingHours}
            onChange={(e) =>
              setCompany({ ...company, workingHours: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="No. of shifts"
            value={company.shifts}
            onChange={(e) =>
              setCompany({ ...company, shifts: e.target.value })
            }
          />
        </div>
        <textarea
          className="border p-2 rounded w-full mt-3"
          placeholder="List of major machinery connected to the boiler use"
          rows={2}
          value={company.majorMachinery}
          onChange={(e) =>
            setCompany({ ...company, majorMachinery: e.target.value })
          }
        />
      </section>

      {/* Section B */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section B: Production Information
        </h2>
        <DynamicRows
          rows={rawMaterials}
          setRows={setRawMaterials}
          columns={[
            { name: "type", label: "Type" },
            { name: "qty", label: "Average Quantity/Month" },
            { name: "raw", label: "Raw Materials Used" },
          ]}
          label="Raw Materials Used"
        />
        <DynamicRows
          rows={products}
          setRows={setProducts}
          columns={[
            { name: "name", label: "Product" },
            { name: "qty", label: "Average Quantity/Month" },
          ]}
          label="Products"
        />
        <DynamicRows
          rows={wastes}
          setRows={setWastes}
          columns={[
            { name: "name", label: "Waste" },
            { name: "qty", label: "Average Quantity/Month" },
          ]}
          label="Wastes Generated"
        />
        <DynamicRows
          rows={byproducts}
          setRows={setByproducts}
          columns={[
            { name: "name", label: "By-Product" },
            { name: "qty", label: "Average Quantity/Month" },
          ]}
          label="By-Products"
        />
      </section>

      {/* Section C */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section C: Waste Management Practices
        </h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Source(s) of waste"
          value={wasteSource}
          onChange={(e) => setWasteSource(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Discuss how waste is managed"
          rows={2}
          value={wasteMgmt}
          onChange={(e) => setWasteMgmt(e.target.value)}
        />
      </section>

      {/* Section D */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section D: Energy Information
        </h2>
        <DynamicRows
          rows={systems}
          setRows={setSystems}
          columns={[
            { name: "system", label: "System for Cooking" },
            { name: "volume", label: "Volume of Cooker (tons)" },
            { name: "efficiency", label: "Efficiency of System" },
            { name: "hours", label: "Hours of Operation" }
          ]}
        />
      </section>

      {/* Section E */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section E: Fuel
        </h2>
        <DynamicRows
          rows={fuels}
          setRows={setFuels}
          columns={[
            { name: "type", label: "Type of Fuel Used" },
            { name: "source", label: "Source" },
            { name: "qty", label: "Quantity" },
            { name: "cost", label: "Cost" },
            { name: "transport", label: "Mode of Transportation" },
            { name: "storage", label: "Storage" }
          ]}
        />
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Other potential fuel(s)"
          rows={2}
          value={otherFuels}
          onChange={(e) => setOtherFuels(e.target.value)}
        />
      </section>

      {/* Section F */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section F: Water
        </h2>
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Source of cooker feed water"
          value={water.source}
          onChange={(e) => setWater({ ...water, source: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Type of treatment"
          value={water.treatment}
          onChange={(e) => setWater({ ...water, treatment: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Cooker feed water consumption (m3/month)"
          value={water.feedWaterCons}
          onChange={(e) => setWater({ ...water, feedWaterCons: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Cooker make up water (m3/month)"
          value={water.makeUpWater}
          onChange={(e) => setWater({ ...water, makeUpWater: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Feed water tank capacity"
          value={water.tankCapacity}
          onChange={(e) => setWater({ ...water, tankCapacity: e.target.value })}
        />
      </section>

      {/* Section G */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section G: Management & Maintenance
        </h2>
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Discuss how cooking operation is optimised"
          rows={2}
          value={optimisation}
          onChange={(e) => setOptimisation(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Nature of maintenance including specific components frequently maintained"
          rows={2}
          value={maintenanceNature}
          onChange={(e) => setMaintenanceNature(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Cost of Maintenance"
          value={maintenanceCost}
          onChange={(e) => setMaintenanceCost(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Frequency of statutory inspection"
          value={inspectionFreq}
          onChange={(e) => setInspectionFreq(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Recommendations from statutory inspection"
          rows={2}
          value={inspectionRec}
          onChange={(e) => setInspectionRec(e.target.value)}
        />
      </section>

      {/* Section H */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section H: Emissions
        </h2>
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Type of pollutants emitted from the cooking operations"
          rows={2}
          value={pollutants}
          onChange={(e) => setPollutants(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Measures to minimize emissions"
          rows={2}
          value={minimiseMeasures}
          onChange={(e) => setMinimiseMeasures(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Effect of emission on workers & the environment"
          rows={2}
          value={effects}
          onChange={(e) => setEffects(e.target.value)}
        />
      </section>

      {/* Section I */}
      <section>
        <h2 className="font-semibold text-xl mb-2 border-b pb-1">
          Section I: Improvement
        </h2>
        <div className="flex flex-wrap gap-4 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={improvements.upgrade}
              onChange={() =>
                setImprovements((prev) => ({
                  ...prev,
                  upgrade: !prev.upgrade
                }))
              }
            />
            Upgrade
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={improvements.refurb}
              onChange={() =>
                setImprovements((prev) => ({
                  ...prev,
                  refurb: !prev.refurb
                }))
              }
            />
            Refurbishment
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={improvements.replace}
              onChange={() =>
                setImprovements((prev) => ({
                  ...prev,
                  replace: !prev.replace
                }))
              }
            />
            Replacement
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={improvements.newInstall}
              onChange={() =>
                setImprovements((prev) => ({
                  ...prev,
                  newInstall: !prev.newInstall
                }))
              }
            />
            New Installation
          </label>
        </div>
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Details of improvement"
          rows={2}
          value={improvements.details}
          onChange={(e) =>
            setImprovements((prev) => ({
              ...prev,
              details: e.target.value
            }))
          }
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Estimated cost"
          value={improvements.estCost}
          onChange={(e) =>
            setImprovements((prev) => ({
              ...prev,
              estCost: e.target.value
            }))
          }
        />
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Proposed source of funding"
          value={improvements.funding}
          onChange={(e) =>
            setImprovements((prev) => ({
              ...prev,
              funding: e.target.value
            }))
          }
        />
        <input
          className="border p-2 rounded w-full mb-2"
          type="date"
          placeholder="Proposed date for improvement"
          value={improvements.date}
          onChange={(e) =>
            setImprovements((prev) => ({
              ...prev,
              date: e.target.value
            }))
          }
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Type of technical support required"
          value={improvements.techSupport}
          onChange={(e) =>
            setImprovements((prev) => ({
              ...prev,
              techSupport: e.target.value
            }))
          }
        />
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

export default BoilerInventoryForm;
