<template>
  <Form ref="searchFrom" :model="search" :rules="rules" :label-width="80" inline>
    <FormItem label="Name" prop="search_name_like">
        <Input v-model="search.search_name_like" placeholder="Enter your name" />
    </FormItem>
    <FormItem label="RealName" prop="search_realName_like">
        <Input v-model="search.search_realName_like" placeholder="Enter your real name" />
    </FormItem>
    <FormItem>
        <Button type="primary" @click="handleSubmit">search</Button>
        <Button style="margin-left: 8px" @click="handleReset">reset</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'userSearch',
  data () {
    return {
      search: {},
      rules: {}
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.searchFrom.validate((valid) => {
        if (valid) {
          this.$emit('paramChange', this.search)
        } else {
          this.failHandler('Fail!')
        }
      })
    },
    handleReset () {
      for (let key in this.$refs) {
        this.$refs[key].resetFields && this.$refs[key].resetFields()
      }
    },
    failHandler (err) {
      setTimeout(() => {
        this.loading_ = false
        this.$nextTick(() => {
          this.loading_ = true
        })
      }, 200)
      this.$Message.error(err)
    }
  }
}
</script>
