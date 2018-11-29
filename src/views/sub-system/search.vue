<template>
  <Form ref="searchFrom" :model="search" :rules="rules" :label-width="80" inline>
    <FormItem label="Name" prop="search_name_like">
        <Input v-model="search.search_name_like" placeholder="Enter name" />
    </FormItem>
    <FormItem label="path" prop="search_path_like">
        <Input v-model="search.search_path_like" placeholder="Enter path" />
    </FormItem>
    <FormItem>
        <Button type="primary" @click="handleSubmit">search</Button>
        <Button style="margin-left: 8px" @click="handleReset">reset</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'subSystemSearch',
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
