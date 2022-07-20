import App from 'next/app'
import React from 'react'
import '../styles/globals.css'
import { Provider } from 'react-redux'
import store from '../store/store'
import { createWrapper} from 'next-redux-wrapper'


/*class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props
        return (
            <Provider store={store}>
              <Component {...pageProps}></Component>
            </Provider>
        )
    }
}
*/

const MyApp = ({ Component, pageProps }) => {
    return (
      <Provider store={store}>
        <Component {...pageProps}></Component>
      </Provider>
  )
} 

/*
MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps }
}
*/

const makeStore = () => store
const wrapper = createWrapper(makeStore)

export default wrapper.withRedux(MyApp)
