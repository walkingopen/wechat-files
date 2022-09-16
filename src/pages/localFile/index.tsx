import { Component, PropsWithChildren } from 'react'
import { View, Button, Label, Image, Video, ScrollView } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'

const fs = Taro.getFileSystemManager()
const userPath: string = Taro.env.USER_DATA_PATH
export default class Index extends Component<PropsWithChildren> {

  state = {
    savedFiles: []
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  selectMedia() {
    Taro.chooseMedia({
      count: 9,
      mediaType: ["mix"],
      sourceType: ["album", "camera"],
      maxDuration: 30,
      camera: "back",
      success(res) {
        console.log(res.tempFiles);
        res.tempFiles.forEach((file: any, idx) => {
          const filename = (file.fileType == 'image' ? `image-${idx}.jpg` : `video-${idx}.mp4`)
          try {
            fs.accessSync(`${userPath}/${filename}`)
            fs.unlinkSync(`${userPath}/${filename}`)
          } catch (error) {
            console.warn("文件: " + `${userPath}/${filename}` + "不存在")
          }
          fs.saveFileSync(file.tempFilePath, `${userPath}/${filename}`)
        })
      },
      fail(err) {
        console.log(err);
      }
    });
  }

  deleteSavedFiles() {
    fs.readdir({
      dirPath: userPath,
      success: res => {
        res.files.forEach(f => {
          console.log("====> 删除文件: " + f)
          Taro.getFileSystemManager().unlink({
            filePath: `${userPath}/${f}`
          })
        })
        this.setState({
          savedFiles: []
        })
      }
    })
  }

  viewSavedFiles() {
    fs.readdir({
      dirPath: userPath,
      success: res => {
        console.log(res)
        var files: any = []
        res.files.forEach( (file)=> {
          if (file == "miniprogramLog") {
            return
          }
          files.push({ filePath: `${userPath}/${file}`, fileType: file.indexOf('.mp4') != -1 ? 'video' : 'image'})
        })
        console.log(files)
        this.setState({
          savedFiles: files
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }

  render () {
    const { savedFiles } = this.state
    return (
      <View className="index">
        <Button type="default" onClick={this.selectMedia.bind(this)}>选取相册文件</Button>
        <Button type="warn" onClick={this.deleteSavedFiles.bind(this)}>删除本地文件</Button>
        <Button type="primary" onClick={this.viewSavedFiles.bind(this)}>展示本地文件</Button>

        <View className="view-files view-saved-local-files">
          <ScrollView scrollY={true} style={"width: 360px; height: 400px; border: 1px solid black;"}>
            <Label>本地存储的文件如下:</Label>
            {savedFiles.map((file: any, idx) => {
              return file.fileType == "image" ? (
                <Image id={"image-" + idx} src={file.filePath} mode='aspectFit' data-size={file.size} data-path={file.tempFilePath} />
              ) : (
                <Video id={"video-" + idx} src={file.filePath} data-size={file.size} data-path={file.tempFilePath} />
              )
            })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
