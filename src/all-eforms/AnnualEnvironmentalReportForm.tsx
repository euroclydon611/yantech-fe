import React, { useState, ChangeEvent, FormEvent } from 'react';

// Define the interface for the Annual Environmental Report form data
interface FormDataAER {
  yearOfReporting: string;

  // Section 1.0 COMPANY PROFILE
  nameOfServiceStation: string; // 1.1
  parentOilMarketingCompany: string; // 1.2
  yearOfEstablishment: string; // 1.3
  contactPerson: string; // 1.4
  contactPersonPosition: string; // 1.4
  address: string; // 1.5
  tel: string; // 1.5
  fax: string; // 1.5
  email: string; // 1.5
  companyPolicyEHS: string; // 1.6

  // Section 1.7 Permits/Licences and Certificates
  epaEnvironmentalPermit: boolean;
  epaEnvironmentalCertificate: boolean;
  gnfsFirePermit: boolean;
  gnfsFireCertificate: boolean;
  npaConstructionPermit: boolean;
  npaOperationalLicence: boolean; // Note: Licence, not Permit
  tcpdDevelopmentPermit: boolean;
  tcpdBuildingPermit: boolean;

  // Section 2.0 SITE DESCRIPTION
  locationMajorLandmarks: string; // 2.1
  geographicalCoordinates: string; // 2.2
  currentZoning: string; // 2.3
  approxDistanceToNearestFacility: string; // 2.4
  adjacentLandUses: string; // 2.5
  nearnessToWaterBody: string; // 2.6

  // Section 3.0 TYPE OF UNDERTAKING
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
  // Diesel Tanks
  dieselTankNumberCapacity: string;
  dieselTankYearInstallation: string;
  dieselTankYearReplacement: string;
  // Kerosene Tanks
  keroseneTankNumberCapacity: string;
  keroseneTankYearInstallation: string;
  keroseneTankYearReplacement: string;
  numberOfWorkers: string; // 3.4

  // Section 4.0 INFRASTRUCTURE AND UTILITIES
  // 4.1 Structures
  structuresEast: string;
  structuresWest: string;
  structuresNorth: string;
  structuresSouth: string;
  // 4.2 Water
  waterSourceGWC: boolean;
  waterSourceTanker: boolean;
  waterSourceWellBorehole: boolean;
  waterSourceOthersSpecify: string;
  // 4.3 Power
  powerSourceECG: boolean;
  powerSourceStandbyGenerator: boolean;
  powerSourceOthersSpecify: string;
  // 4.4 Forecourt Facilities
  hasSiteDrainageSystem: 'Yes' | 'No' | ''; // 4.4.1
  forecourtCondition: 'Paved' | 'Unpaved' | ''; // 4.4.2 (Radio group)
  washroomsNumber: string; // 4.4.3
  washroomsCleaningFrequency: string; // 4.4.4

  // Section 5.0 POTENTIAL ENVIRONMENTAL IMPACTS
  // 5.1 VOCs
  vocUnloadingImpacts: string;
  vocDispensingImpacts: string;
  vocLeakageSpillsImpacts: string;
  // 5.2 Effluent/Liquid Waste
  effluentWashroomsRestaurantsImpacts: string;
  effluentRainWaterRunOffImpacts: string;
  effluentWashingBayDischargesImpacts: string;
  effluentWasteOilsImpacts: string;
  effluentSpillsLeaksImpacts: string;
  // 5.3 Solid Waste/Sludge
  solidSludgeImpacts: string;
  solidContaminatedAbsorbentsImpacts: string;
  solidOilFiltersImpacts: string;
  solidEmptyDrumsImpacts: string;
  // 5.4 Fire
  fireOilSpillsImpacts: string;
  fireNakedFireImpacts: string;
  fireBRVsImpacts: string;
  fireUsedOilsImpacts: string;
  // 5.5 Noise
  noiseTootingHornImpacts: string;
  noiseGeneratorImpacts: string;
  noiseRestaurantBarImpacts: string;
  // 5.6 Traffic
  trafficEntryExitImpacts: string;
  trafficBRVsDischargeImpacts: string;
  // 5.7 Occupational Health and Safety
  ohsFireImpacts: string;
  ohsInhalationVOCsImpacts: string;
  ohsHeatImpacts: string;
  ohsNoiseImpacts: string;

  // Section 6.0 MANAGEMENT OF IMPACTS
  managementVOCs: string; // 6.1
  managementEffluentLiquidWaste: string; // 6.2
  managementSolidWasteSludge: string; // 6.3
  managementFire: string; // 6.4
  managementNoise: string; // 6.5
  // 6.6 Traffic Management
  trafficMgmtAccessFacility: 'Yes' | 'No' | '';
  trafficMgmtParkingSpaces: string;
  trafficMgmtAccidentsLastYear: string;
  managementOHS: string; // 6.7
  // 6.8 Soil Investigations
  conductedSoilInvestigation: 'Yes' | 'No' | '';
  soilInvestigationWhen: string; // if yes

