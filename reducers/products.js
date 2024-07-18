import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    initializeProducts: (state, action) => {
      state.value = action.payload.map((product, index) => ({
        id: index,
        ...product,
      }));
    },
    addProductToStore: (state, action) => {
      const newId =
        state.value.length > 0 ? state.value[state.value.length - 1].id + 1 : 0;
      state.value.push({ id: newId, ...action.payload });
    },
    updateProductInStore: (state, action) => {
      const { id, updatedProduct } = action.payload;
      const index = state.value.findIndex((product) => product.id === id);
      if (index !== -1) {
        state.value[index] = { ...state.value[index], ...updatedProduct };
      }
    },
    deleteProductFromStore: (state, action) => {
      const id = action.payload;
      state.value = state.value.filter((product) => product.id !== id);
    },
  },
});

export const {
  initializeProducts,
  addProductToStore,
  updateProductInStore,
  deleteProductFromStore,
} = productsSlice.actions;

export default productsSlice.reducer;
