import * as moment from 'moment';

export class DateService {
  static daysInLeapYear = 366;
  static daysInYear = 365;
  static defaultAllocationDays = 30;

  static calendar = [
    { monthShortName: 'JAN', enddate: '31', monthName: 'January', monthNumber: 1, },
    { monthShortName: 'FEB', enddate: '28', monthName: 'February', monthNumber: 2 },
    { monthShortName: 'MAR', enddate: '31', monthName: 'March', monthNumber: 3 },
    { monthShortName: 'APR', enddate: '30', monthName: 'April', monthNumber: 4 },
    { monthShortName: 'MAY', enddate: '31', monthName: 'May', monthNumber: 5 },
    { monthShortName: 'JUN', enddate: '30', monthName: 'June', monthNumber: 6 },
    { monthShortName: 'JUL', enddate: '31', monthName: 'July', monthNumber: 7 },
    { monthShortName: 'AUG', enddate: '31', monthName: 'August', monthNumber: 8 },
    { monthShortName: 'SEP', enddate: '30', monthName: 'September', monthNumber: 9 },
    { monthShortName: 'OCT', enddate: '31', monthName: 'October', monthNumber: 10 },
    { monthShortName: 'NOV', enddate: '30', monthName: 'November', monthNumber: 11 },
    { monthShortName: 'DEC', enddate: '31', monthName: 'December', monthNumber: 12 }
  ];

  public static getBainFormattedToday(): string {
    const today = new Date();
    return this.convertDateInBainFormat(today);
  }

  public static getToday() {
    const today = new Date();
    return today.setHours(0, 0, 0, 0);
  }

  public static convertDateInBainFormat(date) {
    if (!date) {
      return date;
    }
    return moment(date).format('DD-MMM-YYYY');
  }

  public static getFormattedDateRange(date) {
    const dateRange = { startDate: '', endDate: '' };

    const today = (date && date.startDate !== null) ? date.startDate : new Date();
    dateRange.startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const twoWeeksAfter = (date && date.endDate !== null) ? date.endDate : new Date(today.setDate(today.getDate() + 14));
    dateRange.endDate = twoWeeksAfter.getFullYear() + '-' + (twoWeeksAfter.getMonth() + 1) + '-' + twoWeeksAfter.getDate();

    return dateRange;
  }

  public static getFormattedDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  public static formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  public static addDays(date, days) {
    return moment(date).add(days, 'days').format('DD-MMM-YYYY');
  }

  public static addWeeks(date, weeks) {
    return moment(date).add(weeks, 'w').format('DD-MMM-YYYY');
  }

  public static subtractDays(date, days) {
    return moment(date).subtract(days, 'days').format('DD-MMM-YYYY');
  }

  public static subtractWeeks(date, weeks) {
    return moment(date).add(weeks, 'w').format('DD-MMM-YYYY');
  }


  // Get all the dates as array of moment objects
  public static getDates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = moment(startDate);
    const endDate = moment(stopDate);
    while (currentDate <= endDate) {
      dateArray.push(moment(currentDate));
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  public static getMonthName(monthNumber) {
    const data = this.calendar.filter(function (value) {
      return value.monthNumber === monthNumber;
    });
    return data[0].monthName;
  }

  public static getDatesDifferenceInDays(startDate: Date, endDate: Date) {
    // To calculate the time difference of two dates
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const differenceInTime = endDate.getTime() - startDate.getTime();

    // To calculate the no. of days between two dates
    const millisecondsPerDay = (1000 * 3600 * 24);
    const differenceInDays = differenceInTime / millisecondsPerDay;

    return differenceInDays;
  }

  public static isLeapYear(year: number = (new Date()).getFullYear()) {
    return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
  }

  public static getMaxEndDateForAllocation(startDate: Date, endDate: Date) {
    let noOfDaysInYear = this.daysInYear;
    let maxEndDate = new Date(startDate);
    if (DateService.isLeapYear(startDate.getFullYear())) {
      noOfDaysInYear = this.daysInLeapYear;
    }
    // add start date + 30 when endDate is null for opp
    // OR add today's date + configurable days when case duration > 365/366
    if (endDate.toDateString() === new Date(0).toDateString() ||
      DateService.getDatesDifferenceInDays(new Date(startDate), new Date(endDate)) > noOfDaysInYear) {
      maxEndDate.setDate(maxEndDate.getDate() + this.defaultAllocationDays);
    }
    // no change required in end date
    else {
      maxEndDate = endDate;
    }
    return maxEndDate;
  }

  // Weekend means Sat & Sun
  public static isWeekend(date) {
    const dt = new Date(date);

    if (dt.getDay() === 6 || dt.getDay() === 0) {
      return true;
    } else {
      return false;
    }

  }

  // gets the next date based on dayNumber. 0 means next sunday, 1 means Monday... 6 means next saturday
  public static getDayInFuture(date, dayNumber) {
    const d = new Date(date);
    d.setDate(d.getDate() + (dayNumber + 7 - d.getDay()) % 7);

    return d;
  }

  public static getStartOfWeek(date = null) {
    var startOfWeek = !date ? new Date() : new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6) % 7);

    return startOfWeek;
  }

  public static getEndOfWeek(includeWeekends = false, date = null) {
    let endOfWeekDay = includeWeekends ? 6 : 4;

    var endOfWeek = this.getStartOfWeek(date);
    endOfWeek.setDate(endOfWeek.getDate() + endOfWeekDay);

    return endOfWeek;
  }

  public static getESTDateTimeNow() {
    const dt = new Date();
    dt.setTime(dt.getTime() + dt.getTimezoneOffset() * 60 * 1000); //get UTC time

    const offset = -300; //Timezone offset for EST in minutes. EST is 5 hours behind of UTC
    const estDate = new Date(dt.getTime() + offset * 60 * 1000);

    return estDate;
  }

  //returns true if date1 >= date2
  public static isSameOrAfter(date1: string | Date, date2: string | Date, excludeTime: boolean = true): boolean {
    // To calculate the time difference of two dates
    const tempDate1 = new Date(date1);
    const tempDate2 = new Date(date2);

    if (excludeTime) {
      tempDate1.setHours(0, 0, 0, 0);
      tempDate2.setHours(0, 0, 0, 0);
    }

    if (tempDate1.getTime() >= tempDate2.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  //returns true if date1 <= date2
  public static isSameOrBefore(date1: string | Date, date2: string | Date, excludeTime: boolean = true): boolean {
    // To calculate the time difference of two dates
    const tempDate1 = new Date(date1);
    const tempDate2 = new Date(date2);

    if (excludeTime) {
      tempDate1.setHours(0, 0, 0, 0);
      tempDate2.setHours(0, 0, 0, 0);
    }

    if (tempDate1.getTime() <= tempDate2.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  //returns true if date1 = date2
  public static isSame(date1: string | Date, date2: string | Date, excludeTime: boolean = true): boolean {
    // To calculate the time difference of two dates
    const tempDate1 = new Date(date1);
    const tempDate2 = new Date(date2);

    if (excludeTime) {
      tempDate1.setHours(0, 0, 0, 0);
      tempDate2.setHours(0, 0, 0, 0);
    }

    if (tempDate1.getTime() === tempDate2.getTime()) {
      return true;
    } else {
      return false;
    }
  }

}
