export enum ProjectType {
  Opportunity = 'Opportunity',
  NewDemand = 'NewDemand',
  ActiveCase = 'ActiveCase',
  PlanningCard = 'PlanningCard'
}

export enum ProjectTypeCssClass {
  Opportunity = 'project-color1',
  NewDemand = 'project-color2',
  ActiveCase = 'project-color3'
}

export enum StaffingTag {
  PEG = 'P',
  PEG_Surge = 'PS',
  AAG = 'SL0022',
  ADAPT = 'SL0006',
  FRWD = 'SL0011'
}

export enum CommitmentType {
  CASE_OPP = "C",
  HOLIDAY = "H",
  PLANNING_CARD = "PC",
  LOA = "L",
  LIMITED_AVAILABILITY = "LA",
  NOT_AVAILABLE = "NA",
  DOWN_DAY = "DD",
  NAMED_PLACEHOLDER = "NP",
  RECRUITING = "R",
  SHORT_TERM_AVAILABLE = "ST",
  TRAINING = "T",
  VACATION = "V",
  PEG = 'P',
  PEG_Surge = 'PS',
  AAG = 'SL0022',
  ADAPT = 'SL0006',
  FRWD = 'SL0011',
  TRANSFER = 'TF',
  TERMINATION = 'TN',
  TRANSITION = 'TS'
}

export enum EmployeeJobChangeStatus {
  TRANSFER = "Transfer",
  TERMINATION = "Termination"
}

export enum TaskType {
  TRANSFER = "Transfer",
  TERMINATION = "Termination",
  HOLIDAY = "Holiday",
  VACATION = "Vacation"
}

export enum GanttTimelineColor {
  ORANGE = "orange",
  TEAL = "teal",
  PURPLE = "line-task-purple",
  GREEN = "line-task-green",
  GANTTGREEN = "gantt-green",
  RED = "red",
  GREY = "grey",
  YELLOW = "yellow",
  GAINS_BORO = "gainsboro"
}

export enum ProjectType {
  CASE = "Case",
  OPP = "Opportunity"
}

export enum ServiceLine {
  GeneralConsulting = 'SL0001'
}

export enum GroupBy {
  ServiceLine = 'serviceLine'
}

export enum SortBy {
  LevelGrade = 'levelGrade'
}

export enum CaseType {
  Billable = '1'
}

export enum OpportunityStatusType {
  All = '0,1,2,3,4,5'
}

export enum GanttTaskType {
  Case = 'case'
}

export enum AvailabilityIncludes {
  Transition = 'transition',
  Opportunity = 'opportunity',
  Weekends = 'weekends',
  CD = '4'
}

export enum CaseRollOptions {
  RollCurrentCase = 'rollCurrentCase',
  RollTeamToNewCase = 'rollTeamToNewCase',
  RevertCaseRoll = 'revertCaseRoll'
}

export enum ProjectBackgroundColorCode {
  ActiveCase = '#EDF4FA', //blue
  NewDemand = '#F7EEE0', //Orange
  Opportunity = '#FEFFCF', //yellow
  PlanningCard = '#FFFFFF' //blue
}

export enum ProjectBorderColorCode {
  ActiveCase = '#477CE0', //blue
  NewDemand = '#FF9A62', //Orange
  Opportunity = '#FCE516', //yellow
  PlanningCard = '#477CE0' //blue
}

export enum FieldsEnum {
  currentLevelGrade = "PD Grade",
  operatingOfficeCode = "Office",
  serviceLineCode = "Service Line",
  allocation = "Allocation%"
};

export enum FeatureFlagNames {
  CASE_PLANNING_WHITEBOARD = "case-planning-whiteboard"
};

export enum TreeviewDropdownType {
  TREE_VIEW = 1,
  DROPDOWN_TREE_VIEW = 2
}

export enum ResourcesSupplyFilterGroupEnum {
  SAVED_FILTERS = "Saved Filters",
  SUPPLY_GROUPS = "Supply Groups",
  STAFFING_SETTINGS = "Staffing Settings",
  CUSTOM_GROUP = "customGroup",
  SAVED_GROUP = "savedGroup"
}

export enum CasePlanningBoardPlaygroundSessionOptions {
  CREATE_PLAYGROUND = "create",
  JOIN_PLAYGROUND = "join",
  LEAVE_PLAYGROUND = "leave",
  END_PLAYGROUND = "end"
}

export enum UniversalSearchOptions {
  RESOURCE = "resource",
  PROJECT = "project",
  EVERYTHING = "everything"
}

export enum EmployeeCaseGroupingEnum {
  CASES = "cases",
  RESOURCES = "resources"
}

export enum DAYOFWEEK {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

export enum NoteTypeCode {
  RESOURCE_PROFILE_NOTE = "RP",
  RESOURCE_ALLOCATION_NOTE = "RA"
}

export enum CasePlanningBoardBucketEnum {
  STAFF_FROM_MY_SUPPLY = 1,
  ACTION_NEEDED = 2,
  NOT_STAFFING = 3
}