  // Section 7.0 EMERGENCY RESPONSE MEASURES
  // 7.1 Fire, Oil Spill, Vehicular Accidents
  hasEmergencyResponsePlanFOSVA: 'Yes' | 'No' | '';
  hasEmergencyResponseSpillKit: 'Yes' | 'No' | '';
  tanksBuriedInConcreteBunkers: 'Yes' | 'No' | '';
  tanksBuriedWhen: string; // if yes
  hasStandardFirstAidKit: 'Yes' | 'No' | '';
  hasAssemblyPointEmergency: 'Yes' | 'No' | '';
  fireExtinguishersNumber: string;
  // 7.2 Education and Training
  attendantsTrainedEHS: 'Yes' | 'No' | '';
  attendantsTrainedEHSOften: string; // if yes
  staffTrainedFireFighting: 'Yes' | 'No' | '';
  fireDrillsPerYear: string;
  staffTrainedOilSpillManagement: 'Yes' | 'No' | '';
  attendantsTrainedSafeProductHandling: 'Yes' | 'No' | '';

  // Section 8.0 ENVIRONMENTAL MONITORING
  // 8.1 Forecourt Monitoring
  regularInspectionsConducted: 'Yes' | 'No' | '';
  // 8.2 Record Keeping
  recordWasteOilSludge: 'Yes' | 'No' | '';
  recordSpillsLeaks: 'Yes' | 'No' | '';
  recordDisposalWasteOilSludge: 'Yes' | 'No' | '';
  recordDisposalSolidWaste: 'Yes' | 'No' | '';
  recordAccidents: 'Yes' | 'No' | '';
  // 8.3
  investigationSpillFireVehicularAccidents: 'Yes' | 'No' | '';
  investigationsLastYearCount: string;
  // 8.4
  conductHydraulicPressureTests: 'Yes' | 'No' | '';
  hydraulicPressureTestsLastTime: string; // if yes
  // 8.5
  fireExtinguishersMonitoringFrequency: string;

  // Section 9.0 Complaints
  complaintsReceivedLastYear: 'Yes' | 'No' | '';
  complaintsHowMany: string; // if yes
  complaintsNature: string;
  complaintsHowDealtWith: string;

  // Section 10.0 CHALLENGES/CONCERNS
  challengesConcernsOperations: string;

  // Section 11.0 ENVIRONMENTAL ENHANCEMENT MEASURES
  enhancementMeasuresEnsuingYear: string;

  // DECLARATION
  declarationName: string;
  declarationDate: string;
}

const initialFormDataAER: FormDataAER = {
  yearOfReporting: new Date().getFullYear().toString(),
  nameOfServiceStation: '',
  parentOilMarketingCompany: '',
  yearOfEstablishment: '',
  contactPerson: '',
  contactPersonPosition: '',
  address: '',
  tel: '',
  fax: '',
  email: '',
  companyPolicyEHS: '',
  epaEnvironmentalPermit: false,
  epaEnvironmentalCertificate: false,
  gnfsFirePermit: false,
  gnfsFireCertificate: false,
  npaConstructionPermit: false,
  npaOperationalLicence: false,
  tcpdDevelopmentPermit: false,
  tcpdBuildingPermit: false,
  locationMajorLandmarks: '',
  geographicalCoordinates: '',
  currentZoning: '',
  approxDistanceToNearestFacility: '',
  adjacentLandUses: '',
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
  structuresEast: '',
  structuresWest: '',
  structuresNorth: '',
  structuresSouth: '',
  waterSourceGWC: false,
  waterSourceTanker: false,
  waterSourceWellBorehole: false,
  waterSourceOthersSpecify: '',
  powerSourceECG: false,
  powerSourceStandbyGenerator: false,
  powerSourceOthersSpecify: '',
  hasSiteDrainageSystem: '',
  forecourtCondition: '',
  washroomsNumber: '',
  washroomsCleaningFrequency: '',
  vocUnloadingImpacts: '',
  vocDispensingImpacts: '',
  vocLeakageSpillsImpacts: '',
  effluentWashroomsRestaurantsImpacts: '',
  effluentRainWaterRunOffImpacts: '',
  effluentWashingBayDischargesImpacts: '',
  effluentWasteOilsImpacts: '',
  effluentSpillsLeaksImpacts: '',
  solidSludgeImpacts: '',
  solidContaminatedAbsorbentsImpacts: '',
  solidOilFiltersImpacts: '',
  solidEmptyDrumsImpacts: '',
  fireOilSpillsImpacts: '',
  fireNakedFireImpacts: '',
  fireBRVsImpacts: '',
  fireUsedOilsImpacts: '',
  noiseTootingHornImpacts: '',
  noiseGeneratorImpacts: '',
  noiseRestaurantBarImpacts: '',
  trafficEntryExitImpacts: '',
  trafficBRVsDischargeImpacts: '',
  ohsFireImpacts: '',
  ohsInhalationVOCsImpacts: '',
  ohsHeatImpacts: '',
  ohsNoiseImpacts: '',
  managementVOCs: '',
  managementEffluentLiquidWaste: '',
  managementSolidWasteSludge: '',
  managementFire: '',
  managementNoise: '',
  trafficMgmtAccessFacility: '',
  trafficMgmtParkingSpaces: '',
  trafficMgmtAccidentsLastYear: '',
  managementOHS: '',
  conductedSoilInvestigation: '',
  soilInvestigationWhen: '',
  hasEmergencyResponsePlanFOSVA: '',
  hasEmergencyResponseSpillKit: '',
  tanksBuriedInConcreteBunkers: '',
  tanksBuriedWhen: '',
  hasStandardFirstAidKit: '',
  hasAssemblyPointEmergency: '',
  fireExtinguishersNumber: '',
  attendantsTrainedEHS: '',
  attendantsTrainedEHSOften: '',
  staffTrainedFireFighting: '',
  fireDrillsPerYear: '',
  staffTrainedOilSpillManagement: '',
  attendantsTrainedSafeProductHandling: '',
  regularInspectionsConducted: '',
  recordWasteOilSludge: '',
  recordSpillsLeaks: '',
  recordDisposalWasteOilSludge: '',
  recordDisposalSolidWaste: '',
  recordAccidents: '',
  investigationSpillFireVehicularAccidents: '',
  investigationsLastYearCount: '',
  conductHydraulicPressureTests: '',
  hydraulicPressureTestsLastTime: '',
  fireExtinguishersMonitoringFrequency: '',
  complaintsReceivedLastYear: '',
  complaintsHowMany: '',
  complaintsNature: '',
  complaintsHowDealtWith: '',
  challengesConcernsOperations: '',
  enhancementMeasuresEnsuingYear: '',
  declarationName: '',
  declarationDate: '',
};

