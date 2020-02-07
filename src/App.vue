<template>
  <div id="app">
    <section class="hero has-background-primary is-fullheight">
      <div class="hero-body">
        <div class="container">
          <FindARide />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FindARide from "./components/FindARide.vue";


export default {
  name: "app",
  components: {
    FindARide
  }
};
</script>