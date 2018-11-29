<template>
    <div>
      <Table ref="table" :columns="columns" :data="page.content" stripe ></Table>
      <div style="margin: 10px;overflow: hidden">
          <div style="float: right; margin: 4px; line-height: 24px;">
            <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
          </div>
          <Page style="float: right;" transfer prev-text="上一页" next-text="下一页"
              :total="page.totalElements" :current.sync="page.number+1" show-total show-sizer show-elevator
              @on-change="pindexChangeHandler" @on-page-size-change="pcountChangeHandler">
          </Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'CommonList',
  props: {
    columns: {
      type: Array
    },
    page: {
      type: Object,
      default: () => ({ totalElements: 0, number: 1, size: 10, content: [] })
    }
  },
  methods: {
    goElevatorPage () {
      let evtObj = null
      let elevatorDiv = this.$el.getElementsByClassName(
        'ivu-page-options-elevator'
      )
      if (elevatorDiv && elevatorDiv.length > 0) {
        let pageInput = elevatorDiv[0].getElementsByTagName('input')[0]
        if (window.KeyEvent) {
          // firefox 浏览器下模拟事件
          evtObj = document.createEvent('KeyEvents')
          evtObj.initKeyEvent('keyup', true, true, window, true,
            false, false, false, 13, 0)
        } else {
          // chrome 浏览器下模拟事件
          evtObj = document.createEvent('UIEvents')
          evtObj.initUIEvent('keyup', true, true, window, 1)
          delete evtObj.keyCode
          if (typeof evtObj.keyCode === 'undefined') {
            // 为了模拟keycode
            Object.defineProperty(evtObj, 'keyCode', { value: 13 })
          } else {
            evtObj.key = String.fromCharCode(13)
          }
        }
        pageInput.dispatchEvent(evtObj)
      }
    },
    pindexChangeHandler (pindex) {
      this.$emit('pindexChange', pindex - 1)
    },
    pcountChangeHandler (pcount) {
      this.$emit('pcountChange', pcount)
    },
    getSelection () {
      return this.$refs.table.getSelection()
    }

  }
}
</script>
