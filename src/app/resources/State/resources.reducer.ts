import * as fromRoot from '../../../app/state/app.state';
import { ResourcesActionTypes, ResourcesActions } from './resources.actions';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ResourceStaffing } from 'src/app/shared/interfaces/resourceStaffing.interface';
import { CommitmentView } from 'src/app/shared/interfaces/commitmentView';
import { ResourceFilter } from 'src/app/shared/interfaces/resource-filter.interface';
import { StaffableAsRole } from 'src/app/shared/interfaces/staffableAsRole.interface';

/**
 * Extends the app state to include the resources feature
 * This is required because resources are lazy loaded
 * so the reference to ResourcesState cannot be added to app.state.ts directly
 *
 * searchedResources is used to store resources that have been searched by the staffing officer.
 * This object is created so that when the staffing officer clears the search string,
 * then we can get the resources directly from initial state
 */

// State for this feature
export interface ResourcesState {
  resources: ResourceStaffing[];
  searchedResources: ResourceStaffing[];
  resourceFilters: ResourceFilter[];
  refreshCaseAndResourceOverlay: boolean;
  refreshLastBillableDate: boolean;
  resourcesLoader: boolean;
}

export interface State extends fromRoot.State {
  resources: ResourcesState;
  searchedResources: ResourcesState;
  resourceFilters: ResourcesState;
  refreshCaseAndResourceOverlay: boolean;
  refreshLastBillableDate: boolean;
  resourcesLoader: boolean;
}

const initialState = {
  resources: [] as ResourceStaffing[],
  searchedResources: [] as ResourceStaffing[],
  resourceFilters: null,
  refreshCaseAndResourceOverlay: false,
  refreshLastBillableDate: false,
  resourcesLoader: false,
};

// Selector Functions
const getResourcesFeatureState = createFeatureSelector<ResourcesState>(
  'resources'
);

export const getResourcesStaffing = createSelector(
  getResourcesFeatureState,
  (state) => state.resources
);

export const getSearchedResourcesStaffing = createSelector(
  getResourcesFeatureState,
  (state) => state.searchedResources
);

export const refreshCaseAndResourceOverlay = createSelector(
  getResourcesFeatureState,
  (state) => state.refreshCaseAndResourceOverlay
);

export const refreshLastBillableDate = createSelector(
  getResourcesFeatureState,
  (state) => state.refreshLastBillableDate
);

export const resourcesLoader = createSelector(
  getResourcesFeatureState,
  (state) => state.resourcesLoader
);

export const getSavedResourceFilters = createSelector(
  getResourcesFeatureState,
  (state) => state.resourceFilters
);


