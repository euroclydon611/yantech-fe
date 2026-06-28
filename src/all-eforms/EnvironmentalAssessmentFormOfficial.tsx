import React, { useState, ChangeEvent, FormEvent } from 'react';

// Define the interface for form data
interface FormData {
  dateOfInspection: string;
  // Section 1.0
  nameOfServiceStation: string;
  parentOilMarketingCompany: string;
  yearOfEstablishment: string;
  location: string;
  contactPerson: string;
  contactPersonPosition: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  // Section 1.7 Permits
  epaEnvironmentalPermit: boolean;
  epaEnvironmentalCertificate: boolean;
  gnfsFirePermit: boolean;
  gnfsFireCertificate: boolean;
  npaConstructionPermit: boolean;
  npaOperationalPermit: boolean;
  tcpdDevelopmentPermit: boolean;
  tcpdBuildingPermit: boolean;

  // Section 2.0
  changesInAdjacentLandUses: 'Yes' | 'No' | '';
  changesCompatibleWithFacility?: 'Yes' | 'No' | ''; // Conditional
  currentZoning: string; // 2.3
  approxDistanceToNearestFacility: string; // 2.4
  adjacentLandUsesDescription: string; // 2.5
  geographicalCoordinates: string; // Second 2.3
  nearnessToWaterBody: string; // 2.6

  // Section 3.0
  isFuelFillingStation: boolean; // 3.1
  isFuelServiceStation: boolean; // 3.1
  // Services Provided 3.2
  serviceDispensingFuel: boolean;
  serviceLubeBay: boolean;
  serviceShoppingMart: boolean;
  serviceWashingBay: boolean;
  serviceRestaurant: boolean;
  serviceBankingFacility: boolean;
  serviceLubricantShop: boolean;
  serviceOffices: boolean;
  serviceOthersSpecify: string;
  // Storage Tanks 3.3
  tankTypeSteel: boolean; // 3.3.1
  tankTypeFRP: boolean; // 3.3.1
  tankPlacementSurface: boolean; // 3.3.2
  tankPlacementUnderground: boolean; // 3.3.2
  // Petrol Tanks (Part of 3.3.3)
  petrolTankNumberCapacity: string;
  petrolTankYearInstallation: string;
  petrolTankYearReplacement: string;
  // Diesel Tanks (Part of 3.3.3)
  dieselTankNumberCapacity: string;
  dieselTankYearInstallation: string;
  dieselTankYearReplacement: string;
  // Kerosene Tanks (Part of 3.3.3)
  keroseneTankNumberCapacity: string;
  keroseneTankYearInstallation: string;
  keroseneTankYearReplacement: string;
  numberOfWorkers: string; // 3.4

  // Section 4.0
  // Water 4.1
  waterSourceGWC: boolean;
  waterSourceTanker: boolean;
  waterSourceWellBorehole: boolean;
  waterSourceOthersSpecify: string;
  // Power 4.2
  powerSourceECG: boolean;
  powerSourceStandbyGenerator: boolean;
  powerSourceOthersSpecify: string;
  // Forecourt Facilities 4.3
  siteDrainageSystem: 'Available' | 'Not-Available' | ''; // 4.3.1
  forecourtCondition: 'Paved' | 'Unpaved' | ''; // 4.3.2
  forecourtFacilitiesOthersSpecify: string; // Others (Specify) under 4.3.2
  numberOfWashrooms: string; // 4.3.3
  conditionOfWashrooms: string; // 4.3.4
  forecourtCommentsObservation: string; // 4.3.5

