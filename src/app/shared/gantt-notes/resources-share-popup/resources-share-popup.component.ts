import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/commonService';
import { Resource } from 'src/app/shared/interfaces/resource.interface';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-shared-resources-share-popup',
  templateUrl: './resources-share-popup.component.html',
  styleUrls: ['./resources-share-popup.component.scss']
})
export class ResourcesSharePopupComponent implements OnInit {
  // @Inputs
  @Input() selectedOption: any;
  @Input() specificUsers: any;

  // @Outputs
  @Output() sharedOptionEmitter = new EventEmitter<any>();
  @Output() closeMenuEmitter = new EventEmitter<any>();

  // User Search Query
  public asyncResourceString = '';
  resourceInput$ = new Subject<string>();
  isResourceSearchOpen = false;
  resourcesData$: Observable<Resource[]>;
  selectedResources: Resource[] = [];
  selectedUsers: any[] = [];

  // Sharing Options
  public options = [
    { label: "Only me", icon: "lock", checked: true },
    { label: "All users", icon: "globe", checked: false },
    { label: "Specific users", icon: "user", checked: false, specifcUsers: [] }
  ];

  public usersAdded = []; // Specific users to be added here
  public openSpecificusers = false;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.attachEventForResourcesSearch();

    // When note is being edited
    // Adds checked and specific user states to the sharing option selected
    if (this.selectedOption) {
      this.options.forEach((item) => {
        if (item.label === this.selectedOption.label) {
          item.checked = true;

          if (this.selectedOption.icon && this.selectedOption.icon.length) {
            item.icon = this.selectedOption.icon;
          }

          if (this.selectedOption.users && this.selectedOption.users.length) {
            this.usersAdded = this.selectedOption.users.sort((previousElement, nextElement) => {
              return CommonService.sortByString(previousElement.employeeCode, nextElement.employeeCode)
            });
          }
        } else {
          item.checked = false;
        }
      });
    }
  }

  // Open Specific Users Menu
  toggleSpecificUsers() {
    this.openSpecificusers = !this.openSpecificusers;
  }

  // Only Me | All Users Clicked
  handleSharingOption(option) {
    const sharedObj = {
      label: option.label,
      icon: option.icon,
      checked: option.checked
    };

    this.options.forEach((item) => {
      if (item.label === option.label) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });

    this.sharedOptionEmitter.emit(sharedObj); // Send user to resources file
    this.closeMenuEmitter.emit(); // Close sharing optons menu
  }

  // Add Specific User
  addUser(users) {
    this.usersAdded = [...new Set([...this.usersAdded, ...users])]
    this.asyncResourceString = "";

    this.usersAdded.forEach((item) => {
      if (users.some(x => x.employeeCode === item.employeeCode)) {
        item.selected = true;
      }
    });
  }

  // Delete Specific User
  deleteUser(user, index) {
    this.usersAdded.forEach((item) => {
      if (item.employeeCode === user.employeeCode) {
        item.selected = false;
        this.usersAdded.splice(index, 1);
        this.selectedResources = [...this.selectedResources.filter(x => x.employeeCode !== item.employeeCode)];
        this.selectedUsers = [...this.selectedUsers.filter(x => x !== item.fullName)];
      }
    });
  }

  // When Sharing Option is "Specific Users"
  saveAddedusers() {
    let sharedObj = {
      label: "",
      icon: "",
      checked: false,
      specificUsers: []
    };

    if (this.usersAdded.length) {
      this.options.forEach((item) => {
        if (item.label === "Specific users") {
          item.checked = true;

          // Add data to object
          sharedObj = {
            label: item.label,
            icon: item.icon,
            checked: item.checked,
            specificUsers: this.usersAdded
          };
        } else {
          item.checked = false;
        }
      });
    }

    if (sharedObj.specificUsers.length) {
      this.sharedOptionEmitter.emit(sharedObj); // Send users to resource
      this.closeMenuEmitter.emit(); // Close sharing options menu
    }
  }

  /// Multiselect TODO: use type-ahead instead of custom search function once we replace bootstrap typeahead with ng-select
  // we can't do it right now as [typeahead] directive creates conflict in bootstrap and ng-select
  onResourceSearchChange($event) {
    if ($event.term.length > 2) {
      this.resourceInput$.next($event.term);
    }

    // to reset search term if keyword's length is less than 3
    if ($event.term.length < 3) {
      this.resourceInput$.next(null);
    }

    // TODO: below condition should be removed once permanent solution is applied
    if ($event.term.length < 1) {
      this.isResourceSearchOpen = false;
    }
  }

  attachEventForResourcesSearch() {
    this.resourcesData$ = concat(
      of([]), // default items
      this.resourceInput$.pipe(
        distinctUntilChanged(),
        switchMap(term => this.sharedService.getResourcesBySearchString(term).pipe(
          catchError(() => of([])), // empty list on error
        )),
        tap(() => {
          this.isResourceSearchOpen = true;
        })
      )
    );
  }

  selectedResourcesChange($event) {
    var searchedResources = [];
    $event.forEach(x => {
      if (!this.usersAdded.some(y => (y.employeeCode ?? y.fullName) === (x.employeeCode ?? x.fullName)))
        searchedResources.push(x);
    });

    this.selectedResources = searchedResources;
    this.isResourceSearchOpen = false;
    this.addUser(this.selectedResources);
  }
}
