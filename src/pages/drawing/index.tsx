import { Component, PropsWithChildren } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'
import { isConnected } from '../../utils/network'
import { navigatorBarTitleNetStatusLisener, getProjectList, getEnterpriseList, getModelCollectionList, getModelDrawingList } from '../../models/drawing'

export default class Index extends Component<PropsWithChildren> {
    state = {
        enterpriseList: [],
        projectList: [],
        modelList: [],
        drawingList: [],
        selectedEnterperise: '',
        selectedProject: '',
        selectedModel: '',
    }

    componentDidMount(): void {
        var that = this
        navigatorBarTitleNetStatusLisener('模型协同')
        getEnterpriseList().then((data: any) => {
            that.setState({
                enterpriseList: data
            })
        })
    }

    networkStatus() {
        if (isConnected()) {
            Taro.showToast({title: '连接状态', icon: 'success', duration: 2000})
        } else {
            Taro.showToast({title: '离线状态', icon: 'error', duration: 2000})
        }
    }

    chooseEnterprise(item: any) {
        var that = this
        getProjectList({ enterpriseId: item.id, page: 1, pageSize: 100}).then((data: any) => {
            that.setState({
                projectList: data,
                selectedEnterperise: item.id
            })
        })
    }

    chooseProject(item: any) {
        var that = this
        const { selectedEnterperise } = this.state
        getModelCollectionList({ enterpriseId: selectedEnterperise, projectId: item.id, collectionId: item.collectionId, sort: 'desc', thumbnailSwitch: true, page: 1, pageSize: 100}).then((data: any) => {
            that.setState({
                modelList: data,
                selectedProject: item.id
            })
        })
    }

    chooseModel(item: any) {
        var that = this
        const { selectedEnterperise, selectedProject } = this.state
        getModelDrawingList({ enterpriseId: selectedEnterperise, projectId: selectedProject, collectionId: item.id, versionList: []}).then((data: any) => {
            that.setState({
                drawingList: data,
                selectedModel: item.id
            })
        })
    }

    chooseDrawing(item) {
        const { selectedEnterperise, selectedProject, selectedModel } = this.state
        // 跳转到图纸转换页（pdf -> image）
        Taro.navigateTo({url: `./drawing2image?entperise=${selectedEnterperise}&project=${selectedProject}&model=${selectedModel}&drawing=${item.id}`})
    }

    render () {
        const { enterpriseList, projectList, modelList, drawingList } = this.state
        return <View>
            <Text>企业列表：</Text>
            <ScrollView scrollY={true} className="scroll-entperise-list">
                {
                    enterpriseList.map((item:any) => {
                        return <Text className="scroll-entperise-list-text" onClick={this.chooseEnterprise.bind(this, item)}>{item.name}</Text>
                    })
                }
            </ScrollView>

            <Text className='project-title'>项目列表：</Text>
            <ScrollView scrollY={true} className="scroll-project-list">
                {
                    projectList.map((item:any) => {
                        return <Text className="scroll-project-list-text" onClick={this.chooseProject.bind(this, item)}>{item.name + '-' + item.caseName}</Text>
                    })
                }
            </ScrollView>

            <Text className='project-title'>模型列表：</Text>
            <ScrollView scrollY={true} className="scroll-project-list">
                {
                    modelList.map((item:any) => {
                        return <Text className="scroll-project-list-text" onClick={this.chooseModel.bind(this, item)}>{item.name}</Text>
                    })
                }
            </ScrollView>

            <Text className='project-title'>图纸列表：</Text>
            <ScrollView scrollY={true} className="scroll-project-list">
                {
                    drawingList.filter((item: any) => !!item.drawingName && item.drawingName.indexOf('.pdf') !== -1).map((item:any) => {
                        return <Text className="scroll-project-list-text" onClick={this.chooseDrawing.bind(this, item)}>{item.drawingName}</Text>
                    })
                }
            </ScrollView>
        </View>
    }
}