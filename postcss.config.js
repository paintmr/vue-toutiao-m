module.exports = {
  // 配置要使用的postcss插件
  plugins: {
    // autoprefixer插件的配置
    // 作用：生成浏览器CSS样式规则前缀
    // VueCLI内部已经配置了autoprefixer插件，这里再配置，就重复了，系统会给warning。所以这里不用配置autoprefixer。
    // "autoprefixer": {
    //   // 配置要兼容的环境信息
    //   browsers: ["Android >= 4.0", "iOS >= 8"],
    // },
    // 配置使用postcss-pxtorem插件
    'postcss-pxtorem': {
      // 这个rootValue基于lib-flexible的REM适配方案：把一行分为10份，每份是十分之一。所以rootValue应该设置为设计稿宽度的十分之一。大多數設計稿以iPhone6為原型，寬度為750px。
      // 但vant建议设置为37.5，因为vant是基于375px宽度的设计稿写的。据此，使用设计稿时，要把设计稿的尺寸除以二。但这样的话，vant组件就会变得很小。
      // 需求：vant样式按照37.5来转换；如果是设计稿的样式，按照75来转换。
      // 解决方案： rootValues支持两种类型：
      // （1）数字：固定的数值
      // rootValue: 37.5,
      // （2）函数：可以动态处理返回。postcss-pxtorem处理每个css文件的时候都会来调用这个函数，它会把被处理的CSS文件相关的信息通过参数传递给该函数
      // 配置要转换的CSS属性。*表示所有。propList: ["height"]表示只把高的px转为rem。一般的需求都是所有的属性都要转，所以写作下面的代码：
      rootValue (obj) {
        // 上面的代码也可以写成
        // rootValue({ file }) {
        const { file } = obj
        // console.log(file)
        // 如果file中含有vant样式，则按照37.5的rootValue来处理，否则75
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*']
    }
  }
}
