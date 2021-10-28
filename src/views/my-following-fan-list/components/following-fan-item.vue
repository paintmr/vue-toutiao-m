<template>
  <van-cell>
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="user.photo"
      @click="toUserInfo"
    />
    <div class="text-wrap" @click="toUserInfo">
      <span>{{ user.name }}</span>
      <span>粉丝数：{{ user.fans_count }}</span>
    </div>
    <van-button v-if="user.mutual_follow" slot="extra" @click="onFollow('互相关注')" :loading="loading">互相关注</van-button>
    <van-button v-else-if="tabIndex===0" slot="extra" type="info" class="following" @click="onFollow('已关注')" :loading="loading">已关注</van-button>
    <van-button v-else-if="tabIndex===1" slot="extra" type="info" class="follow" @click="onFollow('关注')" :loading="loading">关注</van-button>
  </van-cell>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
import { setItem } from '@/utils/storage'

export default {
  name: 'FollowingFanItem',
  data () {
    return {
      loading: false
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    tabIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    // 点击相互关注、已关注，取关；点击关注，关注。
    async onFollow (flag) {
      this.loading = true // 展示关注按钮的loading状态
      try {
        if (flag === '关注') {
          await addFollow(this.user.id.toString())
          // 该用户变成了mutual_follow
          this.$emit('update-mutual_follow', true)
          // 该用户的fans_count+1
          this.user.fans_count++
          this.$emit('update-fans_count', this.user.fans_count)
          // 我的关注列表用户+1，通知following-list重新获取关注列表数据。但following-list是目前这个item的父组件的兄弟组件，这个item没法直接通知following-list。只能借用localstorage存一个更新的标记，等用户点击following-list的tab时，follow-fan-list这个祖父组件去通知following-list这个父组件。
          setItem('update-following-list', true)
        } else {
          await deleteFollow(this.user.id.toString())

          // 取消专注有3种情况：
          if (this.tabIndex === 1) {
            // 1 粉丝页面点击互相关注取关
            // 该用户变成了非mutual_follow
            this.$emit('update-mutual_follow', false)
            // 该用户的fans_count-1
            this.user.fans_count--
            // 我的关注列表用户-1
            setItem('update-following-list', true)
          } else if (this.tabIndex === 0) {
            if (flag === '互相关注') {
              // 2 关注页面点击互相关注取关
              // 通过父组件通知祖组件更新following-list(通过改变following-list的key值)
              this.$emit('update-following-list')
              // 往localstorage存更新fan-list的标记。点击fan-list的tab时更新fan-list
              setItem('update-fan-list', true)
            } else if (flag === '已关注') {
              // 3 关注页面点击已关注取关
              // 通过父组件通知祖组件更新following-list(通过改变following-list的key值)
              this.$emit('update-following-list')
            }
          }
        }
      } catch (err) {
        this.$toast.fail('操作失败，请重试：', err)
      }
      this.loading = false // 关闭关注按钮的loading状态
    },
    toUserInfo () {
      this.$router.push({ name: 'user-others', params: { userId: this.user.id, tabIndex: this.tabIndex } })
    }
  }
}
</script>

<style scoped lang="less">
.van-cell {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .avatar {
    width: 100px;
    height: 100px;
    margin-right: 25px;
  }
  .text-wrap {
    display: flex;
    flex-direction: column;
  }
  .van-button {
    border-radius: 10px;
  }
  .following {
    background-color: #3296fa;
    border-color: #3296fa
  }
  .follow {
    background-color: #f85959;
    border-color: #f85959;
  }
}
</style>
