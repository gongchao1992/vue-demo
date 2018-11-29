<template>
  <Form ref="form" :model="form" :rules="rules" :label-width="80">
    <FormItem label="Name" prop="name">
        <Input v-model="form.name" placeholder="Enter name" />
    </FormItem>
    <FormItem label="Path" prop="path">
        <Input v-model="form.path" :readonly="readonly" placeholder="Enter path" />
    </FormItem>
    <FormItem label="OrderNum" prop="orderNum">
        <InputNumber :max="999" :min="1" :readonly="readonly" v-model="form.orderNum" />
    </FormItem>
    <FormItem label="Remark" prop="remark">
        <Input v-model="form.remark" :readonly="readonly"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'subSystemDetail',
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
      form: {},
      rules: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        path: [
          { required: true, message: 'The path cannot be empty', trigger: 'blur' }
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
