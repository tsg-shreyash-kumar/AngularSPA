export interface CommitmentView {
  id?: string;
  employeeCode: string;
  commitmentTypeCode: string;
  commitmentTypeName?: string;
  startDate: string;
  endDate: string;
  allocation?: number;
  description: string;
  isSourceStaffing: boolean;
}
