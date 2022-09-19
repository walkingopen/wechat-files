import { Component, PropsWithChildren, ReactNode } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'
import { isConnected } from '../../utils/network'
import { navigatorBarTitleNetStatusLisener } from '../../models/drawing'

export default class Index extends Component<PropsWithChildren> {
    state = {
    }

    render() {
        return <View>Hello</View>
    }
}