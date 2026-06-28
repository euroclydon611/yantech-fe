
export interface ActiveSubstance {
    activeIngredient: string;
    concentrationValue: string;
    concentrationUnit: string;
    casNumber: string;
  }
  
  export interface Product {
    name: string;
    hsCode: string;
    formulationType: string;
    productType: string;
    manufacturer: string;
    manufacturerAddress: string;
    supplierName: string;
    supplierAddress: string;
    activeIngredients: ActiveSubstance[];
    quantity: number;
    unit: string;
    frePaNumber: string;
    pclExpiryDate: string;
    arrivalDate: string;
    packageSizeValue: string;
    packageSizeUnit: string;
    packagingType: string;
    targetPestOrDisease: string;
    chemicalClass: string;
    casNo: string;
    hazardClass: string;
    tradeName: string;
    commonName: string;
    endUse: string;
  }
  
  export interface Partner {
    name: string;
    contactEmail: string;
    contactPhone: string;
    vehicleNumber: string;
    isEPALicensed: boolean;
    epaLicense: {
      licenseNumber: string;
      licenseIssuedDate: string;
      licenseExpiryDate: string;
    };
  }
  
  export interface Facility {
    location: {
      region: string;
      district: string;
      city: string;
      address: string;
      googleLocationLink: string;
    };
    isPermitted: boolean;
    permit: {
      permitNumber: string;
      permitIssuedDate: string;
      permitExpiryDate: string;
    };
  }
  


  