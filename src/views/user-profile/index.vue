<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 隐藏的文件选择器。用于选择头像，但由于样式不好看，所以隐藏起来，用点击van-cell头像来触发其功能。 -->
    <input
      type="file"
      hidden
      ref="file"
      @change="onfileChange"
    >

    <!-- 个人信息 -->
    <van-cell
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image
        class="avatar"
        fit="cover"
        :src="user.photo"
        round
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!-- 编辑昵称弹出层 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- /编辑昵称弹出层 -->

    <!-- 编辑性别弹出层 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- /编辑性别弹出层 -->

    <!-- 编辑生日弹出层 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- /编辑生日弹出层 -->

    <!-- 编辑头像弹出层 -->
    <van-popup
      v-model="isUpdateAvatarShow"
      position="bottom"
      style="height: 100%"
    >
      <update-avatar
        v-if="isUpdateAvatarShow"
        @close="isUpdateAvatarShow = false"
        v-model="user.photo"
        :img = "img"
        @update-avatar="user.photo=$event"
      />
    </van-popup>
    <!-- /编辑头像弹出层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdateAvatar from './components/update-avatar'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdateAvatar
  },
  data () {
    return {
      user: {}, // 用户的个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdateAvatarShow: false,
      img: '' // 预览用户选择的头像
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast.fail('获取用户信息失败')
      }
    },
    onfileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片的弹出层
      this.isUpdateAvatarShow = true
      // file-input如果这次和上次选的是同一个文件，不会触发change事件
      // 解决方案：每次使用完毕，把value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
}
.van-popup {
  background-color: #f5f7f9;
}
</style>
