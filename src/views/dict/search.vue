<template>
  <Form ref="searchFrom" :model="search" :rules="rules" :label-width="80" inline>
    <FormItem label="类名" prop="search_clazz_like">
        <Input v-model="search.search_clazz_like" placeholder="Enter clazz" />
    </FormItem>
    <FormItem label="字段名" prop="search_filed_like">
        <Input v-model="search.search_filed_like" placeholder="Enter field" />
    </FormItem>
    <FormItem label="键" prop="search_key_like">
        <Input v-model="search.search_key_like" placeholder="Enter key" />
    </FormItem>
    <FormItem label="值" prop="search_value_like">
        <Input v-model="search.search_value_like" placeholder="Enter value" />
    </FormItem>
    <FormItem>
        <Button type="primary" @click="handleSubmit">search</Button>
        <Button style="margin-left: 8px" @click="handleReset">reset</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'dictSearch',
  data () {
    return {
      search: {
        search_clazz_like: '',
        search_filed_like: '',
        search_key_like: '',
        search_value_like: ''
      },
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
