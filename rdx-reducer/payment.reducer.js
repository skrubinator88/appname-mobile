const initialState = {
    methods: [],
    balance: 0,
    defaultMethod: null,
    hasActiveAccount: false,
    transactions: []
}

export const PaymentReducer = (prevState = initialState, action) => {
    switch (action.type) {
        case "ADD_PAYMENT_METHOD":
            const { methods } = prevState
            methods.push(action.data)
            // TODO: confirm if we need to destructure methods array
            return { ...prevState, methods }

        case "SET_BALANCE":
            return { ...prevState, balance: action.data.balance || 0, hasActiveAccount: action.data.activeAccount }

        case "SET_DEFAULT_METHOD":
            return { ...prevState, defaultMethod: action.data }

        case "SET_TRANSACTION":
            const { transactions } = prevState
            transactions.push(action.data)
            // TODO: confirm if we need to destructure transactions array
            return { ...prevState, transactions: action.data }

        case "CLEAR_PAYMENTS":
            return { ...initialState }

        default:
            return { ...prevState };
    }
};
