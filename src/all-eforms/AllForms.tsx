import React from "react";
import EPAForm from "./EPAForm";
import ChecklistPesticidesForm from "./ChecklistPesticidesForm1";
import PesticideLicenseRenewalForm from "./PesticideLicenseRenewalForm";
import PesticideLicenseForm from "./PesticideLicenseForm";
import PER1D1FProjectsForm from "./PER1D1FProjectsForm";
import AERHospitalityForm from "./AERHospitalityForm";
import BoilerInventoryForm from "./BoilerInventoryForm";
import ChecklistLPGForm from "./ChecklistLPGForm";
import CocoaWarehouseScheduleForm from "./CocoaWarehouseScheduleForm1";
import EA1Form from "./EA1Form";
import EM1WarehouseForm from "./EM1WarehouseForm";
import EM1Form from "./EM1Form";
import AER1ChecklistForm from "./AER1ChecklistForm";
import AER1SiteVerificationFuelForm from "./AER1SiteVerificationFuelForm";
import AER2LPGForm from "./AER2LPGForm";
import HealthcareSiteVerificationForm from "./HealthcareSiteVerificationForm";
import SmallScaleMiningForm from "./SmallScaleMiningForm";
import ScreeningReportForm from "./ScreeningReportForm";
import QualityAssuranceAndTRCForm from "./QualityAssuranceAndTRCForm";

import AnnualEnvironmentalReportForm from "./AnnualEnvironmentalReportForm";
import EnvironmentalAssessmentFormOfficial from "./EnvironmentalAssessmentFormOfficial";



// Normalized form map (all keys in lowercase)
const formMap = {
  "annual environmental report for hospitality industry (officials)": {
    label: "Annual Environmental Report for Hospitality Industry (Officials)",
    component: <AERHospitalityForm />,
  },
  "annual environmental report for hospitality industry (proponent)": {
    label: "Annual Environmental Report for Hospitality Industry (Proponent)",
    component: <AERHospitalityForm />,
  },
  "annual environmental report for petroleum (official)": {
    label: "Annual Environmental Report for Petroleum (Official)",
    component: <AER1SiteVerificationFuelForm />,
  },
  "annual environmental report for petroleum (proponent)": {
    label: "Annual Environmental Report for Petroleum (Proponent)",
    component: <AER2LPGForm />,
  },
  "boiler inventory form_informal sector_final": {
    label: "Boiler Inventory Form - Informal Sector",
    component: <BoilerInventoryForm />,
  },
  "cocoa warehouse": {
    label: "Cocoa Warehouse",
    component: <CocoaWarehouseScheduleForm />,
  },
  "environmental assessment registration form (official)": {
    label: "Environmental Assessment Registration Form (Official)",
    component: <EnvironmentalAssessmentFormOfficial />,
  },
  "environmental assessment registration form (proponent)": {
    label: "Environmental Assessment Registration Form (Proponent)",
    component: <AnnualEnvironmentalReportForm />,
  },
  "form ea 1(main form)": {
    label: "Form EA 1 (Main Form)",
    component: <EA1Form />,
  },
  "healthcare facility - site verification": {
    label: "Healthcare Facility - Site Verification",
    component: <HealthcareSiteVerificationForm />,
  },
  // "per 1 d_1 f projects": {
  //   label: "PER 1 D_1 F Projects",
  //   component: <PER1D1FProjectsForm />,
  // },
  "petroleum monitoring form": {
    label: "Petroleum Monitoring Form",
    component: <ChecklistLPGForm />,
  },
  "quality assurance checklist and technical review commitee aproval sheet forms":
    {
      label: "Quality Assurance Checklist and TRC Approval Sheet Forms",
      component: <QualityAssuranceAndTRCForm />,
    },
  "registration of existing project form for warehouse": {
    label: "Registration of Existing Project Form for Warehouse",
    component: <EM1WarehouseForm />,
  },
  "registration of existing project form": {
    label: "Registration of Existing Project Form",
    component: <EM1Form />,
  },
  "screening forms": {
    label: "Screening Forms",
    component: <ScreeningReportForm />,
  },
  "small scale mining form": {
    label: "Small Scale Mining Form",
    component: <SmallScaleMiningForm />,
  },
  "aer1 checklist form": {
    label: "AER1 Checklist Form",
    component: <AER1ChecklistForm />,
  },
};

const AllForms = ({ formTypes }) => {
  const typesArray = Array.isArray(formTypes) ? formTypes : [formTypes];

  console.log("total",Object.keys(formMap).length);

  return (
    <div>
      {/* <h1 className="text-3xl font-bold text-center mt-10">All Forms</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 p-4">
        {typesArray.map((inputTitle) => {
          const normalizedTitle = inputTitle.toLowerCase().trim();
          const form = formMap[normalizedTitle];

          return form ? (
            <div key={normalizedTitle}>
              <h2 className="text-xl font-semibold mb-2">{form.label}</h2>
              {form.component}
            </div>
          ) : (
            <div key={normalizedTitle} className="text-red-500">
              Unknown form: {inputTitle}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 p-4">
        {/* <EPAForm />
        <AERHospitalityForm />
        <BoilerInventoryForm />
        <ChecklistLPGForm />
        <ChecklistPesticidesForm />
        <CocoaWarehouseScheduleForm1 />
        <CocoaWarehouseScheduleForm />
        <EA1Form />
        <EM1WarehouseForm />
        <EM1Form />
        <AER1ChecklistForm />
        <AER1SiteVerificationFuelForm />
        <AER2LPGForm />
        <HealthcareSiteVerificationForm /> */}
      </div>
    </div>
  );
};

export default AllForms;
