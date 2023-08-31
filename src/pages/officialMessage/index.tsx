import { Component, PropsWithChildren } from "react";
import { View, Button, Label, Text, ScrollView } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component<PropsWithChildren> {
  state = {
    users: [],
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getAllUsers() {
    var that = this;
    Taro.request({
      url: 'https://parking-dev.api.patternx.gemdale.com/v1/wechat/officialAccount/users',
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setState({
          users: res?.data?.details
        })
      }
    })
  }

  sendMessage(item:any) {
    var that = this;
    const price = Math.round(Math.random()*100);
    Taro.request({
      url: 'https://parking-dev.api.patternx.gemdale.com/v1/wechat/officialAccount/message',
      method: 'POST',
      data: {
        touser: item?.openId,
        template_id: "juNbk0IhF4j48ilhDnvwZEWvitz4W4y6_Yd9DM_-VYE",
        url: "https://www.baidu.com",
        //client_msg_id: "MSG_000003",
        data: {
            result: {
                "value": "成功触发"
            },
            withdrawMoney: {
                "value": `${price}元`
            },
            withdrawTime: {
                "value": new Date().toString()
            },
            cardInfo: {
                "value": item?.phone
            },
            arrivedTime: {
                "value": new Date().toString()
            }
        }
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }

  render() {
    const { users } = this.state
    return (
      <View className="index">
        <View className="view-files view-saved-temp-files">
          <Button type="primary" onClick={this.getAllUsers.bind(this)}>
            展示已有公众号用户
          </Button>
          <ScrollView scrollY={true} style={"width: 360px; height: 400px; border: 1px solid black; margin-top: 30px;"}>
            <Label>现有公众号用户如下:</Label>
            {users && users.map((item: any, idx) => {
              return <View>
                <Text>{item?.phone}</Text>
                <Button onClick={this.sendMessage.bind(this, item)}>发送消息</Button>
              </View>
            })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
