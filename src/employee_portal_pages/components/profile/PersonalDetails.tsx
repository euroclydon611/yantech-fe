import { formatDate2 } from "../../../utils/helperFunction";
import { Card } from "antd";
import { Employee } from "../../types/employee";

interface PersonalDetailsProps {
  employee: Employee;
}

export default function PersonalDetails({ employee }: PersonalDetailsProps) {
  return (
    <Card 
      className="border border-gray-200 shadow-sm"
      title={<span className="text-lg font-semibold text-gray-900">Personal Details</span>}
      styles={{ body: { padding: '24px' } }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500">Full Name</label>
              <p className="text-sm font-medium">
                {`${employee.firstname} ${employee.other_names ? employee.other_names + ' ' : ''}${employee.lastname}`}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Gender</label>
              <p className="text-sm font-medium">{employee.gender}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Date of Birth</label>
              <p className="text-sm font-medium">{formatDate2(employee.date_of_birth)}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Marital Status</label>
              <p className="text-sm font-medium">{employee.marital_status || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500">Phone Number</label>
              <p className="text-sm font-medium">{employee.phone_number_1}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Email</label>
              <p className="text-sm font-medium">{employee.email || employee.personal_email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Address</label>
              <p className="text-sm font-medium">{employee.address || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Resident Town</label>
              <p className="text-sm font-medium">{employee.resident_town || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Official Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500">SSNIT Number</label>
              <p className="text-sm font-medium">{employee.ssnit_number || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">TIN Number</label>
              <p className="text-sm font-medium">{employee.tin_number || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Ghana Card Number</label>
              <p className="text-sm font-medium">{employee.ghana_card_number || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Tax/SSNIT Status</label>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Tax: <span className="ml-1">{employee.is_tax_payer ? 'Yes' : 'No'}</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  SSNIT: <span className="ml-1">{employee.is_ssnit_payer ? 'Yes' : 'No'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
