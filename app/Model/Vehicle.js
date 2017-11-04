'use strict'

const Lucid = use('Lucid')

class Vehicle extends Lucid {
  // validation rules
  static get rules () {
    return {
      plate: 'required',
      lat: 'required',
      lon: 'required',
      reportedAt: 'required'
    }
  }
}

module.exports = Vehicle
