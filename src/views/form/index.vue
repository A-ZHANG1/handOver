<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="教师姓名">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="教工号">
        <el-input v-model="form.id"/>
      </el-form-item>
      <el-form-item label="初始密码">
        <el-input v-model="form.pwd"/>
      </el-form-item>
      <el-form-item label="权限">
        <el-radio-group v-model="form.resource">
          <el-radio label="teacher"/>
          <el-radio label="admin"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="注释">
        <el-input v-model="form.desc" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: ''
      // }
          form: {
        name: '',
        id: '',
        pwd: '',
        date2: '',
        note: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

