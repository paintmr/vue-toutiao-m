<template>
  <div class="update-avatar">
    <img :src="img" alt="avatar" ref="img">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserAvatar } from '@/api/user'

export default {
  name: 'UpdateAvatar',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    onConfirm () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })

      // 下面这种方法是错误的,值传不到服务器，因为Content-Type要求是multipart/form-data，而传递的却是一个普通的JS对象{photo: blob}。
      // this.cropper.getCroppedCanvas().toBlob((blob) => {
      //   await updateUserAvatar ({
      //     photo: blob
      //   })
      // })

      try {
        // 如果 Content-Type要求是application/json，则 data 传普通JS对象 {}
        // 如果 Content-Type要求是multipart/form-data，则data传FormData对象
        // 大多数的接口要求Content-Type是application/json
        // 一般文件上传的数据接口才要求Content-Type是multipart/form-data
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
          // 下面的把blob编程FormData。其中'photo'是服务器要求的字段
          const formData = new FormData()
          formData.append('photo', blob)
          const { data } = await updateUserAvatar(formData)
          // 关闭弹出层
          this.$emit('close')
          // 更新视图
          this.$emit('update-avatar', data.data.photo)
          // 提示更新头像成功
          this.$toast.success('头像更新成功')
        })
      } catch (err) {
        this.$toast.fail('头像更新失败，请重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-avatar {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    display: flex;
    justify-content: space-between;
    left: 0;
    right: 0;
    bottom: 0;
    .cancel, .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
  img {
    display:block;
    max-width: 100%;
  }
}
</style>
