import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const Products = ({products, filter, history, filtered, ratingFacet, stockFacet}) => {
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
        {
          Object.entries(stockFacet).map( entry => {
            const key = entry[0];
            const value = entry[1];
            if(value.count === 0){
              return null;
            }
            return (
              <option key={ key } value={ value.value }>
                { value.label } ({ value.count })
              </option>
            );
          })
        }
        {
          /*
        <option value='true'>In Stock</option>
        <option value='false'>Out of Stock</option>
          */
        }
      </select>

      <select value={filter.rating === undefined ? '' : filter.rating} onChange={ search } name='rating'>
        <option value=''>All</option>
        {
          Object.entries(ratingFacet).map( (entry)=> {
            return (
              <option key={ entry[0]} value={ entry[0] }>{ entry[0]} ({ entry[1]})</option>
            );
          })
        }
        {
          /*
        <option>GREAT</option>
        <option>GOOD</option>
        <option>MEH</option>
        */
        }
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

  const ratingFacet = (filter.inStock === undefined ? state.products : state.products.filter(product => product.inStock === filter.inStock)).reduce((acc, product)=> {
    const key = product.rating;
    acc[key] = acc[key] || 0;
    acc[key]++;
    return acc;
  }, {});

  const stockFacet = (filter.rating ? state.products.filter(product=> product.rating === filter.rating) :state.products).reduce((acc, product)=> {
    if(product.inStock){
      acc.inStock.count++;
    }
    else {
      acc.outOfStock.count++;
    }
    return acc;
  }, {
    inStock: { value: true, count: 0, label: 'In Stock'},
    outOfStock: { value: false, count: 0, label: 'Out of Stock'},
  });
  return {
    stockFacet,
    ratingFacet,
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

