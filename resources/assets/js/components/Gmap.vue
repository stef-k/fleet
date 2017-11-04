<template>
  <div>
    <marker-menu></marker-menu>
    <div id="map"></div>
  </div>
</template>

<script>
import MarkerMenu from '../components/MarkerMenu'
// A Google Maps Vue Component
export default {
  components: {
    MarkerMenu
  },
  mounted () {
    this.checkScriptExists()
    this.bootstrap()
    // Event listeners
    this.$bus.$on('center-map', () => {
      this.centerMap()
    })
    this.$bus.$on('reset-zoom', () => {
      this.resetZoom()
    })
    this.$bus.$on('marker-menu-closed', (marker) => {
      this.reCenter(marker)
      this.markerMenuActive = false
    })
    this.drawCurrentMarkers()
    // listen for incoming map updates from the backend
    this.$socketChannel.on('message', msg => {
      this.handleSocketMessage(msg)
    })
    // listen for incoming map updates from other components
    this.$bus.$on('map-update', marker => {
      this.updateVehicle({
        plate: marker.title,
        lat: marker.getPosition().lat(),
        lon: marker.getPosition().lng(),
        accuracy: marker.accuracy,
        altitude: marker.altitude,
        altitudeAccuracy: marker.altitudeAccuracy,
        heading: marker.heading,
        speed: marker.speed,
        reportedAt: marker.reportedAt,
        info: marker.info,
        updatedAt: marker.updated_at
      })
    })
  },

  /**
   * Map data
   */
  data () {
    return {
      gmap: null,
      scriptExists: false,
      markerMenuActive: false,
      baseUrl: window.location.protocol + '//' + window.location.host + '/img',
      options: {
        center: { lat: 38.7, lng: 25 },
        zoom: 7,
        mapTypeControle: false,
        streeViewControl: false,
        fullScreenControl: true,
        draggableCursor: 'default',
        draggingCursor: 'default'
      }
    }
  }, // data end

  /**
   * Map methods
   */
  methods: {
    /**
     * Check if we are ready to initialize the map
     */
    bootstrap () {
      if (this.scriptExists) {
        this.init()
      }
    },

    init () {
      if (this.gmap === null) {
        this.gmap = document.getElementById('map')
        this.gmap = new google.maps.Map(this.gmap, this.options)
      }
    },

    /**
     * Checks if the Google maps script exists
     */
    checkScriptExists () {
      let scripts = document.getElementsByTagName('script');
      [].filter.call(scripts, script => {
        if (script.src.indexOf('maps/api/js?key=') >= 0) {
          this.scriptExists = true
        }
      })
    },

    /**
     * Center the map to it's original coordinates
     */
    centerMap () {
      this.gmap.setCenter({
        lat: this.options.center.lat,
        lng: this.options.center.lng
      })
    },

    /**
     * Reset the map to it's original zoom level
     */
    resetZoom () {
      this.gmap.setZoom(this.options.zoom)
    },

    handleSocketMessage (msg) {
      if (msg.type === 'map-update') {
        this.updateVehicle(msg.payload)
      }
    },

    /**
   * Updates vehicle status in markers map (property of globalStorage object)
   * If the vehicle exists the it gets updated, else a new entry will be added in markers map.
   */
    updateVehicle (vehicle) {
      let lat = parseFloat(vehicle.lat)
      let lng = parseFloat(vehicle.lon)
      let plate = vehicle.plate
      if (this.$store.markers.has(plate)) {
        let marker = this.$store.markers.get(plate)
        marker.setPosition({ lat: lat, lng: lng })
        marker.icon = this.setIcon(vehicle.active, vehicle.info)
        marker.accuracy = vehicle.accuracy
        marker.altitude = vehicle.altitude
        marker.altitudeAccuracy = vehicle.altitudeAccuracy
        marker.heading = vehicle.heading
        marker.speed = vehicle.speed
        marker.reportedAt = vehicle.reportedAt
        marker.delay = 'reportedAt - updated_at calculation...'
        marker.info = vehicle.info
        marker.updatedAt = vehicle.updated_at
        this.$store.markers.set(plate, marker)
      } else {
        let marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: this.gmap,
          icon: this.setIcon(vehicle.active, vehicle.info),
          title: plate,
          accuracy: vehicle.accuracy,
          altitude: vehicle.altitude,
          altitudeAccuracy: vehicle.altitudeAccuracy,
          heading: vehicle.heading,
          speed: vehicle.speed,
          reportedAt: vehicle.reportedAt,
          delay: 'reportedAt - updated_at calculation...',
          info: vehicle.info,
          updatedAt: vehicle.updated_at
          // updated: new Date(marker.updated_at).toLocaleString('el-GR') // TODO when we store actual objects in DB
        })
        marker.addListener('click', () => {
          this.showMarkerMenu(marker)
        })
        this.$store.markers.set(plate, marker)
      }
    },

    setIcon (active, info) {
      if (active) {
        if (info !== 'Χωρίς πρόβλημα') {
          return this.baseUrl + '/problem-marker.png'
        } else {
          return this.baseUrl + '/active-marker.png'
        }
      } else {
        if (info !== 'Χωρίς πρόβλημα') {
          return this.baseUrl + '/problem-marker.png'
        } else {
          return this.baseUrl + '/inactive-marker.png'
        }
      }
    },

    /**
     * (re)Draws all markers contained in store markers hashmap object
     */
    drawCurrentMarkers () {
      for (var marker of this.$store.markers.values()) {
        marker.setMap(this.gmap)
      }
    },
    /**
     * Shows the menu for the specified marker.
     */
    showMarkerMenu (marker) {
      this.slideDown()
      this.$bus.$emit('show-marker-menu', marker.title)
      this.markerMenuActive = true
    },

    /**
     * Slide down the map in order to see the menu and the clicked marker
     */
    slideDown () {
      if (!this.markerMenuActive) {
        this.gmap.panBy(0, -window.innerHeight / 2)
      }
    },
    /**
     * Recenter the map
     */
    reCenter (marker) {
      if (this.markerMenuActive) {
        this.gmap.panTo(marker.getPosition())
      }
    }
  } // methods end
}
</script>

<style scoped>
#map {
  height: calc(100vh - 70px);
  width: 100%;
}
</style>
