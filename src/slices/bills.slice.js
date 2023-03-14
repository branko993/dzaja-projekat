import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { firestore } from 'utils/firebase'
import { v4 as uuidv4 } from 'uuid'

// ------------------------------------
// Helpers
// ------------------------------------

const calculateStatistics = (supplierBills) => {
  const results = {
    paid: 0,
    leftToPay: 0,
    sumOfValues: 0,
  }
  supplierBills.forEach((bill) => {
    results.paid += bill.paid
    results.leftToPay += bill.leftToPay
    results.sumOfValues += bill.value
  })
  return results
}

// ------------------------------------
// State
// ------------------------------------

const initialState = {
  supplierBills: [],
  statistics: {
    paid: 0,
    leftToPay: 0,
    sumOfValues: 0,
  },
}

// ------------------------------------
// Slices
// -----------------------------------

const slice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setSupplierBills: (state, action) => ({
      ...state,
      statistics: action.payload.statistics,
      supplierBills: action.payload.supplierBills,
    }),
    updateTransaction: (state, action) => {
      const { transaction } = action.payload

      const newBills = state.supplierBills.map((bill) => {
        if (bill.id === transaction.billID) {
          const paid = transaction.value + bill.paid
          const leftToPay = bill.leftToPay - transaction.value

          return {
            ...bill,
            paid,
            leftToPay,
            transactions: [transaction].concat(bill.transactions),
          }
        }
        return bill
      })
      const statistics = calculateStatistics(newBills)
      return {
        ...state,
        statistics,
        supplierBills: newBills,
      }
    },
  },
})

// ------------------------------------
// Actions
// -----------------------------------

const fetchSupplierBills =
  ({ userId }) =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const bills = []
        const supplierBillSnapshot = await firestore
          .collection('supplierBill')
          .where('userId', '==', userId)
          .orderBy('creationDate', 'desc')
          .get()

        await supplierBillSnapshot.docs.reduce(async (referencePoint, doc) => {
          // Check for execution status of previous iteration, i.e. wait for it to get finished
          await referencePoint
          const document = doc.data()

          const supplierTransactionsSnapshot = await firestore
            .collection('transactions')
            .where('billID', '==', document.id)
            .orderBy('creationDate', 'desc')
            .get()

          document.transactions = []
          document.paid = 0
          document.leftToPay = document.value

          document.creationDate = moment(document.creationDate.toDate()).format(
            'DD/MM/YYYY',
          )
          document.billDate = moment(document.billDate.toDate()).format(
            'DD/MM/YYYY',
          )

          supplierTransactionsSnapshot.docs.forEach((transactionDoc) => {
            const transaction = transactionDoc.data()
            transaction.creationDate = moment(
              transaction.creationDate.toDate(),
            ).format('DD/MM/YYYY')
            transaction.transactionDate = moment(
              transaction.transactionDate.toDate(),
            ).format('DD/MM/YYYY')

            document.paid += Number(transaction.value)
            document.leftToPay -= Number(transaction.value)
            document.transactions.push(transaction)
          })
          bills.push(document)
        }, Promise.resolve())
        const statistics = calculateStatistics(bills)
        dispatch(
          slice.actions.setSupplierBills({ supplierBills: bills, statistics }),
        )

        resolve()
      } catch (err) {
        reject(err)
      }
    })

const addTransaction =
  ({ billID, transactionDate, value }) =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const id = uuidv4()
        // store user info in firestore
        await firestore
          .collection('transactions')
          .doc(id)
          .set({
            id,
            billID,
            transactionDate,
            creationDate: new Date(),
            value: Number(value),
          })
        const transaction = await firestore
          .collection('transactions')
          .doc(id)
          .get()
        const transactionToAdd = transaction.data()
        transactionToAdd.creationDate = moment(
          transactionToAdd.creationDate.toDate(),
        ).format('DD/MM/YYYY')
        transactionToAdd.transactionDate = moment(
          transactionToAdd.transactionDate.toDate(),
        ).format('DD/MM/YYYY')

        dispatch(
          slice.actions.updateTransaction({ transaction: transactionToAdd }),
        )

        resolve(transactionToAdd)
      } catch (err) {
        reject(err)
      }
    })

// ------------------------------------
// Exports
// ------------------------------------

export const actions = {
  ...slice.actions,
  fetchSupplierBills,
  addTransaction,
}

export default slice.reducer
