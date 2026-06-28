export interface IEpaClient {
  clientId: string;
  _id: string;
  userType: "individual" | "organization" | "government" | "agent" | "";
  preferredContactMethod?: "email" | "sms";

  // Person/Contact Details (used for Individual, Agent, and as Contact/Liaison)
  firstName: string;
  lastName: string;
  otherNames: string;
  email: string;
  phone: string;

  // Individual & Agent Fields
  nationality?: string;
  nationalIdType?: "ghana_card" | "passport" | "drivers_license";
  nationalIdNumber?: string;
  tin?: string;
  residentialAddress?: string;
  digitalAddress?: string;
  mailingAddress?: string;
  uploadIdDocument?: string;

  preferredName?: string;

  // Agent-Specific Fields
  agentAddress?: string;
  accreditingBody?: string;
  accreditationNumber?: string;
  consultingCompanyName?: string;
  companyEmail?: string;
  companyPhone?: string;

  contactPersonPosition?: string;

  // Organization / Government entity-level contact
  orgEmail?: string;
  orgPhone?: string;

  // Organization Fields
  organizationName?: string;
  registrationNumber?: string;
  dateOfIncorporation?: any;
  companyType?: string;
  companyTIN?: string;
  industrySector?: string;
  uploadRegistrationDocs?: string;
  uploadOperatingPermit?: string;

  // Government Agency Fields
  agencyName?: string;
  agencyAcronym?: string;
  institutionType?: string;
  jurisdictionLevel?: string;
  sector?: string;

  address: {
    region: string;
    district: string;
    city: string;
    address: string;
    gps: string;
  };

  // Credentials
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;

  // Account Status
  isVerified?: boolean;
  isActive?: boolean;

  // Timestamps
  createdAt?: string | Date | any;
  updatedAt?: string | Date | any;
}