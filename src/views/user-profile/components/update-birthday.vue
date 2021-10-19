<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="请选择生日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: '',
      currentDate: ''
    }
  },
  created () {
    this.setDates(this.value)
  },
  methods: {
    setDates (currentBirthday) {
      this.maxDate = new Date()
      if (currentBirthday) {
        const currentBirthdayArr = currentBirthday.split('-')
        // currentBirthdayArr里面的数组成员都是数字类型string。有时有这样的['2019','09', '02']。new Date()里面只能接收前面不带0的数字。把这些字符串进行一下运算，可以将其转换为对应的数字，并且把前面的0去掉
        this.currentDate = new Date(currentBirthdayArr[0], currentBirthdayArr[1] - 1, currentBirthdayArr[2] - 0)
      } else {
        this.currentDate = new Date()
      }
    },
    async onConfirm (date) {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止点击背景
        duration: 0 // 持续展示loading。toast提示成功/失败，都会关闭loading
      })

      const birthY = date.getFullYear()
      const birthM = (date.getMonth() + 1).toString().length === 1 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1) // 给1一位数的补零
      const birthD = date.getDate().toString().length === 1 ? ('0' + date.getDate()) : date.getDate() // 给1一位数的补零
      const currentBirthday = `${birthY}-${birthM}-${birthD}`

      try {
        if (currentBirthday === this.value) {
          this.$toast('生日没有变化')
          return
        }
        await updateUserProfile({
          birthday: currentBirthday
        })
        // 更新视图
        this.$emit('input', currentBirthday)
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
/deep/ .van-picker__confirm {
  color: #409dfa;
}
</style>
