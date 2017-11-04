<template>
  <div class="marker-menu" :class='sliderClass'>
    <div class="container-fluid">
      <div class="columns">
        <div class="column is-1 is-narrow">
          <a @click='closeMenu' class='button is-opposite is-small' title='Κλείσιμο μενου'>X</a>
        </div>
        <div class="column">
          <h1 class="has-text-centered is-size-4">ΠΛΗΡΟΦΟΡΙΕΣ & ΔΙΑΧΕΙΡΙΣΗ ΟΧΗΜΑΤΟΣ</h1>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <div v-if='this.marker' class="info">ΠΙΝΑΚΙΔΑ: <span class="data">{{ this.marker.title }}</span></div>
          <div v-if='this.marker' class="info">ΠΛΑΤΟΣ: (WGS84) <span class="data">{{ this.marker.getPosition().lat() }}</span></div>
          <div v-if='this.marker' class="info">ΜΗΚΟΣ: (WGS84) <span class="data">{{ this.marker.getPosition().lng() }}</span></div>
          <div v-if='this.marker' class="info">AΚΡΙΒΕΙΑ ΜΗΚΟΥΣ/ΠΛΑΤΟΥΣ: <span class="data">{{ this.marker.accuracy }} Μέτρα</span></div>
          <div v-if='this.marker' class="info">ΥΨΟΜΕΤΡΟ: <span class="data">{{ this.marker.altitude }} Μέτρα</span></div>
          <div v-if='this.marker' class="info">AΚΡΙΒΕΙΑ ΥΨΟΜΕΤΡΟΥ: <span class="data">{{ this.marker.altitudeAccuracy }} Μέτρα</span></div>
          <div v-if='this.marker' class="info">ΚΑΤΕΥΘΥΝΣΗ: <span class="data">{{ this.marker.heading }} Μοίρες</span></div>
          <div v-if='this.marker' class="info">ΤΑΧΥΤΗΤΑ: <span class="data">{{ this.kmPerHour }} Χλμ/Ω</span></div>
          <div v-if='this.marker' class="info">ΤΕΛΕΥΤΑΙΑ ΕΝΗΜΕΡΩΣΗ: <span class="data">{{ this.marker.updatedAt }}</span></div>
          <div v-if='this.marker' class="info" title="Καθυστέρηση μεταξύ της συσκευής στο όχημα με τον server, συνήθως οφειλόμενη στο δίκτυο">ΚΑΘΥΣΤΕΡΗΣΗ ΕΝΗΜΕΡΩΣΗΣ: <span class="data">{{ this.updateDelay.mins }} λεπτά ή {{ this.updateDelay.secs }} δευτερόλεπτα</span></div>
        </div>
        <div class="column">
          <div v-if='this.marker' class="info">ΚΑΤΑΣΤΑΣΗ: <span class="data">{{ this.marker.info }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h1, h2, h3, h4, h5 {
  color: #fff;
}
.data {
  font-family: monospace;
  font-size: 1.15em;
}
.info:hover {
  background-color: rgba(0, 0, 0, 0.2)
}
.button.is-opposite {
  background-color: #8F381C;
  color: #fff;
  border: 1px solid #9e3131;
}
.button.is-opposite:hover {
 background-color: #9e3131;
}
.marker-menu {
  color: #fcfcfc;
  background-color: rgba(9, 68, 90, 0.75);
  position: fixed;
  left: 0;
  right: 0;
  min-height: 50vh;
  height: 0;
  width: 100%;
  padding: 20px;
  overflow-y: auto;
  z-index: 2;
  border-bottom: 1px solid rgba(9, 68, 90, 0.85)
}
.marker-menu.hidden {
  top: -90vh;
}
.marker-menu.show {
  animation: slideDown 0.5s ease forwards;
}
.marker-menu-enter {
  height: 0;
}
@keyframes slideDown {
  0% {
    transform: translateY(-50vh);
  }
  100% {
    transform: translateY(0);
  }
}
.marker-menu.hide {
  animation: slideUp 0.5s ease forwards;
}
@keyframes slideUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50vh);
  }
}
</style>

<script>
export default {

  mounted () {
    this.$bus.$on('show-marker-menu', plate => {
      this.marker = this.$store.markers.get(plate)
      this.show = true
    })
  },

  data () {
    return {
      show: '',
      marker: null
    }
  },

  computed: {
    sliderClass () {
      if (this.show === '') {
        return 'hidden'
      }
      if (this.show) {
        return 'show'
      } else {
        return 'hide'
      }
    },
    kmPerHour () {
      return this.marker.speed * 60 * 60 / 1000
    },
    updateDelay () {
      console.log('updteDelay', this.marker)
      let reported = new Date(this.marker.reportedAt)
      let updated = new Date(this.marker.updatedAt)
      let secs = Math.abs(updated - reported) / 1000
      let mins = secs / 60
      return {secs: secs, mins: mins.toFixed(2)}
    }
  },
  methods: {
    closeMenu () {
      this.show = false
      this.$bus.$emit('marker-menu-closed', this.marker)
    }
  }
}
</script>
