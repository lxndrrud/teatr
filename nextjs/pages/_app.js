import App from 'next/app'
import React from 'react'
import '../styles/globals.css'
import { Provider } from 'react-redux'
import store from '../store/store'
import { createWrapper} from 'next-redux-wrapper'


class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props
        return (
          <Provider store={store}>
            <Component {...pageProps}></Component>
          </Provider>
        )
    }
}

const makeStore = () => store
const wrapper = createWrapper(makeStore)

export default wrapper.withRedux(MyApp)
