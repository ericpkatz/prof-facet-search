const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Product = db.define('product', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  inStock: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: Sequelize.ENUM('GREAT', 'GOOD', 'MEH'),
    defaultValue: 'GOOD'
  },
})

module.exports = Product
