<template>
<nav class="navbar ">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <img src="#" alt="FLEET">
    </a>

    <div class="navbar-burger burger" data-target="main-menu">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div id="main-menu" class="navbar-menu">
    <div class="navbar-start">
      <router-link to="/" exact class="navbar-item">Αρχική</router-link>
      <router-link to="/about" exact class="navbar-item">Πληροφορίες</router-link>
    </div>

    <div class="navbar-end">
    <a class="navbar-item" href="#" id="mapCenter" title="Κεντράρισμα του χάρτη στην αρχική ρύθμιση" @click="centerMap">
        Κεντράρισμα Χάρτη
      </a>
      <a class="navbar-item" href="#" id="mapResetZoom" title="Αρχικό ζουμ του χάρτη" @click="resetZoom">
        Αρχικό Ζουμ
      </a>
      <a class="navbar-item" href="#" id="loginWrapper" title="Αποσύνδεση από την εφαρμογή">
        <span id="logout">Αποσύνδεση</span>
      </a>

    </div>

  </div>
</nav>
</template>

<script>
export default {
  methods: {
    centerMap () {
      this.$bus.$emit('center-map')
    },
    resetZoom () {
      this.$bus.$emit('reset-zoom')
    }
  }
}
</script>
