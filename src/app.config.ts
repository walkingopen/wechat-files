export default defineAppConfig({
  pages: [
    "pages/login/index",
    "pages/officialAccount/index",
    "pages/officialMessage/index",
    "pages/tempFile/index",
    "pages/localFile/index",
    "pages/messageFile/index",
    "pages/drawing/index",
    "pages/drawing/drawing2image",
    "pages/drawing/showImageDrawing",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    list: [
      // {
      //   pagePath: "pages/tempFile/index",
      //   text: "临时文件"
      // },
      // {
      //   pagePath: "pages/localFile/index",
      //   text: "本地文件"
      // },
      // {
      //   pagePath: "pages/messageFile/index",
      //   text: "会话文件"
      // },
      // {
      //   pagePath: "pages/drawing/index",
      //   text: "模型协同"
      // },
      {
        pagePath: "pages/login/index",
        text: "获取code"
      },
      {
        pagePath: "pages/officialMessage/index",
        text: "发送消息"
      },
      // {
      //   pagePath: "pages/officialAccount/index",
      //   text: "获取公众号用户OpenId"
      // },
    ]
  }
});
