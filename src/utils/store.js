import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import app from 'slices/app.slice'
import bills from 'slices/bills.slice'
import clientBills from 'slices/clientBills.slice'

const store = configureStore({
  reducer: {
    app,
    bills,
    clientBills,
  },
  middleware:
    process.env.NODE_ENV === 'production'
      ? [...getDefaultMiddleware()]
      : [...getDefaultMiddleware(), logger],
})

export default store
