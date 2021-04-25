// 省市区（县）转换为 层级 和 { key: '中文' }，用于map数据更新
import mapOriginal from './mapOriginal'

let mapArr: any = []
let province: any = {}
let countyArr: any = []
let mapList = mapOriginal.RECORDS

let mapKey: any = {}

let handleCounty = (pid: string, list: any) => {
  let children: any = []
  list.map(({ id, full_name, parent_id }: any) => {
    if (parent_id === pid) {
      children.push({
        id,
        label: full_name,
        value: id,
      })
    }
  })
  return children
}

mapList.map((item: any) => {
  let { id, full_name, parent_id } = item
  let valueParams = {
    id,
    label: full_name,
    value: id,
    children: [],
  }

  if (parent_id === '0') { // 省
    province[id] = valueParams
  } else if (province[parent_id]) { // 市
    province[parent_id]['children'].push(valueParams)
  } else {
    countyArr.push(item)
  }

  mapKey[id] = full_name
})
Object.keys(province).map((key: string) => {
  let item = province[key]
  item.children.map((cityItem: any) => {
    cityItem['children'] = handleCounty(cityItem.id, countyArr)
  })
  mapArr.push(item)
})

export default {
  mapArr,
  mapKey,
}