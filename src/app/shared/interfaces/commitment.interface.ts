import { CommitmentType } from './commitmentType.interface';

export interface Commitment {
  id: string;
  employeeCode: string;
  commitmentType: CommitmentType;
  startDate: string;
  endDate: string;
  notes: string;
  lastUpdatedBy: string;
  allocation?: number;
  isSourceStaffing?: boolean;
}
