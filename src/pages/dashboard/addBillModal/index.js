import { useState, useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { PropTypes } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'
import { Toast } from 'primereact/toast'

import Input from 'components/Input'
import validate, { addBillTest } from 'utils/validate'
import ErrorBox from 'components/ErrorBox'
import { actions } from 'slices/bills.slice'
import { actions as clientActions } from 'slices/clientBills.slice'

import { showSuccess } from 'utils/toast.helper'

const AddBillModal = ({ visible, setVisible, isClient }) => {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.app)
  const toast = useRef(null)

  // ------------------------------------
  // State
  // ------------------------------------
  const [input, setInput] = useState({
    billNumber: '',
    billDate: '',
    name: '',
    value: undefined,
  })
  const [error, setError] = useState({})
  const [resErr, setResError] = useState('')
  const [disableButton, setDisableButton] = useState(false)

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
      billNumber: '',
      billDate: '',
      name: '',
      value: undefined,
    })
    setResError('')
    setError({})
    setVisible(false)
  }

  const handleSubmit = async () => {
    setDisableButton(true)
    const result = validate(input, addBillTest)
    const currentDate = new Date()

    if (
      !result.errors.billDate &&
      currentDate.getTime() < input.billDate.getTime()
    ) {
      result.errors.billDate = 'Datum ne može biti u budućnosti'
    }
    setError(result.errors)
    if (result.isError) {
      setDisableButton(false)
      return
    }

    try {
      if (!isClient) {
        await dispatch(actions.addBill({ ...input, userId: me.id }))
      } else {
        await dispatch(clientActions.addBill({ ...input, userId: me.id }))
      }
      closeDialog()
      showSuccess(toast, 'Račun je uspesno dodat!')
      setResError('')
    } catch (err) {
      setResError(err.message)
    }
    setDisableButton(false)
  }

  const footerContent = (
    <div>
      <Button
        label="Dodaj"
        icon={`${disableButton ? 'pi pi-spin pi-spinner' : 'pi pi-plus'}`}
        severity="info"
        iconPos="right"
        disabled={disableButton}
        onClick={() => handleSubmit()}
      />
    </div>
  )

  return (
    <>
      <Toast ref={toast} position="top-center" />

      <Dialog
        header="Dodaj novi račun"
        visible={visible}
        style={{ width: isMobile ? '80vw' : '50vw' }}
        onHide={closeDialog}
        footer={footerContent}
      >
        <Input
          label="Broj računa"
          name="billNumber"
          placeholder="Unesi broj računa"
          value={input.billNumber}
          onChange={handleOnChange}
          error={error.billNumber}
        />
        <div className="flex-auto">
          <p className="input-label">Datum</p>
          <Calendar
            style={{ width: '100%' }}
            id="billDate"
            name="billDate"
            value={input.billDate}
            onChange={handleOnChange}
            showIcon
            dateFormat="dd/mm/yy"
            className={error && 'is-invalid'}
          />
          {error.billDate && (
            <div className="invalid-feedback">{error.billDate}</div>
          )}
        </div>
        <Input
          label={isClient ? 'Ime klijenta' : 'Ime dobavljača'}
          name="name"
          placeholder={isClient ? 'Unesi ime klijenta' : 'Unesi ime dobavljača'}
          value={input.name}
          onChange={handleOnChange}
          error={error.name}
          className="mt-3"
        />
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
    </>
  )
}

AddBillModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  isClient: PropTypes.bool,
}
AddBillModal.defaultProps = {
  isClient: false,
}

export default AddBillModal
