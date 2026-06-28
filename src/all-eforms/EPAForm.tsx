import React, { useState } from 'react';

// Helper for dynamic tables
const DynamicTable = ({
  columns,
  data,
  setData,
  addRowLabel = "Add Row"
}: {
  columns: { name: string, label: string, type?: string }[],
  data: any[],
  setData: (rows: any[]) => void,
  addRowLabel?: string,
}) => (
  <div className="mb-6">
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.name} className="py-2 px-3 border-b text-left">{col.label}</th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rIdx) => (
          <tr key={rIdx}>
            {columns.map((col, cIdx) => (
              <td key={col.name} className="py-2 px-3 border-b">
                <input
                  type={col.type || "text"}
                  className="border p-1 rounded w-full"
                  value={row[col.name] || ''}
                  onChange={e => {
                    const copy = [...data];
                    copy[rIdx][col.name] = e.target.value;
                    setData(copy);
                  }}
                />
              </td>
            ))}
            <td>
              <button
                type="button"
                className="text-red-500"
                onClick={() => {
                  setData(data.filter((_, i) => i !== rIdx));
                }}
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
              onClick={() => setData([...data, {}])}
            >
              {addRowLabel}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const EPAForm: React.FC = () => {
  // STATE: You can further modularize this, but this will get you started for demo/prototyping!
  const [company, setCompany] = useState({
    registeredName: "", tin: "", undertakingName: "", undertakingType: "", sector: "",
    postalAddress: "", ghanaPostGps: "", tel: "", email: "",
    headName: "", contactName: "", contactPosition: "", contactMobile: "", contactEmail: "",
  });
  const [projectLocation, setProjectLocation] = useState({
    plotNo: "", street: "", town: "", district: "", landMark: "", region: "",
    zoning: "", landSize: ""
  });
  const [siteDescription, setSiteDescription] = useState({
    currentLandUse: "", floraFauna: "", drainage: "", accessibility: "", topography: "",
    adjacentNorth: "", adjacentSouth: "", adjacentEast: "", adjacentWest: "", nearestCommunityDist: "",
  });
  const [objectives, setObjectives] = useState("");
  const [envPolicy, setEnvPolicy] = useState("");
  const [legalRegulations, setLegalRegulations] = useState<any[]>([]);
  const [experience, setExperience] = useState("");
  const [baselineInfo, setBaselineInfo] = useState("");
  const [envComponents, setEnvComponents] = useState<any[]>([]);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [processes, setProcesses] = useState<any[]>([]);
  const [rawMaterialsConstruction, setRawMaterialsConstruction] = useState<any[]>([]);
  const [rawMaterialsOperation, setRawMaterialsOperation] = useState<any[]>([]);
  const [equipmentConstruction, setEquipmentConstruction] = useState<any[]>([]);
  const [equipmentOperation, setEquipmentOperation] = useState<any[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [impacts, setImpacts] = useState<any[]>([]);
  const [mitigations, setMitigations] = useState<any[]>([]);
  const [monitoring, setMonitoring] = useState<any[]>([]);
  const [decommission, setDecommission] = useState<any[]>([]);
  const [conclusion, setConclusion] = useState("");
  const [attachments, setAttachments] = useState({
    sitePlan: false,
    blockPlan: false,
    sitePhotos: false,
    zoningLetter: false,
  });
  const [declaration, setDeclaration] = useState({
    name: "",
    position: "",
    date: "",
    signature: "",
  });

  // Form submission handler (implement as needed)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form data here (e.g., send to backend or generate PDF)
    alert('Form submitted! (Handle submission logic)');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-white shadow-2xl rounded-xl space-y-12 mb-10">
      <h1 className="text-2xl font-bold mb-6 text-center">EPA - Preliminary Environmental Report<br/>One District, One Factory Projects</h1>

      {/* 1.0 Introduction */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">1.0 Introduction</h2>
        {/* 1.1 Company Information */}
        <div>
          <h3 className="font-semibold mb-2">1.1 Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* All company info fields */}
            {[
              {label: "Registered Name", name: "registeredName"},
              {label: "Tax Identification Number (TIN)", name: "tin"},
              {label: "Name of Undertaking", name: "undertakingName"},
              {label: "Type of Undertaking", name: "undertakingType"},
              {label: "Sector", name: "sector"},
              {label: "Postal Address", name: "postalAddress"},
              {label: "Ghana Post GPS", name: "ghanaPostGps"},
              {label: "Tel. No.", name: "tel"},
              {label: "Email", name: "email"},
              {label: "Name of Head of Company", name: "headName"},
              {label: "Name of Contact Person", name: "contactName"},
              {label: "Position", name: "contactPosition"},
              {label: "Mobile No.", name: "contactMobile"},
              {label: "Contact Email", name: "contactEmail"},
            ].map((f) => (
              <div key={f.name} className="flex flex-col">
                <label className="font-medium">{f.label}</label>
                <input
                  type={f.name.includes("email") ? "email" : "text"}
                  className="border rounded p-2"
                  value={(company as any)[f.name]}
                  onChange={e => setCompany({...company, [f.name]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>
        {/* 1.2 Project Location */}
        <div>
          <h3 className="font-semibold mb-2">1.2 Proposed Project Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {label: "Plot/House No.", name: "plotNo"},
              {label: "Street/Area Name", name: "street"},
              {label: "Town", name: "town"},
              {label: "District", name: "district"},
              {label: "Major Land Mark", name: "landMark"},
              {label: "Region", name: "region"},
              {label: "Zoning Status", name: "zoning"},
              {label: "Land Size (Acres/Hectares)", name: "landSize"},
            ].map(f => (
              <div key={f.name} className="flex flex-col">
                <label className="font-medium">{f.label}</label>
                <input
                  type="text"
                  className="border rounded p-2"
                  value={(projectLocation as any)[f.name]}
                  onChange={e => setProjectLocation({...projectLocation, [f.name]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>
        {/* 1.2.1 Site and Neighbourhood */}
        <div>
          <h3 className="font-semibold mb-2">1.2.1 Site and External/Neighbourhood Environment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* grouped for clarity */}
            <div className="col-span-2">
              <label className="font-medium">Current Land Uses (farming, residence, commercial, etc)</label>
              <textarea className="border rounded p-2 w-full" rows={2} value={siteDescription.currentLandUse}
                onChange={e => setSiteDescription({...siteDescription, currentLandUse: e.target.value})}/>
            </div>
            <div>
              <label className="font-medium">Flora and Fauna</label>
              <textarea className="border rounded p-2 w-full" rows={2} value={siteDescription.floraFauna}
                onChange={e => setSiteDescription({...siteDescription, floraFauna: e.target.value})}/>
            </div>
            <div>
              <label className="font-medium">Drainage</label>
              <textarea className="border rounded p-2 w-full" rows={2} value={siteDescription.drainage}
                onChange={e => setSiteDescription({...siteDescription, drainage: e.target.value})}/>
            </div>
            <div>
              <label className="font-medium">Accessibility</label>
              <textarea className="border rounded p-2 w-full" rows={2} value={siteDescription.accessibility}
                onChange={e => setSiteDescription({...siteDescription, accessibility: e.target.value})}/>
            </div>
            <div>
              <label className="font-medium">Topography</label>
              <textarea className="border rounded p-2 w-full" rows={2} value={siteDescription.topography}
                onChange={e => setSiteDescription({...siteDescription, topography: e.target.value})}/>
            </div>
            {["North", "South", "East", "West"].map(dir => (
              <div key={dir}>
                <label className="font-medium">Adjacent Land Use - {dir}</label>
                <input className="border rounded p-2 w-full" type="text"
                  value={(siteDescription as any)[`adjacent${dir}`]}
                  onChange={e => setSiteDescription({...siteDescription, [`adjacent${dir}`]: e.target.value})}/>
              </div>
            ))}
            <div>
              <label className="font-medium">Approximate distance to nearest community</label>
              <input className="border rounded p-2 w-full" type="text"
                value={siteDescription.nearestCommunityDist}
                onChange={e => setSiteDescription({...siteDescription, nearestCommunityDist: e.target.value})}/>
            </div>
          </div>
        </div>
        {/* 1.3 Objectives */}
        <div>
          <h3 className="font-semibold mb-2">1.3 Objectives of Undertaking</h3>
          <textarea className="border rounded p-2 w-full" rows={3}
            value={objectives} onChange={e => setObjectives(e.target.value)} />
        </div>
        {/* 1.4 Legal & Institutional Framework */}
        <div>
          <h3 className="font-semibold mb-2">1.4 Legal and Institutional Framework</h3>
          <label className="font-medium">Company's Environmental Policy Statement</label>
          <textarea className="border rounded p-2 w-full mb-4" rows={2}
            value={envPolicy} onChange={e => setEnvPolicy(e.target.value)} />
          <label className="font-medium">Relevant policies, legislative and regulatory framework</label>
          <DynamicTable
            columns={[
              { name: "policy", label: "Policy/Legislation/Regulatory Framework" },
              { name: "relevance", label: "Relevance to Project" }
            ]}
            data={legalRegulations}
            setData={setLegalRegulations}
            addRowLabel="Add Policy/Legislation"
          />
        </div>
        {/* 1.5 Previous Experience */}
        <div>
          <h3 className="font-semibold mb-2">1.5 Summary of Previous Experiences</h3>
          <textarea className="border rounded p-2 w-full" rows={3}
            value={experience} onChange={e => setExperience(e.target.value)} />
        </div>
      </section>

      {/* 2.0 Baseline Information */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">2.0 Baseline Information</h2>
        <div>
          <label className="font-medium">2.1 Baseline Environment Information</label>
          <textarea className="border rounded p-2 w-full" rows={3}
            value={baselineInfo} onChange={e => setBaselineInfo(e.target.value)} />
        </div>
        <div>
          <label className="font-medium">2.2 Environmental Components</label>
          <DynamicTable
            columns={[
              { name: "component", label: "Environmental Component" },
              { name: "baseline", label: "Baseline Information" },
              { name: "source", label: "Source of Data/Information" }
            ]}
            data={envComponents}
            setData={setEnvComponents}
          />
        </div>
        <div>
          <label className="font-medium">2.3 Alternative Sites, Processes, Technologies, Pollution Control</label>
          <DynamicTable
            columns={[
              { name: "item", label: "Item/Description" },
              { name: "alt1", label: "Alternative 1" },
              { name: "alt2", label: "Alternative 2" },
              { name: "alt3", label: "Alternative 3" },
              { name: "preferred", label: "Preferred Choice" },
              { name: "reasons", label: "Reasons for Preferred Choice" },
            ]}
            data={alternatives}
            setData={setAlternatives}
          />
        </div>
      </section>

      {/* 3.0 Description of the Undertaking */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">3.0 Description of the Undertaking</h2>
        <div>
          <label className="font-medium">3.1 Proposed Production Process</label>
          <DynamicTable
            columns={[
              { name: "stage", label: "Process Stage/Unit Operation" },
              { name: "description", label: "Description" },
              { name: "waste", label: "Types of Waste" },
              { name: "mitigation", label: "Minimisation/Control & Mitigation Measures" },
            ]}
            data={processes}
            setData={setProcesses}
          />
        </div>
        {/* Raw Materials */}
        <div>
          <h3 className="font-semibold">3.2 Proposed Raw Materials</h3>
          <h4 className="font-medium">3.2.1 Constructional Phase</h4>
          <DynamicTable
            columns={[
              { name: "material", label: "Raw Materials/Chemicals" },
              { name: "source", label: "Sources" },
              { name: "packaging", label: "Type of Packaging" },
              { name: "characterization", label: "Characterization" },
              { name: "toxic", label: "Toxic" },
              { name: "corrosive", label: "Corrosive" },
              { name: "flammable", label: "Flammable" },
              { name: "nonhazard", label: "Non-hazardous" },
              { name: "estimate", label: "Estimate Consumption Levels" }
            ]}
            data={rawMaterialsConstruction}
            setData={setRawMaterialsConstruction}
          />
          <h4 className="font-medium">3.2.2 Operational Phase</h4>
          <DynamicTable
            columns={[
              { name: "material", label: "Raw Materials/Chemicals" },
              { name: "source", label: "Sources" },
              { name: "packaging", label: "Type of Packaging" },
              { name: "classification", label: "Classification" },
              { name: "hazardous", label: "Hazardous" },
              { name: "nonhazard", label: "Non-hazardous" },
              { name: "estimate", label: "Estimate Consumption Levels" }
            ]}
            data={rawMaterialsOperation}
            setData={setRawMaterialsOperation}
          />
        </div>
        {/* Equipment */}
        <div>
          <h3 className="font-semibold">3.3 Proposed Machinery/Equipment</h3>
          <h4 className="font-medium">3.3.1 Constructional Phase</h4>
          <DynamicTable
            columns={[
              { name: "type", label: "Type" },
              { name: "quantity", label: "Quantity" },
              { name: "capacity", label: "Capacity" },
              { name: "power", label: "Power Rating" },
              { name: "year", label: "Year of Manufacture" },
              { name: "country", label: "Country of Origin" }
            ]}
            data={equipmentConstruction}
            setData={setEquipmentConstruction}
          />
          <h4 className="font-medium">3.3.2 Operational Phase</h4>
          <DynamicTable
            columns={[
              { name: "type", label: "Type" },
              { name: "quantity", label: "Quantity" },
              { name: "capacity", label: "Capacity" },
              { name: "power", label: "Power Rating" },
              { name: "year", label: "Year of Manufacture" },
              { name: "country", label: "Country of Origin" }
            ]}
            data={equipmentOperation}
            setData={setEquipmentOperation}
          />
        </div>
      </section>

      {/* 4.0 Consultations */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">4.0 Consultations</h2>
        <DynamicTable
          columns={[
            { name: "stakeholder", label: "Identified Stakeholder" },
            { name: "classification", label: "Classification" },
            { name: "date", label: "Date of Consultation" },
            { name: "concerns", label: "Concerns" },
            { name: "measures", label: "Suggested Measures" }
          ]}
          data={stakeholders}
          setData={setStakeholders}
        />
      </section>

      {/* 5.0 Identification, Analysis and Evaluation of Impacts */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">5.0 Identification, Analysis and Evaluation of Impacts</h2>
        <DynamicTable
          columns={[
            { name: "impact", label: "Environmental/Socio-economic Impacts" },
            { name: "receptor", label: "Impact Receptor" },
            { name: "significance", label: "Significance of Impact" }
          ]}
          data={impacts}
          setData={setImpacts}
        />
      </section>

      {/* 6.0 Mitigation Measures */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">6.0 Mitigation Measures</h2>
        <DynamicTable
          columns={[
            { name: "impact", label: "Impact" },
            { name: "measures", label: "Mitigation Measures" }
          ]}
          data={mitigations}
          setData={setMitigations}
        />
      </section>

      {/* 7.0 Environmental Monitoring */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">7.0 Environmental Monitoring</h2>
        <DynamicTable
          columns={[
            { name: "indicator", label: "Performance Indicator" },
            { name: "parameters", label: "Parameters to be Monitored" },
            { name: "frequency", label: "Frequency" },
            { name: "reporting", label: "Reporting Regime" },
            { name: "budget", label: "Budget (GHS)" },
            { name: "officer", label: "Responsible Officer" }
          ]}
          data={monitoring}
          setData={setMonitoring}
        />
      </section>

      {/* 8.0 Decommissioning Plan */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">8.0 Decommissioning Plan (if applicable)</h2>
        <DynamicTable
          columns={[
            { name: "component", label: "Project Component(s)" },
            { name: "impact", label: "Associated Impact" },
            { name: "measures", label: "Mitigation Measures" },
            { name: "timeline", label: "Timeline" },
            { name: "budget", label: "Budget" },
            { name: "responsibility", label: "Responsibility" }
          ]}
          data={decommission}
          setData={setDecommission}
        />
      </section>

      {/* 9.0 Conclusions */}
      <section>
        <h2 className="text-xl font-semibold border-b pb-2">9.0 Conclusions</h2>
        <textarea className="border rounded p-2 w-full" rows={3}
          value={conclusion} onChange={e => setConclusion(e.target.value)} />
      </section>

      {/* 10.0 Attachments */}
      <section>
        <h2 className="text-xl font-semibold border-b pb-2">10.0 Attachments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" checked={attachments.sitePlan}
              onChange={e => setAttachments({...attachments, sitePlan: e.target.checked})}/> Authentic site plan
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" checked={attachments.blockPlan}
              onChange={e => setAttachments({...attachments, blockPlan: e.target.checked})}/> Block plan of the site
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" checked={attachments.sitePhotos}
              onChange={e => setAttachments({...attachments, sitePhotos: e.target.checked})}/> Photographs of the site
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" checked={attachments.zoningLetter}
              onChange={e => setAttachments({...attachments, zoningLetter: e.target.checked})}/> Zoning letter from Landuse & Spatial Planning
          </label>
        </div>
      </section>

      {/* 11.0 Declaration */}
      <section>
        <h2 className="text-xl font-semibold border-b pb-2">11.0 Declaration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name</label>
            <input className="border rounded p-2 w-full" type="text" value={declaration.name}
              onChange={e => setDeclaration({...declaration, name: e.target.value})}/>
          </div>
          <div>
            <label className="font-medium">Position/Designation</label>
            <input className="border rounded p-2 w-full" type="text" value={declaration.position}
              onChange={e => setDeclaration({...declaration, position: e.target.value})}/>
          </div>
          <div>
            <label className="font-medium">Signature/Stamp</label>
            <input className="border rounded p-2 w-full" type="text" value={declaration.signature}
              onChange={e => setDeclaration({...declaration, signature: e.target.value})}/>
          </div>
          <div>
            <label className="font-medium">Date</label>
            <input className="border rounded p-2 w-full" type="date" value={declaration.date}
              onChange={e => setDeclaration({...declaration, date: e.target.value})}/>
          </div>
        </div>
      </section>

      <div className="mt-10 text-center">
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

export default EPAForm;
