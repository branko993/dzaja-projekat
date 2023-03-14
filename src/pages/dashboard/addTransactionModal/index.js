import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { PropTypes } from 'prop-types'
import { useDispatch } from 'react-redux'
import { isMobile } from 'react-device-detect'

import Input from 'components/Input'
import validate, { addTransactionTests } from 'utils/validate'
import ErrorBox from 'components/ErrorBox'
import { actions } from 'slices/bills.slice'

const AddTransactionModal = ({ visible, setVisible, billNumber, billID }) => {
  const dispatch = useDispatch()

  // ------------------------------------
  // State
  // ------------------------------------
  const [input, setInput] = useState({
    transactionDate: '',
    value: undefined,
  })
  const [error, setError] = useState({})
  const [resErr, setResError] = useState('')

  // ------------------------------------
  // Handlers
  // ------------------------------------
  const handleOnChange = ({ target: { name, value } }) => {
    setInput((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: '' }))
    setResError('')
  }

  const closeDialog = () => {
    setInput({
      transactionDate: '',
      value: undefined,
    })
    setResError('')
    setError({})
    setVisible(false)
  }

  const handleSubmit = async () => {
    const result = validate(input, addTransactionTests)
    setError(result.errors)
    if (result.isError) return

    try {
      await dispatch(actions.addTransaction({ ...input, billID }))
      closeDialog()
      setResError('')
    } catch (err) {
      setResError(err.message)
    }
  }

  const footerContent = (
    <div>
      <Button
        label="Dodaj"
        icon="pi pi-plus"
        severity="info"
        iconPos="right"
        onClick={() => handleSubmit()}
      />
    </div>
  )

  return (
    <Dialog
      header={`Dodaj transakciju na račun sa brojem: ${billNumber}`}
      visible={visible}
      style={{ width: isMobile ? '80vw' : '50vw' }}
      onHide={closeDialog}
      footer={footerContent}
    >
      <div className="flex-auto">
        <p className="input-label">Datum</p>
        <Calendar
          style={{ width: '100%' }}
          id="transactionDate"
          name="transactionDate"
          value={input.transactionDate}
          onChange={handleOnChange}
          showIcon
          dateFormat="dd/mm/yy"
          className={error && 'is-invalid'}
        />
        {error.transactionDate && (
          <div className="invalid-feedback">{error.transactionDate}</div>
        )}
      </div>
      <Input
        label="Iznos"
        name="value"
        type="number"
        placeholder="0"
        value={input.value}
        onChange={handleOnChange}
        error={error.value}
      />
      {resErr && <ErrorBox>{resErr}</ErrorBox>}
    </Dialog>
  )
}

AddTransactionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  billNumber: PropTypes.string,
  billID: PropTypes.string,
}
AddTransactionModal.defaultProps = {
  billNumber: '',
  billID: '',
}

export default AddTransactionModal
