import {
  Component, OnInit, Input, Output, EventEmitter,
  ViewChild, ChangeDetectionStrategy, OnDestroy, ViewEncapsulation, AfterViewInit
} from '@angular/core';
import { TreeviewItem, TreeviewHelper, TreeviewI18n, DropdownTreeviewComponent, TreeviewConfig, TreeviewComponent } from 'ngx-treeview';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DropdownTreeViewButtonText } from '../dropdownTreeviewButtonText';
import { debounceTime } from 'rxjs/operators';
import { TreeviewDropdownType } from '../constants/enumMaster';
@Component({
  selector: 'app-office-dropdown',
  templateUrl: './office-dropdown.component.html',
  styleUrls: ['./office-dropdown.component.scss'],
  providers: [{ provide: TreeviewI18n, useClass: DropdownTreeViewButtonText }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class OfficeDropdownComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("treeViewDropDown", { static: false }) dropdownTreeViewComponent: DropdownTreeviewComponent | TreeviewComponent;
  // -----------------------Local variables--------------------------------------------//
  items: TreeviewItem[] = [];
  dropdownSettings: {};
  private _officeHierarchy = new BehaviorSubject<any>({});
  private _selectedOfficeList = new BehaviorSubject<any>({});
  private _title = new BehaviorSubject<any>({});
  private _checkBoxChange = new Subject();
  private subscription: Subscription;
  
  public get treeviewDropdownType(): typeof TreeviewDropdownType {
    return TreeviewDropdownType; 
  }

  // -----------------------Input Events--------------------------------------------//
  @Input() treeViewType = this.treeviewDropdownType.DROPDOWN_TREE_VIEW;

  @Input()
  set selectedOfficeList(value) {
    this._selectedOfficeList.next(value);
  }
  get selectedOfficeList() {
    return this._selectedOfficeList.getValue();
  }

  @Input()
  set officeHierarchy(value) {
    this._officeHierarchy.next(value);
  }
  get officeHierarchy() {
    return this._officeHierarchy.getValue();
  }
  @Input()
  set title(value) {
    this._title.next(value);
  }
  get title() {
    return this._title.getValue();
  }
  @Input() maxHeight = 350;

  // -----------------------Output Events--------------------------------------------//
  @Output() refreshView = new EventEmitter<any>();

  constructor() { 
    this.treeViewType = TreeviewDropdownType.DROPDOWN_TREE_VIEW;
  }

  // -----------------------Component Lifecycle Hooks --------------------------------------------//
  ngOnInit() {

    this.addDebounceToCheckBoxClickEvent();
    this.initializeTreeViewDropDownSettings();
    
  }

  initializeTreeViewDropDownSettings(){
    this.dropdownSettings = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasFilter: true,
      hasCollapseExpand: false,
      decoupleChildFromParent: false,
      maxHeight: this.maxHeight
    });
  }

  ngAfterViewInit(){

    this._officeHierarchy.subscribe(officeHierarchy => {
      if (officeHierarchy) {
        this.items = [new TreeviewItem(officeHierarchy)];
        
        this.dropdownTreeViewComponent.i18n['items'] = this.items;
        this.uncheckAllOffice(this.items);
      }
    });

    this._selectedOfficeList.subscribe(() => {
      if (this.items) {
        this.uncheckAllOffice(this.items, false);
        this.checkSelectedOffice(this.items);
      }
    });

    this._title.subscribe(title => {
      if (title) {
        this.dropdownTreeViewComponent.i18n['title'] = this.title;
      }
    });
  }

  // -----------------------Event Handlers--------------------------------------------//

  // This will prevent multiple API calls when checkboxes are checked/unchecked in quick successions
  addDebounceToCheckBoxClickEvent() {

    this.subscription = this._checkBoxChange.pipe(
      debounceTime(1000)
    ).subscribe(selectedValues => this.refreshView.emit(selectedValues));

  }

  uncheckAllOffice(officeHierarchy: TreeviewItem[], collapseHierachy = true) {
    if (officeHierarchy && officeHierarchy.length > 0) {
      officeHierarchy.forEach(currentOffice => {
        currentOffice.checked = false;
        currentOffice.correctChecked();
        // to prevent dropdown hierarchy from expanding when user selects the parent node
        // currentOffice.collapsed = collapseHierachy;
        this.uncheckAllOffice(currentOffice['internalChildren'], collapseHierachy);
      });
    }
  }

  checkSelectedOffice(officeTreeViewItems: TreeviewItem[]) {
    if (officeTreeViewItems.length > 0 && this.selectedOfficeList) {
      for (const officeCode of this.selectedOfficeList) {
        const office = TreeviewHelper.findItem(officeTreeViewItems[0], officeCode.toString());
        if (office) {
          office.checked = true;
          this.expandParentOffice(office);
        }
      }
    }
  }

  expandParentOffice(currentOffice: TreeviewItem) {
    const parentOffice = TreeviewHelper.findParent(this.items[0], currentOffice);
    if (parentOffice) {
      // to prevent dropdown hierarchy from expanding when user selects the parent node
      // parentOffice.collapsed = false;
      parentOffice.correctChecked();
      this.expandParentOffice(parentOffice);
    }
    return false;
  }

  onSelectChange(items: any) {
    if (items.length <= 0 && !this.officeHierarchy) {
      // this.refreshView.emit(items.toString());
      return false;
    }

    for (const item of items) {
      const office = TreeviewHelper.findItem(this.items[0], item.toString());
      this.expandParentOffice(office);
    }

    if (JSON.stringify(this.selectedOfficeList) === JSON.stringify(items)) {
      return false;
    }

    this.selectedOfficeList = items;

    const officeCodes = this.selectedOfficeList.filter(officeCode => Number(officeCode)).toString();

    this._checkBoxChange.next(officeCodes);
  }

  deSelectAllItems(){
    let treeViewComponent = this.getTreeViewComponent(this.dropdownTreeViewComponent);
    treeViewComponent.allItem.checked = false;
    treeViewComponent.onAllCheckedChange();
  }

  getTreeViewComponent(component): TreeviewComponent{
    if(component.hasOwnProperty('treeviewComponent')){
      return component["treeviewComponent"];
    }else{
      return component;
    }
  }

  // This function is required to filter office from tree view
  onFilterChange(item: any) { }

  // ---------------------------Destroy Event --------------------------

  ngOnDestroy() {
    this._checkBoxChange.unsubscribe();
    this.subscription.unsubscribe();
  }

}
