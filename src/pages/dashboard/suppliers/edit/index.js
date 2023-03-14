import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useParams } from 'react-router-dom'

const EditSupplier = () => {
  const { id } = useParams()
  const { supplierBills } = useSelector((state) => state.bills)

  const [billToEdit, setBillToEdit] = useState(null)

  useEffect(() => {
    setBillToEdit(supplierBills.find((bill) => bill.id === id))
  })

  const renderTransactions = () =>
    billToEdit?.transactions.map((transaction) => (
      <div key={transaction.id}>
        <div>Datum: {transaction.transactionDate}</div>
        <div>Uplaćeno: {transaction.value}</div>
      </div>
    ))
  return (
    <div className="card">
      <h3>Broj Računa: {billToEdit?.billNumber}</h3>
      <h5>Ime dobavljača: {billToEdit?.supplierName}</h5>
      <h5>Datum: {billToEdit?.billDate}</h5>
      <h5>Transakcije:</h5>
      {renderTransactions()}
      <h5>Uplaćeno: {billToEdit?.paid}</h5>
      <h5>Preostalo: {billToEdit?.leftToPay}</h5>
      <h5>Ukupan iznos: {billToEdit?.value}</h5>
    </div>
  )
}

EditSupplier.propTypes = {}
EditSupplier.defaultProps = {}

export default EditSupplier
