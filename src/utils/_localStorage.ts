export function set (options: any) {

  for(let p in options) {
    localStorage.setItem(p, options[p])
  }
}

export function get (params: any) {
  return localStorage.getItem(params)
}

export function getItem (key: any) {
  return localStorage.getItem(key);
}

// 返回json格式
export function getJson(params: any, defaultVal = '{}') {
  return JSON.parse(localStorage.getItem(params) || defaultVal)
}

// 设置json格式
export function setJson(key: any, values: any) {
  localStorage.setItem(key, JSON.stringify(values));
}

export function removeLocalItem(key: any) {
  localStorage.removeItem(key)
}