// Basic styling (can be imported from a shared file or defined here)
const styles: { [key: string]: React.CSSProperties } = {
    formContainer: { fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    header: { textAlign: 'center', marginBottom: '20px' },
    formAerText: { fontSize: '0.9em', fontWeight: 'bold', textAlign: 'left', marginBottom: '10px'},
    epaTextLogo: { fontSize: '2em', fontWeight: 'bold', color: '#4CAF50', marginBottom: '10px' },
    mainTitle: { fontSize: '1.5em', fontWeight: 'bold', margin: '5px 0'},
    subTitle: { fontSize: '1.2em', margin: '5px 0'},
    section: { marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff' },
    sectionTitle: { fontSize: '1.4em', color: '#333', borderBottom: '2px solid #4CAF50', paddingBottom: '10px', marginBottom: '20px' },
    subSectionTitle: { fontSize: '1.1em', fontWeight: 'bold', color: '#444', marginTop: '20px', marginBottom: '15px' },
    fieldGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' },
    inlineLabel: { fontWeight: 'bold', color: '#555', marginRight: '10px'},
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px', minHeight: '100px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    checkboxGroup: { display: 'flex', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' },
    checkboxLabel: { marginLeft: '8px', fontWeight: 'normal', color: '#333', marginRight: '15px' },
    radioGroupContainer: { marginBottom: '10px' },
    radioGroup: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
    radioLabel: { display: 'flex', alignItems: 'center', marginLeft: '5px', fontWeight: 'normal', color: '#333', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    permitGroup: { marginBottom: '15px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#fcfcfc' },
    permitTitle: { fontWeight: 'bold', marginBottom: '10px', color: '#333' },
    button: { backgroundColor: '#4CAF50', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', marginTop: '20px' },
    impactTable: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
    impactThTd: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' },
    impactTh: { backgroundColor: '#f2f2f2' },
    noteText: { fontSize: '0.9em', color: '#777', marginLeft: '10px', fontStyle: 'italic' },
    attachmentsList: { listStyleType: 'disc', marginLeft: '20px'},
};

// Helper Components (re-use from previous if in same project, or define here)
interface TextInputProps { label: string; name: keyof FormDataAER; value: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; placeholder?: string; required?: boolean; isTextArea?: boolean; }
const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, type = "text", placeholder, required, isTextArea = false }) => (
  <div style={styles.fieldGroup}>
    <label htmlFor={name} style={styles.label}>{label}</label>
    {isTextArea ? <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} style={styles.textarea} />
                 : <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} style={styles.input} />}
  </div>
);

interface CheckboxFieldProps { label: string; name: keyof FormDataAER; checked: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }
const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, name, checked, onChange }) => (
  <div style={styles.checkboxGroup}>
    <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} />
    <label htmlFor={name} style={styles.checkboxLabel}>{label}</label>
  </div>
);

interface YesNoRadioGroupProps { label: string; name: keyof FormDataAER; value: 'Yes' | 'No' | ''; onChange: (e: ChangeEvent<HTMLInputElement>) => void; required?: boolean; }
const YesNoRadioGroup: React.FC<YesNoRadioGroupProps> = ({ label, name, value, onChange, required }) => (
  <div style={styles.radioGroupContainer}>
    <span style={styles.inlineLabel}>{label}</span>
    <div style={styles.radioGroup}>
      <label style={styles.radioLabel}><input type="radio" name={name} value="Yes" checked={value === 'Yes'} onChange={onChange} required={required} /> Yes</label>
      <label style={styles.radioLabel}><input type="radio" name={name} value="No" checked={value === 'No'} onChange={onChange} required={required} /> No</label>
    </div>
  </div>
);

