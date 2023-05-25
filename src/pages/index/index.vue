<template>
  <div class="container" v-if="createCode === 'quickinput_index'" >
    <div class="header" >
    </div>
    <div class="body" >
      <el-table :data="tableData" empty-text="暂无数据" style="width: 100%">
        <el-table-column prop="tag" label="输入码" width="180" >
          <template  #default="scope">
            <edit-input v-model="scope.row.tag" :isEdit="scope.row.isEdit" ></edit-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="短语" >
          <template  #default="scope">
            <edit-input v-model="scope.row.value" type="textarea" :isEdit="scope.row.isEdit" ></edit-input>
          </template>
        </el-table-column>
        <el-table-column prop="option" label="设置" fixed="right" width="200" >
          <template  #default="scope">
            <div v-if="!scope.row.isEdit" class="buttons" >
              <el-button class="button" @click="doCopy(scope.row)" >复制</el-button>
              <el-button class="button" @click="doInput(scope.row)" >输入</el-button>
              <el-button class="button" @click="doEdit(scope.row)" >编辑</el-button>
              <el-popconfirm title="确认删除?" confirmButtonText="删除" cancelButtonText="取消" @confirm="doDelete(scope.row)" >
                <template #reference>
                  <el-button class="button">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <div v-else class="buttons" >
              <el-button class="button" @click="doSave(scope.row)" >保存</el-button>
              <el-button class="button" @click="doCancel(scope.row)" >取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="addButton" @click="add"></div>
  </div>
</template>

<script setup>
import editInput from './editInput.vue'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from "vue"
import util from "/utils/util.js"

let tableData = reactive([])

onMounted(() => {
  // 初始化数据
  const getTableData = util.getData('tableData')
  if (getTableData?.data) {
    tableData.push(...JSON.parse(getTableData.data))
  }
})

// 进入插件
let createCode = ref('')
utools.onPluginEnter((object) => {
  console.log(object)
  if (object.code.indexOf('copyModel-') == 0) {
    // 复制模式
    const code = object.code.replace('copyModel-', '')
    createCode.value = code
    const isSame = tableData.find(item => item.tag === code)
    if (isSame) {
      utools.hideMainWindow()
      utools.copyText(isSame.value)
      utools.outPlugin()
    }
  } else {
    // 输入模式
    createCode.value = object.code
    const isSame = tableData.find(item => item.tag === object.code)
    console.log(isSame)
    if (isSame) {
      console.log(object.code.indexOf('copyModel-'))
      utools.hideMainWindow()
      utools.copyText(isSame.value)
      if (utools.isMacOs()) {
        // macos 模拟粘贴
        utools.simulateKeyboardTap('v', 'command')
      } else {
        // windows linux 模拟粘贴
        utools.simulateKeyboardTap('v', 'ctrl')
      }
      utools.outPlugin()
      setTimeout(() => {
        utools.copyText('')
      }, 1000)
    }
  }
  // 调用输入框
  utools.setSubInput(({ text }) => { search(text) }, '请输入输入码 / 短语', false)
  // 判断暗黑模式
  const isDarkColors = utools.isDarkColors()
  if (isDarkColors) document.querySelector('HTML').classList.add('dark')
})

// 搜索
const search = (searchText) => {
  const _tableData = JSON.parse(util.getData('tableData').data)
  if (searchText) {
    tableData.splice(0, tableData.length, ..._tableData.filter(item => { return item.tag.includes(searchText) || item.value.includes(searchText) }))
  } else {
    tableData.splice(0, tableData.length, ..._tableData)
  }
}

// 添加
const add = () => {
  tableData.push({
    tag: '',
    value: '',
    rowKey: util.getUUID(),
    isEdit: true,
    isNew: true,
  })
}

// 复制
const doCopy = (row) => {
  utools.copyText(row.value)
  ElMessage.success('复制成功')
}

// 输入
const doInput = (row) => {
  utools.hideMainWindow()
  utools.copyText(row.value)
  if (utools.isMacOs()) {
    // macos 模拟粘贴
    utools.simulateKeyboardTap('v', 'command')
  } else {
    // windows linux 模拟粘贴
    utools.simulateKeyboardTap('v', 'ctrl')
  }
  utools.outPlugin()
  setTimeout(() => {
    utools.copyText('')
  }, 1000)
}


// 编辑
const doEdit = (item) => {
  item.isEdit = true;
  item._valueCache = JSON.parse(JSON.stringify(item))
}

// 保存
const doSave = (item) => {
  // 获取全部数据
  const _tableData = JSON.parse(util.getData('tableData')?.data || '[]')
  if (!(item.tag && item.value)) {
    ElMessage.error('请输入完整信息')
    return
  }
  if (tableData.filter(res => res.tag === item.tag).length > 1) {
    ElMessage.error('输入码已存在')
    return
  }
  item.isEdit = false;
  // 删除原有唤醒词
  if (item._valueCache) {
    utools.removeFeature(item._valueCache.tag)
    utools.removeFeature('copyModel-' + item._valueCache.tag)
  }
  delete item.isNew
  delete item._valueCache
  // 添加新唤醒词
  utools.setFeature({
    "code": item.tag,
    "explain": item.value || '请输入短语',
    "cmds": [item.tag]
  })
  utools.setFeature({
    "code": 'copyModel-' + item.tag,
    "explain": item.value || '请输入短语',
    "cmds": ['复制-' + item.tag]
  })
  // 查找修改的单身，存在则修改，不存在则添加
  const editItem = _tableData.filter(res => res.rowKey === item.rowKey)
  if (editItem && editItem.length) {
    editItem[0].tag = item.tag
    editItem[0].value = item.value
  } else {
    _tableData.push(item)
  }
  util.saveData('tableData', JSON.stringify(_tableData))
}

// 取消
const doCancel = (item) => {
  if (item.isNew) {
    // 删除新增未保存项
    tableData.splice(tableData.indexOf(item), 1)
  } else {
    // 合并数组
    tableData[tableData.indexOf(item)] = Object.assign(item, item._valueCache)
    delete item._valueCache
    item.isEdit = false;
  }
}

// 删除
const doDelete = (item) => {
  const _tableData = JSON.parse(util.getData('tableData')?.data || '[]')
  _tableData.splice(_tableData.findIndex(res => res.rowKey === item.rowKey), 1)
  tableData.splice(tableData.findIndex(res => res.rowKey === item.rowKey), 1)
  utools.removeFeature(item.tag)
  utools.removeFeature('copyModel-' + item.tag)
  util.saveData('tableData', JSON.stringify(_tableData))
}



</script>

<style lang='scss' scoped>

.container {

  .body {
    height: 100%;
    color: #34495e;
    line-height: 30px;
    text-align: center;
    font-size: 14px;

    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;

      .button {
        padding: 0;
        margin: 0;
      }
    }
  }

  .addButton {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background-color: #FFF;
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 2;
    background-image: url("/public/add.png");
    background-size: 125%;
    background-position: center;
  }
}

</style>
