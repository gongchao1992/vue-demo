export default (that) => (
  [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: '名称',
      key: 'name'
    },
    {
      title: '路径',
      key: 'path'
    },
    {
      title: '标题',
      key: 'title'
    },
    // {
    //   title: '标题头隐藏',
    //   key: 'hideInBreadd',
    //   render: (h, params) => {
    //     return h('p', params.row.hideInBreadd ? '是' : '否')
    //   }
    // },
    // {
    //   title: '目录隐藏',
    //   key: 'hideInMenu',
    //   render: (h, params) => {
    //     return h('p', params.row.hideInMenu ? '是' : '否')
    //   }
    // },
    // {
    //   title: '页面缓存',
    //   key: 'notCache',
    //   render: (h, params) => {
    //     return h('p', !params.row.notCache ? '是' : '否')
    //   }
    // },
    // {
    //   title: '权限路由',
    //   key: 'access'
    // },
    // {
    //   title: 'Icon',
    //   key: 'icon'
    // },
    // {
    //   title: '关闭确认',
    //   key: 'closeConfirm',
    //   render: (h, params) => {
    //     return h('p', !params.row.closeConfirm ? '是' : '否')
    //   }
    // },
    // {
    //   title: '排序',
    //   key: 'orderNum',
    //   sortable: true
    // },
    {
      title: '上级模块',
      key: 'parent.name',
      render: (h, params) => {
        return h('p', params.row.parent && params.row.parent.name)
      },
      filters: [
        {
          label: '父级模块',
          value: true
        },
        {
          label: '子级模块',
          value: false
        }
      ],
      filterMultiple: false,
      filterMethod (value, row) {
        if (value) {
          return !row.parent
        } else {
          return row.parent
        }
      }
    },
    {
      title: '子系统',
      key: 'subSystem.name',
      render: (h, params) => {
        return h('p', params.row.subSystem.name)
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: { type: 'info', size: 'small' },
            style: { marginRight: '5px' },
            on: { click: () => that.view(params.row.id) }
          }, '查看'),
          h('Button', {
            props: { type: 'primary', size: 'small' },
            style: { marginRight: '5px' },
            on: { click: () => that.edit(params.row.id) }
          }, '编辑')
        ])
      }
    }
  ]
)
