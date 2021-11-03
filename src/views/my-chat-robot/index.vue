<template>
  <div class="my-chat-robot">
    <van-nav-bar
      class="page-nav-bar page-nav-bar-position"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="chat-content-wrap">

      <!-- 一组消息 -->
      <div
        v-for="(chatInfoGroup, timeStamp, index) in chatInfoGroups"
        :key="index"
        class="chat-group"
      >
        <!-- 时间 -->
        <div v-if="chatInfoGroup.chatTime" class="chat-time">{{ chatInfoGroup.chatTime }}</div>

        <!-- 用户头像和信息 -->
        <div v-if="chatInfoGroup.inputText" class="user-info-wrap">
          <div class="text-panel">
            <span class="text">{{ chatInfoGroup.inputText }}</span>
          </div>
          <van-image
            round
            fit="cover"
            :src="avatar"
            class="avatar"
          />
        </div>

        <!-- 机器人头像和信息 -->
        <div v-if="chatInfoGroup.robotMsg" class="robot-info-wrap">
          <van-image
            round
            fit="cover"
            :src="robotAvatar"
            class="avatar"
          />
          <div class="text-panel">
            <span class="text">{{ chatInfoGroup.robotMsg }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="input-wrap">
      <input type="text" class="write-input" v-model="inputText" @keyup.enter='onInput'>
      <span class="send" @click="onInput">发送</span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { setItem, getItem, removeItem } from '@/utils/storage'
import robotAvatar from '@/assets/chat-robot.png'
import { getRobotResponse } from '@/api/chatrobot.js'

// import { io } from 'socket.io-client'
// const socket = io('http://localhost:3000/')

export default {
  name: 'MyChatRobot',
  data () {
    return {
      chatInfoGroups: {},
      inputText: '',
      avatar: '',
      robotAvatar,
      chatInfoGroup: {},
      responsing: true,
      timeStamp: ''
    }
  },
  created () {
    // 把头像地址保存在localstorage中，这样就算用户刷新页面，也不会修饰
    if (!getItem('AVATAR')) {
      setItem('AVATAR', this.$route.params.avatar)
    }
    this.avatar = getItem('AVATAR') ? getItem('AVATAR') : this.$route.params.avatar

    // 创建socket链接
    // socket的网址数据不对
    // const url = 'http://ttapi.research.itcast.cn/'
    // const url = 'http://toutiao-app.itheima.net/socket.io/'
    // const url = 'http://localhost:3000/'
    // this.socket = io(url, {
    //   query: {
    //     token: getItem('VUETOUTIAO_USER').token
    //   }
    // })
    // console.log(this.socket)
  },
  methods: {
    async onInput () {
      if (this.responsing && this.inputText) {
        this.responsing = false

        const intervalMin = parseInt((new Date().getTime() - this.timeStamp) / 1000 / 60)
        // const intervalMin = new Date((new Date().getTime() - this.timeStamp)).getMinutes()
        if (intervalMin >= 1) {
          this.chatInfoGroup.chatTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        this.timeStamp = new Date().getTime()

        this.chatInfoGroup.inputText = this.inputText

        this.chatInfoGroups[this.timeStamp] = this.chatInfoGroup

        // 获取机器人的回应
        // 我自己写的一个简单的后台返回的数据
        // socket.emit('chat message', this.inputText)
        // this.inputText = ''
        // socket.on('chat message', respMsg => {
        //   this.chatInfoGroup.robotMsg = respMsg
        // })

        const { data } = await getRobotResponse(this.inputText)
        this.inputText = ''
        this.chatInfoGroups[this.timeStamp].robotMsg = data.data.info.text

        // 把时间，用户信息，机器人回复都存到了this.chatInfoGroup后，把它push进this.chatInfoGroups
        this.chatInfoGroup = {}
        this.scrollToBottom() // 把滚动条拉到最底端
        this.responsing = true
      }
    },
    scrollToBottom () {
      const dom = document.querySelector('.chat-content-wrap')
      this.$nextTick(() => {
        dom.scrollTop = dom.scrollHeight
      })
    }
  },
  beforeDestroy () {
    // 用户离开页面时，把localstorage里的avatar值销毁
    removeItem('AVATAR')
  }
}
</script>

<style scoped lang="less">
.my-chat-robot {
  position: relative;
  // padding: 92px 0 125px 0;
  background-color: #fff;
  height: 1334px;
  box-sizing: border-box;
  overflow-y: scroll;

  .page-nav-bar-position {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
  }

  .chat-content-wrap {
    margin-top: 20px;
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 125px;
    overflow-y: scroll;

    .chat-group {
      margin-bottom: 50px;

      .chat-time {
        text-align: center;
        font-size: 30px;
        color: #cacaca;
      }

      .user-info-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin: 30px 0;
      }

      .text-panel {
          position: relative;
          margin-right: 30px;
          padding: 0 20px;
          min-height: 75px;
          max-width: 480px;
          line-height: 70px;
          background-color: #e0effb;
          border-radius: 10px;
          .text{
            display:inline-block; // 实现换行效果
            word-wrap: break-word; // 让数字和字母换行
            font-size: 30px;
            max-width: 480px; // 规定最大宽度，可以让连续无空格的数字字母自动换行
          }
          &::before{
            content: "";
            position: absolute;
            right: -30px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            line-height: 0;
            font-size: 0;
            border: 15px solid transparent;
            border-left-color: #e0effb;
          }
        }

      .avatar{
        width: 132px;
        height: 132px;
        margin-right: 23px;
        border: 5px solid #fff;
      }
      // 上面的text-panel和avatar是user-info-wrap和robot-info-wrap公用的。robot-info-wrap 只要改动部分代码
      .robot-info-wrap {
        display: flex;
        align-items: center;
        padding-left: 20px;
        .text-panel {
          &::before {
            left: -30px;
            border-left-color: transparent;
            border-right-color: #e0effb;
          }
        }
      }
    }
  }

  .input-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 92px;
    line-height: 92px;
    padding: 13px 33px;
    background-color: #f4f5f6;
    font-size: 30px;
    .write-input {
      border: 1px solid #e8e8e8;
      margin-right: 35px;
      width: 565px;
      height: 65px;
      border-radius: 60px;
      padding: 0 25px;
      box-sizing: border-box;
      color: #999;
    }
    .send {
      padding: 0;
      margin: 0;
      color: #cacaca;
    }
  }
}
</style>
