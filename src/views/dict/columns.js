export default (that) => (
  [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: '类名',
      key: 'clazz'
    },
    {
      title: '字段名',
      key: 'field'
    },
    {
      title: '键',
      key: 'key'
    },
    {
      title: '值',
      key: 'value',
      tooltip: true,
      sortable: true
    },
    {
      title: '排序',
      key: 'orderNum',
      sortable: true
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
