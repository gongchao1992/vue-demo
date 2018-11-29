<template>
  <Form ref="form" :model="form" :rules="rules" :label-width="90">

    <FormItem label="子系统" prop="subSystem">
      <Input v-model="form.subSystem.name" disabled />
      <Input v-show="false" :value="form.subSystem.id" readonly />
    </FormItem>
    <FormItem label="上级模块" prop="parent" >
      <Input v-model="form.parent.name" disabled />
      <Input v-show="false" :value="form.parent.id" readonly />
    </FormItem>
    <FormItem label="名称" prop="name">
      <Input v-model="form.name" :readonly="readonly" placeholder="Enter name"/>
    </FormItem>
    <FormItem label="路径" prop="path">
      <Input v-model="form.path" :readonly="readonly" placeholder="Enter path"/>
    </FormItem>

    <FormItem label="标题" prop="title">
      <Input v-model="form.title" :readonly="readonly" placeholder="Enter title"/>
    </FormItem>

    <FormItem label="标题头隐藏" prop="hideInBreadd">
      <RadioGroup v-model="form.hideInBreadd">
        <Radio label="1" :disabled="readonly">是</Radio>
        <Radio label="0" :disabled="readonly">否</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="目录隐藏" prop="hideInMenu">
      <RadioGroup v-model="form.hideInMenu">
        <Radio label="1" :disabled="readonly">是</Radio>
        <Radio label="0" :disabled="readonly">否</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="页面缓存" prop="notCache">
      <RadioGroup v-model="form.notCache">
        <Radio label="0" :disabled="readonly">是</Radio>
        <Radio label="1" :disabled="readonly">否</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="关闭提示" prop="closeConfirm">
      <RadioGroup v-model="form.closeConfirm">
        <Radio label="1" :disabled="readonly">是</Radio>
        <Radio label="0" :disabled="readonly">否</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="权限路由" prop="access">
      <Input v-model="form.access" :readonly="readonly" placeholder="Enter access"/>
    </FormItem>
    <FormItem
      v-for="(item, index) in form.accessArr"
      v-if="item.status"
      :key="index"
      :label="'权限路由' + index"
      :prop="'accessArr.' + index + '.value'"
      :rules="{required: true, message: '权限路由 ' + index +' can not be empty', trigger: 'blur'}"
    >
      <Row>
        <Col span="18">
          <Input type="text" v-model="item.value" placeholder="Enter access"/>
        </Col>
        <Col span="4" offset="1">
          <Button :disabled="readonly" @click="handleRemove(index)">删除</Button>
        </Col>
      </Row>
    </FormItem>
    <FormItem>
      <Row>
        <Col span="12">
          <Button type="dashed" :disabled="readonly" long @click="handleAdd" icon="md-add">添加</Button>
        </Col>
      </Row>
    </FormItem>

    <FormItem label="Icon" prop="icon">
      <Input v-model="form.icon" :readonly="readonly" placeholder="Enter icon"/>
    </FormItem>

    <FormItem label="排序" prop="orderNum">
      <InputNumber :max="999" :min="1" :readonly="readonly" v-model="form.orderNum"/>
    </FormItem>
    <FormItem label="Remark" prop="remark">
      <Input
        v-model="form.remark"
        :readonly="readonly"
        type="textarea"
        :autosize="{minRows: 2,maxRows: 5}"
        placeholder="Enter something..."
      />
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'moduleDetail',
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
    },
    detailForm: {
      type: Object,
      default: () => ({ accessArr: [], subSystem: {}, parent: {} })
    }
  },
  data () {
    return {
      form: this.detailForm,
      rules: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        path: [
          { required: true, message: 'The path cannot be empty', trigger: 'blur' }
        ],
        access: [
          { required: true, message: 'The access cannot be empty', trigger: 'blur' }
        ],
        hideInBreadd: [
          { required: true, message: 'The hideInBreadd cannot be empty', trigger: 'change' }
        ],
        hideInMenu: [
          { required: true, message: 'The hideInMenu cannot be empty', trigger: 'change' }
        ],
        notCache: [
          { required: true, message: 'The notCache cannot be empty', trigger: 'change' }
        ],
        closeConfirm: [
          { required: true, message: 'The closeConfirm cannot be empty', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    queryID (value) {
      this.handleReset()
      this.form = this.detailForm
      if (value > 0) {
        this.$api.GET(this.queryUrl + value, null, resp => {
          let arr = resp.data.access.split(',')
          resp.data.access = arr.shift()
          resp.data.accessArr = arr.map(item => ({ status: 1, value: item }))
          if (!resp.data.parent) {
            resp.data.parent = {}
          }
          this.form = resp.data
        }, err => {
          this.$Message.error(err.msg)
        })
      }
    }
  },
  methods: {
    handleAdd () {
      this.form.accessArr.push({
        value: '',
        status: 1
      })
    },
    handleRemove (index) {
      this.form.accessArr[index].status = 0
    },
    handleSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let access = [{ status: 1, value: this.form.access }, ...this.form.accessArr]
          let form = { ...this.form }
          form.access = access.filter(item => item.status !== 0).map(item => item.value).join(',')
          delete form.accessArr
          if (form.parent.id) {
            form.parent = { id: form.parent.id }
          } else {
            delete form.parent
          }
          this.$api.POST(this.saveUrl, form, resp => {
            this.$Message.success(resp.msg)
            this.$emit('closeModal')
            this.$emit('search')
            this.$emit('refreshTree')
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
