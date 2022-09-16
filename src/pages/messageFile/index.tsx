import { Component, PropsWithChildren } from 'react'
import { View, Button, Label, Image, Video, ScrollView, Text } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'

const fs = Taro.getFileSystemManager()
const userPath: string = Taro.env.USER_DATA_PATH
const savePath: string = `${userPath}/work`
const imageStuffixs = [ 'jpeg', 'jpg', 'webp', 'png' ]
const videoStuffixs = [ 'mp4', 'mp3', 'mov' ]
const docStuffixs = [ 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf' ]
export default class Index extends Component<PropsWithChildren> {

  state = {
    savedFiles: []
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  chooseMessageFile(type: any) {
    // var that = this
    Taro.chooseMessageFile({
      count: 10,
      type: type,
      success (res) {
        console.log(res)
        try {
          fs.accessSync(savePath)
        } catch(e) {
          console.error(e)
          try {
            fs.mkdirSync(savePath, false)
          } catch(e) {
            console.error(e)
          }
        }
        res.tempFiles.forEach((file: any) => {
          //const filename = Buffer.from(file.path, 'base64').toString('hex')
          const filename = file.path.split('/').reverse()[0]
          const saveFullPath: string = `${savePath}/${filename}`
          try {
            fs.accessSync(saveFullPath)
            fs.unlinkSync(saveFullPath)
          } catch (error) {
            console.warn("文件: " + saveFullPath + "不存在")
          }
          fs.saveFileSync(file.path, saveFullPath)
        })
      }
    })
  }

  deleteSavedFiles() {
    fs.readdir({
      dirPath: savePath,
      success: res => {
        res.files.forEach(f => {
          console.log("====> 删除文件: " + f)
          try {
            fs.accessSync( `${savePath}/${f}`)
            fs.unlinkSync( `${savePath}/${f}`)
          } catch (error) {
            console.warn("文件: " +  `${savePath}/${f}` + "不存在")
          }
        })
        this.setState({
          savedFiles: []
        })
      }
    })
  }

  viewSavedFiles() {
    fs.readdir({
      dirPath: savePath,
      success: res => {
        console.log(res)
        var files: any = []
        res.files.forEach( (file)=> {
          if (file == "miniprogramLog") {
            return
          }
          const stuffix = file.split('.')[1]
          let fileType =''
          if (this.checkContain(imageStuffixs, stuffix)) {
            fileType = 'image'
          } else if (this.checkContain(videoStuffixs, stuffix)) {
            fileType = 'video'
          } else if (this.checkContain(docStuffixs, stuffix)) {
            fileType = 'document'
          }
          files.push({ filename: file, filePath: `${savePath}/${file}`, fileType: fileType, stuffix: stuffix })
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

  previewMedia(path: string, fileType: string) {
    Taro.previewMedia({
      showmenu: true,
      current: 0,
      sources: [ { url: path, type: fileType=='video' ? 'video' : 'image' } ],
      success: res => {
        console.log('预览成功: ' + JSON.stringify(res))
      },
      fail: err => {
        console.error('预览失败: ' + JSON.stringify(err))
      }
    })
  }

  previewDocument(path) {
    Taro.openDocument({
      filePath: path,
      success: res => {
        console.log('预览成功: ' + JSON.stringify(res))
      },
      fail: err => {
        console.error('预览失败: ' + JSON.stringify(err))
      }
    })
  }

  checkContain(arr, ele) {
    return arr.some((element) => {
      return element == ele
    })
  }

  formatDisplayFilename(filename: string) {
    if (filename.length > 25) {
      return filename.substring(0, 15) + '...' + filename.substring(filename.length  - 10)
    }
    return filename
  }

  render () {
    const { savedFiles } = this.state
    return (
      <View className='index'>
        {/* <Button type="default" onClick={this.chooseMessageFile.bind(this, 'image')}>选择会话图片</Button> */}
        {/* <Button type="default" onClick={this.chooseMessageFile.bind(this, 'video')}>选择会话视频</Button> */}
        {/* <Button type="default" onClick={this.chooseMessageFile.bind(this, 'file')}>选择会话普通文件</Button> */}
        <Button type="primary" onClick={this.chooseMessageFile.bind(this, 'all')}>选择会话文件</Button>
        <Button type="warn" onClick={this.deleteSavedFiles.bind(this)}>删除本地文件</Button>
        <Button type="primary" onClick={this.viewSavedFiles.bind(this)}>展示本地文件</Button>
        <View className="view-files view-saved-local-files">
          <ScrollView scrollY={true} style={"width: 360px; height: 400px; border: 1px solid black;"}>
            <Label>会话转存的文件如下:</Label>
            {savedFiles.map((file: any, idx) => {
              return file.fileType == 'image' ? (
                <Image className='file-node' id={'image-' + idx} onClick={this.previewMedia.bind(this, file.filePath, 'image')} src={file.filePath} mode='aspectFit' data-filename={file.filename} ata-fileType={file.fileType} data-stuffix={file.stuffix} data-path={file.filePath} />
              ) : file.fileType == 'video' ? (
                <Video className='file-node' id={'video-' + idx} src={file.filePath} data-filename={file.filename} data-fileType={file.fileType} data-stuffix={file.stuffix} data-path={file.filePath} />
              ) : file.fileType == 'document' ? (
                <Text className='file-node' id={'document-' + idx} onClick={this.previewDocument.bind(this, file.filePath)} data-filename={file.filename} data-fileType={file.fileType} data-stuffix={file.stuffix} data-path={file.filePath}>{this.formatDisplayFilename(file.filename)}</Text>
              ) : <Text className='file-node' id={'other-' + idx} data-filename={file.filename} data-fileType={file.fileType} data-stuffix={file.stuffix} data-path={file.filePath}>{this.formatDisplayFilename(file.filename)}</Text>
            })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
