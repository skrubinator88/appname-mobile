// Dependencies
// Config
import env from "../env";
import PaymentActions from "../rdx-actions/payment.action";

export const getPaymentInfo = async (authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
    const data = await res.json()

    data.methods.map((method) => dispatch(PaymentActions.addMethod(method)))
    data.transactions.map((txn) => dispatch(PaymentActions.updateTransaction(txn)))
    await dispatch(PaymentActions.updateBalance(data.balance))
    await dispatch(PaymentActions.updateDefault(data.methods.filter(v => v.isDefault)[0]))
  })

};