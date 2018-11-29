<style lang="less">
@import "./login.less";
</style>
<template>
  <div class="login">
    <img style="margin:150px 150px;" src="@/assets/images/logo.png">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import LoginForm from '_c/login-form'
export default {
  name: 'Login',
  components: {
    LoginForm
  },
  methods: {
    handleSubmit (user) {
      this.$api.POST('/base/login', user, result => {
        this.$Message.success('Success!')
        this.$store.commit('login', result)
        let redirect = decodeURIComponent(
          this.$route.query.redirect || '/home'
        )
        this.$router.push({ path: redirect })
      }
      , err => this.$Message.error(err.msg))
    }
  }
}
</script>
