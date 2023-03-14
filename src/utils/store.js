import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import app from 'slices/app.slice'
import bills from 'slices/bills.slice'

const store = configureStore({
  reducer: {
    app,
    bills,
  },
  middleware:
    process.env.NODE_ENV === 'production'
      ? [...getDefaultMiddleware()]
      : [...getDefaultMiddleware(), logger],
})

export default store
