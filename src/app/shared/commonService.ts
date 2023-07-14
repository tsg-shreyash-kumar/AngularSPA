import { ConstantsMaster } from "./constants/constantsMaster";
import { PlanningCardModel } from "./interfaces/planningCardModel.interface";
import { CommitmentType as CommitmentTypeCodeEnum } from "src/app/shared/constants/enumMaster";
import { SortRow } from "./interfaces/sort-row.interface";

export class CommonService {

  public static generate_UUID() {
    let date = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const randomNumber = (date + Math.random() * 16) % 16 || 0;
      date = Math.floor(date / 16);
      return (c === 'x' ? randomNumber : (randomNumber && 0x3 || 0x8)).toString(16);
    });
    return uuid;
  }

  public static hasAccessToFeature(featureName, accessibleFeatures) {
    if (Array.isArray(featureName)) {
      return accessibleFeatures?.some(x => featureName.some(f => x === f));
    }
    return accessibleFeatures?.some(x => x === featureName);
  }

  public static isAccessToFeatureReadOnlyOrNone(featureName, accessibleFeaturesForUser) {
    const isAccessable = !this.isReadOnlyAccessToFeature(featureName, accessibleFeaturesForUser) && !this.isLinkDisabledForFeature(featureName, accessibleFeaturesForUser);
    return isAccessable;
  }

  public static isReadOnlyAccessToFeature(featureName, accessibleFeatures) {
    if (Array.isArray(featureName)) {
      return accessibleFeatures.filter(x => featureName.includes(x.FeatureName))?.every(y => y.AccessTypeName === 'Read');
    }
    return accessibleFeatures.filter(x => x.FeatureName === featureName)?.every(y => y.AccessTypeName === 'Read');
  }

  public static isLinkDisabledForFeature(featureName, accessibleFeatures) {
    if (Array.isArray(featureName)) {
      return accessibleFeatures.filter(x => featureName.includes(x.FeatureName))?.every(y => y.AccessTypeName === 'None');
    }
    return accessibleFeatures.filter(x => x.FeatureName === featureName)?.every(y => y.AccessTypeName === 'None');
  }

  public static getAccessibleReports(accessiblePages) {
    let accessibleReports = [];
    accessiblePages.forEach(element => {
      if (element.trim().includes(ConstantsMaster.appScreens.page.analytics)) {
        accessibleReports.push(element.trim());
      }
    });
    return accessibleReports
  }

  public static getUniqueArrayOfObjects(arr, param1, param2) {
    let uniqueArray = [];
    arr.forEach(item => {
      let itemsFound = arr.filter(x => x[param1] === item[param1] && x[param2] === item[param2]);
      if (uniqueArray.indexOf(itemsFound[0]) < 0) {
        uniqueArray.push(itemsFound[0]);
      }
    });
    return uniqueArray;
  }

  public static findDuplicatesInArray(arr) {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }

  public static getAccessibleCommitmentTypes(claims) {
    let accessibleCommitmentTypes: string[] = [];
    let commitmentTypes = claims?.FeatureAccess?.filter(x => x.FeatureName.startsWith('commitmentType/')
      && (x.AccessTypeName === 'Read' || x.AccessTypeName === 'Write'));

    commitmentTypes.forEach(element => {
      accessibleCommitmentTypes.push(element.FeatureName.substring('15'))
    });
    return accessibleCommitmentTypes;

  }

  public static getEditableCommitmentTypes(claims, commitmentTypes) {
    let editableCommitmentTypeCodes: string[] = [];
    editableCommitmentTypeCodes = this.getEditableCommitmentTypesCodesList(claims);

    let editableCommitmentTypes = commitmentTypes.filter(x => editableCommitmentTypeCodes?.includes(x.commitmentTypeCode));
    const dummyCategory = { commitmentTypeCode: '', commitmentTypeName: 'Select Type', precedence: 0, isStaffingTag: false };
    editableCommitmentTypes.splice(0, 0, dummyCategory);
    return editableCommitmentTypes;

  }

  public static getEditableCommitmentTypesCodesList(claims) {
    let editableCommitmentTypeCodes: string[] = [];
    let editableCommitmentTypesFeature = claims?.FeatureAccess?.filter(x => x.FeatureName.startsWith('commitmentType/')
      && x.AccessTypeName === 'Write');

    editableCommitmentTypesFeature.forEach(element => {
      editableCommitmentTypeCodes.push(element.FeatureName.substring('15'))
    });

    return editableCommitmentTypeCodes;

  }

  public static sortByDate(previousDate, nextDate, sortDirection = 'asc') {
    const higherComparaterValue = sortDirection === 'asc' ? 1 : -1;
    const lowerComparaterValue = sortDirection === 'asc' ? -1 : 1;
    let sortValue = 0;

    if (!previousDate)
      sortValue = higherComparaterValue;
    else if (!nextDate)
      sortValue = lowerComparaterValue;
    else if (new Date(previousDate).getTime() > new Date(nextDate).getTime())
      sortValue = higherComparaterValue;
    else if (new Date(previousDate).getTime() < new Date(nextDate).getTime())
      sortValue = lowerComparaterValue;
    return sortValue;
  }

  public static sortByString(previousElement, nextElement, sortDirection = 'asc') {
    const higherComparaterValue = sortDirection === 'asc' ? 1 : -1;
    const lowerComparaterValue = sortDirection === 'asc' ? -1 : 1;
    let sortValue = 0;

    if (!previousElement)
      sortValue = higherComparaterValue;
    else if (!nextElement)
      sortValue = lowerComparaterValue;
    else if (previousElement > nextElement)
      sortValue = higherComparaterValue;
    else if (previousElement < nextElement)
      sortValue = lowerComparaterValue;

    return sortValue;
  }

  public static sortByNumber(previousElement, nextElement, sortDirection = 'asc') {
    const higherComparaterValue = sortDirection === 'asc' ? 1 : -1;
    const lowerComparaterValue = sortDirection === 'asc' ? -1 : 1;
    let sortValue = 0;

    if (!previousElement)
      sortValue = higherComparaterValue;
    else if (!nextElement)
      sortValue = lowerComparaterValue;
    sortValue = previousElement - nextElement;

    return sortValue;
  }

  public static toggleClass(elements: HTMLElement[], className, isApply = false) {
    if (isApply) {
      elements.forEach(element => {
        if (element && !element.classList.contains(className))
          element.classList.add(className);
      });
    }
    else {
      elements.forEach(element => {
        if (element && element.classList.contains(className))
          element.classList.remove(className);
      });
    }
  }

  public static arrayMove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);

    return arr;
  }

  public static isArraysEqual(arr1, arr2) {
    let arr1Length = arr1.length;
    let arr2Length = arr2.length;

    // If lengths of array are not equal means
    // array are not equal
    if (arr1Length != arr2Length)
      return false;

    // Sort both arrays
    arr1.sort();
    arr2.sort();

    // Linearly compare elements
    for (let i = 0; i < arr1Length; i++)
      if (arr1[i] != arr2[i])
        return false;

    // If all elements were same.
    return true;
  }

  public static ConvertToPlanningCardViewModel(projects, officeFlatList, staffingTagsList) {
    let planningCardModels: PlanningCardModel[] = [];

    projects.forEach((planningCard) => {
      const planningCardModel: PlanningCardModel = {
        id: planningCard.id,
        name: planningCard.name,
        projectName: planningCard.name,
        startDate: planningCard.startDate,
        endDate: planningCard.endDate,
        office: planningCard.office,
        isShared: planningCard.isShared,
        sharedOfficeCodes: planningCard.sharedOfficeCodes,
        sharedOfficeNames: CommonService.GetOfficeNames(planningCard.sharedOfficeCodes, officeFlatList),
        sharedStaffingTags: planningCard.sharedStaffingTags,
        sharedStaffingTagNames: CommonService.GetServiceLineNames(planningCard.sharedStaffingTags, staffingTagsList),
      };

      planningCardModels.push(planningCardModel);
    });

    return planningCardModels;
  }

  public static GetOfficeNames(sharedOfficeCodes, officeFlatList) {
    let sharedOffices = new Array();
    let sharedOfficeCodeList = sharedOfficeCodes.split(',');
    sharedOfficeCodeList.forEach(sharedOfficeCode => {
      sharedOffices.push((officeFlatList.find((x) => x.officeCode == sharedOfficeCode))?.officeAbbreviation)
    });

    return sharedOffices.join(', ');
  }

  public static GetServiceLineNames(sharedStaffingTags, staffingTagsList) {
    let sharedServiceLines = new Array();
    let sharedStaffingTagsList = sharedStaffingTags.split(',');
    sharedStaffingTagsList.forEach(sharedstaffingTag => {
      sharedServiceLines.push((staffingTagsList.find((x) => x.serviceLineCode == sharedstaffingTag))?.serviceLineName)
    });

    return sharedServiceLines.join(', ');
  }

  public static getResourcesSortAndGroupBySelectedValues(resources, sortBy, sortDirection = 'asc') {

    const sortByList = sortBy?.length > 1 ? sortBy.split(',') : null;
    const higherComparaterValue = sortDirection === 'asc' ? 1 : -1;
    const lowerComparaterValue = sortDirection === 'asc' ? -1 : 1;

    if (sortByList && resources?.length > 0) {
      resources.sort((previousElement, nextElement) => {
        for (let index = 0; index < sortByList.length; index++) {
          switch (sortByList[index]) {
            case 'levelGrade': {
              const comparer = this.sortAlphanumeric(previousElement.resource.levelGrade, nextElement.resource.levelGrade, sortDirection);
              if (comparer === 1 || comparer === -1) { return comparer; }
              break;
            }
            case 'office': {
              if (previousElement.resource.schedulingOffice.officeName > nextElement.resource.schedulingOffice.officeName) {
                return higherComparaterValue;
              }
              if (previousElement.resource.schedulingOffice.officeName < nextElement.resource.schedulingOffice.officeName) {
                return lowerComparaterValue;
              }
              break;
            }
            case 'position': {
              if (previousElement.resource[sortByList[index]].positionGroupName > nextElement.resource[sortByList[index]].positionGroupName) {
                return higherComparaterValue;
              }
              if (previousElement.resource[sortByList[index]].positionGroupName < nextElement.resource[sortByList[index]].positionGroupName) {
                return lowerComparaterValue;
              }
              break;
            }
            case 'dateFirstAvailable' || 'startDate': {
              //this is done to handle nulls as we want to push them down
              if (!previousElement.resource[sortByList[index]]) {
                return 1;
              }
              if (!nextElement.resource[sortByList[index]]) {
                return -1;
              }

              if (new Date(previousElement.resource[sortByList[index]]) > new Date(nextElement.resource[sortByList[index]])) {
                return higherComparaterValue;
              }
              if (new Date(previousElement.resource[sortByList[index]]) < new Date(nextElement.resource[sortByList[index]])) {
                return lowerComparaterValue;
              }
              break;
            }

            case 'lastBillableDate': {
              //this is done to handle nulls as we want to push them down
              if (!previousElement.resource.lastBillable?.lastBillableDate) {
                return 1;
              }
              if (!nextElement.resource.lastBillable?.lastBillableDate) {
                return -1;
              }

              if (new Date(previousElement.resource.lastBillable?.lastBillableDate) > new Date(nextElement.resource.lastBillable?.lastBillableDate)) {
                return higherComparaterValue;
              }
              if (new Date(previousElement.resource.lastBillable?.lastBillableDate) < new Date(nextElement.resource.lastBillable?.lastBillableDate)) {
                return lowerComparaterValue;
              }
              break;
            }
            case 'percentAvailable': {
              //this is done to handle nulls as we want to push them down
              if (!previousElement.resource[sortByList[index]]) {
                return 1;
              }
              if (!nextElement.resource[sortByList[index]]) {
                return -1;
              }

              if (previousElement.resource[sortByList[index]] > nextElement.resource[sortByList[index]]) {
                return higherComparaterValue;
              }
              if (previousElement.resource[sortByList[index]] < nextElement.resource[sortByList[index]]) {
                return lowerComparaterValue;
              }

              break;
            }
            default: {
              if (previousElement.resource[sortByList[index]]?.toLowerCase() > nextElement.resource[sortByList[index]]?.toLowerCase()) {
                return higherComparaterValue;
              }
              if (previousElement.resource[sortByList[index]]?.toLowerCase() < nextElement.resource[sortByList[index]]?.toLowerCase()) {
                return lowerComparaterValue;
              }
              break;
            }
          }


        }
      });
    }

    return resources;
  }

  public static getResourcesSortBySelectedValues(resources, sortByRows: SortRow[]) {
    let sortByList = [];
    if (!sortByRows || sortByRows.length === 0) {
      sortByList = sortByList.concat({ field: 'fullName', direction: 'asc' } as SortRow);
    }
    else {
      sortByList = sortByList.concat(sortByRows)
    }

    if (sortByList && resources?.length > 0) {
      resources.sort((previousElement, nextElement) => {
        for (let index = 0; index < sortByList.length; index++) {
          const higherComparaterValue = sortByList[index].direction === 'asc' ? 1 : -1;
          const lowerComparaterValue = sortByList[index].direction === 'asc' ? -1 : 1;

          switch (sortByList[index].field) {
            case 'levelGrade': {
              const comparer = this.sortAlphanumeric(previousElement.resource.levelGrade, nextElement.resource.levelGrade, sortByList[index].direction);
              if (comparer === 1 || comparer === -1) { return comparer; }
              break;
            }
            case 'office': {
              if (previousElement.resource.schedulingOffice.officeName > nextElement.resource.schedulingOffice.officeName) {
                return higherComparaterValue;
              }
              if (previousElement.resource.schedulingOffice.officeName < nextElement.resource.schedulingOffice.officeName) {
                return lowerComparaterValue;
              }
              break;
            }
            case 'position': {
              if (previousElement.resource[sortByList[index].field].positionGroupName > nextElement.resource[sortByList[index].field].positionGroupName) {
                return higherComparaterValue;
              }
              if (previousElement.resource[sortByList[index].field].positionGroupName < nextElement.resource[sortByList[index].field].positionGroupName) {
                return lowerComparaterValue;
              }
              break;
            }
            case 'dateFirstAvailable':
            case 'startDate': {
              //this is done to handle nulls as we want to push them down
              if (!previousElement.resource[sortByList[index].field]) {
                return 1;
              }
              if (!nextElement.resource[sortByList[index].field]) {
                return -1;
              }

              if (new Date(previousElement.resource[sortByList[index].field]) > new Date(nextElement.resource[sortByList[index].field])) {
                return higherComparaterValue;
              }
              if (new Date(previousElement.resource[sortByList[index].field]) < new Date(nextElement.resource[sortByList[index].field])) {
                return lowerComparaterValue;
              }
              break;
            }

            case 'lastBillableDate': {
              //this is done to handle nulls as we want to push them down
              if (!previousElement.resource.lastBillable?.lastBillableDate) {
                return 1;
              }
              if (!nextElement.resource.lastBillable?.lastBillableDate) {
                return -1;
              }

              if (new Date(previousElement.resource.lastBillable?.lastBillableDate) > new Date(nextElement.resource.lastBillable?.lastBillableDate)) {
                return higherComparaterValue;
              }
              if (new Date(previousElement.resource.lastBillable?.lastBillableDate) < new Date(nextElement.resource.lastBillable?.lastBillableDate)) {
                return lowerComparaterValue;
              }
              break;
            }
            case 'percentAvailable': {
              //this is done to handle nulls as we want to push them down
              if (!previousElement.resource[sortByList[index].field]) {
                return 1;
              }
              if (!nextElement.resource[sortByList[index].field]) {
                return -1;
              }

              if (previousElement.resource[sortByList[index].field] > nextElement.resource[sortByList[index].field]) {
                return higherComparaterValue;
              }
              if (previousElement.resource[sortByList[index].field] < nextElement.resource[sortByList[index].field]) {
                return lowerComparaterValue;
              }

              break;
            }
            default: {
              if (previousElement.resource[sortByList[index].field]?.toLowerCase() > nextElement.resource[sortByList[index].field]?.toLowerCase()) {
                return higherComparaterValue;
              }
              if (previousElement.resource[sortByList[index].field]?.toLowerCase() < nextElement.resource[sortByList[index].field]?.toLowerCase()) {
                return lowerComparaterValue;
              }
              break;
            }
          }


        }
      });
    }

    return resources;
  }

  public static sortAlphanumeric(previous, next, sortDirection) {
    const regexAlpha = /[^a-zA-Z]/g;
    const regexNumeric = /[^0-9]/g;
    const previousAlphaPart = previous.replace(regexAlpha, '');
    const nextAlphaPart = next.replace(regexAlpha, '');
    const higherComparaterValue = sortDirection === 'asc' ? 1 : -1;
    const lowerComparaterValue = sortDirection === 'asc' ? -1 : 1;

    if (previousAlphaPart === nextAlphaPart) {
      const previousNumericPart = parseInt(previous.replace(regexNumeric, ''), 10);
      const nextNumericPart = parseInt(next.replace(regexNumeric, ''), 10);
      if (previousNumericPart > nextNumericPart) { return higherComparaterValue; }
      if (previousNumericPart < nextNumericPart) { return lowerComparaterValue; }
    } else {
      if (previousAlphaPart > nextAlphaPart) { return higherComparaterValue; }
      if (previousAlphaPart < nextAlphaPart) { return lowerComparaterValue; }
    }

  }

  public static isCommonElementsInTwoCommaSeparatedStrings(str1, str2) {
    const str1Array: string[] = !str1 ? [] : str1.split(",");
    const str2Array: string[] = !str2 ? [] : str2.split(",");

    const commonValues: string[] = str1Array.filter(value => str2Array.includes(value));

    if (commonValues.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  public static getCommitmentColorClass(commitmentTypeCode, investmentCode): string {
    let colorClass = "";

    switch (commitmentTypeCode) {
      case CommitmentTypeCodeEnum.CASE_OPP:
      case CommitmentTypeCodeEnum.PLANNING_CARD:
      case CommitmentTypeCodeEnum.NAMED_PLACEHOLDER: {
        switch (investmentCode) {
          case ConstantsMaster.InvestmentCategory.InternalPD.investmentCode: {
            colorClass = "orange";
            break;
          }
          case ConstantsMaster.InvestmentCategory.ClientVariable.investmentCode: {
            colorClass = "teal";
            break;
          }
          case ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode: {
            colorClass = "grey";
            break;
          }
          default: {
            colorClass = "blue";
            break;
          }
        }
        break;
      }
      case CommitmentTypeCodeEnum.LOA: {
        colorClass = "pink";
        break;
      }
      case CommitmentTypeCodeEnum.HOLIDAY:
      case CommitmentTypeCodeEnum.AAG:
      case CommitmentTypeCodeEnum.ADAPT:
      case CommitmentTypeCodeEnum.FRWD:
      case CommitmentTypeCodeEnum.VACATION: {
        colorClass = "purple";
        break;
      }
      case CommitmentTypeCodeEnum.TRAINING: {
        colorClass = "light-red";
        break;
      }
      case CommitmentTypeCodeEnum.RECRUITING: {
        colorClass = "yellow";
        break;
      }
      case CommitmentTypeCodeEnum.SHORT_TERM_AVAILABLE:
      case CommitmentTypeCodeEnum.NOT_AVAILABLE:
      case CommitmentTypeCodeEnum.LIMITED_AVAILABILITY: {
        colorClass = "green";
        break;
      }
      case CommitmentTypeCodeEnum.PEG:
      case CommitmentTypeCodeEnum.PEG_Surge: {
        colorClass = "lavender";
        break;
      }
      case CommitmentTypeCodeEnum.DOWN_DAY: {
        colorClass = "blue-grey";
        break;
      }
      default: {
        colorClass = "blue";
        break;
      }
    }

    return colorClass;
  }

}
