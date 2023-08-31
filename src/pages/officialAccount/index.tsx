import { Component, PropsWithChildren } from "react";
import { View, WebView } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component<PropsWithChildren> {

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  viewSelectedTempFiles() {
    this.setState({
      savedTempFiles: Taro.getStorageSync("selectedTempFiles")
    });
  }

  render() {
    return (
      <View className="index">
        <WebView src="https://standard-dev.patternx.gemdale.com/?enterpriseId=fb9df053-027e-4b34-93a3-cdce881e23a1&projectId=b660a8aa8f484410bdc4b7d9a496fc18"></WebView>
      </View>
    )
  }
}
