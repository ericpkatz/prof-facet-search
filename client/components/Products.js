import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Products = ({handleClick, isLoggedIn, products}) => (
  <div>
    <h1>Products ({ products.length})</h1>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    products: state.products 
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Products)

