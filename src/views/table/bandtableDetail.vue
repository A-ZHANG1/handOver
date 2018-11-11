
 <template>
  <div class="app-container">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="deviceID"
      label="设备号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="180">
    </el-table-column>
    <el-table-column
      prop="teacherID"
      label="教师工号"
      width="180">
    </el-table-column>
    <el-table-column  align="center"  width="80px" label="操作">
       <!-- <el-button type="primary" size="mini" slot-scope="{ row }">启用</el-button> -->
      <template slot-scope="scope">
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'停用')">停用
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'启用')">启用
          </el-button>
          <el-button  size="mini" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
    </el-table-column>
  </el-table>

  <el-dialog  title="添加手环" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备号" prop="deviceID">
            <el-input v-model="temp.deviceID"/>          
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-input v-model="temp.status"/>          
        </el-form-item>
        <el-form-item label="教师工号" prop="teacherID">
            <el-input v-model="temp.teacherID"/>          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
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
     data() {
      return{
        tableData: [],
        temp:{
          deviceID: "",
          status: "待用",
          teacherID: ''
        },
        dialogStatus: '',
        dialogFormVisible: false,
      }
    },

    mounted () {
        this.querytable();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    querytable(){
        let url="static/simulated1.json"
        this.$axios.get(url).then(res=>{

          this.tableData=res.data.results.deviceStatus;
//json文件多了一个逗号
          // console.log(res.data);
          // console.log(res.data.results);
        })
        .catch(error=>{
            alert(error)
            console.log(error)
          });
      },

    resetTemp() {
      this.temp = {
        deviceID: "",
        status: "待用",
        teacherID: ''
      }
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()

      })
    },

    createData(){
      this.tableData.unshift(this.temp)
      this.dialogFormVisible = false
      this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
    },

    handleDelete(row) {

      this.temp = Object.assign({}, row) // copy obj
      
      for(const v of this.tableData){
       
        if(v.deviceID==this.temp.deviceID){
          const index=this.tableData.indexOf(v)
          this.tableData.splice(index,1)
          break
        }
      }

     this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000 
    })
    
    }   
    } 
  }
</script>

  