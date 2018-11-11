
 <template>
  <div class="app-container">
  <el-table
    :data="tableData2"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="date"
      label="教师"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="学生数"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="手环数">
    </el-table-column>
    <el-table-column  align="center"  width="80px" label="操作">
       <el-button type="primary" size="mini" slot-scope="{ row }" @click="handleDispatch(scope.row)">详情</el-button>
       <!-- <el-button type="primary" size="mini" slot-scope="{ row }" @click="handleDetail(scope.row)">详情</el-button> -->
    </el-table-column>
  </el-table>
</div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
  export default {
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      
      handleDispatch(row) {

      this.temp = Object.assign({}, row) // copy obj
      
      //tableData后端返回，函数还是可以这样写
      // for(const v of this.tableData){
       
      //   if(v.teacherID==this.temp.deviceID){
      //     const index=this.tableData.indexOf(v)
      //     this.tableData.splice(index,1)
      //     break
      //   }
      // }
    
    } 
    },
    data() {
      return {
        tableData2: [{
          date: '张三',
          name: '120',
          address: '40',
          // href: '/dashboard'
        }, {
          date: '李四',
          name: '170',
          address: '50'
        }, {
          date: '王小虎',
          name: '145',
          address: '42',
        }, {
          date: '六六六',
          name: '167',
          address: '46'
        }]
      }
    }
  }
</script>