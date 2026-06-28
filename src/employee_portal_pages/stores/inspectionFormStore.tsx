import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Type Definitions for the Form State ---

// Helper type for checklist items
export interface ChecklistItemState {
  isCompliant: 'yes' | 'no' | 'n/a' | null;
  observations: string;
}

// The main interface for the entire form
export interface InspectionFormState {
  // Section 1
  inspectionRefNo: string;
  dateOfInspection: string;
  applicationType: 'industrial' | 'pesticide' | 'hazardous' | null;
  permitType: 'onetime' | 'annual' | null;
  facilityLocation: string;
  regionAreaOffice: string;
  leadInspectorName: string;
  supportingInspectors: string;

  // Section 2
  exporterName: string;
  applicantId: string;
  facilityAddress: string;
  contactPersonName: string;
  contactPersonPhoneEmail: string;

  // Section 3
  purposeOfInspection: string;

  // Section 4
  checklist: {
    allExports: {
      validLicense: ChecklistItemState;
      dedicatedStorage: ChecklistItemState;
      inventoryRecords: ChecklistItemState;
      securePackaging: ChecklistItemState;
      shippingManifest: ChecklistItemState;
      sdsAvailable: ChecklistItemState;
      transportDocs: ChecklistItemState;
      spillManagement: ChecklistItemState;
      ppeSafety: ChecklistItemState;
      workerTraining: ChecklistItemState;
    };
    pesticide: {
      controlledStorage: ChecklistItemState;
      properSegregation: ChecklistItemState;
      expiryDates: ChecklistItemState;
    };
    industrial: {
        compatibilitySegregation: ChecklistItemState;
        sealedContainers: ChecklistItemState;
        legalSourceDoc: ChecklistItemState;
        technicalPersonnel: ChecklistItemState;
    };
    hazardous: {
        wasteIdentified: ChecklistItemState;
        picProof: ChecklistItemState;
        appropriateStorage: ChecklistItemState;
        esmEvidence: ChecklistItemState;
        pretreatment: ChecklistItemState;
        transporterVerified: ChecklistItemState;
    };
  };
  
  // Section 5
  transport: {
      licensedAgreement: ChecklistItemState;
      vehicleSuitability: ChecklistItemState;
      emergencyProtocols: ChecklistItemState;
      containerLabeling: ChecklistItemState;
      shippingCompliance: ChecklistItemState;
  };

  // Section 6
  keyObservations: string;
  complianceStatus: 'compliant' | 'partial' | 'noncompliant' | null;
  recommendedAction: 'issue' | 'reinspect' | null;

  // Section 8 (File uploads would be handled separately, but we can track them)
  attachments: {
      photos: boolean;
      inventoryList: boolean;
      transporterAgreement: boolean;
      sds: boolean;
      wasteReports: boolean;
  };
  
  // Helper function to update any field
  updateField: (field: keyof InspectionFormState, value: any) => void;
  updateChecklistItem: (category: string, item: string, value: Partial<ChecklistItemState>) => void;
  updateAttachment: (attachment: keyof InspectionFormState['attachments'], value: boolean) => void;
  resetForm: () => void;
}

// --- Initial State for a new form ---

const createInitialChecklistItem = (): ChecklistItemState => ({
    isCompliant: null,
    observations: '',
});

const initialState = {
  inspectionRefNo: '',
  dateOfInspection: '',
  applicationType: null,
  permitType: null,
  facilityLocation: '',
  regionAreaOffice: '',
  leadInspectorName: '',
  supportingInspectors: '',
  exporterName: '',
  applicantId: '',
  facilityAddress: '',
  contactPersonName: '',
  contactPersonPhoneEmail: '',
  purposeOfInspection: '',
  checklist: {
    allExports: {
      validLicense: createInitialChecklistItem(),
      dedicatedStorage: createInitialChecklistItem(),
      inventoryRecords: createInitialChecklistItem(),
      securePackaging: createInitialChecklistItem(),
      shippingManifest: createInitialChecklistItem(),
      sdsAvailable: createInitialChecklistItem(),
      transportDocs: createInitialChecklistItem(),
      spillManagement: createInitialChecklistItem(),
      ppeSafety: createInitialChecklistItem(),
      workerTraining: createInitialChecklistItem(),
    },
    pesticide: {
      controlledStorage: createInitialChecklistItem(),
      properSegregation: createInitialChecklistItem(),
      expiryDates: createInitialChecklistItem(),
    },
    industrial: {
        compatibilitySegregation: createInitialChecklistItem(),
        sealedContainers: createInitialChecklistItem(),
        legalSourceDoc: createInitialChecklistItem(),
        technicalPersonnel: createInitialChecklistItem(),
    },
    hazardous: {
        wasteIdentified: createInitialChecklistItem(),
        picProof: createInitialChecklistItem(),
        appropriateStorage: createInitialChecklistItem(),
        esmEvidence: createInitialChecklistItem(),
        pretreatment: createInitialChecklistItem(),
        transporterVerified: createInitialChecklistItem(),
    }
  },
  transport: {
    licensedAgreement: createInitialChecklistItem(),
    vehicleSuitability: createInitialChecklistItem(),
    emergencyProtocols: createInitialChecklistItem(),
    containerLabeling: createInitialChecklistItem(),
    shippingCompliance: createInitialChecklistItem(),
  },
  keyObservations: '',
  complianceStatus: null,
  recommendedAction: null,
  attachments: {
    photos: false,
    inventoryList: false,
    transporterAgreement: false,
    sds: false,
    wasteReports: false,
  },
};


// --- Create the Zustand Store ---

export const useInspectionFormStore = create<InspectionFormState>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateField: (field, value) => set({ [field]: value }),
      
      updateChecklistItem: (category, item, value) => {
        set(state => ({
          ...state,
          [category]: {
            ...state[category],
            [item]: {
              ...state[category][item],
              ...value,
            },
          },
        }));
      },

      updateAttachment: (attachment, value) => {
        set(state => ({
          attachments: {
            ...state.attachments,
            [attachment]: value,
          },
        }));
      },
      
      resetForm: () => set(initialState),
    }),
    {
      name: 'pre-permit-inspection-form', // name of the item in storage
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);