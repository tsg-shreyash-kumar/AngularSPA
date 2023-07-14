import * as moment from 'moment';

// Class constains master lists for dropdowns which are not saved in DB. Can be removed when we start saving in DB
export class ConstantsMaster {

  public static resourcesFilter = {
    Offices: 'Offices',
    StaffingTags: 'StaffingTags',
    LevelGrades: 'LevelGrades',
    PositionCodes: 'PositionCodes',
    SortBy: 'SortBy',
    AffiliationRole: 'AffiliationRole',
    CommitmentTypes: 'CommitmentTypes',
    Certificates: 'Certficates',
    Languages: 'Languages',
    RangeThreshold: 'RangeThreshold',
    PracticeArea: 'PracticeArea',
    EmployeeStatus: 'EmployeeStatus',
    StaffableAs: 'StaffableAs'
  };

  public static groupBy = [
    { code: 'office', name: 'Office' },
    { code: 'levelGrade', name: 'Level Grade' },
    { code: 'position', name: 'Position' },
    { code: 'serviceLine', name: 'Service Line' },
    { code: 'dateFirstAvailable', name: 'Availability Date' },
    { code: 'availability', name: 'Availability' },
    { code: 'weeks', name: 'Weeks' }
  ];

  public static sortBy = [
    { code: 'fullName', name: 'Name' },
    { code: 'dateFirstAvailable', name: 'Availability Date' },
    { code: 'percentAvailable', name: 'Availability Percent' },
    { code: 'levelGrade', name: 'Level Grade' },
    { code: 'office', name: 'Office' }
  ];

  // TODO: Add new type in SecurityRoleDataAccess Table
  public static demandTypes = [
    { type: 'Opportunity', name: 'Opp' },
    { type: 'NewDemand', name: 'Cases - New' },
    { type: 'CaseEnding', name: 'Cases - Ending' },
    { type: 'StaffedCase', name: 'Cases - Staffed' },
    { type: 'CasesStaffedBySupply', name: 'Cases - Staffed By Supply' },
    { type: 'ActiveCase', name: 'Cases - On Going' },
    { type: 'PlanningCards', name: 'Planning Cards' }
  ];

  public static availabilityIncludes = [
    { code: 'weekends', name: 'Weekends' },
    { code: 'transition', name: 'Transition' },
    { code: '2', name: 'Administrative' }, // 2 is case Type code in master table. Hence kept it same here
    { code: '4', name: 'Client Development' }, // 3 is case Type code in master table. Hence kept it same here
    { code: '5', name: 'Pro Bono' }, // 5 is case Type code in master table. Hence kept it same here
    { code: 'opportunity', name: 'Opportunities' }
  ];

