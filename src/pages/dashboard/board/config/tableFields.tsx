const countUnits: any = {
  0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
  6: '六', 7: '七', 8: '八', 9: '九', 10: '十', 11: '十一',
  12: '十二', 13: '十三'
}

export const tableList = [
  {
    title: '蜂场个数',
    key: 'swarmNum',
    render: (text: number) => {
      return `${countUnits[text] || text}个`;
    }
  },
  {
    title: '蜂友人数',
    key: 'friendNum',
  },
  {
    title: '自主注册人数',
    key: 'selfAddNum',
  },
  {
    title: '员工注册人数',
    key: 'staffAddNum',
  },
  {
    title: '登录用户人数',
    key: 'loginNum',
  },
]