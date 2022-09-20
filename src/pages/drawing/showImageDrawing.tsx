import { Component, PropsWithChildren } from 'react'
import { View, Canvas, Button } from '@tarojs/components'
import './drawing2image.scss'
import Taro from '@tarojs/taro'
import { isConnected } from '../../utils/network';

export default class ShowImageDrawing extends Component<PropsWithChildren> {
    // 建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，
    // 而不是频繁地调用此 API
    $instance = Taro.getCurrentInstance()

    state = {
        filePath: '',
        filename: '',
        canvas: null,
        context: null,
        distance: 0,
        scale: 1,
        baseWidth: 0,
        baseHeight: 300,
        scaleWidth: 300,
        scaleHeight: 600,
        distanceDiff: 0,
    }

    componentWillMount(): void {
        const { filename, filePath } = this.$instance.router?.params || {}
        const realFilename: string = !!filename ? decodeURIComponent(filename) : ''
        const realFilePath: string = !!filePath ? decodeURIComponent(filePath) : ''

        const connected = isConnected()
        const title = `${connected ? '(在线)' : '(离线)'}${realFilename}`
        Taro.setNavigationBarTitle({title: title})

        this.setState({
            filePath: realFilePath,
            filename: realFilename,
        })
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
            that.setState({
                canvas: canvas,
                context: context
            }, () => {
                that.drawingCat()
            })
        })
    }

    drawingCat() {
        const { filePath, context, canvas, scaleWidth, scaleHeight } = this.state
        console.log('===', scaleWidth, scaleHeight)
        // 图片对象
        const image = canvas.createImage()
        // 图片加载完成回调
        image.onload = () => {
            // 将图片绘制到 canvas 上
            context.drawImage(image, 0, 0, scaleWidth, scaleHeight)
        }
        image.src = filePath
    }


    touchStart(e) {
        // 单手指缩放开始，也不做任何处理
        if(e.touches.length == 1) return
        console.log('双手指触发开始')
        // 注意touchstartCallback 真正代码的开始
        // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug
        // 当两根手指放上去的时候，就将distance 初始化。
        let xMove = e.touches[1].x - e.touches[0].x;
        let yMove = e.touches[1].y - e.touches[0].y;
        let distance = Math.sqrt(xMove * xMove + yMove * yMove);
        this.setState({
            distance: distance,
        })
    }

    touchMove(e) {
        var that = this
        const { distance, scale, baseWidth, baseHeight } = this.state
        // 单手指缩放我们不做任何操作
        console.log(e.touches)
        if(e.touches.length == 1) return
        console.log('双手指运动')
        const xMove = e.touches[1].x - e.touches[0].x;
        const yMove = e.touches[1].y - e.touches[0].y;
        // 新的 ditance
        const newDistance = Math.sqrt(xMove * xMove + yMove * yMove);
        const distanceDiff = newDistance - distance;
        let newScale = scale + 0.005 * distanceDiff
        // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
        if(newScale >= 3) {
          newScale = 3
        }
        if(newScale <= 0.6) {
          newScale = 0.6
        }
        const newScaleWidth = newScale * baseWidth
        const newScaleHeight = newScale * baseHeight
        // 赋值 新的 => 旧的
        this.setState({
          distance: newDistance,
          scale: newScale,
          scaleWidth: newScaleWidth,
          scaleHeight: newScaleHeight,
          distanceDiff: distanceDiff
        }, () => {
          that.drawingCat()
        })
    }

    render() {
        // const { filePath } = this.state
        return <View>
            <Button type='default' onClick={this.initCanvas.bind(this)}>手动初始化</Button>
            <Canvas id="myCanvas" canvasId="myCanvas" style="border: 1px solid; width: 370px; height: 500px;" type="2d" onTouchStart={this.touchStart.bind(this)} onTouchMove={this.touchMove.bind(this)} />
            {/* <Image src={filePath} mode='aspectFit' /> */}
        </View>
    }
}