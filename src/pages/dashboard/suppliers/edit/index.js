import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

const EditSupplier = ({ supplierBills }) => {
  const { id } = useParams()
  const [billToEdit, setBillToEdit] = useState(null)

  useEffect(() => {
    setBillToEdit(supplierBills.find((bill) => bill.id === id))
  })

  const renderTransactions = () =>
    billToEdit?.transactions.map((transaction) => (
      <div key={transaction.id}>
        <div>Datum: {transaction.creationDate}</div>
        <div>Uplaćeno: {transaction.value}</div>
      </div>
    ))
  return (
    <div className="card">
      <h3>Broj Računa: {billToEdit?.billNumber}</h3>
      <h5>Ime dobavljača: {billToEdit?.supplierName}</h5>
      <h5>Datum: {billToEdit?.dateOfCreation}</h5>
      <h5>Transakcije:</h5>
      {renderTransactions()}
      <h5>Uplaćeno: {billToEdit?.paid}</h5>
      <h5>Preostalo: {billToEdit?.leftToPay}</h5>
      <h5>Ukupan iznos: {billToEdit?.value}</h5>
    </div>
  )
}

EditSupplier.propTypes = {
  supplierBills: PropTypes.arrayOf(
    PropTypes.shape({
      billNumber: PropTypes.string.isRequired,
      dateOfCreation: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      leftToPay: PropTypes.number.isRequired,
      paid: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      supplierName: PropTypes.string.isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          billID: PropTypes.string.isRequired,
          creationDate: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
        }),
      ).isRequired,
      userId: PropTypes.string.isRequired,
    }),
  ),
}
EditSupplier.defaultProps = {
  supplierBills: [],
}

export default EditSupplier
