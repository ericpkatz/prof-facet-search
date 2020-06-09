import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const Products = ({products, filter, history}) => {
  const search = (ev)=> {
    console.log(ev.target);
  }
  let filtered = products;
  return (
    <div>
      <h1>Products ({ filtered.length})</h1>
      <div>
        Showing { filtered.length } out of { products.length }
      </div>

      <select onChange={ search } name='inStock'>
        <option value=''>All</option>
        <option value='true'>In Stock</option>
        <option value='false'>Out of Stock</option>
      </select>

      <select onChange={ search } name='rating'>
        <option value=''>All</option>
        <option>GREAT</option>
        <option>GOOD</option>
        <option>MEH</option>
      </select>

      <ul>
        {
          filtered.map( product => {
            return (
              <li className={ product.inStock ? '': 'out-of-stock'} key={ product.id }>
                { product.name }
                <br />
                { product.rating }
                <br />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

/**
 * CONTAINER
 */
const mapState = (state, { match }) => {
  const filter = JSON.parse(match.params.filter || '{}'); 
  return {
    products: state.products,
    filter
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

