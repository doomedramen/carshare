<template>
  <div class="card is-rounded">
    <div class="card-content">
      <div class="columns">
        <div class="column">
          <!-- prevent form submission, replce with own function -->
          <form @submit.prevent="submitForm">
            <!-- From (Location) -->
            <div class="field">
              <label class="label">From</label>
              <div class="control is-clearfix">
                <LocationInput @change="onFromInputChange" />
              </div>
            </div>

            <!-- To (Location) -->
            <div class="field">
              <label class="label">To</label>
              <div class="control is-clearfix">
                <LocationInput @change="onToInputChange" />
              </div>
            </div>
            <br />
            <div class="columns">
              <div class="column">
                <!-- Depart (DateTime) -->
                <div class="field">
                  <label class="label">Departure Date</label>
                  <div class="control is-clearfix">
                    <DateTimeInput @change="onDepartureDateInputChange" />
                  </div>
                </div>
              </div>
              <div class="column">
                <!-- Return (DateTime) -->
                <div class="field">
                  <label class="label">Return Date</label>
                  <div class="control is-clearfix">
                    <DateTimeInput @change="onReturnDateInputChange" />
                  </div>
                </div>
              </div>
            </div>

            <br />
            <div class="field">
              <button
                ref="submit"
                type="submit"
                class="button is-secondary is-rounded has-text-weight-bold"
                :disabled="canSubmit"
              >
                <span>Find a ride</span>
                <span class="icon is-small">
                  <i class="mdi mdi-arrow-right-thick"></i>
                </span>
              </button>
            </div>
          </form>
        </div>
        <div class="column" v-if="from && to">
          <iframe
            width="100%"
            height="330px"
            frameborder="0"
            style="border:0"
            :src="mapsIFrameSource"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import LocationInput from "./LocationInput.vue";
import DateTimeInput from "./DateTimeInput.vue";
import axios from "axios";

import setClickOutsideDirective from "../../setClickOutsideDirective";
import Vue from "vue";
setClickOutsideDirective(Vue);

export default {
  name: "find-a-ride",
  components: {
    LocationInput,
    DateTimeInput
  },
  data() {
    return {
      from: null,
      to: null,
      departureDate: null,
      returnDate: null
    };
  },
  methods: {
    onFromInputChange(location) {
      this.from = location;
    },
    onToInputChange(location) {
      this.to = location;
    },
    onDepartureDateInputChange(date) {
      this.departureDate = date;
    },
    onReturnDateInputChange(date) {
      this.returnDate = date;
    },
    /**
     * post form to fake address
     */
    submitForm() {
      const objectToSend = {
        to: {
          lat: this.to.lat,
          lon: this.to.lon
        },
        from: {
          lat: this.from.lat,
          lon: this.from.lon
        },
        depart: this.departureDate,
        return: this.returnDate
      };
      console.log("posting", objectToSend);
      axios
        .post(`https://api.example.org/carshare`, objectToSend)
        .then(({ data }) => {})
        .catch(error => {})
        .finally(() => {});
    }
  },
  computed: {
    /**
     * for depermining if submit button is disabled
     */
    canSubmit() {
      return !(this.from && this.to && this.departureDate && this.returnDate);
    },
    /**
     * generate map iframe src value
     */
    mapsIFrameSource() {
      const GOOGLE_API_KEY = "AIzaSyA6UTYgz7NPoInr8R1sN9suSunsKPW8mLQ";
      return `https://www.google.com/maps/embed/v1/directions?origin=${this.from.display_name}&destination=${this.to.display_name}&key=${GOOGLE_API_KEY}`;
    }
  }
};
</script>
