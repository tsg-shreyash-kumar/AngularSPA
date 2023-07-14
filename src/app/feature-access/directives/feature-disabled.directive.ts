import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoreService } from 'src/app/core/core.service';
import { CommonService } from 'src/app/shared/commonService';

@Directive({
  selector: '[appFeatureDisabled]'
})
export class FeatureDisabledDirective {

  // @Input()
  // appFeatureDisabled = '';
  // elementTypes = ['input', 'select', 'button', 'a', 'i'];

  constructor(private elementRef: ElementRef, private coreService: CoreService) { }

  @Input() set appFeatureDisabled(featureName: string) {
    const accessibleFeatures = this.coreService.loggedInUserClaims.FeatureAccess;
    const isReadOnly = CommonService.isReadOnlyAccessToFeature(featureName, accessibleFeatures);
    const isLinkDisabled = CommonService.isLinkDisabledForFeature(featureName, accessibleFeatures);

    if (isReadOnly || isLinkDisabled) {
      this.elementRef.nativeElement.classList.add('read-only');
    } else {
      this.elementRef.nativeElement.classList.remove('read-only');
    }

  }

  // @HostListener('click', ['$event']) onClick($event){
  //   console.info('clicked: ' + $event);
  //   $event.preventDefault();
  //   $event.stopPropagation();
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   const elements = this.getElements();
  //   this.doReadOnly(elements);
  // }
  // getElements() {
  //   let elements = [];
  //   if( this.elementTypes.includes(this._el.nativeElement.nodeName.toLowerCase())){
  //     elements = elements.concat(this._el.nativeElement);
  //   }else{
  //     elements =  this._el.nativeElement.querySelectorAll(this.elementTypes.join(','));
  //   }

  //   return elements;
  // }

  // doReadOnly(elements) {
  //   const accessibleFeatures = this.coreService.loggedInUserClaims.FeatureAccess.map(x => x.FeatureName);
  //   const isReadOnly = CommonService.hasAccessToFeature(this.appFeatureDisabled, accessibleFeatures);

  //   for (let i = 0; i < elements.length; i++) {
  //     elements[i].disabled = true;// isReadOnly;
  //     // elements[i].style.pointerEvents = "none";
  //   }
  // }

}
