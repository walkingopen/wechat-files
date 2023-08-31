import { Component, PropsWithChildren } from "react";
import { View, Button, Text, Input } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component<PropsWithChildren> {
  state = {
    code: ''
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getCode() {
    var that = this;
    Taro.login({
      success: function (res) {
        if (res.code) {
          console.log('x=====', res);
          that.setState({ code: res.code });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  copy() {
    Taro.setClipboardData({
      data: this.state.code,
      success: function (res) {
        Taro.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

  render() {
    const { code } = this.state;
    return (
      <View className="index">
        <View className="view-files view-saved-temp-files">
          <Button type="primary" onClick={this.getCode.bind(this)}>
            获取微信登录code
          </Button>
          <View>
            code: <Text onClick={this.copy.bind(this)}>{code}</Text>
          </View>
        </View>
      </View>
    )
  }
}