interface CustomRadioGroupProps { label: string; name: keyof FormDataAER; options: { value: string; label: string }[]; selectedValue: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }
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

interface ImpactItem {
  no: string | number;
  source: string;
  impactsName: keyof FormDataAER;
  impactsValue: string;
}
interface ImpactTableSectionProps {
  title: string;
  items: ImpactItem[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ImpactTableSection: React.FC<ImpactTableSectionProps> = ({ title, items, handleChange }) => (
  <div>
    <h4 style={styles.subSectionTitle}>{title}</h4>
    <table style={styles.impactTable}>
      <thead>
        <tr>
          <th style={{...styles.impactThTd, ...styles.impactTh, width: '5%'}}>No</th>
          <th style={{...styles.impactThTd, ...styles.impactTh, width: '35%'}}>Sources</th>
          <th style={{...styles.impactThTd, ...styles.impactTh, width: '60%'}}>Impacts (List them)</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.no}>
            <td style={styles.impactThTd}>{item.no}</td>
            <td style={styles.impactThTd}>{item.source}</td>
            <td style={styles.impactThTd}>
              <textarea
                name={item.impactsName}
                value={item.impactsValue}
                onChange={handleChange}
                style={{...styles.textarea, minHeight: '50px', padding: '5px'}}
                placeholder="List impacts..."
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const AnnualEnvironmentalReportForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataAER>(initialFormDataAER);

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
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Annual Environmental Report Data Submitted:', formData);
    // alert('Report submitted! (See console for data)');
  };

  // Data for Impact Tables
  const vocImpactItems: ImpactItem[] = [
    { no: 1, source: 'Unloading', impactsName: 'vocUnloadingImpacts', impactsValue: formData.vocUnloadingImpacts },
    { no: 2, source: 'Dispensing', impactsName: 'vocDispensingImpacts', impactsValue: formData.vocDispensingImpacts },
    { no: 3, source: 'Leakage and Spills', impactsName: 'vocLeakageSpillsImpacts', impactsValue: formData.vocLeakageSpillsImpacts },
  ];
  const effluentImpactItems: ImpactItem[] = [
    { no: 1, source: 'Waste water from washrooms, restaurants etc.', impactsName: 'effluentWashroomsRestaurantsImpacts', impactsValue: formData.effluentWashroomsRestaurantsImpacts },
    { no: 2, source: 'Rain water run off', impactsName: 'effluentRainWaterRunOffImpacts', impactsValue: formData.effluentRainWaterRunOffImpacts },
    { no: 3, source: 'Washing Bay discharges', impactsName: 'effluentWashingBayDischargesImpacts', impactsValue: formData.effluentWashingBayDischargesImpacts },
    { no: 4, source: 'Waste oils', impactsName: 'effluentWasteOilsImpacts', impactsValue: formData.effluentWasteOilsImpacts },
    { no: 5, source: 'Spills and Leaks', impactsName: 'effluentSpillsLeaksImpacts', impactsValue: formData.effluentSpillsLeaksImpacts },
  ];
   const solidWasteImpactItems: ImpactItem[] = [
    { no: 1, source: 'Sludge', impactsName: 'solidSludgeImpacts', impactsValue: formData.solidSludgeImpacts },
    { no: 2, source: 'Spill/contaminated absorbent materials (saw dust, sand, etc)', impactsName: 'solidContaminatedAbsorbentsImpacts', impactsValue: formData.solidContaminatedAbsorbentsImpacts },
    { no: 3, source: 'Oil filters', impactsName: 'solidOilFiltersImpacts', impactsValue: formData.solidOilFiltersImpacts },
    { no: 4, source: 'Empty drums', impactsName: 'solidEmptyDrumsImpacts', impactsValue: formData.solidEmptyDrumsImpacts },
  ];
  const fireImpactItems: ImpactItem[] = [
    { no: 1, source: 'Oil spills', impactsName: 'fireOilSpillsImpacts', impactsValue: formData.fireOilSpillsImpacts },
    { no: 2, source: 'Naked fire', impactsName: 'fireNakedFireImpacts', impactsValue: formData.fireNakedFireImpacts },
    { no: 3, source: 'Bulk Road Vehicles (BRVs)', impactsName: 'fireBRVsImpacts', impactsValue: formData.fireBRVsImpacts },
    { no: 4, source: 'Used oils', impactsName: 'fireUsedOilsImpacts', impactsValue: formData.fireUsedOilsImpacts },
  ];
  const noiseImpactItems: ImpactItem[] = [
    { no: 1, source: 'Tooting of Horn', impactsName: 'noiseTootingHornImpacts', impactsValue: formData.noiseTootingHornImpacts },
    { no: 2, source: 'Generator', impactsName: 'noiseGeneratorImpacts', impactsValue: formData.noiseGeneratorImpacts },
    { no: 3, source: 'Restaurant/Bar', impactsName: 'noiseRestaurantBarImpacts', impactsValue: formData.noiseRestaurantBarImpacts },
  ];
  const trafficImpactItems: ImpactItem[] = [
    { no: 1, source: 'Entry and exit', impactsName: 'trafficEntryExitImpacts', impactsValue: formData.trafficEntryExitImpacts },
    { no: 2, source: 'Bulk road vehicles (BRVs) discharge', impactsName: 'trafficBRVsDischargeImpacts', impactsValue: formData.trafficBRVsDischargeImpacts },
  ];
  const ohsImpactItems: ImpactItem[] = [
    { no: 1, source: 'Fire', impactsName: 'ohsFireImpacts', impactsValue: formData.ohsFireImpacts },
    { no: 2, source: 'Inhalation of VOCs', impactsName: 'ohsInhalationVOCsImpacts', impactsValue: formData.ohsInhalationVOCsImpacts },
    { no: 3, source: 'Heat', impactsName: 'ohsHeatImpacts', impactsValue: formData.ohsHeatImpacts },
    { no: 4, source: 'Noise', impactsName: 'ohsNoiseImpacts', impactsValue: formData.ohsNoiseImpacts },
  ];


  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <header style={styles.header}>
          <p style={styles.formAerText}>FORM AER1</p>
          <div style={styles.epaTextLogo}>epa</div>
          <h1 style={styles.mainTitle}>ANNUAL ENVIRONMENTAL REPORT</h1>
          <h2 style={styles.subTitle}>PETROLEUM PRODUCTS RETAIL OUTLETS</h2>
          <h3 style={styles.subTitle}>FUEL SERVICE AND FILLING STATIONS</h3>
          <TextInput label="YEAR OF REPORTING:" name="yearOfReporting" value={formData.yearOfReporting} onChange={handleChange} placeholder="YYYY" />
        </header>

