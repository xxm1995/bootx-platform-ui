import VXETable from 'vxe-table'
// vxeTable 全局配置
VXETable.setup({
  table: {
    resizable: true,
    border: true,
    stripe: true,
    showOverflow: true,
    showHeaderOverflow: true,
    size: 'medium',
    tooltipConfig: {
      enterable: true
    }
  },
  toolbar: {
    size: null,
    import: {
      mode: 'covering'
    },
    export: {
      types: ['csv', 'html', 'xml', 'txt']
    },
    custom: true,
    buttons: [],
    tools: []
  },
  pager: {
    border: true,
    size: 'medium'
  }
})
