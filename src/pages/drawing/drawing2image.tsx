import { Component, PropsWithChildren } from 'react'
import { View, Image, Button } from '@tarojs/components'
import './drawing2image.scss'
import Taro from '@tarojs/taro'
import { getModelDrawing, getModelDrawingFile, getModelDrawingPdfFile } from '../../models/drawing'
import { isConnected } from '../../utils/network'

export default class Drawing2Image extends Component<PropsWithChildren> {
    // 建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，
    // 而不是频繁地调用此 API
    $instance = Taro.getCurrentInstance();

    state = {
        entperise: '',
        project: '',
        model: '',
        drawing: '',
        fileList: [],
    }

    previewDrawing() {
        const { model, drawing } = this.state;
        const drawingDetail: any = getModelDrawing(model, drawing)

        const connected = isConnected()
        const title = `${connected ? '(在线)' : '(离线)'}${drawingDetail.drawingName}`
        Taro.setNavigationBarTitle({title: title})

        getModelDrawingFile(model, drawing, drawingDetail.storageFileId).then((data:any) => {
            // this.setState({
            //     fileList: data
            // })
            const filePath = data.find(() => true)
            if (!filePath) {
                Taro.showToast({title: '没有找到图纸文件(Image)', icon: 'none'})
            } else {
                Taro.navigateTo({url: `./showImageDrawing?filePath=${encodeURIComponent(filePath)}&filename=${encodeURIComponent(drawingDetail.drawingName)}&modelId=${model}&drawingId=${drawing}&cloudModelFileId=${drawingDetail.cloudModelFileId}`})
            }
        })
    }

    previewDrawingPdf() {
        const { model, drawing } = this.state;
        const drawingDetail: any = getModelDrawing(model, drawing)
        console.log(drawingDetail)
        getModelDrawingPdfFile(model, drawing, drawingDetail.storageFileId).then((data:any) => {
            const filePath = data.find(() => true)
            if (!filePath) {
                Taro.showToast({title: '没有找到图纸文件(PDF)', icon: 'none'})
            } else {
                Taro.openDocument({
                    filePath: filePath,
                    fileType: 'pdf',
                    showMenu: true,
                })
            }
        })
    }

    componentDidMount(): void {
        const { entperise, project, model, drawing } = this.$instance.router?.params || {};
        this.setState({
            entperise: entperise,
            project: project,
            model: model,
            drawing: drawing,
        })
    }

    render() {
        const { fileList } = this.state
        return <View>
            <Button type='default' style={"width: 66%;"} onClick={this.previewDrawingPdf.bind(this)}>展示图纸(Pdf)</Button>
            <Button type='primary' style={"width: 66%; margin-top: 10px;"} onClick={this.previewDrawing.bind(this)}>展示图纸(Image)</Button>
            {
                fileList.map((item: any) => {
                    return <Image src={item} mode='aspectFit' />
                })
            }
        </View>
    }
}