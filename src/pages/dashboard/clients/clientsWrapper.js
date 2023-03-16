import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { firestore } from 'utils/firebase'
import { actions } from 'slices/clientBills.slice'
import Clients from '.'

const ClientsWrapper = () => {
  const { me } = useSelector((state) => state.app)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.fetchClientBills({ userId: me.id }))
  }, [])

  return <Clients />
}

ClientsWrapper.propTypes = {}
ClientsWrapper.defaultProps = {}

export default ClientsWrapper
