import { Routes, Route } from "react-router-dom";
import {
  MainLayout,
  Departments,
  Entities,
  Units,
  Ranks,
  Banks,
  Branches,
  CreateEmployee,
  EditEmployee,
  ListEmployees,
  Pending_leaves,
  Approved_leaves,
  Rejected_leaves,
} from "../routes/routes";

const Hr = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="departments" element={<Departments />} />
          <Route path="entities" element={<Entities />} />
          <Route path="units" element={<Units />} />
          <Route path="ranks" element={<Ranks />} />
          <Route path="banks" element={<Banks />} />
          <Route path="branches" element={<Branches />} />
          <Route path="employees" element={<ListEmployees />} />
          <Route path="create-employee" element={<CreateEmployee />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />

          <Route path="pending-leaves" element={<Pending_leaves />} />
          <Route path="approved-leaves" element={<Approved_leaves />} />
          <Route path="rejected-leaves" element={<Rejected_leaves />} />
        </Route>
      </Routes>
    </>
  );
};

export default Hr;
