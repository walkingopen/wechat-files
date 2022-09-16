import { Component, PropsWithChildren } from 'react'
import { View, Button } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'

// const pdf = require('pdf-poppler')

export default class Index extends Component<PropsWithChildren> {

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
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        //const tempFilePaths = res.tempFiles
        // Taro.openDocument({
        //   filePath: tempFilePaths[0].path,
        //   showMenu: true,
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      }
    })
  }

  // pdf2Image(file: Taro.chooseMessageFile.ChooseFile) {
  //   let opts = {
  //     format: 'jpeg',
  //     out_dir: `${Taro.env.USER_DATA_PATH}/${file.name}`,
  //     out_prefix: file.name.split('.')[1],
  //     page: null
  //   }

  //   pdf.convert(file.path, opts)
  //   .then(res => {
  //       console.log(res);
  //   })
  //   .catch(error => {
  //       console.error(error);
  //   })
  // }

  render () {
    return (
      <View className='index'>
        <Button type="default" onClick={this.chooseMessageFile.bind(this, 'image')}>选择会话图片</Button>
        <Button type="default" onClick={this.chooseMessageFile.bind(this, 'video')}>选择会话视频</Button>
        <Button type="default" onClick={this.chooseMessageFile.bind(this, 'file')}>选择会话普通文件</Button>
        <Button type="primary" onClick={this.chooseMessageFile.bind(this, 'all')}>选择会话文件</Button>
      </View>
    )
  }
}
