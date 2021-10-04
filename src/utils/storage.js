/**
 * 封装本地存储操作模块
 */

/**
 * 获取数据
 */
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    // 如果data是JSON格式字符串，将其转换为对象以后再返回。否则报错，直接返回data。
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 存储数据
 */
export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

/**
 * 删除数据
 */
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
