import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { dashboardPath } from 'utils/const'
// import { firestore } from 'utils/firebase'
import { actions } from 'slices/bills.slice'
import Suppliers from '.'
import AddNewSupplier from './addNew'
import EditSupplier from './edit'

const SupplierWrapper = () => {
  const { me } = useSelector((state) => state.app)
  const dispatch = useDispatch()

  useEffect(async () => {
    dispatch(actions.fetchSupplierBills({ userId: me.id }))
  }, [])

  return (
    <>
      <Switch>
        <Route path={dashboardPath.addSupplier}>
          <AddNewSupplier />
        </Route>
        <Route path={dashboardPath.editSupplier}>
          <EditSupplier />
        </Route>
        <Route path={dashboardPath.suppliers}>
          <Suppliers />
        </Route>
        <Redirect to={dashboardPath.suppliers} />
      </Switch>
    </>
  )
}

SupplierWrapper.propTypes = {}
SupplierWrapper.defaultProps = {}

export default SupplierWrapper
