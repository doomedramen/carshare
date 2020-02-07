<template>
  <div class="autocomplete" v-click-outside="clickedOutside">
    <div class="control has-icons-left is-clearfix">
      <input
        type="text"
        autocomplete="a-random-string-so-chrome-does-not-autocomplete"
        placeholder="postcode, street, town"
        class="input is-rounded"
        ref="location"
        v-model="locationInput"
        @input="getAsyncData"
        @select="selectItem"
      />
      <input type="hidden" v-model="selectedLat" name="lat" />
      <input type="hidden" v-model="selectedLon" name="lon" />
      <span class="icon is-left">
        <i class="mdi mdi-map-marker mdi-24px"></i>
      </span>
      <!---->
      <!---->
    </div>

    <div v-show="data.length" class="dropdown-menu">
      <div class="dropdown-content" ref="found-locations">
        <div
          class="dropdown-item"
          v-for="item in data"
          :key="item.place_id"
          @click="selectItem(item)"
        >{{item.display_name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import axios from "axios";

export default {
  name: "location-input",
  data() {
    return {
      locationInput: null,
      data: [],
      selected: null,
      selectedLat: null,
      selectedLon: null,
      isFetching: false
    };
  },
  methods: {
    /**
     * action when input outside componenet root
     */
    clickedOutside() {
      this.data = [];
      if (!this.selected) {
        this.locationInput = "";
      }
    },
    /**
     * set selected day
     */
    setSelected(item) {
      this.selected = item;
      this.selectedLat = item.lat;
      this.selectedLon = item.lon;
      this.$emit("change", this.selected);
    },
    /**
     * clear selected day
     */
    unsetSelected() {
      this.selected = null;
    },
    /**
     * day item click event
     */
    selectItem(option) {
      if (option && option.lat && option.lon) {
        this.locationInput = option.display_name;
        this.setSelected(option);
        this.data = [];
      }
    },
    getAsyncData: debounce(function() {
      if (!this.locationInput.length) {
        this.data = [];
        return;
      }

      this.unsetSelected();

      this.isFetching = true;
      axios
        .get(
          `http://nominatim.openstreetmap.org/search?format=json&q=${this.locationInput}`
        )
        .then(({ data }) => {
          this.data = [];

          data = data.filter((a, b) => {
            return a.display_name.localeCompare(b.display_name);
          });

          // push into THIS.data from data.
          data.forEach(item => this.data.push(item));
        })
        .catch(error => {
          this.data = [];
          throw error;
        })
        .finally(() => {
          this.isFetching = false;
        });
    }, 500)
  }
};
</script>

<style lang="scss">
.autocomplete .dropdown-menu {
  display: block;
  min-width: 100%;
  max-width: 100%;
}
.autocomplete .dropdown-content {
  overflow: auto;
  max-height: 200px;
}

.autocomplete .dropdown-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
    color: #0a0a0a;
  }
}
</style>