export default {
  // 保存数据
  saveData (type, data) {
    return utools.db.put({
      _id: type,
      data: data,
      _rev: utools.db.get(type)?._rev || ''
    })
  },
  // 获取数据
  getData (type) {
    return utools.db.get(type)
  },
  // 获取UUID
  getUUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}