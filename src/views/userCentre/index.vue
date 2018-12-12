<template>
  <div style="padding-top:50px; border:0px solid red">
    <Modal>
      <el-tabs type="border-card">
        <el-tab-pane label="所有订单">
          <el-table :data="myTasks">
            <el-table-column label="订单号">
              <template slot-scope="scope">
                <a :href="'/#/userCentre/task/'+scope.row.id" target="_blank">{{ scope.row.id }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="物品总价"/>
            <el-table-column prop="express_fee" label="递送费"/>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                {{ translate(scope.row.current_state) }}
              </template>
            </el-table-column>
            <el-table-column label="订单类型">
              <template slot-scope="scope">
                {{ translate(scope.row.task_type) }}
              </template>
            </el-table-column>
            <el-table-column prop="receiver_name" label="收件人"/>
            <el-table-column prop="address" label="收件地址"/>
            <el-table-column prop="postman_name" label="递客"/>
            <el-table-column prop="date" label="日期"/>
            <el-table-column prop="task_des" label="备注"/>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="当前订单">
          <el-table :data="currentTasks">
            <el-table-column label="订单号">
              <template slot-scope="scope">
                <a :href="'/#/userCentre/task/'+scope.row.id" target="_blank">{{ scope.row.id }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="物品总价"/>
            <el-table-column prop="express_fee" label="递送费"/>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                {{ translate(scope.row.current_state) }}
              </template>
            </el-table-column>
            <el-table-column label="订单类型">
              <template slot-scope="scope">
                {{ translate(scope.row.task_type) }}
              </template>
            </el-table-column>
            <el-table-column prop="receiver_name" label="收件人"/>
            <el-table-column prop="address" label="收件地址"/>
            <el-table-column prop="postman_name" label="递客"/>
            <el-table-column prop="date" label="日期"/>
            <el-table-column prop="task_des" label="备注"/>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="历史订单">
          <el-table :data="historyTasks">
            <el-table-column label="订单号">
              <template slot-scope="scope">
                <a :href="'/#/userCentre/task/'+scope.row.id" target="_blank">{{ scope.row.id }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="物品总价"/>
            <el-table-column prop="express_fee" label="递送费"/>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                {{ translate(scope.row.current_state) }}
              </template>
            </el-table-column>
            <el-table-column label="订单类型">
              <template slot-scope="scope">
                {{ translate(scope.row.task_type) }}
              </template>
            </el-table-column>
            <el-table-column prop="receiver_name" label="收件人"/>
            <el-table-column prop="address" label="收件地址"/>
            <el-table-column prop="postman_name" label="递客"/>
            <el-table-column prop="date" label="日期"/>
            <el-table-column prop="task_des" label="备注"/>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </Modal>
  </div>
</template>
<script>
import { getUserId } from '../../utils/auth'
import { translateState } from '../../utils/translate'

export default {
  data: function() {
    return {
      myTasks: [],
      currentTasks: [],
      historyTasks: [],
      finishedStates: ['cancelled', 'cancelledOP', 'signed', 'refused', 'paid']
    }
  },
  created() {
    this.handleData()
  },
  methods: {
    handleData() {
      const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task?Task._owner_uid=' + getUserId()
      this.$axios.get(url).then(res => {
        if (res.data['Task']) {
          this.myTasks = res.data['Task']
          this.historyTasks = []
          this.currentTasks = []
          for (const i in this.myTasks) {
            const task = this.myTasks[i]
            if (task.receiver_address) {
              task.receiver_address = JSON.parse(task.receiver_address)
              if (task.receiver_address.title) {
                task.address = task.receiver_address.title + '\n' + task.receiver_address.detail
              }
            }
            if (task.start_time) {
              task.date = task.start_time.substring(0, 10)
            }
            if (this.finishedStates.indexOf(task.current_state) > -1) {
              this.historyTasks.push(task)
            } else {
              this.currentTasks.push(task)
            }
          }
        }
      })
    },
    translate(state) {
      return translateState(state)
    }
  }
}
</script>

<style scoped>
</style>
