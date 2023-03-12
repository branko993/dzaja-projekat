import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { dashboardPath } from 'utils/const'
import { firestore } from 'utils/firebase'
import Suppliers from '.'
import AddNewSupplier from './addNew'
import EditSupplier from './edit'

const SupplierWrapper = () => {
  const { me } = useSelector((state) => state.app)
  const [supplierBills, setSupplierBills] = useState([])
  useEffect(async () => {
    const supplierBillSnapshot = await firestore
      .collection('supplierBill')
      .where('userId', '==', me.id)
      .get()

    supplierBillSnapshot.docs.forEach(async (doc) => {
      const document = doc.data()
      const indexOfEl = supplierBills.findIndex(
        (bill) => bill.id === document.id,
      )

      if (indexOfEl === -1) {
        const supplierTransactionsSnapshot = await firestore
          .collection('transactions')
          .where('billID', '==', document.id)
          .get()

        document.transactions = []
        document.paid = 0
        document.leftToPay = document.value
        supplierTransactionsSnapshot.docs.forEach((transactionDoc) => {
          const transaction = transactionDoc.data()
          document.paid += Number(transaction.value)
          document.leftToPay -= Number(transaction.value)
          document.transactions.push(transaction)
        })
        setSupplierBills((bills) => [...bills, document])
      }
    })
  }, [])
  return (
    <>
      <Switch>
        <Route path={dashboardPath.addSupplier}>
          <AddNewSupplier />
        </Route>
        <Route path={dashboardPath.editSupplier}>
          <EditSupplier supplierBills={supplierBills} />
        </Route>
        <Route path={dashboardPath.suppliers}>
          <Suppliers supplierBills={supplierBills} />
        </Route>
        <Redirect to={dashboardPath.suppliers} supplierBills={supplierBills} />
      </Switch>
    </>
  )
}

SupplierWrapper.propTypes = {}
SupplierWrapper.defaultProps = {}

export default SupplierWrapper
