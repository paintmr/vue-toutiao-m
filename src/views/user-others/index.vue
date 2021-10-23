<template>
  <div class="other-users">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      :title="user.name"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 用户信息 -->
    <div class="user-info-wrap">
      <div class="user-info-first-line">
        <van-image
          round
          fit="cover"
          class="avatar"
          :src="user.photo"
        />
        <div class="user-info">
          <div class="user-info-items">
            <div class="user-info-item">
              <span class="user-info-number">{{ user.art_count }}</span>
              <span class="user-info-text">发布</span>
            </div>
            <div class="user-info-item">
              <span class="user-info-number">{{ user.follow_count }}</span>
              <span class="user-info-text">关注</span>
            </div>
            <div class="user-info-item">
              <span class="user-info-number">{{ user.fans_count }}</span>
              <span class="user-info-text">粉丝</span>
            </div>
            <div class="user-info-item">
              <span class="user-info-number">{{ user.like_count }}</span>
              <span class="user-info-text">获赞</span>
            </div>
          </div>
          <div class="btn-wrap">
            <!-- <van-button
              class="follow-btn"
              @click="follow"
            >关注</van-button> -->
            <follow-user
              v-model="user.is_following"
              class="follow-btn"
              :user-id="user.id"
            />
          </div>
        </div>
      </div>

      <div class="user-labels-wrap">
        <div class="user-label">
          <span class="user-label-l">简介：</span>
          <span class="user-label-r">{{ user.certi }}</span>
        </div>
      </div>
    </div>
    <!-- /用户信息 -->

    <!-- 用户文章列表 -->
    <!-- /用户文章列表 -->
  </div>
</template>

<script>
import { getUserById } from '@/api/user'
import FollowUser from '@/components/follow-user'

export default {
  name: 'OtherUsers',
  components: {
    FollowUser
  },
  data () {
    return {
      user: {} // 用户信息
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    async loadUser () {
      const userId = this.$route.params.userId.toString()
      console.log(userId)
      try {
        const { data } = await getUserById(userId)
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast.fail('获取用户数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-info-wrap{
  .user-info-first-line {
    display: flex;
    margin-bottom: 10px;
    padding: 25px 32px;
    background-color: #fff;
    .avatar {
      width: 155px;
      height: 155px;
      margin-right: 62px;
  }
    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .user-info-items {
        display: flex;
        justify-content: space-between;
        .user-info-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .user-info-number {
            font-size: 26px;
            color: #0d0a10;
          }
          .user-info-text {
            font-size: 21px;
            color: #9c9b9d;
          }
        }
      }
      .btn-wrap {
        text-align: center;
        .follow-btn {
          width: 289px;
          height: 55px;
          line-height: 55px;
          background-color: #6bb5ff;
          color: #fff;
          border: none;
        }
      }
    }
  }

  .user-labels-wrap {
    background-color: #fff;
    padding: 25px 32px;
    font-size: 25px;
    .user-label{
      margin-bottom: 10px;
      .user-label-l {
        color: #646263;
      }
      .user-label-r {
        color: #212121;
      }
    }
  }
}
</style>
