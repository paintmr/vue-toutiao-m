<template>
  <div id="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="cross" @click="$router.back()"/>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onLogin">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="vuetoutiao vuetoutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="vuetoutiao vuetoutiao-yanzhengma"></i>
        <!-- 下面的template属于Field输入框中的插槽，在template的包裹下，插入按钮。 -->
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="60 * 1000"
            format="ss 秒后再次发送"
            @finish="isCountDownShow = false"
          />
          <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button，否则会触发表单提交。 -->
          <van-button v-else round size="small" type="default" class="send-sms-btn" @click="onSendSms" native-type="button">发验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, getSmsCode } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13912341234', // 手机号
        code: '246810' // 验证码
      },
      // 提交表单时会自动触发表单验证。如果验证通过，会触发submit/login事件。如果验证失败，不会触发submit/login。
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  methods: {
    async onLogin () {
      // 展示登录中 loading
      // 在组件中通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '登录中……',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示loading组件的时间，默认 2000毫秒,  0表示持续展示不关闭。同时，新toast调用时，会关闭老toast
      })
      // 请求登录
      try {
        const res = await login(this.user)
        this.$toast.success('登陆成功')
        // console.log(res)
        this.$store.commit('setUser', res.data.data)
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号码或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4 根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // 1 校验手机号
      try {
        // 如果不传参数mobile，this.$refs.loginForm.validate()验证的是整个表单
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2 验证通过，显示倒计时
      this.isCountDownShow = true

      // 3 请后台服务器给手机发送验证码
      try {
        await getSmsCode(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('请求太频繁，请稍后再试')
        } else {
          this.$toast('验证码发送失败，请稍后再试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.send-sms-btn {
  width: 152px;
  height: 46px;
  line-height: 46px;
  background-color: #ededed;
  font-size:22px;
  color: #666;
}

.login-btn-wrap {
  padding: 53px 33px;
  .login-btn{
    background-color: #6db4fb;
    border: none;
  }
}
</style>
