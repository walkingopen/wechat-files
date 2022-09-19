import { Component, PropsWithChildren } from 'react'
import { View, Image, Button } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'
import { getModelDrawing, getModelDrawingFile, getModelDrawingPdfFile } from '../../models/drawing'

export default class Index extends Component<PropsWithChildren> {
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
        Taro.setNavigationBarTitle(drawingDetail.drawingName || '')
        //navigatorBarTitleNetStatusLisener(drawingDetail.drawingName || '')
        getModelDrawingFile(model, drawing, drawingDetail.storageFileId).then((data:any) => {
            this.setState({
                fileList: data
            })
        })
    }

    previewDrawingPdf() {
        const { model, drawing } = this.state;
        const drawingDetail: any = getModelDrawing(model, drawing)
        console.log(drawingDetail)
        getModelDrawingPdfFile(model, drawing, drawingDetail.storageFileId).then((data:any) => {
            if (data.length > 0) {
                Taro.openDocument({
                    filePath: data[0],
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