export function checkLogin(store) {
    const token = store.getState().user.token
    if (!(token && token.length > 0)) {
        return false
    }
    return true
}
