import { Component, PropsWithChildren } from 'react'
import './app.scss'
import * as login from './models/login'
import { checkNetworkStatus, isConnected } from './utils/network'

class App extends Component<PropsWithChildren> {

  componentDidMount () {
    checkNetworkStatus().then(() => {
      const connected = isConnected()
      console.log(connected)
      // 模拟登录
      if (login.checkLogin()) {
        login.navigateToHome()
      } else if (connected) {
        login.loginByPhone('17321135363', 'a123456')
      }
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  render () {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App