  // Section 5.0 (Management of Impacts)
  // 5.1 Traffic Management (Implicit from structure, fields listed directly)
  facilityAccessEntryExit: 'Yes' | 'No' | '';
  parkingSpacesCapacity: string;
  accidentsLastYear: string;
  // 5.2 Occupational Health and Safety
  attendantTrainingEHS: 'Yes' | 'No' | ''; // 5.2.1
  firstAidKitAvailable: 'Yes' | 'No' | ''; // 5.2.2
  assemblyPointEmergency: 'Yes' | 'No' | ''; // 5.2.3
  protectiveClothingList: string; // 5.2.4
  // 5.3 Emergency Response Measures
  // 5.3.1 Fire, Oil Spill and Vehicular Accidents
  emergencyResponsePlan_FOSVA: 'Yes' | 'No' | '';
  emergencyResponseSpillKit: 'Yes' | 'No' | '';
  tanksBuriedInConcreteBunkers: 'Yes' | 'No' | '';
  // 5.3.2 Training
  staffTrainingFireFighting: 'Yes' | 'No' | '';
  numberOfFireDrillsYear: string;
  staffTrainingOilSpillManagement: 'Yes' | 'No' | '';
  attendantTrainingSafeProductHandling: 'Yes' | 'No' | '';

  // Section 6.0 Environmental Monitoring
  // 6.1 Record Keeping
  recordWasteOilSludgeGeneration: 'Yes' | 'No' | '';
  recordSpillsLeaks: 'Yes' | 'No' | '';
  recordDisposalWasteOilSludge: 'Yes' | 'No' | '';
  recordDisposalSolidWaste: 'Yes' | 'No' | '';
  recordAccidents: 'Yes' | 'No' | ''; // "Accidents" under 6.1
  // 6.3 Investigation Reports
  reportAccidentsFSL: 'Yes' | 'No' | ''; // Accidents (fire, spillage, leaks, etc) reports
  reportHydraulicPressureTests: 'Yes' | 'No' | '';

  // Section 7.0
  neighbourhoodConsultation: string;

  // Section 8.0
  generalCommentsRecommendations: string;

  // Section 9.0
  specialConditionsCertification: string;

  // Signatures
  officer1Name: string;
  officer1Date: string;
  officer2Name: string;
  officer2Date: string;
  officer3Name: string;
  officer3Date: string;
}

const initialFormData: FormData = {
  dateOfInspection: '',
  nameOfServiceStation: '',
  parentOilMarketingCompany: '',
  yearOfEstablishment: '',
  location: '',
  contactPerson: '',
  contactPersonPosition: '',
  address: '',
  tel: '',
  fax: '',
  email: '',
  epaEnvironmentalPermit: false,
  epaEnvironmentalCertificate: false,
  gnfsFirePermit: false,
  gnfsFireCertificate: false,
  npaConstructionPermit: false,
  npaOperationalPermit: false,
  tcpdDevelopmentPermit: false,
  tcpdBuildingPermit: false,
  changesInAdjacentLandUses: '',
  changesCompatibleWithFacility: '',
  currentZoning: '',
  approxDistanceToNearestFacility: '',
  adjacentLandUsesDescription: '',
  geographicalCoordinates: '',
  nearnessToWaterBody: '',
  isFuelFillingStation: false,
  isFuelServiceStation: false,
  serviceDispensingFuel: false,
  serviceLubeBay: false,
  serviceShoppingMart: false,
  serviceWashingBay: false,
  serviceRestaurant: false,
  serviceBankingFacility: false,
  serviceLubricantShop: false,
  serviceOffices: false,
  serviceOthersSpecify: '',
  tankTypeSteel: false,
  tankTypeFRP: false,
  tankPlacementSurface: false,
  tankPlacementUnderground: false,
  petrolTankNumberCapacity: '',
  petrolTankYearInstallation: '',
  petrolTankYearReplacement: '',
  dieselTankNumberCapacity: '',
  dieselTankYearInstallation: '',
  dieselTankYearReplacement: '',
  keroseneTankNumberCapacity: '',
  keroseneTankYearInstallation: '',
  keroseneTankYearReplacement: '',
  numberOfWorkers: '',
  waterSourceGWC: false,
  waterSourceTanker: false,
  waterSourceWellBorehole: false,
  waterSourceOthersSpecify: '',
  powerSourceECG: false,
  powerSourceStandbyGenerator: false,
  powerSourceOthersSpecify: '',
  siteDrainageSystem: '',
  forecourtCondition: '',
  forecourtFacilitiesOthersSpecify: '',
  numberOfWashrooms: '',
  conditionOfWashrooms: '',
  forecourtCommentsObservation: '',
  facilityAccessEntryExit: '',
  parkingSpacesCapacity: '',
  accidentsLastYear: '',
  attendantTrainingEHS: '',
  firstAidKitAvailable: '',
  assemblyPointEmergency: '',
  protectiveClothingList: '',
  emergencyResponsePlan_FOSVA: '',
  emergencyResponseSpillKit: '',
  tanksBuriedInConcreteBunkers: '',
  staffTrainingFireFighting: '',
  numberOfFireDrillsYear: '',
  staffTrainingOilSpillManagement: '',
  attendantTrainingSafeProductHandling: '',
  recordWasteOilSludgeGeneration: '',
  recordSpillsLeaks: '',
  recordDisposalWasteOilSludge: '',
  recordDisposalSolidWaste: '',
  recordAccidents: '',
  reportAccidentsFSL: '',
  reportHydraulicPressureTests: '',
  neighbourhoodConsultation: '',
  generalCommentsRecommendations: '',
  specialConditionsCertification: '',
  officer1Name: '',
  officer1Date: '',
  officer2Name: '',
  officer2Date: '',
  officer3Name: '',
  officer3Date: '',
};

