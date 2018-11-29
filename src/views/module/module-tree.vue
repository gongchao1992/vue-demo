<template>
    <Tree :data="tree" :render="renderContent"></Tree>
</template>
<script>
import { toTree } from '@/libs/utils'
import treeRootHandler from './tree-root'
export default {
  name: 'moduleTree',
  data () {
    return {
      tree: treeRootHandler(this),
      subSystems: [],
      modules: [],
      buttonProps: {
        type: 'default',
        size: 'small'
      }
    }
  },
  mounted () {
    this.refreshTree()
  },
  methods: {
    refreshTree () {
      this.$api.GET('/base/dict/getModule', {}, resp => {
        this.subSystems = resp.subSystems
        this.modules = resp.modules
        let children = resp.subSystems.map(item => ({ expand: true, title: item.title, name: item.name, id: item.id }))
        let moduleTree = toTree(resp.modules)
        children.forEach(subSystem => {
          subSystem.children = []
          moduleTree.forEach(kid => {
            if (parseInt(kid.nodePath.split('_')[0]) === subSystem.id) {
              subSystem.children.push(kid)
            }
          })
        })
        console.log(moduleTree)
        this.$set(this.tree[0], 'children', children)
      }, err => this.$Message.error(err.msg))
    },
    renderContent (h, { root, node, data }) {
      return h('span', { style: { display: 'inline-block', width: '100%' } }
        , [
          h('span', [
            h('Icon', {
              props: { type: data.children && data.children.length > 0 ? 'ios-folder-outline' : 'ios-paper-outline' },
              style: { marginRight: '8px' }
            }),
            h('span', data.title || data.name)
          ]),

          h('span', { style: { display: 'inline-block', float: 'right', marginRight: '32px' } }
            , [
              data.nodePath && (!data.children || data.children.length === 0)
                ? h('Button', {
                  props: Object.assign({}, this.buttonProps, { icon: 'ios-remove' }),
                  style: { marginRight: '8px' },
                  on: { click: () => { this.remove(root, node, data) } }
                })
                : null,
              h('Button', {
                props: Object.assign({}, this.buttonProps, { icon: 'ios-add' }),
                on: { click: () => { this.append(root, node, data) } }
              })
            ])
        ])
    },
    append (root, node, data) {
      // const children = data.children || []
      // children.push({
      //   title: 'appended node',
      //   expand: true
      // })
      // this.$set(data, 'children', children)
      let form = { subSystem: {}, parent: {}, accessArr: [] }
      if (data.nodePath) {
        let subSystemId = parseInt(data.nodePath.split('_')[0])
        this.subSystems.forEach(item => {
          if (item.id === subSystemId) {
            form.subSystem = { id: item.id, name: item.name }
          }
        })
        form.parent = { id: data.id, name: data.name }
        form.nodePath = data.nodePath + '-' + data.id
      } else {
        form.subSystem = { id: data.id, name: data.name }
        form.nodePath = data.id
      }
      this.$emit('add', form)
    },
    remove (root, node, data) {
      // const parentKey = root.find(el => el === node).parent
      // const parent = root.find(el => el.nodeKey === parentKey).node
      // const index = parent.children.indexOf(data)
      // parent.children.splice(index, 1)
      this.$Message.success(data.title)
    }
  }
}
</script>
