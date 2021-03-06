export default (that) => (
  [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Path',
      key: 'path'
    },
    {
      title: 'OrderNum',
      key: 'orderNum'
    },
    {
      title: 'Remark',
      key: 'remark'
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
