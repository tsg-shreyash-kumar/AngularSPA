import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserPreferenceSupplyGroup } from '../shared/interfaces/userPreferenceSupplyGroup';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesMessageService {
  private userPreferencesSupplyGroups = new Subject<UserPreferenceSupplyGroup[]>();
  
  constructor() { }

  triggerUserPreferencesSupplyGroupsRefresh(upsertedData: UserPreferenceSupplyGroup[]) {
    this.userPreferencesSupplyGroups.next(upsertedData);
  }

  refreshUserPreferencesSupplyGroups() {
    return this.userPreferencesSupplyGroups.asObservable();
  }
}
