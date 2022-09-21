import { Component, PropsWithChildren } from 'react'
import { View, Canvas, Button, Image, Slider, CoverView } from '@tarojs/components'
import './drawing2image.scss'
import Taro from '@tarojs/taro'
import { isConnected } from '../../utils/network'
import pinImg from '../../assets/pin.png'
import pinActiveImg from '../../assets/pin-active.png'
import { getModelDrawingMarkupList } from '../../models/drawing'

export default class ShowImageDrawing extends Component<PropsWithChildren> {
    // 建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，
    // 而不是频繁地调用此 API
    $instance = Taro.getCurrentInstance()

    state = {
        filePath: '',
        filename: '',
        canvas: null,
        context: null,
        image: {},
        scale: 1,
        slider: 1,
        baseWidth: 300,
        baseHeight: 600,
        scaleWidth: 300,
        scaleHeight: 600,
        markupList: [],
        showMarkup: false,
        modelId: '',
        drawingId: '',
        cloudModelFileId: '',
    }

    componentWillMount(): void {
        const { filename, filePath, modelId, drawingId, cloudModelFileId } = this.$instance.router?.params || {}
        const realFilename: string = !!filename ? decodeURIComponent(filename) : ''
        const realFilePath: string = !!filePath ? decodeURIComponent(filePath) : ''

        const connected = isConnected()
        const title = `${connected ? '(在线)' : '(离线)'}${realFilename}`
        Taro.setNavigationBarTitle({title: title})

        this.setState({
            filePath: realFilePath,
            filename: realFilename,
            cloudModelFileId: cloudModelFileId,
            modelId: modelId,
            drawingId: drawingId,
        })

        this.getImageInfo(realFilePath)
    }

    componentDidMount(): void {
    }

    initCanvas() {
        var that = this
        const query = Taro.createSelectorQuery()
        query.select('#myCanvas').fields({ node: true, size: true })
        query.exec((res) => {
            console.log(res)
            // Canvas 对象
            const canvas = res[0].node
            // 渲染上下文
            const context = canvas.getContext('2d')
            // Canvas 画布的实际绘制宽高
            const width = res[0].width
            const height = res[0].height

            // 初始化画布大小
            const dpr = Taro.getWindowInfo().pixelRatio
            canvas.width = width * dpr
            canvas.height = height * dpr
            context.scale(dpr, dpr)

            const image = canvas.createImage()

            that.setState({
                canvas: canvas,
                context: context,
                image: image,
            }, () => {
                that.drawingCat()
            })
        })
    }

    scaleChange(e) {
        var that = this
        const customScale: number = e.detail.value
        const { scale, baseWidth, baseHeight } = this.state
        let newScale = Number((customScale / scale).toFixed(1))
        console.log(newScale)
        // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
        if(newScale >= 2) {
          newScale = 2
        }
        if(newScale <= 0.6) {
          newScale = 0.6
        }
        const newScaleWidth = newScale * baseWidth
        const newScaleHeight = newScale * baseHeight

        // 赋值 新的 => 旧的
        this.setState({
          scale: newScale,
          slider: customScale,
          scaleWidth: newScaleWidth,
          scaleHeight: newScaleHeight,
        }, () => {
          that.drawingCat()
          that.rescaleMarkupPointPositions(newScaleWidth, newScaleHeight)
        })
    }

    drawingCat() {
        const { context, canvas, image, filePath, scale, scaleWidth, scaleHeight } = this.state
        // 清理图片: 如何清理
        context.clearRect(0, 0, canvas.width, canvas.height)
  
        // 重新绘制图片
        context.scale(scale, scale)
        // 图片对象
        //const image = canvas.createImage()
        // 图片加载完成回调
        image.onload = () => {
            // 将图片绘制到 canvas 上
            context.drawImage(image, 0, 0, scaleWidth, scaleHeight)
        }
        image.src = filePath

        //
        this.rescaleMarkupPointPositions(scaleWidth, scaleHeight)
    }