export function reducer(state = initialState, action: ResourcesActions): ResourcesState {
  switch (action.type) {
    case ResourcesActionTypes.ResourcesLoader:
      return {
        ...state,
        resourcesLoader: action.payload
      };

    case ResourcesActionTypes.RefreshCaseAndResourceOverlay:
      return {
        ...state,
        refreshCaseAndResourceOverlay: action.payload
      };

    case ResourcesActionTypes.RefreshLastBillableDate:
      return {
        ...state,
        refreshLastBillableDate: action.payload
      };

    case ResourcesActionTypes.ClearSearchData:
      const fetchedResources: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      state.searchedResources = [];
      state.resources = fetchedResources;
      return {
        ...state
      };
    case ResourcesActionTypes.ClearResourcesStaffingData:
      return {
        ...state,
        resources: [],
        searchedResources: []
      };
    case ResourcesActionTypes.LoadResourcesStaffingSuccess:
      action.payload.forEach( x=> x.trackById = Date.now());
      return {
        ...state,
        resources: action.payload
      };

    case ResourcesActionTypes.LoadResourcesStaffingOnPageScrollSuccess:
      const existingActiveResources: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      action.payload.forEach((resource: ResourceStaffing) => {
        existingActiveResources.push(resource);
      });

      return {
        ...state,
        resources: existingActiveResources,
        searchedResources: []
      };

    case ResourcesActionTypes.LoadResourcesStaffingBySearchStringSuccess:
      action.payload.forEach( x=> x.trackById = Date.now());

      return {
        ...state,
        searchedResources: action.payload,
      };

    case ResourcesActionTypes.LoadSavedResourceFiltersSuccess:
      return {
        ...state,
        resourceFilters: action.payload,
      };

    case ResourcesActionTypes.UpsertResourceStaffableAsRoleSuccess:
      let activeResources: ResourceStaffing[] = JSON.parse(JSON.stringify(state.resources));
      let searchedResourceList: ResourceStaffing[] = JSON.parse(JSON.stringify(state.searchedResources));
      let updatedStaffableAsRoles = action.payload.response;
      let updateStaffableAsRolesRequest = action.payload.request;
      updatedStaffableAsRoles.forEach(ust => {
        activeResources = activeResources.map(ar => {
          if (ust.employeeCode === ar.resource.employeeCode) {
            ust.staffableAsTypeName = updateStaffableAsRolesRequest.find(x => x.employeeCode === ust.employeeCode).staffableAsTypeName;
            ar.staffableAsRoles = [];
            ar.staffableAsRoles.push(ust);
          }
          return ar;
        });
        searchedResourceList = searchedResourceList.map(sr => {
          if (ust.employeeCode === sr.resource.employeeCode) {
            ust.staffableAsTypeName = updateStaffableAsRolesRequest.find(x => x.employeeCode === ust.employeeCode).staffableAsTypeName;
            sr.staffableAsRoles = [];
            sr.staffableAsRoles.push(ust);
          }
          return sr;
        });
      });

      return {
        ...state,
        resources: activeResources,
        searchedResources: searchedResourceList
      };

    case ResourcesActionTypes.DeleteResourceStaffableAsRoleSuccess:
      let activeResourceList: ResourceStaffing[] = JSON.parse(JSON.stringify(state.resources));
      let searchedResources: ResourceStaffing[] = JSON.parse(JSON.stringify(state.searchedResources));
      activeResourceList.forEach(r => {
        let staffableRoleToDelete = r?.staffableAsRoles?.find(st => st.id === action.payload);
        if (staffableRoleToDelete) {
          r.staffableAsRoles.splice(r?.staffableAsRoles?.indexOf(staffableRoleToDelete), 1);
          r.resource.staffableAsTypeName = '';
        }
      });
      searchedResources.forEach(r => {
        let staffableRoleToDelete = r?.staffableAsRoles?.find(st => st.id === action.payload);
        if (staffableRoleToDelete) {
          r.staffableAsRoles.splice(r?.staffableAsRoles?.indexOf(staffableRoleToDelete), 1);
          r.resource.staffableAsTypeName = '';
        }
      });
      return {
        ...state,
        resources: activeResourceList,
        searchedResources: searchedResources
      };

    case ResourcesActionTypes.UpsertResourceFiltersSuccess:

      return {
        ...state,
        resourceFilters: action.payload,
      };

    case ResourcesActionTypes.UpdateResourceSuccess:
      let updatedResources = JSON.parse(JSON.stringify(state.resources));
      updatedResources = updatedResources.map(x => {
        if (action.payload.employeeCode === x.resource.employeeCode) {
          x.allocations = x.allocations.map(y => y.id === action.payload.id ? action.payload : y);
          return x;
        } else {
          return x;
        }
      });

      return {
        ...state,
        resources: updatedResources,
      };

    case ResourcesActionTypes.DeleteResourceStaffingSuccess:
      let updatedResourcesWithDeletedAssignment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const resourceWhoseAllocationToDelete = updatedResourcesWithDeletedAssignment.find(x =>
        !!x.allocations.find(y => y.id === action.payload)
      );

      if (resourceWhoseAllocationToDelete) {
        updatedResourcesWithDeletedAssignment = updatedResourcesWithDeletedAssignment.map(x => {
          if (x.resource.employeeCode === resourceWhoseAllocationToDelete.resource.employeeCode) {
            x.allocations = x.allocations.filter(y => y.id !== action.payload);
            return x;
          } else {
            return x;
          }
        });
      }
      let updatedSearchedResourcesWithDeletedAssignment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));
      const searchedResourceWhoseAllocationToDelete = updatedSearchedResourcesWithDeletedAssignment.find(x =>
        !!x.allocations.find(y => y.id === action.payload)
      );

      if (searchedResourceWhoseAllocationToDelete) {
        updatedSearchedResourcesWithDeletedAssignment = updatedSearchedResourcesWithDeletedAssignment.map(x => {
          if (x.resource.employeeCode === searchedResourceWhoseAllocationToDelete.resource.employeeCode) {
            x.allocations = x.allocations.filter(y => y.id !== action.payload);
            return x;
          } else {
            return x;
          }
        });
      }
      return {
        ...state,
        resources: updatedResourcesWithDeletedAssignment,
        searchedResources: updatedSearchedResourcesWithDeletedAssignment
      };

    case ResourcesActionTypes.AddResourceStaffingSuccess:
      const resourcesWithAddedAssignment: ResourceStaffing[] = JSON.parse(JSON.stringify(state.resources));
      const resourceWhoseAllocationIsAdded = resourcesWithAddedAssignment
        .find(r => r.resource.employeeCode === action.payload[0].employeeCode);
      action.payload.forEach(x => resourceWhoseAllocationIsAdded.allocations.push(x));

      return {
        ...state,
        resources: resourcesWithAddedAssignment,
      };

    case ResourcesActionTypes.UpsertResourceStaffingSuccess:
      const resourcesWithUpsertedAssignment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const searchedResourcesWithUpsertedAssignment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));

      // let resourceWhoseAllocationIsUpserted = resourcesWithUpsertedAssignment.find(r =>
      //  r.resource.employeeCode == action.payload[0].employeeCode
      // );

      // if (resourceWhoseAllocationIsUpserted) {
      //  action.payload.forEach(x => {
      //    let index = resourceWhoseAllocationIsUpserted.allocations.findIndex(y => y.id === x.id);
      //    if (index > -1) {
      //      resourceWhoseAllocationIsUpserted.allocations.splice(index, 1, x)
      //    } else {
      //      resourceWhoseAllocationIsUpserted.allocations.push(x)
      //    }

      //  });
      // }

      resourcesWithUpsertedAssignment.forEach(r => {
        action.payload.forEach(x => {
          if (r.resource.employeeCode === x.employeeCode) {
            r.trackById = Date.now();

            const index = r.allocations.findIndex(y => y.id === x.id);
            if (index > -1) {
              r.allocations.splice(index, 1, x);
            } else {
              r.allocations.push(x);
            }
          }
        });
      });
      // if (resourceWhoseAllocationIsUpserted) {
      //  action.payload.forEach(x => {
      //    let index = resourceWhoseAllocationIsUpserted.allocations.findIndex(y => y.id === x.id);
      //    if (index > -1) {
      //      resourceWhoseAllocationIsUpserted.allocations.splice(index, 1, x)
      //    } else {
      //      resourceWhoseAllocationIsUpserted.allocations.push(x)
      //    }

      //  });
      // }


      const searchedResourceWhoseAllocationIsUpserted = searchedResourcesWithUpsertedAssignment.find(r =>
        r.resource.employeeCode === action.payload[0].employeeCode
      );

      if (searchedResourceWhoseAllocationIsUpserted) {
        action.payload.forEach(x => {
          const index = searchedResourceWhoseAllocationIsUpserted.allocations.findIndex(y => y.id === x.id);
          if (index > -1) {
            searchedResourceWhoseAllocationIsUpserted.allocations.splice(index, 1, x);
          } else {
            searchedResourceWhoseAllocationIsUpserted.allocations.push(x);
          }

        });
      }

      return {
        ...state,
        resources: resourcesWithUpsertedAssignment,
        searchedResources: searchedResourcesWithUpsertedAssignment
      };




      
    case ResourcesActionTypes.UpsertPlaceholderStaffingSuccess:
      const resourcesWithUpsertedPlaceholderAssignment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const searchedResourcesWithUpsertedPlaceholderAssignment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));

      resourcesWithUpsertedPlaceholderAssignment.forEach(r => {
        action.payload.forEach(x => {
          if (r.resource.employeeCode === x.employeeCode) {
            const index = r.placeholderAllocations.findIndex(y => y.id === x.id);
            if (index > -1) {
              r.placeholderAllocations.splice(index, 1, x);
            } else {
              r.placeholderAllocations.push(x);
            }
          }
        });
      });

      const searchedResourceWhosePlaceholderAllocationIsUpserted = searchedResourcesWithUpsertedPlaceholderAssignment.find(r =>
        r.resource.employeeCode === action.payload[0].employeeCode
      );

      if (searchedResourceWhosePlaceholderAllocationIsUpserted) {
        action.payload.forEach(x => {
          const index = searchedResourceWhosePlaceholderAllocationIsUpserted.placeholderAllocations.findIndex(y => y.id === x.id);
          if (index > -1) {
            searchedResourceWhosePlaceholderAllocationIsUpserted.placeholderAllocations.splice(index, 1, x);
          } else {
            searchedResourceWhosePlaceholderAllocationIsUpserted.placeholderAllocations.push(x);
          }

        });
      }

      return {
        ...state,
        resources: resourcesWithUpsertedPlaceholderAssignment,
        searchedResources: searchedResourcesWithUpsertedPlaceholderAssignment
      };







    case ResourcesActionTypes.AddResourceCommitmentSuccess:
      const resourcesWithInsertedCommitment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const searchedResourcesWithInsertedCommitment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));
      const insertedCommitments: CommitmentView[] = [];

      action.payload.forEach(commitment => {
        const commitmentView: CommitmentView = {
          id: commitment.id,
          commitmentTypeCode: commitment.commitmentType.commitmentTypeCode,
          commitmentTypeName: commitment.commitmentType.commitmentTypeName,
          description: commitment.notes,
          employeeCode: commitment.employeeCode,
          endDate: commitment.endDate,
          startDate: commitment.startDate,
          allocation: commitment.allocation,
          isSourceStaffing: commitment.isSourceStaffing
        };
        insertedCommitments.push(commitmentView);
      });

      resourcesWithInsertedCommitment.forEach(r => {
        insertedCommitments.forEach(x => {
          if (r.resource.employeeCode === x.employeeCode) {
            r.commitments.push(x);
          }
        });
      });

      const searchedResourceWhoseCommitmentIsInserted = searchedResourcesWithInsertedCommitment.find(r =>
        r.resource.employeeCode === insertedCommitments[0].employeeCode
      );

      if (searchedResourceWhoseCommitmentIsInserted) {
        insertedCommitments.forEach(x => {
          searchedResourceWhoseCommitmentIsInserted.commitments.push(x);
        });
      }

      return {
        ...state,
        resources: resourcesWithInsertedCommitment,
        searchedResources: searchedResourcesWithInsertedCommitment
      };



    case ResourcesActionTypes.UpdateResourceCommitmentSuccess:
      const resourcesWithUpsertedCommitment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const searchedResourcesWithUpsertedCommitment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));

      const upsertedCommitments: CommitmentView[] = [];

      action.payload.forEach(commitment => {
        const commitmentView: CommitmentView = {
          id: commitment.id,
          commitmentTypeCode: commitment.commitmentType.commitmentTypeCode,
          commitmentTypeName: commitment.commitmentType.commitmentTypeName,
          description: commitment.notes,
          employeeCode: commitment.employeeCode,
          endDate: commitment.endDate,
          startDate: commitment.startDate,
          allocation: commitment.allocation,
          isSourceStaffing: commitment.isSourceStaffing
        };
        upsertedCommitments.push(commitmentView);
      });

      resourcesWithUpsertedCommitment.forEach(r => {
        upsertedCommitments.forEach(upsertedCommitment => {
          if (r.resource.employeeCode === upsertedCommitment.employeeCode) {
            const index = r.commitments.findIndex(y => y.id === upsertedCommitment.id);
            if (index > -1) {
              r.commitments.splice(index, 1, upsertedCommitment);
            } else {
              r.commitments.push(upsertedCommitment);
            }
          }
        });
      });

      const searchedResourceWhoseCommitmentIsUpserted = searchedResourcesWithUpsertedCommitment.find(r =>
        r.resource.employeeCode === upsertedCommitments[0].employeeCode
      );

      if (searchedResourceWhoseCommitmentIsUpserted) {
        upsertedCommitments.forEach(upsertedCommitment => {
          const index = searchedResourceWhoseCommitmentIsUpserted.commitments.findIndex(y => y.id === upsertedCommitment.id);
          if (index > -1) {
            searchedResourceWhoseCommitmentIsUpserted.commitments.splice(index, 1, upsertedCommitment);
          } else {
            searchedResourceWhoseCommitmentIsUpserted.commitments.push(upsertedCommitment);
          }
        });
      }

      return {
        ...state,
        resources: resourcesWithUpsertedCommitment,
        searchedResources: searchedResourcesWithUpsertedCommitment
      };

    case ResourcesActionTypes.DeleteResourceCommitmentSuccess:
      let updatedResourcesWithDeletedCommitment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const resourceWhoseCommitmentToDelete = updatedResourcesWithDeletedCommitment.find(x =>
        !!x.commitments.find(y => y.id === action.payload)
      );

      if (resourceWhoseCommitmentToDelete) {
        updatedResourcesWithDeletedCommitment = updatedResourcesWithDeletedCommitment.map(x => {
          if (x.resource.employeeCode === resourceWhoseCommitmentToDelete.resource.employeeCode) {
            x.commitments = x.commitments.filter(y => y.id !== action.payload);
            return x;
          } else {
            return x;
          }
        });
      }
      let updatedSearchedResourcesWithDeletedCommitment: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));
      const searchedResourceWhoseCommitmentToDelete = updatedSearchedResourcesWithDeletedCommitment.find(x =>
        !!x.commitments.find(y => y.id === action.payload)
      );

      if (searchedResourceWhoseCommitmentToDelete) {
        updatedSearchedResourcesWithDeletedCommitment = updatedSearchedResourcesWithDeletedCommitment.map(x => {
          if (x.resource.employeeCode === searchedResourceWhoseCommitmentToDelete.resource.employeeCode) {
            x.commitments = x.commitments.filter(y => y.id !== action.payload);
            return x;
          } else {
            return x;
          }
        });
      }
      return {
        ...state,
        resources: updatedResourcesWithDeletedCommitment,
        searchedResources: updatedSearchedResourcesWithDeletedCommitment
      };

    case ResourcesActionTypes.DeleteAllocationsCommitmentsStaffingSuccess:
      let updatedResourcesWithDeletedCommitmentAndAllocations: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      let resourcesWhoseCommitmentsOrAllocationIsDeleted = updatedResourcesWithDeletedCommitmentAndAllocations
        .find(x =>
          x.commitments.find(y => action.payload.commitmentIds.includes(y.id)) ||
          x.allocations.find(y => action.payload.allocationIds.includes(y.id))
        )

      if (resourcesWhoseCommitmentsOrAllocationIsDeleted) {
        updatedResourcesWithDeletedCommitmentAndAllocations = updatedResourcesWithDeletedCommitmentAndAllocations.map(x => {
          if (x.resource.employeeCode === resourcesWhoseCommitmentsOrAllocationIsDeleted.resource.employeeCode) {
            x.commitments = x.commitments.filter(y => !action.payload.commitmentIds.includes(y.id));
            x.allocations = x.allocations.filter(y => !action.payload.allocationIds.includes(y.id));
            return x;
          } else {
            return x;
          }
        });
      }
      let updatedSearchedResourcesWithDeletedCommitmentAndAllocations: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));
      const searchedResourcesWhoseCommitmentsOrAllocationIsDeleted =
        updatedSearchedResourcesWithDeletedCommitmentAndAllocations.find(x =>
          x.commitments.find(y => action.payload.commitmentIds.includes(y.id)) ||
          x.allocations.find(y => action.payload.allocationIds.includes(y.id))
        );

      if (searchedResourcesWhoseCommitmentsOrAllocationIsDeleted) {
        updatedSearchedResourcesWithDeletedCommitmentAndAllocations =
          updatedSearchedResourcesWithDeletedCommitmentAndAllocations.map(x => {
            if (x.resource.employeeCode ===
              searchedResourcesWhoseCommitmentsOrAllocationIsDeleted.resource.employeeCode) {
              x.commitments = x.commitments.filter(y => !action.payload.commitmentIds.includes(y.id));
              x.allocations = x.allocations.filter(y => !action.payload.allocationIds.includes(y.id));
              return x;
            } else {
              return x;
            }
          });
      }
      return {
        ...state,
        resources: updatedResourcesWithDeletedCommitmentAndAllocations,
        searchedResources: updatedSearchedResourcesWithDeletedCommitmentAndAllocations
      };

    case ResourcesActionTypes.DeleteSavedResourceFilterSuccess:

      return {
        ...state,
        resourceFilters: state.resourceFilters.filter(x => x.id !== action.payload)
      };

    case ResourcesActionTypes.UpsertResourceViewNoteSuccess:
      const allResources: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const allSearchedResources: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));

      allResources.every(r => {
        if (r.resource.employeeCode === action.payload.employeeCode) {
          const index = r.resourceViewNotes.findIndex(y => y.id === action.payload.id);
          if (index > -1) {
            r.resourceViewNotes.splice(index, 1, action.payload);
          } else {
            r.resourceViewNotes.unshift(action.payload);
          }
          return false;
        }
        return true;
      });

      allSearchedResources.every(r => {
        if (r.resource.employeeCode === action.payload.employeeCode) {
          const index = r.resourceViewNotes.findIndex(y => y.id === action.payload.id);
          if (index > -1) {
            r.resourceViewNotes.splice(index, 1, action.payload);
          } else {
            r.resourceViewNotes.unshift(action.payload);
          }
          return false;
        }
        return true;
      });

      return {
        ...state,
        resources: allResources,
        searchedResources: allSearchedResources
      };

    case ResourcesActionTypes.DeleteResourceViewNotesSuccess:
      const resourcesInState: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const searchedResourcesInState: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));

      resourcesInState.forEach(r => {
        r.resourceViewNotes = r.resourceViewNotes.filter(x => !action.payload.includes(x.id))
        //r.resource.resourceViewNotes = r.resource.resourceViewNotes.filter(x => !action.payload.includes(x.id))
      });

      searchedResourcesInState.forEach(r => {
        r.resourceViewNotes = r.resourceViewNotes.filter(x => !action.payload.includes(x.id))
        //r.resource.resourceViewNotes = r.resource.resourceViewNotes.filter(x => !action.payload.includes(x.id))
      });
      return {
        ...state,
        resources: resourcesInState,
        searchedResources: searchedResourcesInState
      };

    case ResourcesActionTypes.LoadLastBillableDateForResourcesSuccess:
      const allResourcesInState: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.resources));
      const allSearchedResourceInState: ResourceStaffing[] =
        JSON.parse(JSON.stringify(state.searchedResources));

      const resourcesWithLastBillableDateToBeRemoved: string[] = action.employeeCodes?.split(',')?.filter(f => !action.payload?.map(x => x.employeeCode)?.includes(f));

      allResourcesInState.every(r => {
        if (resourcesWithLastBillableDateToBeRemoved.includes(r.resource.employeeCode)) {
          r.resource.lastBillable = null;
          return true;
        }
        action.payload.every(x => {
          if (r.resource.employeeCode === x.employeeCode) {
            r.resource.lastBillable = x;
          }
          return true;
        });
        return true;
      });

      allSearchedResourceInState.every(r => {
        if (resourcesWithLastBillableDateToBeRemoved.includes(r.resource.employeeCode)) {
          r.resource.lastBillable = null;
          return true;
        }
        action.payload.every(x => {
          if (r.resource.employeeCode === x.employeeCode) {
            r.resource.lastBillable = x;
          }
          return true;
        });
        return true;
      });

      return {
        ...state,
        resources: allResourcesInState,
        searchedResources: allSearchedResourceInState
      };

    default:
      return state;
  }
}
