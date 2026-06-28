# calculus_payroll_frontend

### Finance/Accounting

- General Ledger
- Accounts Payable
- Accounts Receivable
- Chart of Accounts
- Financial Reporting

### Requisitions

# Order Items:

- Requester Details:

  - Requester Name
  - Department/Project Name (optional)
  - Request Date

- Item Details (From Inventory):

  - Item Code (unique identifier from inventory)
  - Item Name/Description
  - Unit of Measure (e.g., piece, box, kg, etc.)
  - Quantity Required
  - Preferred Delivery Date (optional)

- Location Information:

  - Delivery Location/Store/Warehouse

- Budget Information:

  - Budget Code/Cost Center (if applicable, links to financial allocation)
  - Estimated Item Cost (pulled from item details or input manually)

- Priority Level: Indicates the urgency (e.g., Normal, Urgent, Critical).

- Supporting Documents (Optional):
  - Quotes from vendors
  - Project plans
  - Any necessary justification for PR submission.

# Expense Items:

- Requester Details:

  - Requester Name
  - Department/Project Name (optional)
  - Request Date

- Expense Details (From Chart of Accounts):

  - GL Account Code
  - Account Name/Description (e.g., "Office Supplies," "Maintenance Services")
  - Amount (Expense Value)
  - Reason/Justification for Expense
  - Expected Date for the Expense

- Supplier Details (if applicable):

  - Preferred Supplier/Vendor Name
  - Supplier Contact Information

- Budget Information:

  - Budget Code/Cost Center (if applicable, linked to department or project budget).
  - Budget Availability Check (to ensure expense can be covered).

- Priority Level: Indicates the urgency (e.g., Normal, Urgent, Critical).

- Supporting Documents (Optional):
- Quotes from vendors
- Project plans
- Any necessary justification for PR submission.







Your modules seem well-structured, but a few minor corrections and refinements can enhance clarity, consistency, and readability. Here’s the reviewed and corrected version:

---

# ========Modules=========

- **HR**
  - **Sections**  
    - **Entities**: Set up Departments and Units with their respective Codes.  
    - **Ranks**: Set up Ranks/Positions/Grades with their Basic Salary and Hourly Rate for both established and clock-in employees. General Allowances and Deductions (PMEs) can be appended to these ranks.  
  - **Banks/Branches**: Set up employees' Banks and their Branches.  
  - **Employees**  
    - Manage Employees (individual list, manual creation, bulk upload).  
    - Maintain employee financial details.  
    - Basic Salary and Hourly Rate can also be appended to established and clock-in employees, overriding those attached to their ranks for payroll calculations.  
  - **Leave**  
    - Manage Leave Applications.  
  - **Configuration**  
    - Set Payroll Days in a Month, Hours per Day, and Allowable Leave Days.

- **PAYROLL**  
  - **Configuration**  
    - Tax Config (PAYE, overtime tax, bonus tax).  
    - Payroll Monetary Elements.  
    - Tax Relief Config (e.g., Education, Old Age, Mortgage exemptions).  
    - SSNIT Config (Employer and Employee contributions to Tier 1 and Tier 2).  
    - Overtime Types (standard, weekend, holiday) and Eligibility Criteria.  
  - **Processing**  
    - **Timesheet Upload and Management**: For clock-in employees' payroll run.  
    - **Leave Encashments**: Settlements for outstanding leave balances.  
    - **Overtime Management**  
      - Approve employee overtime.  
      - Apply overtime in batches.  
    - **Payroll Run**: Run payroll for a specific period.  
    - **Payroll Test Run**  
      - Check the validity of figures after payroll run.  
      - If there are issues, cancel the run, make adjustments, and rerun.  
      - Finalize the run by clicking **Final Run** (closes payroll for the period, irreversible action).  
  - **Reports** (by periods)  
    - Summary Pay Reports.  
    - Payslip Reports.  
    - Summary Reports for closed payroll periods.  
    - Tax Reports.  
    - Tier 1, Tier 2, and Tier 3 Reports.  
    - Bank Reports (Consolidated and Bank-wise).

- **PROJECTS**  
  - **Project Creation and Management**  
    - **Breakdown Input**: Load project budgets.  
    - **Project Budget**: Summarized actual budget.  
    - **Supplementary Budgets**: Manage additional budgets.  
    - **Forecast and Actuals**: Prepare project milestones.  
    - **Forecast Transfer**: Transfer balances from closed milestones to open ones.  
    - **Requisitions**: Manage expense items (Travel, Job Card, Compensation, Fuel, Petty Cash).  
    - **Documents**: Store project-related documents.  
    - **Project Ledger**: Maintain financial project records.

- **INVENTORY**  
  - **Stock**: Manage stock items.  
  - **Receiving History**: Record items received.  
  - **Issuance History**: Track items issued.  
  - **Stock Returns**: Record returned stock items.  
  - **Requisitions**: Manage order items.  
  - **Suppliers**: Maintain supplier details.  
  - **Reports**: Generate inventory reports.

- **PROCURE TO PAY (P2P)**  
  - **Purchase Requests**: Manage order and expense requests.  
  - **Request for Quotation**: Handle quotation requests for order items.  
  - **Purchase Orders**: Manage purchase order creation and tracking.

- **FINANCE**  
  - **Chart of Accounts**: Manage financial accounts.  
  - **Purchase Payables**: Accounts payable for order items.  
  - **Expense Payables**: Accounts payable for expense items.  
  - **Bank Accounts and Cashbooks**: Set up and manage bank accounts for payments.  
  - **Rate Card**: Configure exchange rates.

- **SETTINGS**  
  - **User Management**: Set up admin users, roles, and privileges.  
  - **Backup and Restore**: Manage database backups, restore data, and implement recovery plans.

---

