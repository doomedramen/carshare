<template>
  <div v-click-outside="hidePicker">
    <div class="control has-icons-left is-clearfix">
      <!-- TODO if is-mobile, switch out for native datetime picker -->
      <!-- readonly input for triggering date-time input -->
      <input
        type="string"
        autocomplete="a-random-string-so-chrome-does-not-autocomplete"
        placeholder="Select date/time"
        class="input is-rounded"
        v-model="inputParsed"
        readonly="readonly"
        @click="showPicker"
      />
      <!-- calendar icon on left of input -->
      <span class="icon is-left">
        <i class="mdi mdi-calendar-range mdi-24px"></i>
      </span>
    </div>

    <!-- date picker element -->
    <div class="datepicker" v-show="shouldShowPicker">
      <div class="card is-rounded">
        <div class="card-content">
          <div>
            <!-- prev month button, current month full string, next month button -->
            <header>
              <span @click="previousMonth" class="prev"></span>
              <span class="up">{{ currentMonthNameFull }} {{ currentYear }}</span>
              <span @click="nextMonth" class="next"></span>
            </header>

            <!-- sun - mon strings -->
            <div v-for="day in daysAbbr" :key="day" class="cell day-name is-blank">
              <span>{{ day }}</span>
            </div>

            <!-- all day numbers in month e.g. 1-30 -->
            <div
              v-for="day in datesInCurrentMonth"
              :key="day.timestamp"
              :class="{'is-blank':day.isBlank, 'is-today':day.isToday, 'is-selected':day.isSelected}"
              class="cell"
              @click="onSelectDay(day)"
            >
              <span>{{ day.date }}</span>
            </div>
          </div>
          <hr />
          <!-- time selector (see TimeInput.vue) -->
          <TimeInput @change="onTimeChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * date strings, full and abbr versions
 */
const DATE_STRINGS = {
  months: {
    full: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    abbr: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ]
  },
  days: {
    full: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    abbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  }
};

/**
 * get days in mouth for given year, month
 */
const daysInMonth = (year, month) =>
  new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

/**
 * checks if object is a Date
 */
const isDate = object => !!!object && typeof object.getMonth === "function";

/**
 * checks if two dates match
 */
const daysMatch = (date1, date2) =>
  date1.getDate() == date2.getDate() &&
  date1.getMonth() == date2.getMonth() &&
  date1.getFullYear() == date2.getFullYear();

/**
 * checks if date is today
 */
const isToday = someDate => {
  const today = new Date();
  return daysMatch(someDate, today);
};

/**
 * checks if date is within current year
 */
const isThisYear = someDate => {
  const today = new Date();
  return today.getYear() === someDate.getYear();
};

/**
 * checks if date is selected
 */
const isSelected = (date, selectedDay) => {
  if (date && selectedDay) {
    if (date.getTime() === selectedDay.timestamp) {
      return true;
    }
    return false;
  }
  return false;
};

import moment from "moment";
import TimeInput from "./TimeInput.vue";

export default {
  name: "DatePicker",
  components: {
    TimeInput
  },
  data() {
    return {
      inputParsed: null,
      shouldShowPicker: false,
      currentlyVisibleMonth: new Date(),
      selectedDay: null,
      selectedTime: null
    };
  },
  computed: {
    /**
     * gets all days abbr strings
     */
    daysAbbr() {
      return DATE_STRINGS.days.abbr;
    },
    /**
     * gets current year
     */
    currentYear() {
      return this.currentlyVisibleMonth.getFullYear();
    },
    /**
     * gets current month
     */
    currentMonth() {
      return this.currentlyVisibleMonth.getMonth();
    },
    /**
     * gets full name of current month
     */
    currentMonthNameFull() {
      return DATE_STRINGS.months.full[this.currentMonth];
    },
    /**
     * gets abbr name of current month
     */
    currentMonthNameAbbr() {
      return DATE_STRINGS.months.abbr[this.currentMonth];
    },
    /**
     * gets blank days before 1st of month as objects
     */
    blankDays() {
      const daysCount = new Date(
        this.currentlyVisibleMonth.getFullYear(),
        this.currentlyVisibleMonth.getMonth(),
        1
      ).getDay();
      const days = [];
      for (let i = 0; i < daysCount; i++) {
        days.push({
          date: "",
          timestamp: i,
          isBlank: true,
          isToday: false
        });
      }
      return days;
    },
    /**
     * gets days of month as objects
     */
    days() {
      const days = [];
      const dObj = new Date(
        this.currentlyVisibleMonth.getFullYear(),
        this.currentlyVisibleMonth.getMonth(),
        1
      );
      const dim = daysInMonth(dObj.getFullYear(), dObj.getMonth());
      for (let i = 0; i < dim; i++) {
        days.push({
          date: dObj.getDate(),
          timestamp: dObj.getTime(),
          isBlank: false,
          isToday: isToday(dObj),
          isSelected: isSelected(dObj, this.selectedDay)
        });
        dObj.setDate(dObj.getDate() + 1);
      }
      return days;
    },
    /**
     * return blank and real days in month for rendering in selector element
     */
    datesInCurrentMonth() {
      return [...this.blankDays, ...this.days];
    }
  },
  methods: {
    onTimeChange(timeObject) {
      this.selectedTime = timeObject;
      this.updateParsedInput();
    },
    updateParsedInput() {
      let momentDate = moment(this.selectedDay.timestamp);
      momentDate = momentDate.set({
        hour: this.selectedTime ? parseInt(this.selectedTime.hour) : 0,
        minute: this.selectedTime ? parseInt(this.selectedTime.minute) : 0
      });

      //format with/without year depending if selected day is within current year
      const formatWithoutYear = "ddd, Do MMM, h:mm";
      const formatWithYear = "ddd, Do MMM YYYY, h:mm";
      const formatter = isThisYear(new Date(this.selectedDay.timestamp))
        ? formatWithoutYear
        : formatWithYear;
      const parsed = momentDate.format(formatter);

      this.inputParsed = parsed;

      this.$emit("change", momentDate.unix());
    },
    onSelectDay(day) {
      this.selectedDay = day;
      this.updateParsedInput();
      // const d = new Date(this.selectedDay.timestamp);
    },
    showPicker() {
      this.shouldShowPicker = true;
    },
    hidePicker() {
      this.shouldShowPicker = false;
    },
    /**
     * switches view to next month
     */
    nextMonth() {
      const d = new Date(this.currentlyVisibleMonth);
      const dim = daysInMonth(d.getFullYear(), d.getMonth());
      d.setDate(d.getDate() + dim);
      this.currentlyVisibleMonth = d;
    },
    /**
     * switches view to prev month
     */
    previousMonth() {
      const d = new Date(this.currentlyVisibleMonth);
      d.setMonth(d.getMonth() - 1);
      this.currentlyVisibleMonth = d;
    }
  }
};
</script>