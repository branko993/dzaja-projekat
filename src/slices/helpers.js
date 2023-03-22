export const calculateStatistics = (clientBills) => {
  const results = {
    paid: 0,
    leftToPay: 0,
    sumOfValues: 0,
  }
  clientBills.forEach((bill) => {
    results.paid += bill.paid
    results.leftToPay += bill.leftToPay
    results.sumOfValues += bill.value
  })
  return results
}
