import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { firestore } from 'utils/firebase'
import { actions } from 'slices/clientBills.slice'
import Clients from '.'

const SupplierWrapper = () => {
  const { me } = useSelector((state) => state.app)
  const dispatch = useDispatch()

  useEffect(async () => {
    dispatch(actions.fetchClientBills, { userId: me.id })
  }, [])

  return <Clients />
}

SupplierWrapper.propTypes = {}
SupplierWrapper.defaultProps = {}

export default SupplierWrapper
