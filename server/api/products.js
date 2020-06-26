const router = require('express').Router()
const {User, Product} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

router.get('/:search?', async (req, res, next) => {
  const search = JSON.parse(req.params.search)
  //generate facets based on search!
  try {
    let options = {}
    if (Object.keys(search).length) {
      options.where = search
    }
    const stockOptions = {
      attributes: [
        'inStock',
        [Sequelize.fn('count', Sequelize.col('*')), 'count']
      ],
      group: ['inStock']
    }

    if (search.rating) {
      stockOptions.where = {
        rating: search.rating
      }
    }

    const ratingOptions = {
      attributes: [
        'rating',
        [Sequelize.fn('count', Sequelize.col('*')), 'count']
      ],
      group: ['rating']
    }

    if (search.inStock !== undefined) {
      ratingOptions.where = {
        inStock: search.inStock
      }
    }

    const [products, total, stockCounts, ratingCounts] = await Promise.all([
      Product.findAll(options),
      Product.count(),
      Product.findAll(stockOptions),
      Product.findAll(ratingOptions)
    ])

    const stockFacet = stockCounts.reduce((acc, f) => {
      const d = f.dataValues
      if (d.inStock) {
        acc.inStock = {count: d.count, label: 'In Stock', value: true}
      } else {
        acc.outOfStock = {count: d.count, label: 'Out of Stock', value: false}
      }
      return acc
    }, {})

    const ratingFacet = ratingCounts.reduce((acc, r) => {
      acc[r.dataValues.rating] = r.dataValues.count
      return acc
    }, {})

    res.json({products, ratingFacet, stockFacet, total})
  } catch (err) {
    next(err)
  }
})
