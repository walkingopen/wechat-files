export default defineAppConfig({
  pages: [
    "pages/tempFile/index",
    "pages/localFile/index",
    "pages/messageFile/index",
    "pages/drawing/index",
    "pages/drawing/drawing2image",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    list: [
      {
        pagePath: "pages/tempFile/index",
        text: "临时文件"
      },
      {
        pagePath: "pages/localFile/index",
        text: "本地文件"
      },
      {
        pagePath: "pages/messageFile/index",
        text: "会话文件"
      },
      {
        pagePath: "pages/drawing/index",
        text: "模型协同"
      },
    ]
  }
});