// Basic styling for demonstration.
const styles: { [key: string]: React.CSSProperties } = {
  formContainer: { fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' },
  header: { textAlign: 'center', marginBottom: '20px' },
  epaTextLogo: { fontSize: '2em', fontWeight: 'bold', color: '#4CAF50', marginBottom: '10px' },
  section: { marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff' },
  sectionTitle: { fontSize: '1.4em', color: '#333', borderBottom: '2px solid #4CAF50', paddingBottom: '10px', marginBottom: '20px' },
  subSectionTitle: { fontSize: '1.1em', fontWeight: 'bold', color: '#444', marginTop: '20px', marginBottom: '15px' },
  fieldGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' },
  inlineLabel: { fontWeight: 'bold', color: '#555', marginRight: '10px'},
  input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', minHeight: '100px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  checkboxGroup: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
  checkboxLabel: { marginLeft: '8px', fontWeight: 'normal', color: '#333' },
  radioGroupContainer: { marginBottom: '10px' },
  radioGroup: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
  radioLabel: { display: 'flex', alignItems: 'center', marginLeft: '5px', fontWeight: 'normal', color: '#333', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  permitGroup: { marginBottom: '15px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#fcfcfc' },
  permitTitle: { fontWeight: 'bold', marginBottom: '10px', color: '#333' },
  button: { backgroundColor: '#4CAF50', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', marginTop: '20px' },
  officerSignatureGroup: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px 20px', alignItems: 'center', marginBottom: '10px' },
};

// Helper Components
interface TextInputProps { label: string; name: keyof FormData; value: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; placeholder?: string; required?: boolean; isTextArea?: boolean; }
const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, type = "text", placeholder, required, isTextArea = false }) => (
  <div style={styles.fieldGroup}>
    <label htmlFor={name} style={styles.label}>{label}</label>
    {isTextArea ? <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} style={styles.textarea} />
                 : <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} style={styles.input} />}
  </div>
);

interface CheckboxFieldProps { label: string; name: keyof FormData; checked: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }
const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, name, checked, onChange }) => (
  <div style={styles.checkboxGroup}>
    <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} />
    <label htmlFor={name} style={styles.checkboxLabel}>{label}</label>
  </div>
);

interface YesNoRadioGroupProps { label: string; name: keyof FormData; value: 'Yes' | 'No' | ''; onChange: (e: ChangeEvent<HTMLInputElement>) => void; required?: boolean; }
const YesNoRadioGroup: React.FC<YesNoRadioGroupProps> = ({ label, name, value, onChange, required }) => (
  <div style={styles.radioGroupContainer}>
    <span style={styles.inlineLabel}>{label}</span>
    <div style={styles.radioGroup}>
      <label style={styles.radioLabel}><input type="radio" name={name} value="Yes" checked={value === 'Yes'} onChange={onChange} required={required} /> Yes</label>
      <label style={styles.radioLabel}><input type="radio" name={name} value="No" checked={value === 'No'} onChange={onChange} required={required} /> No</label>
    </div>
  </div>
);

