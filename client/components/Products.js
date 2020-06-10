import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const Products = ({products, filter, history, filtered}) => {
  console.log(filter);
  const search = (ev)=> {

    const _filter = {...filter };
    if(ev.target.value){
      if(ev.target.getAttribute('data-type') === 'boolean'){
        _filter[ev.target.name] = ev.target.value === 'true' ? true : false;
      }
      else {
        _filter[ev.target.name] = ev.target.value;
      }
    }
    else {
      delete _filter[ev.target.name];
    }
    history.push(`/products/${JSON.stringify(_filter)}`);
  }
  return (
    <div>
      <h1>Products ({ filtered.length})</h1>
      <div>
        Showing { filtered.length } out of { products.length }
      </div>

      <select value={ filter.inStock === undefined ? '' : filter.inStock } onChange={ search } name='inStock' data-type='boolean'>
        <option value=''>All</option>
        <option value='true'>In Stock</option>
        <option value='false'>Out of Stock</option>
      </select>

      <select value={filter.rating === undefined ? '' : filter.rating} onChange={ search } name='rating'>
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
  let filtered = state.products;

  if(filter.rating){
    filtered = filtered.filter( product => product.rating === filter.rating);
  }
  if(filter.inStock !== undefined){
    filtered = filtered.filter( product => product.inStock === filter.inStock);
  }
  return {
    products: state.products,
    filtered,
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