    getImageInfo(filePath: string) {
        Taro.getImageInfo({
            src: filePath,
            success: res => {
                // 适配画布的原始大小
                const widthB = res.width / 370
                const heightB = res.width / 500
                const maxB = Math.max(widthB, heightB)
                const width = res.width / maxB
                const height = res.height/ maxB
                this.setState({
                    baseWidth: width,
                    baseHeight: height,
                    scaleWidth: width,
                    scaleHeight: height,
                })
            }
        })
    }

    canvasClick(e) {
        // 所有标注点改为 未选中 状态
        const { markupList } = this.state
        markupList.forEach((mark: any) => {
            mark.active = false
        })
        this.setState({
            markupList: markupList,
        })
    }
    markupClick(mark) {
        const { markupList } = this.state
        markupList.forEach((mark: any) => {
            mark.active = true
        })
        this.setState({
            markupList: markupList,
        })

        // 展示批注想起信息
        Taro.showActionSheet({
            itemList: [ `NO.${mark.markup.sequence}`, mark.markup.content, mark.markup.createdByName ],
            success: function (res) {
                console.log(res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    }
    showMarkupPoints() {
        const { modelId, drawingId, cloudModelFileId, scaleWidth, scaleHeight, showMarkup } = this.state
        if (!showMarkup) {
            getModelDrawingMarkupList({collectionId: modelId, drawingId: drawingId, cloudModelFileId: cloudModelFileId, drawingName: '', needScreenshotUrl: false })
            .then((data: Array<any>) => {
                if (!data || data.length == 0) {
                    Taro.showToast({title: '没有2D批注信息', icon: 'none', duration: 2000})
                } else {
                    const validList = data.filter((m: any) => m.markup.markup2DInfo && m.markup.markup2DInfo !== "" && m.markup.markup2DInfo.drawingPosition && m.markup.markup2DInfo.drawingPosition.length == 2)
                    if (!validList || validList.length == 0) {
                        Taro.showToast({title: '没有2D批注信息', icon: 'none', duration: 2000})
                    } else {
                        this.setState({
                            markupList: validList.map((m: any) => {
                                const position: Array<number> =  m.markup.markup2DInfo.drawingPosition
                                return { ...m, active: false, left: scaleWidth * position[0], top: (scaleHeight - scaleHeight * position[1]) } 
                            }),
                            showMarkup: true
                        })
                    }
                }
            })
        } else {
            this.setState({ showMarkup: false })
            const { markupList } = this.state
            if (!markupList || markupList.length == 0) {
                Taro.showToast({title: '没有2D批注信息', icon: 'none', duration: 2000})
            }
        }
    }
    rescaleMarkupPointPositions(scaleWidth: number, scaleHeight: number) {
        const { markupList } = this.state
        this.setState({
            markupList: markupList.map((m: any) => {
                const position: Array<number> =  m.markup.markup2DInfo.drawingPosition
                return { ...m, left: scaleWidth * position[0], top: (scaleHeight - scaleHeight * position[1]) }
            })
        })
    }

    render() {
        const { slider, markupList, showMarkup } = this.state
        console.log(markupList)
        return <View>
            <Button type='default' onClick={this.initCanvas.bind(this)}>手动加载图纸</Button>
            <Slider min={0.5} max={2} step={0.5} value={slider} showValue={true} onChange={this.scaleChange.bind(this)} />
            <Canvas id="myCanvas" canvasId="myCanvas" style="border: 1px solid; width: 370px; height: 500px; z-index: 1;" type="2d" onClick={this.canvasClick.bind(this)} />
            {
                showMarkup && markupList.map((mark: any) => {
                    return <Image id={mark.markupId} src={mark.active ? pinActiveImg : pinImg} style={{height: "32px", width: "32px", left: `${mark.left}px`, top: `${mark.top}px`, position: "absolute", zIndex: 20}} onClick={this.markupClick.bind(this, mark)} />
                })
            }
            <Button type='default' style={{marginTop: "20px"}} onClick={this.showMarkupPoints.bind(this)}>显示/隐藏批注点</Button>
        </View>
    }
}