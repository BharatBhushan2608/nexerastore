import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
  products: [],
  cart: {
    items: [],
    totalPrice: 0
  },
  addresses:[],
  selectedAddress:null // cuurently chosen address
},
  reducers: {
    // Action to set products
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    // cart management
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    // Address Management
    addAddress:(state, action)=>{
      if(!state.addresses) state.addresses=[];
      state.addresses.push(action.payload)
    },
    setSelectedAddress:(state, action)=>{
      state.selectedAddress = action.payload
    },
    deleteAddress: (state, action)=>{
      state.addresses = state.addresses.filter((_, index)=>index !== action.payload)

      // Reset SelectedAdress if it was deleted
      if(state.selectedAddress === action.payload){
        state.selectedAddress = null;
      }
    },
  }
});

// Export actions
export const { setProducts, setCart, addAddress, setSelectedAddress, deleteAddress } = productSlice.actions;

// Export reducer
export default productSlice.reducer;