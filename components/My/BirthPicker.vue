<template>
  <div class="date-picker">
    <v-select :items="days" label="Día" v-model="selectedDay" class="day-picker" v-bind="$attrs"></v-select>

    <v-select :items="months" label="Mes" v-model="selectedMonth" class="month-picker" v-bind="$attrs"></v-select>

    <v-select :items="years" label="Año" v-model="selectedYear" v-bind="$attrs"></v-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    let [year, month, day] = (this.value || "").split("-");
    let months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    month = month ? months[+month - 1] : null;

    return {
      selectedDay: Number(day) || null,
      selectedMonth: month || null,
      selectedYear: Number(year) || null,
      days: Array.from({ length: 31 }, (_, i) => i + 1),
      months: months,
      years: Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i),
    };
  },

  watch: {
    selectedDay() {
      this.emitDate();
    },
    selectedMonth() {
      this.adjustDays();
      this.emitDate();
    },
    selectedYear() {
      this.adjustDays();
      this.emitDate();
    },
  },

  methods: {
    adjustDays() {
      // Adjust the days based on the month selected
      if (["ABR", "JUN", "SEP", "NOV"].includes(this.selectedMonth)) {
        if (this.days.length !== 30) {
          this.days = Array.from({ length: 30 }, (_, i) => i + 1);
        }
      } else if (this.selectedMonth === "FEB") {
        if (this.isLeapYear(this.selectedYear) && this.days.length !== 29) {
          this.days = Array.from({ length: 29 }, (_, i) => i + 1);
        } else if (this.days.length !== 28) {
          this.days = Array.from({ length: 28 }, (_, i) => i + 1);
        }
      } else if (this.days.length !== 31) {
        this.days = Array.from({ length: 31 }, (_, i) => i + 1);
      }

      if (this.selectedDay) {
        if (this.selectedDay > this.days.length) {
          this.selectedDay = 1;
        }
      }
    },
    emitDate() {
      if (this.selectedDay && this.selectedMonth && this.selectedYear) {
        const monthIndex = this.months.indexOf(this.selectedMonth) + 1;
        const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
        const formattedDay = this.selectedDay < 10 ? `0${this.selectedDay}` : this.selectedDay;

        this.$emit("input", `${this.selectedYear}-${formattedMonth}-${formattedDay}`);
      }
    },

    isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
  },
};
</script>

<style scoped>
.date-picker {
  display: flex;
  justify-content: space-between;
}

.day-picker {
  /* width: 100px; /* adjust as needed */
  margin-right: 3px;
}

.month-picker {
  /* width: 130px; /* adjust as needed */
  margin-right: 3px;
}
</style>
