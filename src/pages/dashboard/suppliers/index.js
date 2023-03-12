import React, { useState } from 'react'

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { isMobile } from 'react-device-detect'
import { useHistory } from 'react-router-dom'
import { Dialog } from 'primereact/dialog'
import PropTypes from 'prop-types'

import Button from 'components/Button'
import { dashboardPath } from 'utils/const'

import styles from './suppliers.module.scss'

const Suppliers = ({ supplierBills }) => {
  const history = useHistory()
  const [currentTransactions, setCurrentTransactions] = useState([])
  const [currentBillNumber, setCurrentBillNumber] = useState([])

  const [visible, setVisible] = useState(false)

  const calculateStatistics = () => {
    const results = {
      paid: 0,
      leftToPay: 0,
      sumOfValues: 0,
    }
    supplierBills.forEach((bill) => {
      results.paid += bill.paid
      results.leftToPay += bill.leftToPay
      results.sumOfValues += bill.value
    })
    return results
  }

  const renderFooter = () =>
    isMobile ? (
      <Tbody>
        <Tr>
          <Th style={{ textAlign: 'left' }}>Total:</Th>
          <Th style={{ textAlign: 'right' }}>
            Uplaćeno: {calculateStatistics().paid}
          </Th>
          <Th style={{ textAlign: 'right' }}>
            Preostalo: {calculateStatistics().leftToPay}
          </Th>
          <Th style={{ textAlign: 'right' }}>
            Ukupan iznos: {calculateStatistics().sumOfValues}
          </Th>
        </Tr>
      </Tbody>
    ) : (
      <Tbody>
        <Tr>
          <Th />
          <Th />
          <Th style={{ textAlign: 'left' }}>Total:</Th>
          <Th>{calculateStatistics().paid} RSD</Th>
          <Th>{calculateStatistics().leftToPay} RSD</Th>
          <Th>{calculateStatistics().sumOfValues} RSD</Th>
          <Th />
        </Tr>
      </Tbody>
    )

  const renderTransactions = () =>
    currentTransactions.map((transaction) => (
      <Tr key={transaction.id}>
        <Td>{transaction.creationDate}</Td>
        <Td>{transaction.value} RSD</Td>
      </Tr>
    ))

  const renderTableBody = () =>
    supplierBills.map((bill) => (
      <React.Fragment key={bill.id}>
        <Tr>
          <Td>{bill.billNumber}</Td>
          <Td>{bill.dateOfCreation}</Td>
          <Td>{bill.supplierName}</Td>
          <Td>{bill.paid} RSD</Td>
          <Td>{bill.leftToPay} RSD</Td>
          <Td>{bill.value} RSD</Td>
          <Td className={!isMobile && styles.actionsWrapper}>
            <Button
              onClick={() => {
                setCurrentBillNumber(bill.billNumber)
                setCurrentTransactions(bill.transactions)
                setVisible(true)
              }}
            >
              <span className="pi pi-book" />
            </Button>
            <Button
              className="ml-4"
              onClick={() => {
                setCurrentBillNumber(bill.billNumber)
                setCurrentTransactions(bill.transactions)
                setVisible(true)
              }}
            >
              <span className="pi pi-pencil" />
            </Button>
          </Td>
        </Tr>
      </React.Fragment>
    ))

  return (
    <>
      <div className={styles.buttonWrapper}>
        <Button
          label="Dodaj novi račun"
          className="btn-purple-outline"
          onClick={() => history.push(dashboardPath.addSupplier)}
        />
      </div>
      <Dialog
        header={`Transakcije za racun sa brojem ${currentBillNumber}`}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => setVisible(false)}
      >
        {currentTransactions.length > 0 ? (
          <Table className={styles.table}>
            <Thead>
              <Tr>
                <Th>Datum uplate</Th>
                <Th>Količina</Th>
              </Tr>
            </Thead>
            <Tbody>{renderTransactions()}</Tbody>
          </Table>
        ) : (
          <div>Nema transakcija za ovaj račun!</div>
        )}
      </Dialog>
      <Table className={styles.table}>
        <Thead>
          <Tr>
            <Th>Broj računa</Th>
            <Th>Datum</Th>
            <Th>Ime dobavljača</Th>
            <Th>Uplaćeno</Th>
            <Th>Preostalo</Th>
            <Th>Ukupan iznos</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>{renderTableBody()}</Tbody>
        {renderFooter()}
      </Table>
    </>
  )
}

Suppliers.propTypes = {
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

Suppliers.defaultProps = {
  supplierBills: [],
}

export default Suppliers
