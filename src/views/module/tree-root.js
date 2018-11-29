export default (that) => [
  {
    title: '根节点',
    expand: true,
    render: (h, { root, node, data }) => {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-folder-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          // h('Button', {
          //   props: Object.assign({}, that.buttonProps, {
          //     icon: 'ios-add',
          //     type: 'primary'
          //   }),
          //   style: {
          //     width: '64px'
          //   },
          //   on: {
          //     click: () => { that.append(data) }
          //   }
          // })
        ])
      ])
    },
    children: []
  }
]