  public static datePickerRanges = {
    'Current': [moment(), moment().add(14, 'days')],
    'Last 2 Weeks': [moment().subtract(14, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
  };

  public static caseRollOptions = [
    { code: 'rollCurrentCase', name: 'Roll Current Case' },
    { code: 'rollTeamToNewCase', name: 'Roll Team To New Case' },
    { code: 'revertCaseRoll', name: 'Revert Case Roll' },
  ];

  public static employeeStatus = [
    { code: 'active', name: 'Active' },
    { code: 'loa', name: 'LOA' },
    { code: 'notYetStarted', name: 'Not Yet Started' },
    { code: 'transition', name: 'Transition' },
  ];

  public static localStorageKeys = {
    loggedInUserHomeOffice: 'loggedInUserHomeOffice',
    userPreferences: 'userPreferences',
    userPreferenceSupplyGroups: 'userPreferenceSupplyGroups',
    Offices: 'offices',
    OfficeList: 'officeList',
    officeHierarchy: 'officeHierarchy',
    officeHierarchyEMEA: 'officeHierarchyEMEA',
    caseTypes: 'caseTypes',
    serviceLines: 'serviceLines',
    serviceLinesHierarchy: 'serviceLinesHierarchy',
    staffingTags: 'staffingTags',
    staffingTagsHierarchy: 'staffingTagsHierarchy',
    positionsHierarchy: 'positionsHierarchy',
    levelGradesHierarchy: 'levelGradesHierarchy',
    levelGrades: 'levelGrades',
    positions: 'positions',
    positionsGroups: 'positionsGroups',
    skuTermList: 'skuTermList',
    opportunityStatusTypes: 'opportunityStatusTypes',
    commitmentTypes: 'commitmentTypes',
    ringfences: 'ringfences',
    investmentCategories: 'investmentCategories',
    caseRoleTypes: 'caseRoleTypes',
    certificates: 'certificates',
    languages: 'languages',
    practiceAreas: 'practiceAreas',
    affiliationRoles: 'affiliationRoles',
    staffableAsTypes: 'staffableAsTypes',
    demandTypes: 'demandTypes',
    casePlanningBoardBuckets: 'casePlanningBoardBuckets',
    industryPracticeAreas: 'industryPracticeAreas',
    capabilityPracticeAreas: 'capabilityPracticeAreas',
    securityRoles: 'securityRoles',
    userPersonaTypes: 'userPersonaTypes',
    userPlaygroundSession: 'userPlaygroundSession',
    supplyFilterCriteriaObj: 'supplyFilterCriteriaObj',
    supplyGroupFilterCriteriaObj: 'supplyGroupFilterCriteriaObj',
    searchString: 'searchString',
    selectedFilterType: 'selectedFilterType',
    availabilityThreshold: 'availabilityThreshold',
    selectedCommitmentTypes: 'selectedCommitmentTypes',
    cortexSkuMappings: 'cortexSkuMappings',
    userPreferencesLastUpdatedTimestamp: 'userPreferencesLastUpdatedTimestamp'
  };

  public static apiEndPoints = {
    lookup: {
      officeList: 'api/office/officeList',
      officeHierarchy: 'api/office/officeHierarchy',
      casetypes: 'api/caseType/casetypes',
      serviceLines: 'api/lookup/serviceLineList',
      serviceLinesHierarchy: 'api/lookup/serviceLinesHierarchy',
      positionHierarchy: 'api/lookup/jobProfilesHierarchy',
      levelGradesHierarchy: 'api/lookup/levelGrades',
      levelGrades: 'api/lookup/pdGrades',
      positions: 'api/lookup/jobProfiles',
      skuterms: 'api/skuCaseTerms/getskutermlist',
      opportunityStatusTypes: 'api/lookup/opportunityStatusTypes', // pipeline API lookUp Controller
      commitmentTypes: 'api/commitment/lookup',
      investmentTypes: 'api/lookup/investmentTypes',
      caseRoleTypes: 'api/lookup/caseRoleTypes',
      certificates: 'api/lookup/certificates',
      languages: 'api/lookup/languages',
      practiceArea: 'api/practiceArea/getAllPracticeArea',
      staffableAsTypes: 'api/lookup/staffableAsTypes',
      casePlanningBoardBucketsByEmployee: 'api/lookup/casePlanningBucketsByEmployee',
      affiliationRoles: 'api/PracticeArea/getAffiliationRoles',
      industryPracticeArea: 'api/practiceArea/industryPracticeArea',
      capabilityPracticeArea: 'api/practiceArea/capabilityPracticeArea',
      securityRoles: 'api/lookup/securityRoles',
      userPersonaTypes: 'api/lookup/userPersonaTypes'
    },
    userPreferences: 'api/userPreferences',
    getUserPreferenceSupplyGroups: 'api/userPreferenceSupplyGroupAggregator/getUserPreferenceSupplyGroups',
    upsertUserPreferencesSupplyGroups: 'api/userPreferenceSupplyGroup/upsertUserPreferenceSupplyGroups',
    deleteUserPreferenceSupplyGroupByIds: 'api/userPreferenceSupplyGroup/deleteUserPreferenceSupplyGroupByIds',
    getUserPreferenceSupplyGroupSharedInfo: 'api/userPreferenceSupplyGroupAggregator/getUserPreferenceSupplyGroupSharedInfo',
    updateUserPreferenceSupplyGroupSharedInfo: 'api/userPreferenceSupplyGroupSharedInfo/updateUserPreferenceSupplyGroupSharedInfo',
    upsertUserPreferenceSupplyGroupSharedInfo: 'api/userPreferenceSupplyGroupSharedInfo/upsertUserPreferenceSupplyGroupSharedInfo',
    userNotification: 'api/notification',
    loggedInUser: '/api/securityUser/loggedinuser',
    impersonatedUser: '/api/securityUser/impersonatedUser',
    employeeInfoWithGxcAffiliations: 'api/aggregation/employeeInfoWithGxcAffiliations',
    resourceCommitments: 'api/aggregation/resourcecommitments',
    resourceHistoricalStaffingAllocations: 'api/staffingAggregator/historicalStaffingAllocationsByEmployee',
    projectHistoricalStaffingAllocations: 'api/staffingAggregator/historicalStaffingAllocationsForProject',
    resourceAuditTrail: 'api/staffingAggregator/auditEmployee',
    employeeReviewRatings: 'api/review/employeeReviews',
    totalResourcesByOfficesAndRingfences: 'api/ringfenceManagement/totalResourcesByOfficesAndRingfences',
    ringfenceAuditLogByOfficeAndCommitmentCode: 'api/ringfenceManagement/ringfenceAuditLogByOfficeAndCommitmentCode',
    upsertRingfenceDetails: 'api/ringfenceManagement/upsertRingfenceDetails',
    officeHolidaysWithinDateRange: 'api/holiday/officeholidaysWithinDateRangeByOffices',
    allocationsDuringOfficeClosure: 'api/resourceAllocationAggregator/getAllocationsForOfficeClosure',
    upsertOfficeClosureCases: 'api/officeClosureCases/upsertOfficeClosureCases',
    preponedCasesAllocationsAudit: 'api/preponedCasesAllocationsAudit',
    cortexSkuMappings: 'api/cortexSku'
  };

  public static datePickerSettings = {
    minDate: '01-Jan-1900'
  };

  public static exportFileSettings = {
    headerText: 'BOSS',
    footerText: 'Bain & Company',
    defaultLanguage: 'en',
    fileExtensions: {
      pdf: '.pdf',
      png: '.png',
      exl: '.xlsx',
    },
    fileType: {
      pdf: 'pdf',
      png: 'png',
      exl: 'xlsx',
    },
    gantttCssStyles: `<style>.gantt-chart{position:relative;width:100%;height:600px;}
    .gantt_task_content{overflow:visible;}
    .gantt_split_parent{opacity:0;}
    .orange{border:2px solid #f9a740;color:#f9a740;background:#f9a740;}
    .grey{border:2px solid #c4c4c4;color:#f7f7f7;background:#b1b1b1;}
    .yellow{border:2px solid #fae62a;color:#fae62a;background:#fae62a;}
    .line-task-purple{height:11px !important;background:#5d3f6a;position:absolute;margin-top:10px;}
    .line-task-green{height:11px !important;background:green;position:absolute;margin-top:10px;}
    .placeholder-task-blue{height:11px !important;background:blue;position:absolute;margin-top:10px;}
    .gainsboro{background-color:#e2e2e2 !important;}</style>`
  };

  public static ganttConstants = {
    emptyTemplateText: 'No Rows To Show',
    initialDaysDeduction: 30,
  };

  public static ganttCalendarScaleOptions = {
    options: [
      {
        name: 'Day',
        value: 'day'
      },
      {
        name: 'Week',
        value: 'week'
      },
      {
        name: 'Month',
        value: 'month'
      },
      {
        name: 'Year',
        value: 'year'
      },
    ],
    defaultSelection: 'month'
  };

  public static calendarMonthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  public static countryWithCurrencyCode = {
    'BD': 'BDT', 'BE': 'EUR', 'BF': 'XOF', 'BG': 'BGN', 'BA': 'BAM',
    'BB': 'BBD', 'WF': 'XPF', 'BL': 'EUR', 'BM': 'BMD', 'BN': 'BND', 'BO': 'BOB', 'BH': 'BHD', 'BI': 'BIF',
    'BJ': 'XOF', 'BT': 'BTN', 'JM': 'JMD', 'BV': 'NOK', 'BW': 'BWP', 'WS': 'WST', 'BQ': 'USD', 'BR': 'BRL',
    'BS': 'BSD', 'JE': 'GBP', 'BY': 'BYR', 'BZ': 'BZD', 'RU': 'RUB', 'RW': 'RWF', 'RS': 'RSD', 'TL': 'USD',
    'RE': 'EUR', 'TM': 'TMT', 'TJ': 'TJS', 'RO': 'RON', 'TK': 'NZD', 'GW': 'XOF', 'GU': 'USD', 'GT': 'GTQ',
    'GS': 'GBP', 'GR': 'EUR', 'GQ': 'XAF', 'GP': 'EUR', 'JP': 'JPY', 'GY': 'GYD', 'GG': 'GBP', 'GF': 'EUR',
    'GE': 'GEL', 'GD': 'XCD', 'GB': 'GBP', 'GA': 'XAF', 'SV': 'USD', 'GN': 'GNF', 'GM': 'GMD', 'GL': 'DKK',
    'GI': 'GIP', 'GH': 'GHS', 'OM': 'OMR', 'TN': 'TND', 'JO': 'JOD', 'HR': 'HRK', 'HT': 'HTG', 'HU': 'HUF',
    'HK': 'HKD', 'HN': 'HNL', 'HM': 'AUD', 'VE': 'VEF', 'PR': 'USD', 'PS': 'ILS', 'PW': 'USD', 'PT': 'EUR',
    'SJ': 'NOK', 'PY': 'PYG', 'IQ': 'IQD', 'PA': 'PAB', 'PF': 'XPF', 'PG': 'PGK', 'PE': 'PEN', 'PK': 'PKR',
    'PH': 'PHP', 'PN': 'NZD', 'PL': 'PLN', 'PM': 'EUR', 'ZM': 'ZMK', 'EH': 'MAD', 'EE': 'EUR', 'EG': 'EGP',
    'ZA': 'ZAR', 'EC': 'USD', 'IT': 'EUR', 'VN': 'VND', 'SB': 'SBD', 'ET': 'ETB', 'SO': 'SOS', 'ZW': 'ZWL',
    'SA': 'SAR', 'ES': 'EUR', 'ER': 'ERN', 'ME': 'EUR', 'MD': 'MDL', 'MG': 'MGA', 'MF': 'EUR', 'MA': 'MAD',
    'MC': 'EUR', 'UZ': 'UZS', 'MM': 'MMK', 'ML': 'XOF', 'MO': 'MOP', 'MN': 'MNT', 'MH': 'USD', 'MK': 'MKD',
    'MU': 'MUR', 'MT': 'EUR', 'MW': 'MWK', 'MV': 'MVR', 'MQ': 'EUR', 'MP': 'USD', 'MS': 'XCD', 'MR': 'MRO',
    'IM': 'GBP', 'UG': 'UGX', 'TZ': 'TZS', 'MY': 'MYR', 'MX': 'MXN', 'IL': 'ILS', 'FR': 'EUR', 'IO': 'USD',
    'SH': 'SHP', 'FI': 'EUR', 'FJ': 'FJD', 'FK': 'FKP', 'FM': 'USD', 'FO': 'DKK', 'NI': 'NIO', 'NL': 'EUR',
    'NO': 'NOK', 'NA': 'NAD', 'VU': 'VUV', 'NC': 'XPF', 'NE': 'XOF', 'NF': 'AUD', 'NG': 'NGN', 'NZ': 'NZD',
    'NP': 'NPR', 'NR': 'AUD', 'NU': 'NZD', 'CK': 'NZD', 'XK': 'EUR', 'CI': 'XOF', 'CH': 'CHF', 'CO': 'COP',
    'CN': 'CNY', 'CM': 'XAF', 'CL': 'CLP', 'CC': 'AUD', 'CA': 'CAD', 'CG': 'XAF', 'CF': 'XAF', 'CD': 'CDF',
    'CZ': 'CZK', 'CY': 'EUR', 'CX': 'AUD', 'CR': 'CRC', 'CW': 'ANG', 'CV': 'CVE', 'CU': 'CUP', 'SZ': 'SZL',
    'SY': 'SYP', 'SX': 'ANG', 'KG': 'KGS', 'KE': 'KES', 'SS': 'SSP', 'SR': 'SRD', 'KI': 'AUD', 'KH': 'KHR',
    'KN': 'XCD', 'KM': 'KMF', 'ST': 'STD', 'SK': 'EUR', 'KR': 'KRW', 'SI': 'EUR', 'KP': 'KPW', 'KW': 'KWD',
    'SN': 'XOF', 'SM': 'EUR', 'SL': 'SLL', 'SC': 'SCR', 'KZ': 'KZT', 'KY': 'KYD', 'SG': 'SGD', 'SE': 'SEK',
    'SD': 'SDG', 'DO': 'DOP', 'DM': 'XCD', 'DJ': 'DJF', 'DK': 'DKK', 'VG': 'USD', 'DE': 'EUR', 'YE': 'YER',
    'DZ': 'DZD', 'US': 'USD', 'UY': 'UYU', 'YT': 'EUR', 'UM': 'USD', 'LB': 'LBP', 'LC': 'XCD', 'LA': 'LAK',
    'TV': 'AUD', 'TW': 'TWD', 'TT': 'TTD', 'TR': 'TRY', 'LK': 'LKR', 'LI': 'CHF', 'LV': 'EUR', 'TO': 'TOP',
    'LT': 'LTL', 'LU': 'EUR', 'LR': 'LRD', 'LS': 'LSL', 'TH': 'THB', 'TF': 'EUR', 'TG': 'XOF', 'TD': 'XAF',
    'TC': 'USD', 'LY': 'LYD', 'VA': 'EUR', 'VC': 'XCD', 'AE': 'AED', 'AD': 'EUR', 'AG': 'XCD', 'AF': 'AFN',
    'AI': 'XCD', 'VI': 'USD', 'IS': 'ISK', 'IR': 'IRR', 'AM': 'AMD', 'AL': 'ALL', 'AO': 'AOA', 'AQ': '',
    'AS': 'USD', 'AR': 'ARS', 'AU': 'AUD', 'AT': 'EUR', 'AW': 'AWG', 'IN': 'INR', 'AX': 'EUR', 'AZ': 'AZN',
    'IE': 'EUR', 'ID': 'IDR', 'UA': 'UAH', 'QA': 'QAR', 'MZ': 'MZN'
  };

  public static opportunityConstants = {
    validationMsgs: {
      endDateReqMsg: 'Please enter a valid date (i.e.dd - mmm - yyyy)',
      startDateCompMsg: 'Start date cannot be greater than end date',
      endDateCompMsg: 'End date cannot be less than start date',
    }
  };

  public static InvestmentCategory = {
    PrePostRev: {
      investmentCode: 4,
      investmentName: 'Pre/Post revenue'
    },
    ClientVariable: {
      investmentCode: 2,
      investmentName: 'Client Variable'
    },
    InternalPD: {
      investmentCode: 5,
      investmentName: 'Internal PD'
    },
    Backfill: {
      investmentCode: 12,
      investmentName: 'Backfill'
    }
  };

  public static CommitmentType = {
    Allocation: 'Allocation',
    Commitment: 'Commitment',
    Loa: 'Loa',
    Training: 'Training',
    Vacation: 'Vacation',
    Holiday: 'Holiday',
    PlanningCard: 'Planning Card',
    NamedPlaceholder: 'Named Placeholder'
  };


  public static ServiceLine = {
    GeneralConsulting: 'SL0001'
  };

  public static StaffingTag = {
    PEG: 'P'
  };

  public static NameAZ = 'nameAtoZ';
  public static NameZA = 'nameZtoA';
  public static EndDateAsc = 'endDateAsc';
  public static EndDateDesc = 'endDateDesc';
  public static LevelGradeAZ = 'LevelGradeAtoZ';
  public static LevelGradeZA = 'LevelGradeZtoA';



  public static UserGeotype = [
    {
      text: 'Global'
    },
    {
      text: 'Regional'
    },
    {
      text: 'Cluster'
    },
    {
      text: 'Office'
    }
  ];

  public static CaseAllocationsSortByOptions = [
    {
      text: 'Name (A-Z)',
      value: ConstantsMaster.NameAZ
    },
    {
      text: 'Name (Z-A)',
      value: ConstantsMaster.NameZA
    },
    {
      text: 'End Date (Asc)',
      value: ConstantsMaster.EndDateAsc
    },
    {
      text: 'End Date (Desc)',
      value: ConstantsMaster.EndDateDesc
    },
    {
      text: 'Level Grade (A-Z)',
      value: ConstantsMaster.LevelGradeAZ
    },
    {
      text: 'Level Grade (Z-A)',
      value: ConstantsMaster.LevelGradeZA
    },
  ];

  public static commitmentTypeGroups = [
    {
      name: 'Ringfence/Rotation',
      order: 2,
      isStaffingTag: true
    },
    {
      name: 'Commitments',
      order: 1,
      isStaffingTag: false
    }
  ];

  public static appScreens = {
    page: {
      resources: 'resources',
      analytics: 'analytics',
      admin: 'admin',
      overlay: 'overlay',
      home: 'home',
      casePlanning: 'casePlanning'
    },
    report: {
      availability: 'analytics/availability',
      staffingAllocation: 'analytics/staffingAllocation',
      staffingAllocationsMonthly: 'analytics/staffingAllocationMonthly',
      historicalAllocationsForPromotions: 'analytics/historicalAllocationsForPromotions',
      commitmentDetails: 'analytics/commitmentDetails',
      ringfenceStaffing: 'analytics/ringfenceStaffing',
      weeklyDeploymentIndividualResourceDetails: 'analytics/weeklyDeploymentIndividualResourceDetails',
      weeklyDeploymentSummaryView: 'analytics/weeklyDeploymentSummaryView',
      monthlyDeployment: 'analytics/monthlyDeployment',
      monthlyFTEUtilization: 'analytics/monthlyFTEUtilization',
      monthlyFTEUtilizationIndividual: 'analytics/monthlyFTEUtilizationIndividual',
      practiceStaffing: 'analytics/practiceStaffing',
      timeInLane: 'analytics/timeInLane',
      practiceStaffingCaseServed: 'analytics/practiceStaffingCaseServed',
      affiliateTimeInPractice: 'analytics/affiliateTimeInPractice',
      overAllocationAudit: 'analytics/overAllocatedAudit',
      allocatedWhileOnLOAAudit: 'analytics/allocatedWhileOnLOAAudit',
      caseUpdatesAudit: 'analytics/caseUpdatesAudit',
      capacityBreakdown: 'analytics/capacityBreakdown',
      priceRealization: 'analytics/priceRealization',
      caseEconomics: 'analytics/caseEconomics',
      whoWorkedWithWhom: 'analytics/whoWorkedWithWhom',
      smapAllocations: 'analytics/smapAllocations',
      caseExperience: 'analytics/caseExperience'
    },
    feature: {
      staffingSettings: 'staffingSettings',
      notification: 'notification',
      ringfenceOverlay: 'ringfenceOverlay',
      caseActionsPanel: 'caseActionsPanel',
      caseRollIcon: 'caseRollIcon',
      caseOverlaySKU: 'caseOverlaySKU',
      caseOverlayGantt: 'caseOverlayGantt',
      caseOverlayTeam: 'caseOverlayTeam',
      casesServedByRingfence: 'caseOverlay/casesServedByRingfence',
      addCommitment: 'addCommitment',
      caseOverlayShowCommitment: 'caseOverlayShowCommitment',
      opportunityChanges: 'opportunityChanges',
      resourceOverlay: 'resourceOverlay',
      caseOverlay: 'caseOverlay',
      universalSearch: 'universalSearch',
      casePlanningBoard: 'casePlanning/planningBoard',
      resourceNotes: 'resourceNotes',
      bulkUpdateForOfficeClosure: 'staffingSettings/bulkUpdateForOfficeClosure',
      caseEconomics: 'analytics/caseEconomics',
      staffableAs: 'resourceOverlay/staffableAs',
      preferencesTab: 'resourceOverlay/preferencesTab',
      casesTab: 'resourceOverlay/casesTab',
      clickInteractionsInfoIcon: 'resources/clickInteractionsInfoIcon',
      supplyGroupsDropdown: 'resources/supplyGroupsDropdown',
      addResourceViewNotes: 'resources/addResourceViewNotes',
      addCasePlanningViewNotes: 'casePlanning/addCasePlanningViewNotes',
      levelGradeHistory: 'resourceOverlay/levelGradeHistory',
      timeInLevel: 'resourceOverlay/timeInLevel'
    },
    resourcesFilter: {
      offices: 'resources/officesFilter',
      staffingTags: 'resources/staffingTagsFilter',
      levelGrades: 'resources/levelGradesFilter',
      positions: 'resources/positionFilter',
      staffableAs: 'resources/staffableAsFilter',
      employeeStatus: 'resources/employeeStatusFilter',
      CommitmentType: 'resources/commitmentTypeFilter',
      certificates: 'resources/certificatesFilter',
      languages: 'resources/languagesFilter',
      affiliation: 'resources/affiliationFilter',
      sortBy: 'resources/sortByFilter',
      availabilityThreshold: 'resources/availabilityThresholdFilter',
      affiliationRoles: 'resources/affiliationRoleFilter'

    }
  }

  public static regexUrl = {
    home: new RegExp(ConstantsMaster.appScreens.page.home, "i"),
    casePlanning: new RegExp(ConstantsMaster.appScreens.page.casePlanning, "i"),
    resources: new RegExp(ConstantsMaster.appScreens.page.resources, "i"),
    analytics: new RegExp(ConstantsMaster.appScreens.page.analytics, "i"),
    analyticsStart: new RegExp('^' + ConstantsMaster.appScreens.page.analytics, "i"),
    admin: new RegExp(ConstantsMaster.appScreens.page.admin, "i"),
    overlay: new RegExp(ConstantsMaster.appScreens.page.overlay, "i"),
    resourceAvailability: new RegExp(ConstantsMaster.appScreens.report.availability, "i"),
    staffingAllocation: new RegExp(ConstantsMaster.appScreens.report.staffingAllocation, "i"),
    staffingAllocationsMonthly: new RegExp(ConstantsMaster.appScreens.report.staffingAllocationsMonthly, "i"),
    commitmentDetails: new RegExp(ConstantsMaster.appScreens.report.commitmentDetails, "i"),
    historicalAllocationsForPromotions: new RegExp(ConstantsMaster.appScreens.report.historicalAllocationsForPromotions, "i"),
    ringfenceStaffing: new RegExp(ConstantsMaster.appScreens.report.ringfenceStaffing, "i"),
    individualResourceDetails: new RegExp(ConstantsMaster.appScreens.report.weeklyDeploymentIndividualResourceDetails, "i"),
    weeklyDeploymentSummary: new RegExp(ConstantsMaster.appScreens.report.weeklyDeploymentSummaryView, "i"),
    monthlyDeployment: new RegExp(ConstantsMaster.appScreens.report.monthlyDeployment, "i"),
    monthlyFTEUtilization: new RegExp(ConstantsMaster.appScreens.report.monthlyFTEUtilization, "i"),
    monthlyFTEUtilizationIndividual: new RegExp(ConstantsMaster.appScreens.report.monthlyFTEUtilizationIndividual, "i"),
    monthlyPracticeAreaStaffing: new RegExp(ConstantsMaster.appScreens.report.practiceStaffing, "i"),
    timeInLane: new RegExp(ConstantsMaster.appScreens.report.timeInLane, "i"),
    practiceStaffingCaseServed: new RegExp(ConstantsMaster.appScreens.report.practiceStaffingCaseServed, "i"),
    affiliateTimeInPractice: new RegExp(ConstantsMaster.appScreens.report.affiliateTimeInPractice, "i"),
    overAllocationAudit: new RegExp(ConstantsMaster.appScreens.report.overAllocationAudit, "i"),
    allocatedWhileOnLOAAudit: new RegExp(ConstantsMaster.appScreens.report.allocatedWhileOnLOAAudit, "i"),
    caseUpdatesAudit: new RegExp(ConstantsMaster.appScreens.report.caseUpdatesAudit, "i"),
    capacitybreakdown: new RegExp(ConstantsMaster.appScreens.report.capacityBreakdown, "i"),
    priceRealization: new RegExp(ConstantsMaster.appScreens.report.priceRealization, "i"),
    caseEconomics: new RegExp(ConstantsMaster.appScreens.report.caseEconomics, "i"),
    whoWorkedWithWhom: new RegExp(ConstantsMaster.appScreens.report.whoWorkedWithWhom, "i"),
    smapAllocations: new RegExp(ConstantsMaster.appScreens.report.smapAllocations, "i"),
    caseExperience: new RegExp(ConstantsMaster.appScreens.report.caseExperience, "i")
  }

  public static availabilityBuckets = {
    LimitedAvailable: 'Limited Availability',
    ShortTermAvailable: 'Short Term Available',
    Transition: 'Transition',
    NotYetStarted: 'Not Yet Started',
    Available: 'Available',
    PlaceholderAndPlanningCard: 'Placeholder And Planning Card'
  }

  public static ResourceActiveStatus = {
    NotYetStarted: 'Not Yet Started',
    Active: 'Active',
    LoA: 'LOA',
    Terminated: 'Terminated'
  }

  public static PlanningCardMergeActions = {
    Merge: 'Merge',
    CopyAndMerge: 'CopyMerge'
  }

  public static Messages = {
    DownDaySaved: 'Down Day Saved'
  }

  public static TimeInLevelDefination = "Time in level definition: For general consulting time in level is calculated by time spent in a particular level grade group (e.g time in A overall) less LOAs. For all other service lines time in level is calculated based on a person’s last promotion (e.g. time since promotion to N9) less LOAs"

}
