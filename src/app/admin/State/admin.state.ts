import { CommitmentType } from 'src/app/shared/interfaces/commitmentType.interface';
import { SecurityUserDetail } from 'src/app/shared/interfaces/securityUserDetail';
import * as fromRoot from '../../../app/state/app.state';

export interface AdminState {
    staffingUsers: SecurityUserDetail[];
    staffingUsersLoader: boolean;
    practiceBasedRingfences: CommitmentType[];
}

export interface State extends fromRoot.State {
    resources: AdminState;
    resourcesLoader: boolean;
}

export const initialState = {
    staffingUsers: [],
    staffingUsersLoader: false,
    practiceBasedRingfences: []
}


