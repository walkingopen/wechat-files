import { Component, PropsWithChildren } from "react";
import { View, Button, Label, Image, Video, ScrollView } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component<PropsWithChildren> {
  state = {
    selectedTempFiles: [],
    savedTempFiles: []
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  selectMedia() {
    var that = this;
    Taro.chooseMedia({
      count: 9,
      mediaType: ["image", "video"],
      sourceType: ["album", "camera"],
      maxDuration: 30,
      camera: "back",
      success(res) {
        console.log(res.tempFiles);
        that.setState({
          selectedTempFiles: res.tempFiles
        });
        Taro.setStorageSync("selectedTempFiles", res.tempFiles);
      },
      fail(err) {
        console.log(err);
      }
    });
  }

  viewSelectedTempFiles() {
    this.setState({
      savedTempFiles: Taro.getStorageSync("selectedTempFiles")
    });
  }

  render() {
    const { savedTempFiles } = this.state
    return (
      <View className="index">
        <View className="view-files">
          <Button type="default" onClick={this.selectMedia.bind(this)}>
            选取相册文件
          </Button>
        </View>

        <View className="view-files view-saved-temp-files">
          <Button type="primary" onClick={this.viewSelectedTempFiles.bind(this)}>
            展示临时相册文件
          </Button>
          <ScrollView scrollY={true} style={"width: 360px; height: 400px; border: 1px solid black; margin-top: 30px;"}>
            <Label>临时存储的文件如下:</Label>
            {savedTempFiles.map((file: any, idx) => {
              return file.fileType == "image" ? (
                <Image id={"image-" + idx} src={file.tempFilePath} mode='aspectFit' data-size={file.size} data-path={file.tempFilePath} />
              ) : (
                <Video id={"video-" + idx} src={file.tempFilePath} data-size={file.size} data-path={file.tempFilePath} />
              )
            })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
