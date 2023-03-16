import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { firestore } from 'utils/firebase'
import { v4 as uuidv4 } from 'uuid'

// ------------------------------------
// Helpers
// ------------------------------------

const calculateStatistics = (clientBills) => {
  const results = {
    paid: 0,
    leftToPay: 0,
    sumOfValues: 0,
  }
  clientBills.forEach((bill) => {
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
  clientBills: [],
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
    setClientBills: (state, action) => ({
      ...state,
      statistics: action.payload.statistics,
      clientBills: action.payload.clientBills,
    }),
    updateClientBills: (state, action) => {
      const newBills = [action.payload.bill].concat(state.clientBills)
      const statistics = calculateStatistics(newBills)
      return {
        ...state,
        statistics,
        clientBills: newBills,
      }
    },
    removeClientBill: (state, action) => {
      const newBills = state.clientBills.filter(
        (bill) => bill.id !== action.payload.id,
      )
      const statistics = calculateStatistics(newBills)
      return {
        ...state,
        statistics,
        clientBills: newBills,
      }
    },
    updateTransaction: (state, action) => {
      const { transaction } = action.payload

      const newBills = state.clientBills.map((bill) => {
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
        clientBills: newBills,
      }
    },
    removeTransaction: (state, action) => {
      const { transaction } = action.payload

      const newBills = state.clientBills.map((bill) => {
        if (bill.id === transaction.billID) {
          const paid = bill.paid - transaction.value
          const leftToPay = bill.leftToPay + transaction.value

          return {
            ...bill,
            paid,
            leftToPay,
            transactions: bill.transactions.filter(
              (t) => t.id !== transaction.id,
            ),
          }
        }
        return bill
      })
      const statistics = calculateStatistics(newBills)
      return {
        ...state,
        statistics,
        clientBills: newBills,
      }
    },
  },
})

// ------------------------------------
// Actions
// -----------------------------------

const fetchClientBills =
  ({ userId }) =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const bills = []
        const clientBillSnapshot = await firestore
          .collection('clientBill')
          .where('userId', '==', userId)
          .orderBy('creationDate', 'desc')
          .get()

        await clientBillSnapshot.docs.reduce(async (referencePoint, doc) => {
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
          slice.actions.setClientBills({ clientBills: bills, statistics }),
        )

        resolve()
      } catch (err) {
        reject(err)
      }
    })

const addTransaction =
  ({ billID, transactionDate, value, description }) =>
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
            description,
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

const addBill =
  ({ billNumber, billDate, name, value, userId }) =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const id = uuidv4()
        // store user info in firestore
        await firestore
          .collection('clientBill')
          .doc(id)
          .set({
            id,
            billNumber,
            billDate,
            name,
            creationDate: new Date(),
            value: Number(value),
            userId,
          })
        const bill = await firestore.collection('clientBill').doc(id).get()
        const billToAdd = bill.data()
        billToAdd.creationDate = moment(billToAdd.creationDate.toDate()).format(
          'DD/MM/YYYY',
        )
        billToAdd.billDate = moment(billToAdd.billDate.toDate()).format(
          'DD/MM/YYYY',
        )
        billToAdd.paid = 0
        billToAdd.leftToPay = Number(value)
        billToAdd.transactions = []
        dispatch(slice.actions.updateClientBills({ bill: billToAdd }))

        resolve(billToAdd)
      } catch (err) {
        reject(err)
      }
    })

const deleteBill =
  ({ id }) =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        // store user info in firestore
        const querySnapshot = await firestore
          .collection('clientBill')
          .where('id', '==', id)
          .get()
        const transactionsSnapshot = await firestore
          .collection('transactions')
          .where('billID', '==', id)
          .get()
        transactionsSnapshot.docs.forEach((transaction) => {
          transaction.ref.delete()
        })
        querySnapshot.docs[0].ref.delete()
        dispatch(slice.actions.removeClientBill({ id }))

        resolve()
      } catch (err) {
        reject(err)
      }
    })

const deleteTransaction =
  ({ transaction }) =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        // store user info in firestore
        const querySnapshot = await firestore
          .collection('transactions')
          .where('id', '==', transaction.id)
          .get()

        querySnapshot.docs[0].ref.delete()
        dispatch(slice.actions.removeTransaction({ transaction }))

        resolve()
      } catch (err) {
        reject(err)
      }
    })
// ------------------------------------
// Exports
// ------------------------------------

export const actions = {
  ...slice.actions,
  fetchClientBills,
  addTransaction,
  addBill,
  deleteBill,
  deleteTransaction,
}

export default slice.reducer