        {/* Section 1.0 COMPANY PROFILE */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1.0 COMPANY PROFILE</h2>
          <TextInput label="1.1 Name of Service Station" name="nameOfServiceStation" value={formData.nameOfServiceStation} onChange={handleChange} />
          <TextInput label="1.2 Parent Oil Marketing Company" name="parentOilMarketingCompany" value={formData.parentOilMarketingCompany} onChange={handleChange} />
          <TextInput label="1.3 Year of establishment" name="yearOfEstablishment" value={formData.yearOfEstablishment} onChange={handleChange} placeholder="YYYY"/>
          <div style={styles.grid}>
            <TextInput label="1.4 Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
            <TextInput label="Position" name="contactPersonPosition" value={formData.contactPersonPosition} onChange={handleChange} />
          </div>
          <TextInput label="1.5 Address" name="address" value={formData.address} onChange={handleChange} isTextArea />
          <div style={styles.grid}>
            <TextInput label="Tel" name="tel" type="tel" value={formData.tel} onChange={handleChange} />
            <TextInput label="Fax" name="fax" value={formData.fax} onChange={handleChange} />
          </div>
          <TextInput label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} />
          <TextInput label="1.6 Company Policy on Environment, Health and Safety (EHS)" name="companyPolicyEHS" value={formData.companyPolicyEHS} onChange={handleChange} isTextArea />

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
              <CheckboxField label="Operational Licence" name="npaOperationalLicence" checked={formData.npaOperationalLicence} onChange={handleChange} />
            </div>
            <div style={styles.permitGroup}>
              <p style={styles.permitTitle}>Town & Country Planning Department</p>
              <CheckboxField label="Development Permit" name="tcpdDevelopmentPermit" checked={formData.tcpdDevelopmentPermit} onChange={handleChange} />
              <CheckboxField label="Building Permit" name="tcpdBuildingPermit" checked={formData.tcpdBuildingPermit} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* Section 2.0 SITE DESCRIPTION */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2.0 SITE DESCRIPTION</h2>
            <TextInput label="2.1 Location (indicate major landmarks)" name="locationMajorLandmarks" value={formData.locationMajorLandmarks} onChange={handleChange} isTextArea />
            <TextInput label="2.2 Geographical Coordinates (where available)" name="geographicalCoordinates" value={formData.geographicalCoordinates} onChange={handleChange} />
            <TextInput label="2.3 Current Zoning" name="currentZoning" value={formData.currentZoning} onChange={handleChange} />
            <TextInput label="2.4 Approximate distance to the nearest facility" name="approxDistanceToNearestFacility" value={formData.approxDistanceToNearestFacility} onChange={handleChange} />
            <TextInput label="2.5 Adjacent land uses" name="adjacentLandUses" value={formData.adjacentLandUses} onChange={handleChange} isTextArea />
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
                <span style={styles.inlineLabel}>3.3.1 Type(s) of Storage Tank(s):</span>
                <CheckboxField label="Steel" name="tankTypeSteel" checked={formData.tankTypeSteel} onChange={handleChange} />
                <CheckboxField label="Fibreglass-Reinforced Plastics (FRP)" name="tankTypeFRP" checked={formData.tankTypeFRP} onChange={handleChange} />
            </div>
            <div style={styles.fieldGroup}>
                <span style={styles.inlineLabel}>3.3.2 Placement of Tank(s):</span>
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
            <h3 style={styles.subSectionTitle}>4.1 Structures (buildings and other facilities in the area)</h3>
            <TextInput label="East" name="structuresEast" value={formData.structuresEast} onChange={handleChange} />
            <TextInput label="West" name="structuresWest" value={formData.structuresWest} onChange={handleChange} />
            <TextInput label="North" name="structuresNorth" value={formData.structuresNorth} onChange={handleChange} />
            <TextInput label="South" name="structuresSouth" value={formData.structuresSouth} onChange={handleChange} />

