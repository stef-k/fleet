'use strict'

const ws = use('Ws')
const Validator = use('Validator')
const Vehicle = use('App/Model/Vehicle')

class VehicleController {
  /**
   * This method will validate and store the incoming data to a Vehicle
   * object, finally will update the frontend using the map-updates websocket channel.
   * @param {*} request
   * @param {*} response
   */
  * store (request, response) {
    const data = request.all()
    const validation = yield Validator.validateAll(data, Vehicle.rules)

    if (validation.fails()) {
      response.json(validation.messages())
      // response.status(400).send('error')
      return
    }

    let vehicle = yield Vehicle.query().where('plate', data.plate).first()
    if (vehicle === null) {
      vehicle = yield Vehicle.create({
        active: data.active,
        plate: data.plate,
        lat: data.lat,
        lon: data.lon,
        accuracy: data.accuracy,
        altitude: data.altitude,
        altitudeAccuracy: data.altitudeAccuracy,
        heading: data.heading,
        speed: data.speed,
        reportedAt: data.reportedAt,
        info: data.info
      })
    } else {
      vehicle.active = data.active
      vehicle.lat = data.lat
      vehicle.lon = data.lon
      vehicle.accuracy = data.accuracy
      vehicle.altitude = data.altitude
      vehicle.altitudeAccuracy = data.altitudeAccuracy
      vehicle.heading = data.heading
      vehicle.speed = data.speed
      vehicle.reportedAt = data.reportedAt
      vehicle.info = data.info
      yield vehicle.save()
    }

    ws.channel('map-updates').emit('message', {
      type: 'map-update',
      payload: vehicle
    })

    // DELETE VEHICLE don't keep objects during development
    yield vehicle.delete()
    response.status(201).send('success')
  }
}

module.exports = VehicleController
