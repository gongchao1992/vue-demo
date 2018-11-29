<template>
  <div>
      <Collapse >
      <Panel name="1">
          操作
          <p slot="content">
            <Button type="primary" @click="add">添加</Button>
            <Button type="error" style="margin-left: 8px" @click="del">删除</Button>
          </p>
      </Panel>
      <Panel name="2">
          查询
          <p slot="content">
             <Search  @paramChange="paramChange" />
          </p>
      </Panel>
  </Collapse>
    <common-list ref="list" :page="page" :columns="columns" @pindexChange="pindexChange" @pcountChange="pcountChange"/>
    <Modal :value.sync="modal.value"
        :title="modal.title"
        :loading="modal.loading"
        :mask-closable="false"
        :styles="{top: '20px'}"
        @on-cancel="cancel">

          <detail ref="detail"
            :readonly="detailReadonly"
            :queryID="queryID"
            :queryUrl="queryUrl"
            :saveUrl="saveUrl"
            @closeModal="cancel"
            @search="search"/>

        <p slot="footer" >
          <Button @click="cancel">{{this.modal.cancelText}}</Button>
          <Button v-if="this.modal.okText" type="primary" @click="asyncOK">{{this.modal.okText}}</Button>
        </p>
    </Modal>
   </div>
</template>
<script>
import CommonList from '_c/common-list'
import columnsHandler from './columns'
import Detail from './detail.vue'
import Search from './search.vue'

export default {
  name: 'userList',
  components: { CommonList, Detail, Search },
  data () {
    return {
      pageUrl: '/base/user/list',
      delUrl: '/base/user/del',
      saveUrl: '/base/user/save',
      queryUrl: '/base/user/get/',
      queryID: -1,
      detailReadonly: false,
      param: {},
      columns: columnsHandler(this),
      page: { number: 0, size: 10, totalElements: 0, content: [] },
      modal: { value: false, title: '', loading: true, okText: '确定', cancelText: '取消' }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      this.$api.GET(this.pageUrl,
        { pindex: this.page.number, pcount: this.page.size, ...this.param },
        result => {
          this.page = result.page
        }
      )
    },
    paramChange (param) {
      this.param = param
      this.page.number = 0
      this.search()
    },
    pindexChange (pindex) {
      this.page.number = pindex
      this.search()
    },
    pcountChange (pcount) {
      this.page.size = pcount
      this.search()
    },
    add () {
      this.queryID = 0
      this.detailReadonly = false
      this.modal = { value: true, title: '添加', loading: true, okText: '添加', cancelText: '取消' }
    },
    del () {
      let ids = [...this.$refs.list.getSelection().map(item => item.id)]
      if (ids.length === 0) {
        this.$Message.error('你还没有任何选择数据！')
        return
      }
      this.$Modal.confirm({
        title: '你确定删除吗？',
        onOk: () => {
          this.$api.DELETE(this.delUrl, ids,
            resp => {
              this.$Message.success(resp.msg)
              this.search()
            },
            err => {
              this.$Message.error(err.msg)
            })
        }
      })
    },
    view (id) {
      this.queryID = id
      this.detailReadonly = true
      this.modal = { value: true, title: '查看', loading: true, cancelText: '取消' }
    },
    edit (id) {
      this.queryID = id
      this.detailReadonly = false
      this.modal = { value: true, title: '编辑', loading: true, okText: '保存', cancelText: '取消' }
    },
    asyncOK () {
      if (!this.queryID) {
        this.queryID = -1
      }
      this.$refs.detail.handleSubmit()
    },
    cancel () {
      this.closeModal()
    },
    closeModal () {
      this.modal.value = false
    }
  }
}
</script>
