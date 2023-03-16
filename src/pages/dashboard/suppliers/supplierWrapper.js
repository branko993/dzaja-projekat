import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { firestore } from 'utils/firebase'
import { actions } from 'slices/bills.slice'
import Suppliers from '.'

const SupplierWrapper = () => {
  const { me } = useSelector((state) => state.app)
  const dispatch = useDispatch()

  useEffect(async () => {
    dispatch(actions.fetchSupplierBills({ userId: me.id }))
  }, [])

  return <Suppliers />
}

SupplierWrapper.propTypes = {}
SupplierWrapper.defaultProps = {}

export default SupplierWrapper
