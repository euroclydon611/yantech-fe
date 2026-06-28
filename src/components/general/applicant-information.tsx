import { Collapse } from "antd";
import { normalizeText } from "@/utils/helperFunction";
import { Detail } from "@/employee_portal_pages/components/review/helpers";
interface ApplicantInformationBlockProps {
  application: any;
}

const ApplicantInformationBlock: React.FC<ApplicantInformationBlockProps> = ({
  application,
}) => {
  const { clientId, submittedByAgent, clientDetails, submittedByAgentDetails } =
    application;

  // const applicantDetails = clientDetails || clientId;
  //use current details or information of the proponent
  const applicantDetails = clientId;
  const agentDetails = submittedByAgentDetails || submittedByAgent;

  const renderAddress = (address: any) => {
    if (!address) return null;

    return (
      <div className="mt-4">
        <Collapse
          items={[
            {
              key: "address",
              label: "Address Information",
              children: (
                <div>
                  <Detail
                    label="Region"
                    value={normalizeText(address?.region) || "N/A"}
                  />
                  <Detail
                    label="District"
                    value={normalizeText(address?.district) || "N/A"}
                  />
                  <Detail label="City" value={address?.city || "N/A"} />
                  <Detail label="Address" value={address?.address || "N/A"} />
                  <Detail
                    label="GPS Coordinates"
                    value={address?.gps || "N/A"}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  };

  const resolveApplicantName = () => {
    if (!applicantDetails) return "";

    switch (applicantDetails.userType) {
      case "individual":
        return `${applicantDetails.firstName ?? ""} ${
          applicantDetails.lastName ?? ""
        } ${applicantDetails.otherNames ?? ""}`.trim();

      case "organization":
        return applicantDetails.organizationName;

      case "government":
        return applicantDetails.agencyName;

      default:
        return "";
    }
  };

  return (
    <>
      <Detail
        label="Client ID / Registration Number"
        value={applicantDetails?.clientId}
      />

      <Detail label="Name" value={resolveApplicantName()} />

      {applicantDetails?.preferredName && (
        <Detail
          label="Preferred Name (on permits & certificates)"
          value={applicantDetails.preferredName}
        />
      )}

      <Detail
        label="Contact Person"
        value={`${applicantDetails?.firstName || ""} ${
          applicantDetails?.lastName || ""
        }`.trim()}
      />

      {applicantDetails?.orgEmail && (
        <Detail label="Organization Email" value={applicantDetails.orgEmail} />
      )}
      {applicantDetails?.orgPhone && (
        <Detail label="Organization Phone" value={applicantDetails.orgPhone} />
      )}
      <Detail label="Contact Person Email" value={applicantDetails?.email} />
      <Detail label="Contact Person Phone" value={applicantDetails?.phone} />

      {renderAddress(applicantDetails?.address)}

      {agentDetails && (
        <div className="mt-10">
          <h4 className="font-semibold mb-2">Agent Information</h4>
          <Detail label="Agent ID" value={agentDetails?.clientId} />
          <Detail
            label="Name"
            value={`${agentDetails?.firstName || ""} ${
              agentDetails?.lastName || ""
            }`.trim()}
          />
          <Detail label="Email Address" value={agentDetails?.email} />
          <Detail label="Telephone Number" value={agentDetails?.phone} />

          {renderAddress(agentDetails?.address)}
        </div>
      )}
    </>
  );
};

export default ApplicantInformationBlock;
