import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-resource',
  templateUrl: './search-resource.component.html',
  styleUrls: ['./search-resource.component.scss']
})
export class SearchResourceComponent implements OnInit {

  @Input() searchedResource;
  @Output() openResourceDetailsDialog = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  getImageUrl() {
    this.searchedResource.profileImageUrl = "assets/img/user-icon.jpg";
  }

  openResourceDetailsDialogHandler(){
    this.openResourceDetailsDialog.emit(this.searchedResource.id);
  }
}
