<template>
  <div style="padding-top:50px; border:0px solid red">
    <Modal>
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息">
          <label>订单号：</label>{{ myTask.id }}<br>
          <label>商品总价：</label>{{ myTask.total_price }}<br>
          <label>递送费：</label>{{ myTask.express_fee }}<br>
          <label>当前状态：</label>{{ myTask.current_state }}<br>
          <label>订单类型：</label>{{ myTask.task_type }}<br>
          <label>描述：</label>{{ myTask.task_des }}<br>
          <label v-if="postman">快递员：</label>{{ postman.user_name }}<br>
          <label>评价：</label>{{ myTask.task_comment }}<br>
        </el-tab-pane>

        <el-tab-pane label="物品列表">
          <el-table :data="items">
            <el-table-column prop="item_name" label="品名"/>
            <el-table-column prop="item_price" label="价格"/>
            <el-table-column label="地址">
              <template slot-scope="scope">
                {{ scope.row.item_address['title'] }} <br>
                {{ scope.row.item_address['detail'] }}
              </template>
            </el-table-column>
            <el-table-column prop="item_state" label="状态"/>
            <el-table-column prop="item_des" label="描述"/>
            <el-table-column prop="item_image" label="图片"/>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="收货信息">
          <label>收件人：</label>{{ receiver.receiver_name }}<br>
          <label>收件地址：</label>{{ receiver.receiver_address.title }} &nbsp; {{ receiver.receiver_address.detail }}<br>
          <label>联系电话：</label>{{ receiver.receiver_phone }}<br>
        </el-tab-pane>

        <el-tab-pane v-if="payment" label="支付信息">
          <label>支付状态：</label>{{ payment.payment_state }}<br>
          <label>支付金额：</label>{{ payment.payment_amount }}<br>
          <label>支付方式：</label>{{ payment.payment_mode }}<br>
          <label>订单号：</label>{{ payment.order_num }}<br>
        </el-tab-pane>

        <el-tab-pane label="路径记录">
          <el-table :data="traces">
            <el-table-column prop="trace_time" label="时间"/>
            <el-table-column label="经度">
              <template slot-scope="scope">
                {{ scope.row.trace_pos['lng'] }}
              </template>
            </el-table-column>
            <el-table-column label="维度">
              <template slot-scope="scope">
                {{ scope.row.trace_pos['lat'] }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </Modal>
  </div>
</template>
<script>

export default {
  data: function() {
    return {
      myTask: null,
      receiver: null,
      items: [],
      traces: [],
      payment: null,
      postman: null,
      form: {
        productName: '',
        reward: '',
        receiverName: '',
        keyword: '',
        note: ''
      }
    }
  },
  created() {
    this.handleData()
  },
  methods: {
    handleData() {
      let url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Item/?_task_id=' + this.$route.params.task_uid
      this.$axios.get(url).then(res => {
        if (res.data['Item']) {
          this.items = res.data['Item']
          this.items.forEach(function(item) {
            item.item_address = JSON.parse(item.item_address)
          })
        }
      })
      url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Trace/?_task_id=' + this.$route.params.task_uid
      this.$axios.get(url).then(res => {
        if (res.data['Trace']) {
          this.traces = res.data['Trace']
          this.traces.forEach(function(trace) {
            trace.trace_pos = JSON.parse(trace.trace_pos)
          })
        }
      })
      url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Payment/?_task_id=' + this.$route.params.task_uid
      this.$axios.get(url).then(res => {
        if (res.data['Payment']) {
          this.payment = res.data['Payment'][0]
        }
      })
      this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid).then(res => {
        if (res.data['id']) {
          this.myTask = res.data
          url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver/' + this.myTask._receiver_uid
          this.$axios.get(url).then(res => {
            if (res.data['id']) {
              this.receiver = res.data
              this.receiver.receiver_address = JSON.parse(this.receiver.receiver_address)
            }
          })
          url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/User/' + this.myTask._postman_uid
          this.$axios.get(url).then(res => {
            if (res.data['id']) {
              this.postman = res.data
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
