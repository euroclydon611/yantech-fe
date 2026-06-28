import PageLayout from "../components/layout/PageLayout";
import LeaveSection from "../components/leave/LeaveSection";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function LeavePage() {
  const { employee } = useSelector((state: RootState) => state.employee_auth);

  return (
    <PageLayout 
      title="My Leave" 
      description="Apply for leave and track your leave history"
    >
      <LeaveSection employee={employee} />
    </PageLayout>
  );
}
