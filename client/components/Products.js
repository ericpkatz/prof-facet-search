import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios'

const Products = ({match, history}) => {
  const [ratingFacet, setRatingFacet] = useState({})
  const [filtered, setFiltered] = useState([])
  const [stockFacet, setStockFacet] = useState({})
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState({})

  useEffect(
    () => {
      const _filter = match.params.filter ? JSON.parse(match.params.filter) : {}
      setFilter(_filter)
      axios.get(`/api/products/${JSON.stringify(_filter)}`).then(response => {
        const data = response.data
        setRatingFacet(data.ratingFacet)
        setFiltered(data.products)
        setStockFacet(data.stockFacet)
        setTotal(data.total)
      })
    },
    [match]
  )
  const search = ev => {
    const _filter = {...filter}
    if (ev.target.value) {
      if (ev.target.getAttribute('data-type') === 'boolean') {
        _filter[ev.target.name] = ev.target.value === 'true'
      } else {
        _filter[ev.target.name] = ev.target.value
      }
    } else {
      delete _filter[ev.target.name]
    }
    history.push(`/products/${JSON.stringify(_filter)}`)
  }
  return (
    <div>
      <h1>Products ({filtered.length})</h1>
      <div>
        Showing {filtered.length} out of {total}
      </div>

      <select
        value={filter.inStock === undefined ? '' : filter.inStock}
        onChange={search}
        name="inStock"
        data-type="boolean"
      >
        <option value="">All</option>
        {Object.entries(stockFacet).map(entry => {
          const key = entry[0]
          const value = entry[1]
          if (value.count === 0) {
            return null
          }
          return (
            <option key={key} value={value.value}>
              {value.label} ({value.count})
            </option>
          )
        })}
      </select>

      <select
        value={filter.rating === undefined ? '' : filter.rating}
        onChange={search}
        name="rating"
      >
        <option value="">All</option>
        {Object.entries(ratingFacet).map(entry => {
          return (
            <option key={entry[0]} value={entry[0]}>
              {entry[0]} ({entry[1]})
            </option>
          )
        })}
      </select>

      <ul>
        {filtered.map(product => {
          return (
            <li
              className={product.inStock ? '' : 'out-of-stock'}
              key={product.id}
            >
              {product.name}
              <br />
              {product.rating}
              <br />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * CONTAINER
 */

export default connect(null, null)(Products)
