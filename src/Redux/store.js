import { configureStore } from "@reduxjs/toolkit/dist";
import {serviceReducer} from './serviceReducer.js';
const store=configureStore({
    reducer:{
        serviceReducer,
    }
})
export default store;
