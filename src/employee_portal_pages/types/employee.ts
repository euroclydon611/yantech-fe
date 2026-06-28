// Defining interfaces based on the provided employee JSON data structure
export interface Entity {
  _id: string;
  name: string;
  designation: string;
  officeLocation?: string;
  reporting_entity_id: string;
  reporting_entity_name: string;
  from: string | null;
  to: string | null;
  naturalCode: string | null;
  head_history: any[];
  __v: number;
}

export interface AcademicQualification {
  name: string;
  institution: string;
  start_date: string;
  end_date: string;
  _id: string;
}

export interface ProfessionalQualification {
  name: string;
  institution: string;
  start_date: string;
  end_date: string;
  _id: string;
}

export interface Training {
  name: string;
  body: string;
  certification: string;
  start_date: string;
  end_date: string;
  expires: boolean;
  _id: string;
}

export interface SpecialSkill {
  name: string;
  proficiency_level: string;
  _id: string;
}

export interface Employee {
  _id: string;
  staff_id: string;
  lastname: string;
  firstname: string;
  other_names: string;
  date_of_birth: string;
  gender: string;
  passport_image: string;
  passport_image_url: string;
  signature_url: string;
  phone_number_1: string;
  phone_number_2: string;
  phone_number_3: string;
  email: string;
  personal_email: string;
  ghana_card_number: string;
  tin_number: string;
  ssnit_number: string;
  bank_id: string;
  bank_branch_id: string;
  bank_account_number: string;
  bank_account_name: string;
  nok_name: string;
  nok_relationship: string;
  nok_phone_number: string;
  nok_email: string;
  dependants: string[];
  country: string;
  grade_id: string;
  grade_incremental_ids: any[];
  hire_start_date: string;
  hire_end_date: string;
  appointment_letter: string;
  address: string;
  house_number: string;
  ghana_post: string;
  personnal_pme_ids: any[];
  is_head: boolean;
  permissions?: string[];
  department?: string;
  department_name?: string;
  is_tax_payer: boolean;
  is_ssnit_payer: boolean;
  exemptions: any[];
  remaining_leave_days: number;
  allowable_leave_days: number,
  effective_date_of_last_promotion: string;
  assumption_date: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  emergency_contact_relationship: string;
  academic_qualifications: AcademicQualification[];
  professional_qualifications: ProfessionalQualification[];
  trainings: Training[];
  special_skills: SpecialSkill[];
  signature: string;
  hometown: string;
  marital_status: string;
  resident_town: string;
  staff_community: string;
  staff_skill: string;
  status: string;
  entity: Entity;
  grade: string;
  rank_title:string;
}

export interface LeaveApplication {
  _id: string;
  id: number;
  employee_id: string;
  staff_id: string;
  leave_type: string;
  leave_name?: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'Pending' | 'Approved' | 'Rejected';
  approver_id?: string;
  approved_date?: string;
  rejection_reason?: string;
  decision_note?: string;
  created_at: string;
}

export interface EmployeeLeaveApproval extends LeaveApplication {
  firstname?: string;
  lastname?: string;
  employee?: {
    name: string;
    staff_id: string;
    avatar_initials: string;
  };
}


