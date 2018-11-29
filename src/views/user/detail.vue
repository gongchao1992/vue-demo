<template>
  <Form ref="form" :model="form" :rules="rules" :label-width="80">
    <FormItem label="Name" prop="name">
        <Input v-model="form.name" :readonly="queryID>0" placeholder="Enter your name" />
    </FormItem>
    <FormItem label="RealName" prop="realName">
        <Input v-model="form.realName" :readonly="readonly" placeholder="Enter your real name" />
    </FormItem>
    <FormItem label="status" prop="status" >
        <RadioGroup v-model="form.status">
            <Radio label="1" :disabled="readonly">有效</Radio>
            <Radio label="0" :disabled="readonly">无效</Radio>
        </RadioGroup>
    </FormItem>
    <FormItem label="Remark" prop="remark">
        <Input v-model="form.remark" :readonly="readonly"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'userDetail',
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
        name: '',
        realName: '',
        state: 0,
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: 'The realName cannot be empty', trigger: 'blur' }
        ],
        status: [
          { required: true, message: 'Please select state', trigger: 'change' }
        ],
        remark: [
          { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
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
