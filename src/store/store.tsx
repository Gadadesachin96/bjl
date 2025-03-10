import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../slice/dataReducerSlice'; 

export const store = configureStore({
  reducer: {
    data: dataReducer, 
  },
});

export default store;
