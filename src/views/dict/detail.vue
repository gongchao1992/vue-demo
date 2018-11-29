<template>
  <Form ref="form" :model="form" :rules="rules" :label-width="80">
    <FormItem label="类名" prop="clazz">
        <Input v-model="form.clazz" placeholder="Enter clazz" />
    </FormItem>
    <FormItem label="字段名" prop="field">
        <Input v-model="form.field" :readonly="readonly" placeholder="Enter field" />
    </FormItem>
    <FormItem label="键" prop="key">
        <Input v-model="form.key" :readonly="readonly" placeholder="Enter key" />
    </FormItem>
    <FormItem label="值" prop="value">
        <Input v-model="form.value" :readonly="readonly" placeholder="Enter value" />
    </FormItem>
    <FormItem label="排序" prop="orderNum">
        <!-- <Input v-model="form.orderNum" :readonly="readonly" placeholder="Enter orderNum" /> -->
        <InputNumber :max="999" :min="1" :readonly="readonly" v-model="form.orderNum" />
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'dictDetail',
  props: {
    queryUrl: {
      type: String
    },
    saveUrl: {
      type: String
    },
    queryID: {
      type: Number
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        clazz: '',
        field: '',
        key: '',
        value: '',
        orderNum: 0
      },
      rules: {
        clazz: [
          { required: true, message: 'The clazz cannot be empty', trigger: 'blur' }
        ],
        field: [
          { required: true, message: 'The field cannot be empty', trigger: 'blur' }
        ],
        key: [
          { required: true, message: 'The key cannot be empty', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'The value cannot be empty', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    queryID (value) {
      this.handleReset()
      this.form = {}
      if (value > 0) {
        this.$api.GET(this.queryUrl + value, null, resp => {
          this.form = resp.data
        }, err => {
          this.$Message.error(err.msg)
        })
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.POST(this.saveUrl, this.form, resp => {
            this.$Message.success(resp.msg)
            this.$emit('closeModal')
            this.$emit('search')
          }, err => {
            this.failHandler(err.msg)
          })
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