            <h3 style={styles.subSectionTitle}>4.2 Water (Sources, availability and storage)</h3>
            <div style={styles.checkboxGroup}>
                <CheckboxField label="GWC" name="waterSourceGWC" checked={formData.waterSourceGWC} onChange={handleChange} />
                <CheckboxField label="Water Tanker Service" name="waterSourceTanker" checked={formData.waterSourceTanker} onChange={handleChange} />
                <CheckboxField label="Well/Borehole" name="waterSourceWellBorehole" checked={formData.waterSourceWellBorehole} onChange={handleChange} />
            </div>
            <TextInput label="Others (specify)" name="waterSourceOthersSpecify" value={formData.waterSourceOthersSpecify} onChange={handleChange} />

            <h3 style={styles.subSectionTitle}>4.3 Power Source(s)</h3>
            <div style={styles.checkboxGroup}>
                <CheckboxField label="ECG" name="powerSourceECG" checked={formData.powerSourceECG} onChange={handleChange} />
                <CheckboxField label="Stand-by Generator" name="powerSourceStandbyGenerator" checked={formData.powerSourceStandbyGenerator} onChange={handleChange} />
            </div>
            <TextInput label="Others (specify)" name="powerSourceOthersSpecify" value={formData.powerSourceOthersSpecify} onChange={handleChange} />
            
            <h3 style={styles.subSectionTitle}>4.4 Forecourt Facilities</h3>
            <YesNoRadioGroup label="4.4.1 Do you have Site Drainage system" name="hasSiteDrainageSystem" value={formData.hasSiteDrainageSystem} onChange={handleRadioChange} />
            <CustomRadioGroup
                label="4.4.2 Forecourt Condition"
                name="forecourtCondition"
                options={[{value: 'Paved', label: 'Paved'}, {value: 'Unpaved', label: 'Unpaved'}]}
                selectedValue={formData.forecourtCondition}
                onChange={handleRadioChange}
            />
            <TextInput label="4.4.3 How many washrooms do you have?" name="washroomsNumber" type="number" value={formData.washroomsNumber} onChange={handleChange} />
            <TextInput label="4.4.4 How often do you clean the washrooms?" name="washroomsCleaningFrequency" value={formData.washroomsCleaningFrequency} onChange={handleChange} />
        </section>

