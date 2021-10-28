<template>
  <div class="update-gender">
    <van-picker
      title="编辑性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      :default-index="this.value"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女']
    }
  },
  methods: {
    async onConfirm (value, index) { // 第一个参数必须写（即便用不到），否则如果只写index，这个index会变成value
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止点击背景
        duration: 0 // 持续展示loading。toast提示成功/失败，都会关闭loading
      })
      try {
        if (index === this.value) {
          this.$toast('性别没有变化')
          return
        }
        await updateUserProfile({
          gender: index
        })
        // 更新视图
        this.$emit('input', index)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
