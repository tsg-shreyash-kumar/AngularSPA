import { Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
    selector: 'app-html-grid',
    templateUrl: './html-table-grid.component.html',
    styleUrls: ['./html-table-grid.component.scss']
})
export class HtmlGridComponent {
    @Input() tableData = [];
    @Input() gridTitle: string;
    @Input() tableDef = [];

    @ViewChild('tableRef', {static: false}) tableRef : ElementRef;
    constructor() {}

    isDataAnArray(data) {
        return Array.isArray(data) && data.length > 0;
    }

    isDataNotAnArray(data) {
        return !Array.isArray(data) && data?.length > 0;
    }

    isDataEmpty(data) {
        return (Array.isArray(data) && data?.length === 0) || data === undefined;
    }
}
