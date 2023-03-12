import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { firestore } from 'utils/firebase'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { isMobile } from 'react-device-detect'
import styles from './suppliers.module.scss'

const Suppliers = () => {
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

        document.paid = 0
        document.leftToPay = document.value
        supplierTransactionsSnapshot.docs.forEach((transactionDoc) => {
          const transaction = transactionDoc.data()
          document.paid += Number(transaction.value)
          document.leftToPay -= Number(transaction.value)
        })

        setSupplierBills((bills) => [...bills, document])
      }
    })
  }, [])
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
          <Th>{calculateStatistics().paid}</Th>
          <Th>{calculateStatistics().leftToPay}</Th>
          <Th>{calculateStatistics().sumOfValues}</Th>
        </Tr>
      </Tbody>
    )

  const renderTableBody = () =>
    supplierBills.map((bill) => (
      <Tr>
        <Td>{bill.billNumber}</Td>
        <Td>{bill.dateOfCreation}</Td>
        <Td>{bill.supplierName}</Td>
        <Td>{bill.paid}</Td>
        <Td>{bill.leftToPay}</Td>
        <Td>{bill.value}</Td>
      </Tr>
    ))

  return (
    <>
      <Table className={styles.table}>
        <Thead>
          <Tr>
            <Th>Broj računa</Th>
            <Th>Datum</Th>
            <Th>Ime dobavljača</Th>
            <Th>Uplaćeno</Th>
            <Th>Preostalo</Th>
            <Th>Ukupan iznos</Th>
          </Tr>
        </Thead>
        <Tbody>{renderTableBody()}</Tbody>
        {renderFooter()}
      </Table>
    </>
  )
}

Suppliers.propTypes = {}
Suppliers.defaultProps = {}

export default Suppliers
