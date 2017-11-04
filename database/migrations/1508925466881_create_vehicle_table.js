'use strict'

const Schema = use('Schema')

class VehiclesTableSchema extends Schema {
  up () {
    this.create('vehicles', (table) => {
      table.increments()
      table.timestamps()
      table.boolean('active').defaultTo(true)
      table.string('plate').unique().notNullable()
      table.decimal('lat', 10, 8).notNullable()
      table.decimal('lon', 11, 8).notNullable()
      table.decimal('accuracy').nullable()
      table.decimal('altitude').nullable()
      table.decimal('altitudeAccuracy').nullable()
      table.decimal('heading').nullable()
      table.decimal('speed').nullable()
      table.dateTime('reportedAt').notNullable()
      table.text('info').defaultTo('Χωρίς πρόβλημα')
    })
  }

  down () {
    this.drop('vehicles')
  }
}

module.exports = VehiclesTableSchema
