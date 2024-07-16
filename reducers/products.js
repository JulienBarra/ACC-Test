import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const productsSlice = createSlice({
  name: "products",

  initialState,
  reducers: {
    addProductToStore: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { addProductToStore } = productsSlice.actions;
export default productsSlice.reducer;
