import VXETable from 'vxe-table'
// vxeTable 全局配置
VXETable.setup({
  // 表格配置
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
  // 工具条配置
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
  // 分页配置
  pager: {
    border: true,
    size: 'medium'
  },
  // 弹窗
  modal: {
    showFooter: true,
    // showZoom: true,
    resize: true,
    remember: true,
    position: { top: '9%', left: '35%' },
    // transfer: true,
    escClosable: true
  }
})
