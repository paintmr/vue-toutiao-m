<template>
  <div class="channel-eidt">
    <!-- 我的频道 -->
    <van-cell :border="false" class="my-channel-wrap">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item v-for="(channel, index) in myChannels" :key="channel.id" class="grid-item" @click="onMyChannelClick(channel, index)">
        <van-icon v-show="isEdit && !fixedChannels.includes(channel.id)" slot="icon" name="clear"></van-icon>
        <!-- v-bind: class语法。一个对象，对象中的key表示要作用的css类名。对象中的value表示要计算出布尔值。true则用该类名，false则不用该类名 -->
        <span class="text" :class="{ active: index === active}"  slot="text">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" class="grid-item" icon="plus" @click="onAddChannel(channel)" />
    </van-grid>
    <!-- /频道推荐 -->

  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示或隐藏
      fixedChannels: [0] // 固定频道，不允许用户删除
    }
  },
  computed: {
    ...mapState(['user']),
    // computed会监测data的变化，实时返回新的数据
    // recommendChannels () {
    //   const recommendChannels = []
    //   this.allChannels.forEach(channel => {
    //     // find()遍历数组，找到满足条件的元素项
    //     const result = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     // 如果myChannels中不包括该channel，则收集到recommendChannels中
    //     if (!result) {
    //       recommendChannels.push(channel)
    //     }
    //   })
    //   // allChannels中不包含“推荐”频道，计算式recommendChannels=allChannels-myChannels要把“推荐”频道排除在外。
    //   return recommendChannels
    // }
    // recommendChannels()可以简化写成下面的代码
    // filter()遍历数组，把符合条件的元素存储到新数组。filter根据return的是true还是false决定是否把元素放到新数组中。
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 1 已登录，把数据存储到服务器
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length // 频道序号
          })
        } catch (err) {
          this.$toast('添加频道失败')
        }
      } else {
      // 2 未登录，把数据存储到本地
        setItem('VUETOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1 如果是固定频道，则不删除
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        // 2 编辑状态，删除频道
        // splice()接收2个参数：参数1是待删除的元素的开始索引；参数2是删除的个数，如果不指定，则从参数1开始一直删除到最后
        this.myChannels.splice(index, 1)
        // 3 如果删除的是选中频道之前的和选中频道本身，更新选中频道项
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        // 4 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，切换频道
        // 子组件给父组件发送事件
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('VUETOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除频道失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-eidt {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color:#333;
  }

  .van-cell__value {
    display: flex;
    flex-direction:row-reverse;
    .edit-btn {
      width: 104px;
      height: 48px;
      font-size:26px;
      color: #f85959;
      border: 1px solid #f85959;
    }
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: #f85959;
      }
      // 修改了“我的频道”中的关闭标签，把这个标签从van-grid-item的icon属性变成了插槽van-icon。导致.van-icon-clear 这个类多了上级.van-grid-item__icon-wrapper（该类有position:relative的定位，从而导致以前设置的.van-icon-clear类的定位不准了。现在只要把.van-grid-item__icon-wrapper的定位去掉即可。
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

 /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;;
        }
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2
      }
    }
  }
}
</style>
