<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userInfo.userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="profile">修改信息</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    userInfo: {
      type: Object,
      default: () => { return { name: '管理员' } }
    }
  },
  methods: {
    logout () {
      this.$Modal.confirm({
        title: '你确定退出登陆吗？',
        onOk: () => {
          this.$router.push({ name: 'login' })
        }
      })
    },
    profile () {
      this.$router.push({
        name: 'user-profile'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'profile': this.profile()
          break
      }
    }
  }
}
</script>
<style lang="less">
@import './user.less';
</style>
