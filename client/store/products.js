import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SET_PRODUCTS = 'GET_PRODUCTS'


const setProducts = products => ({type: SET_PRODUCTS, products})

/**
 * THUNK CREATORS
 */
export const getProducts = () => async dispatch => {
    const res = await axios.get('/api/products')
    dispatch(setProducts(res.data))
}


export default function(state = [], action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return action.products
    default:
      return state
  }
}
