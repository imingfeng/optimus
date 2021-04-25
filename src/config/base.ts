const base = {
  name: '追花族运营后台',
  prefix: 'robot',
  openPages: ['/login'],
  initPage: {
    showSizeChanger: true,
    showTotal: (total: number) => `共计 ${total} 条`,
    total: 0,
    pageSize: 10,
    ps: 10,
    pageNum: 1,
    current: 1,
    pn: 1,
  },
};

export default base;