        {/* Section 5.0 POTENTIAL ENVIRONMENTAL IMPACTS */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5.0 POTENTIAL ENVIRONMENTAL IMPACTS</h2>
            <ImpactTableSection title="5.1 Volatile Organic Compounds (VOCs) Emissions into the atmosphere" items={vocImpactItems} handleChange={handleChange} />
            <ImpactTableSection title="5.2 Effluent/Liquid Waste" items={effluentImpactItems} handleChange={handleChange} />
            <ImpactTableSection title="5.3 Solid Waste/Sludge" items={solidWasteImpactItems} handleChange={handleChange} />
            <ImpactTableSection title="5.4 Fire" items={fireImpactItems} handleChange={handleChange} />
            <ImpactTableSection title="5.5 Noise" items={noiseImpactItems} handleChange={handleChange} />
            <ImpactTableSection title="5.6 Traffic" items={trafficImpactItems} handleChange={handleChange} />
            <ImpactTableSection title="5.7 Occupational Health and Safety" items={ohsImpactItems} handleChange={handleChange} />
        </section>

        {/* Section 6.0 MANAGEMENT OF IMPACTS */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>6.0 MANAGEMENT OF IMPACTS</h2>
            <TextInput label="6.1 VOCs Emissions into the atmosphere" name="managementVOCs" value={formData.managementVOCs} onChange={handleChange} isTextArea />
            <TextInput label="6.2 Effluent/Liquid Waste" name="managementEffluentLiquidWaste" value={formData.managementEffluentLiquidWaste} onChange={handleChange} isTextArea />
            <TextInput label="6.3 Solid Waste/Sludge" name="managementSolidWasteSludge" value={formData.managementSolidWasteSludge} onChange={handleChange} isTextArea />
            <TextInput label="6.4 Fire" name="managementFire" value={formData.managementFire} onChange={handleChange} isTextArea />
            <TextInput label="6.5 Noise" name="managementNoise" value={formData.managementNoise} onChange={handleChange} isTextArea />
            
            <h3 style={styles.subSectionTitle}>6.6 Traffic Management</h3>
            <YesNoRadioGroup label="Access to facility: Entry and Exit:" name="trafficMgmtAccessFacility" value={formData.trafficMgmtAccessFacility} onChange={handleRadioChange} />
            <TextInput label="Parking spaces (capacity)" name="trafficMgmtParkingSpaces" value={formData.trafficMgmtParkingSpaces} onChange={handleChange} />
            <TextInput label="Number of accidents in the last year" name="trafficMgmtAccidentsLastYear" type="number" value={formData.trafficMgmtAccidentsLastYear} onChange={handleChange} />
            
            <TextInput label="6.7 Occupational Health and Safety" name="managementOHS" value={formData.managementOHS} onChange={handleChange} isTextArea />
            
            <h3 style={styles.subSectionTitle}>6.8 Soil Investigations</h3>
            <YesNoRadioGroup label="Have you conducted Soil investigation" name="conductedSoilInvestigation" value={formData.conductedSoilInvestigation} onChange={handleRadioChange} />
            {formData.conductedSoilInvestigation === 'Yes' && (
                <TextInput label="If yes, when? (Attach report)" name="soilInvestigationWhen" value={formData.soilInvestigationWhen} onChange={handleChange} />
            )}
        </section>

        {/* Section 7.0 EMERGENCY RESPONSE MEASURES */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>7.0 EMERGENCY RESPONSE MEASURES</h2>
            <h3 style={styles.subSectionTitle}>7.1 Fire, Oil Spill and Vehicular Accidents</h3>
            <YesNoRadioGroup label="Do you have emergency response plan for Fire, Oil Spill and Vehicular Accidents?" name="hasEmergencyResponsePlanFOSVA" value={formData.hasEmergencyResponsePlanFOSVA} onChange={handleRadioChange} />
            {formData.hasEmergencyResponsePlanFOSVA === 'Yes' && <p style={styles.noteText}>If yes, attach the plan.</p>}
            
            <YesNoRadioGroup label="Do you have emergency response spill kit?" name="hasEmergencyResponseSpillKit" value={formData.hasEmergencyResponseSpillKit} onChange={handleRadioChange} />
            {formData.hasEmergencyResponseSpillKit === 'Yes' && <p style={styles.noteText}>If yes, attach list of the spill kit.</p>}

            <YesNoRadioGroup label="Are your tanks buried in concrete bunkers" name="tanksBuriedInConcreteBunkers" value={formData.tanksBuriedInConcreteBunkers} onChange={handleRadioChange} />
            {formData.tanksBuriedInConcreteBunkers === 'Yes' && (
                <TextInput label="If yes, when?" name="tanksBuriedWhen" value={formData.tanksBuriedWhen} onChange={handleChange} />
            )}
            <YesNoRadioGroup label="Do you have a standard first aid kit?" name="hasStandardFirstAidKit" value={formData.hasStandardFirstAidKit} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Do you have an assembly point for emergency?" name="hasAssemblyPointEmergency" value={formData.hasAssemblyPointEmergency} onChange={handleRadioChange} />
            <TextInput label="How many fire extinguishers do you have at the station?" name="fireExtinguishersNumber" type="number" value={formData.fireExtinguishersNumber} onChange={handleChange} />

            <h3 style={styles.subSectionTitle}>7.2 Education and Training</h3>
            <YesNoRadioGroup label="Have your attendants received training in environment, health and safety?" name="attendantsTrainedEHS" value={formData.attendantsTrainedEHS} onChange={handleRadioChange} />
            {formData.attendantsTrainedEHS === 'Yes' && (
                <TextInput label="If yes, how often" name="attendantsTrainedEHSOften" value={formData.attendantsTrainedEHSOften} onChange={handleChange} />
            )}
            <YesNoRadioGroup label="Have staff received training in fire fighting?" name="staffTrainedFireFighting" value={formData.staffTrainedFireFighting} onChange={handleRadioChange} />
            <TextInput label="How many fire drills in a year" name="fireDrillsPerYear" type="number" value={formData.fireDrillsPerYear} onChange={handleChange} />
            <YesNoRadioGroup label="Have staff received training in oil spill management?" name="staffTrainedOilSpillManagement" value={formData.staffTrainedOilSpillManagement} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Have your attendants received training in safe product handling?" name="attendantsTrainedSafeProductHandling" value={formData.attendantsTrainedSafeProductHandling} onChange={handleRadioChange} />
        </section>

        {/* Section 8.0 ENVIRONMENTAL MONITORING */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>8.0 ENVIRONMENTAL MONITORING</h2>
            <h3 style={styles.subSectionTitle}>8.1 Forecourt Monitoring</h3>
            <YesNoRadioGroup label="Do you carry out inspection of facilities on site regularly?" name="regularInspectionsConducted" value={formData.regularInspectionsConducted} onChange={handleRadioChange} />
            {formData.regularInspectionsConducted === 'Yes' && <p style={styles.noteText}>If yes, attach a copy of inspection report.</p>}

            <h3 style={styles.subSectionTitle}>8.2 Record Keeping</h3>
            <p>Do you keep records of the following?</p>
            <YesNoRadioGroup label="Waste oil and sludge generation" name="recordWasteOilSludge" value={formData.recordWasteOilSludge} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Spills and Leaks" name="recordSpillsLeaks" value={formData.recordSpillsLeaks} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Disposal of waste oil and sludge" name="recordDisposalWasteOilSludge" value={formData.recordDisposalWasteOilSludge} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Disposal of solid waste" name="recordDisposalSolidWaste" value={formData.recordDisposalSolidWaste} onChange={handleRadioChange} />
            <YesNoRadioGroup label="Accidents" name="recordAccidents" value={formData.recordAccidents} onChange={handleRadioChange} />

            <h3 style={styles.subSectionTitle}>8.3 Investigation of Accidents</h3>
            <YesNoRadioGroup label="Do you carry out investigation of spill/fire/vehicular accidents when they occur?" name="investigationSpillFireVehicularAccidents" value={formData.investigationSpillFireVehicularAccidents} onChange={handleRadioChange} />
            <TextInput label="How many of such investigations have been carried out in the last year?" name="investigationsLastYearCount" type="number" value={formData.investigationsLastYearCount} onChange={handleChange} />
            
            <h3 style={styles.subSectionTitle}>8.4 Hydraulic Pressure Tests</h3>
            <YesNoRadioGroup label="Do you conduct hydraulic pressure tests of your tanks?" name="conductHydraulicPressureTests" value={formData.conductHydraulicPressureTests} onChange={handleRadioChange} />
            {formData.conductHydraulicPressureTests === 'Yes' && (
                 <TextInput label="If yes, when was the last time? (Provide evidence)" name="hydraulicPressureTestsLastTime" value={formData.hydraulicPressureTestsLastTime} onChange={handleChange} />
            )}

            <h3 style={styles.subSectionTitle}>8.5 Fire Extinguisher Monitoring</h3>
            <TextInput label="How often do you monitor the functionality of your fire extinguishers?" name="fireExtinguishersMonitoringFrequency" value={formData.fireExtinguishersMonitoringFrequency} onChange={handleChange} />
        </section>

        {/* Section 9.0 Complaints */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>9.0 Complaints</h2>
            <YesNoRadioGroup label="Have you received any complaints from neighbour(s) in the last year?" name="complaintsReceivedLastYear" value={formData.complaintsReceivedLastYear} onChange={handleRadioChange} />
            {formData.complaintsReceivedLastYear === 'Yes' && (
                <TextInput label="If yes, how many?" name="complaintsHowMany" type="number" value={formData.complaintsHowMany} onChange={handleChange} />
            )}
            <TextInput label="Nature of complaint(s)" name="complaintsNature" value={formData.complaintsNature} onChange={handleChange} isTextArea />
            <TextInput label="How did you deal with the complaint(s)?" name="complaintsHowDealtWith" value={formData.complaintsHowDealtWith} onChange={handleChange} isTextArea />
        </section>

        {/* Section 10.0 CHALLENGES/CONCERNS */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>10.0 CHALLENGES/CONCERNS</h2>
            <TextInput label="List major challenges you face in your operations" name="challengesConcernsOperations" value={formData.challengesConcernsOperations} onChange={handleChange} isTextArea />
        </section>

        {/* Section 11.0 ENVIRONMENTAL ENHANCEMENT MEASURES */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>11.0 ENVIRONMENTAL ENHANCEMENT MEASURES FOR THE ENSUING YEAR</h2>
            <TextInput label="" name="enhancementMeasuresEnsuingYear" value={formData.enhancementMeasuresEnsuingYear} onChange={handleChange} isTextArea />
        </section>

        {/* DECLARATION */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>DECLARATION</h2>
            <div style={styles.fieldGroup}>
                I <input type="text" name="declarationName" value={formData.declarationName} onChange={handleChange} style={{...styles.input, width:'auto', display:'inline-block', margin:'0 5px'}} placeholder="Full Name"/>
                hereby declare that the information provided on this form is true to the best of my knowledge and shall provide any additional information that shall come to my notice in the course of processing this application.
            </div>
            <div style={styles.grid}>
                <TextInput label="Signature (Name of Signatory if digital)" name="declarationName" value={formData.declarationName} onChange={handleChange} placeholder="Signatory Name (matches above)"/> {/* Placeholder for signature */}
                <TextInput label="Date" name="declarationDate" type="date" value={formData.declarationDate} onChange={handleChange} />
            </div>
        </section>

        {/* Attachments */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Attachments</h2>
            <p>Please ensure the following documents are attached where applicable:</p>
            <ul style={styles.attachmentsList}>
                <li>Fire Certificate</li>
                <li>Soil Investigation Report (bi-annual)</li>
                <li>Hydraulic Pressure test Report (every 5 years)</li>
                <li>National Petroleum Authority Operation License</li>
                <li>Photographs of Service/Filling Station</li>
            </ul>
        </section>

        <button type="submit" style={styles.button}>Submit Annual Report</button>
      </form>
    </div>
  );
};

export default AnnualEnvironmentalReportForm;