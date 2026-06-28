// src/context/PermitFormContext.tsx
import React, { createContext, ReactNode, useContext } from 'react';
import usePersistentReducer from '../hooks/usePersistentReducer';
import { set } from 'lodash'; // Using lodash.set is great for updating nested properties

// Define types
interface ImporterInfo {
  companyName: string;
  businessAddress: string;
  registrationNumber: string;
  authorizedRepresentative: string;
  contact: string;
  epaProductRegNumber: string;
}

interface PermitDetails {
  permitNumber: string;
  dateOfIssue: string;
  validityPeriod: string;
}

interface TransportDetails {
  sourceCountry: string;
  portOfEntry: string;
  modeOfTransportation: string;
}

interface Product {
  [key: string]: any; // Define more specific product structure as needed
}

export interface PermitFormState {
  our_ref: string;
  permit_date: string;
  permit_type: 'IMPORT' | 'EXPORT';
  importerInfo: ImporterInfo;
  permitDetails: PermitDetails;
  products: Product[];
  transportDetails: TransportDetails;
  conditions_html: string;
}

interface PermitFormAction {
  type: 'LOAD_DRAFT' | 'UPDATE_FIELD' | 'ADD_PRODUCT' | 'REMOVE_PRODUCT' | 'UPDATE_PRODUCT_FIELD' | 'RESET_FORM';
  payload?: any;
}

interface PermitFormContextType {
  state: PermitFormState;
  dispatch: React.Dispatch<PermitFormAction>;
  storageKey: string;
}

interface PermitFormProviderProps {
  children: ReactNode;
  permitId: string;
}

// This initial state should match the structure of your template
// and be populated by the API call later.
export const initialState: PermitFormState = {
  our_ref: '',
  permit_date: new Date().toISOString().split('T')[0],
  permit_type: 'IMPORT', // or 'EXPORT'
  // Importer Info Section
  importerInfo: {
    companyName: '',
    businessAddress: '',
    registrationNumber: '',
    authorizedRepresentative: '',
    contact: '',
    epaProductRegNumber: '',
  },
  // Details Section
  permitDetails: {
    permitNumber: '',
    dateOfIssue: '',
    validityPeriod: '',
  },
  // Product Info Section
  products: [], // Will be an array of product objects
  // Transport Info Section
  transportDetails: {
    sourceCountry: '',
    portOfEntry: '',
    modeOfTransportation: '',
  },
  // Conditions Section
  conditions_html: `
    <p>1. This permit is issued under the authority of the Environmental Protection Act 1124 and Act 2025...</p>
    <p>2. This permit is valid only for the consignment described above...</p>
    // ... all 15 conditions here
  `,
};

// The Reducer function handles state updates
const permitFormReducer = (state: PermitFormState, action: PermitFormAction): PermitFormState => {
  const newState = { ...state }; // Create a shallow copy

  switch (action.type) {
    case 'LOAD_DRAFT':
      // Overwrites the entire state with data from an API
      return { ...state, ...action.payload };

    case 'UPDATE_FIELD':
      // Uses lodash.set for easy updating of nested fields
      // payload: { path: 'importerInfo.companyName', value: 'New Company' }
      set(newState, action.payload.path, action.payload.value);
      return newState;

    case 'ADD_PRODUCT':
      // payload should be a new blank product object
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case 'REMOVE_PRODUCT':
      // payload is the index of the product to remove
      return {
        ...state,
        products: state.products.filter((_, index) => index !== action.payload),
      };

    case 'UPDATE_PRODUCT_FIELD':
      // payload: { productIndex: 0, path: 'name', value: 'WeedKiller' }
      const updatedProducts = [...state.products];
      set(updatedProducts[action.payload.productIndex], action.payload.path, action.payload.value);
      return { ...state, products: updatedProducts };
    
    case 'RESET_FORM':
        localStorage.removeItem(action.payload.storageKey);
        return initialState;

    default:
      return state;
  }
};

// Create the context
export const PermitFormContext = createContext<PermitFormContextType | undefined>(undefined);

// Create the Provider component
export const PermitFormProvider: React.FC<PermitFormProviderProps> = ({ children, permitId }) => {
  const storageKey = `permit_draft_${permitId}`; // Unique key for each permit draft
  const [state, dispatch] = usePersistentReducer(permitFormReducer, initialState, storageKey);

  return (
    <PermitFormContext.Provider value={{ state, dispatch, storageKey }}>
      {children}
    </PermitFormContext.Provider>
  );
};

// Custom hook to use the PermitFormContext
export const usePermitForm = (): PermitFormContextType => {
  const context = useContext(PermitFormContext);
  if (!context) {
    throw new Error('usePermitForm must be used within a PermitFormProvider');
  }
  return context;
};