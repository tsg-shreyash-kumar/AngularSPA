import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-gantt-threshold',
  templateUrl: './gantt-threshold.component.html',
  styleUrls: ['./gantt-threshold.component.scss']
})
export class GanttThresholdComponent implements OnInit, OnChanges {
  public mergedArray = [];

  @Input() perDayAllocation: any;
  @Input() thresholdRangeValue: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void{
    if((changes.perDayAllocation || changes.thresholdRangeValue) && this.perDayAllocation && this.thresholdRangeValue){
      this.setThresholdClasses()
    }
  }


  private setThresholdClasses(){
    
    if(!this.thresholdRangeValue.isFilterApplied){
      this.mergedArray =[];
      return;
    }
     
    let lastAllocationValueInBucket = -1;
    this.mergedArray =[];
    for(let i = 0; i< this.perDayAllocation.length -1; i++){
      const isperDayAllocationOutsideThresholdRange = (this.perDayAllocation[i] <= this.thresholdRangeValue.min || this.perDayAllocation[i] > this.thresholdRangeValue.max) ;
      
      if(isperDayAllocationOutsideThresholdRange && this.perDayAllocation[i] != lastAllocationValueInBucket){
        lastAllocationValueInBucket = this.perDayAllocation[i];

        for(let j = i+1; j<= this.perDayAllocation.length; j++){
          if(this.perDayAllocation[j] != lastAllocationValueInBucket){
            this.mergedArray.push({className: `start-${i+1} duration-${(j-i)}`, allocation: lastAllocationValueInBucket});
            
            i=j-1;
            break;
          }
            
        }
        
      }
    }
  }

}