interface CustomRadioGroupProps { label: string; name: keyof FormData; options: { value: string; label: string }[]; selectedValue: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }
const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ label, name, options, selectedValue, onChange }) => (
    <div style={styles.radioGroupContainer}>
        <span style={styles.inlineLabel}>{label}</span>
        <div style={styles.radioGroup}>
            {options.map(option => (
                <label key={option.value} style={styles.radioLabel}>
                    <input type="radio" name={name} value={option.value} checked={selectedValue === option.value} onChange={onChange} />
                    {option.label}
                </label>
            ))}
        </div>
    </div>
);


const EnvironmentalAssessmentFormOfficial: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any })); // Cast as any to satisfy specific union types
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted (Official Use Only):', formData);
    // alert('Checklist submitted! (See console for data)');
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <header style={styles.header}>
          <div style={styles.epaTextLogo}>epa</div>
          <h1>SITE VERIFICATION CHECKLIST</h1>
          <p>(OFFICIAL USE ONLY)</p>
          <h2>PETROLEUM PRODUCTS RETAIL OUTLETS</h2>
          <h3>FUEL SERVICE AND FILLING STATIONS</h3>
          <TextInput label="Date of Inspection" name="dateOfInspection" type="date" value={formData.dateOfInspection} onChange={handleChange} />
        </header>

        {/* Section 1.0 COMPANY PROFILE */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1.0 COMPANY PROFILE</h2>
          <TextInput label="1.1 Name of Service Station" name="nameOfServiceStation" value={formData.nameOfServiceStation} onChange={handleChange} />
          <TextInput label="1.2 Parent Oil Marketing Company" name="parentOilMarketingCompany" value={formData.parentOilMarketingCompany} onChange={handleChange} />
          <TextInput label="1.3 Year of Establishment" name="yearOfEstablishment" value={formData.yearOfEstablishment} onChange={handleChange} placeholder="YYYY"/>
          <TextInput label="1.4 Location" name="location" value={formData.location} onChange={handleChange} />
          <div style={styles.grid}>
            <TextInput label="1.5 Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
            <TextInput label="Position" name="contactPersonPosition" value={formData.contactPersonPosition} onChange={handleChange} />
          </div>
          <TextInput label="1.6 Address" name="address" value={formData.address} onChange={handleChange} isTextArea />
          <div style={styles.grid}>
            <TextInput label="Tel" name="tel" type="tel" value={formData.tel} onChange={handleChange} />
            <TextInput label="Fax" name="fax" value={formData.fax} onChange={handleChange} />
          </div>
          <TextInput label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} />

          <h3 style={styles.subSectionTitle}>1.7 Permits/Licences and Certificates</h3>
          <div style={styles.grid}>
            <div style={styles.permitGroup}>
              <p style={styles.permitTitle}>Environmental Protection Authority</p>
              <CheckboxField label="Environmental Permit" name="epaEnvironmentalPermit" checked={formData.epaEnvironmentalPermit} onChange={handleChange} />
              <CheckboxField label="Environmental Certificate" name="epaEnvironmentalCertificate" checked={formData.epaEnvironmentalCertificate} onChange={handleChange} />
            </div>
            <div style={styles.permitGroup}>
              <p style={styles.permitTitle}>Ghana National Fire Service</p>
              <CheckboxField label="Fire Permit" name="gnfsFirePermit" checked={formData.gnfsFirePermit} onChange={handleChange} />
              <CheckboxField label="Fire Certificate" name="gnfsFireCertificate" checked={formData.gnfsFireCertificate} onChange={handleChange} />
            </div>
            <div style={styles.permitGroup}>
              <p style={styles.permitTitle}>National Petroleum Authority</p>
              <CheckboxField label="Construction Permit" name="npaConstructionPermit" checked={formData.npaConstructionPermit} onChange={handleChange} />
              <CheckboxField label="Operational Permit" name="npaOperationalPermit" checked={formData.npaOperationalPermit} onChange={handleChange} />
            </div>
            <div style={styles.permitGroup}>
              <p style={styles.permitTitle}>Town and Country Planning Department</p>
              <CheckboxField label="Development Permit" name="tcpdDevelopmentPermit" checked={formData.tcpdDevelopmentPermit} onChange={handleChange} />
              <CheckboxField label="Building Permit" name="tcpdBuildingPermit" checked={formData.tcpdBuildingPermit} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* Section 2.0 SITE DESCRIPTION */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2.0 SITE DESCRIPTION</h2>
          <h3 style={styles.subSectionTitle}>2.1 Adjacent Land Uses</h3>
          <YesNoRadioGroup label="Has there been changes in adjacent land uses?" name="changesInAdjacentLandUses" value={formData.changesInAdjacentLandUses} onChange={handleRadioChange} />
          {formData.changesInAdjacentLandUses === 'Yes' && (
            <YesNoRadioGroup label="If yes, are the changes compatible with the facility?" name="changesCompatibleWithFacility" value={formData.changesCompatibleWithFacility || ''} onChange={handleRadioChange} />
          )}
          <TextInput label="2.3 Current Zoning" name="currentZoning" value={formData.currentZoning} onChange={handleChange} />
          <TextInput label="2.4 Approximate distance to the nearest facility" name="approxDistanceToNearestFacility" value={formData.approxDistanceToNearestFacility} onChange={handleChange} />
          <TextInput label="2.5 Adjacent land uses (Description)" name="adjacentLandUsesDescription" value={formData.adjacentLandUsesDescription} onChange={handleChange} isTextArea/>
          <TextInput label="2.3 Geographical Coordinates (where available)" name="geographicalCoordinates" value={formData.geographicalCoordinates} onChange={handleChange} />
          <TextInput label="2.6 Nearness to a water body" name="nearnessToWaterBody" value={formData.nearnessToWaterBody} onChange={handleChange} />
        </section>

        {/* Section 3.0 TYPE OF UNDERTAKING */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3.0 TYPE OF UNDERTAKING</h2>
          <div style={styles.fieldGroup}>
            <span style={styles.inlineLabel}>3.1 Type:</span>
            <CheckboxField label="Fuel Filling Station" name="isFuelFillingStation" checked={formData.isFuelFillingStation} onChange={handleChange} />
            <CheckboxField label="Fuel Service Station" name="isFuelServiceStation" checked={formData.isFuelServiceStation} onChange={handleChange} />
          </div>

          <h3 style={styles.subSectionTitle}>3.2 Services Provided</h3>
          <div style={styles.grid}>
            <CheckboxField label="Dispensing of Fuel" name="serviceDispensingFuel" checked={formData.serviceDispensingFuel} onChange={handleChange} />
            <CheckboxField label="Lube Bay" name="serviceLubeBay" checked={formData.serviceLubeBay} onChange={handleChange} />
            <CheckboxField label="Shopping Mart" name="serviceShoppingMart" checked={formData.serviceShoppingMart} onChange={handleChange} />
            <CheckboxField label="Washing Bay" name="serviceWashingBay" checked={formData.serviceWashingBay} onChange={handleChange} />
            <CheckboxField label="Restaurant" name="serviceRestaurant" checked={formData.serviceRestaurant} onChange={handleChange} />
            <CheckboxField label="Banking Facility" name="serviceBankingFacility" checked={formData.serviceBankingFacility} onChange={handleChange} />
            <CheckboxField label="Lubricant Shop" name="serviceLubricantShop" checked={formData.serviceLubricantShop} onChange={handleChange} />
            <CheckboxField label="Offices" name="serviceOffices" checked={formData.serviceOffices} onChange={handleChange} />
          </div>
          <TextInput label="Others (Specify)" name="serviceOthersSpecify" value={formData.serviceOthersSpecify} onChange={handleChange} />

          <h3 style={styles.subSectionTitle}>3.3 Storage Tanks</h3>
          <div style={styles.fieldGroup}>
            <span style={styles.inlineLabel}>3.3.1 Type(s) of Tank:</span>
            <CheckboxField label="Steel" name="tankTypeSteel" checked={formData.tankTypeSteel} onChange={handleChange} />
            <CheckboxField label="Fibreglass-Reinforced Plastics (FRP)" name="tankTypeFRP" checked={formData.tankTypeFRP} onChange={handleChange} />
          </div>
          <div style={styles.fieldGroup}>
            <span style={styles.inlineLabel}>3.3.2 Placement of Storage Tanks:</span>
            <CheckboxField label="Surface" name="tankPlacementSurface" checked={formData.tankPlacementSurface} onChange={handleChange} />
            <CheckboxField label="Underground" name="tankPlacementUnderground" checked={formData.tankPlacementUnderground} onChange={handleChange} />
          </div>

          <h4 style={styles.subSectionTitle}>3.3.3 Installed Capacity of Storage Tanks</h4>
          <div>
            <p style={styles.permitTitle}>Petrol</p>
            <TextInput label="Number and capacity" name="petrolTankNumberCapacity" value={formData.petrolTankNumberCapacity} onChange={handleChange} />
            <div style={styles.grid}>
              <TextInput label="Year of installation" name="petrolTankYearInstallation" value={formData.petrolTankYearInstallation} onChange={handleChange} />
              <TextInput label="Year of replacement" name="petrolTankYearReplacement" value={formData.petrolTankYearReplacement} onChange={handleChange} />
            </div>
          </div>
          <div>
            <p style={styles.permitTitle}>Diesel</p>
            <TextInput label="Number and capacity" name="dieselTankNumberCapacity" value={formData.dieselTankNumberCapacity} onChange={handleChange} />
            <div style={styles.grid}>
              <TextInput label="Year of installation" name="dieselTankYearInstallation" value={formData.dieselTankYearInstallation} onChange={handleChange} />
              <TextInput label="Year of replacement" name="dieselTankYearReplacement" value={formData.dieselTankYearReplacement} onChange={handleChange} />
            </div>
          </div>
          <div>
            <p style={styles.permitTitle}>Kerosene</p>
            <TextInput label="Number and capacity" name="keroseneTankNumberCapacity" value={formData.keroseneTankNumberCapacity} onChange={handleChange} />
            <div style={styles.grid}>
              <TextInput label="Year of installation" name="keroseneTankYearInstallation" value={formData.keroseneTankYearInstallation} onChange={handleChange} />
              <TextInput label="Year of replacement" name="keroseneTankYearReplacement" value={formData.keroseneTankYearReplacement} onChange={handleChange} />
            </div>
          </div>
          <TextInput label="3.4 Number of Workers" name="numberOfWorkers" type="number" value={formData.numberOfWorkers} onChange={handleChange} />
        </section>

        {/* Section 4.0 INFRASTRUCTURE AND UTILITIES */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4.0 INFRASTRUCTURE AND UTILITIES</h2>
          <h3 style={styles.subSectionTitle}>4.1 Water (Sources, availability and storage)</h3>
          <div style={styles.fieldGroup}>
              <CheckboxField label="GWC" name="waterSourceGWC" checked={formData.waterSourceGWC} onChange={handleChange} />
              <CheckboxField label="Water Tanker Service" name="waterSourceTanker" checked={formData.waterSourceTanker} onChange={handleChange} />
              <CheckboxField label="Well/Borehole" name="waterSourceWellBorehole" checked={formData.waterSourceWellBorehole} onChange={handleChange} />
          </div>
          <TextInput label="Others (specify)" name="waterSourceOthersSpecify" value={formData.waterSourceOthersSpecify} onChange={handleChange} />

          <h3 style={styles.subSectionTitle}>4.2 Power (Source(s))</h3>
          <div style={styles.fieldGroup}>
              <CheckboxField label="ECG" name="powerSourceECG" checked={formData.powerSourceECG} onChange={handleChange} />
              <CheckboxField label="Stand-by Generator" name="powerSourceStandbyGenerator" checked={formData.powerSourceStandbyGenerator} onChange={handleChange} />
          </div>
          <TextInput label="Others (specify)" name="powerSourceOthersSpecify" value={formData.powerSourceOthersSpecify} onChange={handleChange} />

          <h3 style={styles.subSectionTitle}>4.3 Forecourt Facilities</h3>
          <CustomRadioGroup
            label="4.3.1 Site Drainage system:"
            name="siteDrainageSystem"
            options={[{value: 'Available', label: 'Available'}, {value: 'Not-Available', label: 'Not-Available'}]}
            selectedValue={formData.siteDrainageSystem}
            onChange={handleRadioChange}
          />
          <CustomRadioGroup
            label="4.3.2 Forecourt Condition:"
            name="forecourtCondition"
            options={[{value: 'Paved', label: 'Paved'}, {value: 'Unpaved', label: 'Unpaved'}]}
            selectedValue={formData.forecourtCondition}
            onChange={handleRadioChange}
          />
          <TextInput label="Others (Specify)" name="forecourtFacilitiesOthersSpecify" value={formData.forecourtFacilitiesOthersSpecify} onChange={handleChange} />
          <TextInput label="4.3.3 Number of washrooms" name="numberOfWashrooms" type="number" value={formData.numberOfWashrooms} onChange={handleChange} />
          <TextInput label="4.3.4 The condition of the washroom(s)" name="conditionOfWashrooms" value={formData.conditionOfWashrooms} onChange={handleChange} isTextArea />
          <TextInput label="4.3.5 Comments and Observation" name="forecourtCommentsObservation" value={formData.forecourtCommentsObservation} onChange={handleChange} isTextArea />
        </section>

        {/* Section 5.0 MANAGEMENT OF IMPACTS */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5.0 MANAGEMENT OF IMPACTS</h2>
            {/* 5.1 Traffic Management is an implicit sub-header */}
            <h3 style={styles.subSectionTitle}>5.1 Traffic Management</h3>
            <YesNoRadioGroup label="Access to facility: Entry and Exit:" name="facilityAccessEntryExit" value={formData.facilityAccessEntryExit} onChange={handleRadioChange} />
            <TextInput label="Parking spaces (capacity)" name="parkingSpacesCapacity" value={formData.parkingSpacesCapacity} onChange={handleChange} />
            <TextInput label="Number of accident(s) in the last year" name="accidentsLastYear" type="number" value={formData.accidentsLastYear} onChange={handleChange} />

            <h3 style={styles.subSectionTitle}>5.2 Occupational Health and Safety</h3>
            <YesNoRadioGroup label="5.2.1 Have attendant(s) received training in environment, health and safety?" name="attendantTrainingEHS" value={formData.attendantTrainingEHS} onChange={handleRadioChange} />
            <YesNoRadioGroup label="5.2.2 First aid kit" name="firstAidKitAvailable" value={formData.firstAidKitAvailable} onChange={handleRadioChange} />
            <YesNoRadioGroup label="5.2.3 An assembly point for emergency?" name="assemblyPointEmergency" value={formData.assemblyPointEmergency} onChange={handleRadioChange} />
            <TextInput label="5.2.4 Protective Clothing (List)" name="protectiveClothingList" value={formData.protectiveClothingList} onChange={handleChange} isTextArea />

            <h3 style={styles.subSectionTitle}>5.3 EMERGENCY RESPONSE MEASURES</h3>
            <h4 style={{...styles.subSectionTitle, fontSize: '1em', marginTop: '10px' }}>5.3.1 Fire, Oil Spill and Vehicular Accidents</h4>
            <YesNoRadioGroup label="Emergency response plan for Fire, Oil Spill and Vehicular Accidents" name="emergencyResponsePlan_FOSVA" value={formData.emergencyResponsePlan_FOSVA} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Emergency response spill kit" name="emergencyResponseSpillKit" value={formData.emergencyResponseSpillKit} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Are tanks buried in concrete bunkers" name="tanksBuriedInConcreteBunkers" value={formData.tanksBuriedInConcreteBunkers} onChange={handleRadioChange} />
            
            <h4 style={{...styles.subSectionTitle, fontSize: '1em', marginTop: '10px' }}>5.3.2 Training</h4>
            <YesNoRadioGroup label="Have staffs received training in fire fighting?" name="staffTrainingFireFighting" value={formData.staffTrainingFireFighting} onChange={handleRadioChange} />
            <TextInput label="Number of fire drills in a year" name="numberOfFireDrillsYear" type="number" value={formData.numberOfFireDrillsYear} onChange={handleChange} />
            <YesNoRadioGroup label="Have staffs received training in oil spill management?" name="staffTrainingOilSpillManagement" value={formData.staffTrainingOilSpillManagement} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Have attendants received training in safe product handling?" name="attendantTrainingSafeProductHandling" value={formData.attendantTrainingSafeProductHandling} onChange={handleRadioChange} />
        </section>

        {/* Section 6.0 ENVIRONMENTAL MONITORING */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>6.0 ENVIRONMENTAL MONITORING</h2>
            <h3 style={styles.subSectionTitle}>6.1 Record Keeping (Inspect records on the following):</h3>
            <YesNoRadioGroup label="Waste oil and sludge generation" name="recordWasteOilSludgeGeneration" value={formData.recordWasteOilSludgeGeneration} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Spills and Leaks" name="recordSpillsLeaks" value={formData.recordSpillsLeaks} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Disposal of waste oil and sludge" name="recordDisposalWasteOilSludge" value={formData.recordDisposalWasteOilSludge} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Disposal of solid waste" name="recordDisposalSolidWaste" value={formData.recordDisposalSolidWaste} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Accidents" name="recordAccidents" value={formData.recordAccidents} onChange={handleRadioChange} /> {/* This is the "Accidents" directly under "Disposal of solid waste" */}
            
            <h3 style={styles.subSectionTitle}>6.3 Investigation Reports</h3>
            <YesNoRadioGroup label="Accidents (fire, spillage, leaks, etc) reports" name="reportAccidentsFSL" value={formData.reportAccidentsFSL} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Hydraulic pressure tests Report" name="reportHydraulicPressureTests" value={formData.reportHydraulicPressureTests} onChange={handleRadioChange} />
        </section>

        {/* Section 7.0 NEIGHBOURHOOD CONSULTATION */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>7.0 NEIGHBOURHOOD CONSULTATION</h2>
            <TextInput label="" name="neighbourhoodConsultation" value={formData.neighbourhoodConsultation} onChange={handleChange} isTextArea placeholder="Enter details of neighbourhood consultation..." />
        </section>

        {/* Section 8.0 GENERAL COMMENTS AND RECOMMENDATIONS */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>8.0 GENERAL COMMENTS AND RECOMMENDATIONS</h2>
            <TextInput label="" name="generalCommentsRecommendations" value={formData.generalCommentsRecommendations} onChange={handleChange} isTextArea placeholder="Enter general comments and recommendations..." />
        </section>

        {/* Section 9.0 ANY SPECIAL CONDITIONS FOR CERTIFICATION */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>9.0 ANY SPECIAL CONDITIONS FOR CERTIFICATION</h2>
            <TextInput label="" name="specialConditionsCertification" value={formData.specialConditionsCertification} onChange={handleChange} isTextArea placeholder="Enter any special conditions for certification..." />
        </section>

        {/* Signatures */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Name and Signature of Officers</h2>
            {[1, 2, 3].map(i => (
                <div key={i} style={styles.officerSignatureGroup}>
                    <TextInput
                        label={`Officer ${i} Name`}
                        name={`officer${i}Name` as keyof FormData}
                        value={formData[`officer${i}Name` as keyof FormData] as string}
                        onChange={handleChange}
                        placeholder="Officer Name"
                    />
                    <TextInput
                        label={`Date`}
                        name={`officer${i}Date` as keyof FormData}
                        type="date"
                        value={formData[`officer${i}Date` as keyof FormData] as string}
                        onChange={handleChange}
                    />
                </div>
            ))}
        </section>

        <button type="submit" style={styles.button}>Submit Checklist</button>
      </form>
    </div>
  );
};

export default EnvironmentalAssessmentFormOfficial;