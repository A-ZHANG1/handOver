<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
    </el-table>
      <!-- Admin can see this -->
  <el-tag v-permission="['admin']">admin</el-tag>
  <!-- Editor can see this -->
  <el-tag v-permission="['editor']">editor</el-tag>
  <el-tab-pane v-if="checkPermission(['admin'])" >Admin can see this</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['editor'])" >editor can see this</el-tab-pane>
  </div>
</template>

<script>
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  directives: { permission },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    checkPermission,
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
