<template>
  <div style="padding-top:50px; border:0px solid red">
    <Modal>
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息">
          <baidu-map v-if="traces.length > 0"
                     v-bind:style="mapStyle"
                     :center="center"
                     :zoom="zoom"
                     :scroll-wheel-zoom="true"
                     class="bm-view"
                     ak="K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy">
            <bm-view style="width: 100%; height:300px;"/>
            <bm-marker :position="receiver.receiver_address" animation="BMAP_ANIMATION_BOUNCE"/>
            <bm-point-collection :points="items_pos" shape="BMAP_POINT_SHAPE_CIRCLE" color="red" size="BMAP_POINT_SIZE_BIGGER"/>
            <bm-point-collection :points="start_pos" shape="BMAP_POINT_SHAPE_STAR" color="green" size="BMAP_POINT_SIZE_HUGE"/>
            <bm-polyline :path="traces_pos" :editing="true"/>
          </baidu-map>

          <el-row><el-col :span="24"><label>订单号：</label>{{ myTask.id }}</el-col></el-row>
          <el-row><el-col :span="24"><label>商品总价：</label>{{ myTask.total_price }}</el-col></el-row>
          <el-row><el-col :span="24"><label>递送费：</label>{{ myTask.express_fee }}</el-col></el-row>
          <el-row><el-col :span="24"><label>当前状态：</label>{{ myTask.current_state }}</el-col></el-row>
          <el-row><el-col :span="24"><label>订单类型：</label>{{ myTask.task_type }}</el-col></el-row>
          <el-row><el-col :span="24"><label>描述：</label>{{ myTask.task_des }}</el-col></el-row>
          <el-row v-if="postman"><el-col :span="24"><label>快递员：</label>{{ postman.user_name }}</el-col></el-row>
          <el-row><el-col :span="24"><label>评价：</label>{{ myTask.task_comment }}</el-col></el-row>

          <el-button-group v-if="myTask.current_state === 'released'">
            <el-button type="danger" icon="el-icon-close" @click="cancelTask">取消订单</el-button>
          </el-button-group>
          <el-button-group v-if="myTask.current_state === 'accepted'">
            <el-button type="danger" icon="el-icon-circle-close-outline" @click="cancelTaskO">申请取消订单</el-button>
          </el-button-group>
          <el-button-group v-if="myTask.current_state === 'cancelledP'">
            <el-button type="danger" icon="el-icon-close" @click="cancelTaskOP">同意取消订单</el-button>
            <el-button type="warning" icon="el-icon-remove-outline" @click="cancelTaskRefuse">拒绝取消订单</el-button>
          </el-button-group>
          <el-button-group v-if="myTask.current_state === 'received'">
            <el-button type="success" icon="el-icon-success" @click="signTask">签收</el-button>
            <el-button type="danger" icon="el-icon-error" @click="refuseTask">拒签</el-button>
          </el-button-group>
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

        <el-tab-pane v-if="receiver" label="收货信息">
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

        <el-tab-pane v-if="traces.length > 0" label="路径记录">
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
import { BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker, BmPointCollection } from 'vue-baidu-map'

export default {
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
    BmPointCollection
  },
  data: function() {
    return {
      mapStyle: {
        width: '100%',
        height: this.mapHeight + 'px'
      },
      center: { lng: 121, lat: 31 },
      zoom: 15,
      traces_pos: [],
      start_pos: [],
      items_pos: [],
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
      let url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Item/?Item._task_uid=' + this.$route.params.task_uid
      this.$axios.get(url).then(res => {
        if (res.data['Item']) {
          this.items = res.data['Item']
          this.items_pos = []
          for (const i in this.items) {
            const item = this.items[i]
            item.item_address = JSON.parse(item.item_address)
            this.items_pos.push(item.item_address)
          }
        }
      })
      url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Trace/?Trace._task_uid=' + this.$route.params.task_uid
      this.$axios.get(url).then(res => {
        if (res.data['Trace']) {
          this.traces = res.data['Trace']
          this.traces_pos = []
          this.traces.sort(function(a, b) {
            return a.trace_time.localeCompare(b.trace_time)
          })
          for (const i in this.traces) {
            const trace = this.traces[i]
            trace.trace_pos = JSON.parse(trace.trace_pos)
            this.traces_pos.push(trace.trace_pos)
          }
          if (this.traces.length > 0) {
            this.start_pos = [this.traces[0].trace_pos]
          }
        }
      })
      url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Payment/?Payment._task_uid=' + this.$route.params.task_uid
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
              this.center = this.receiver.receiver_address
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
    },
    cancelTask() {
      this.changeTaskState('released', 'cancelled', '当前状态无法直接取消订单')
    },
    cancelTaskO() {
      this.changeTaskState('accepted', 'cancelledO', '当前状态无法提出取消订单')
    },
    cancelTaskOP() {
      this.changeTaskState('cancelledP', 'cancelledOP', '当前状态无法接受取消订单')
    },
    cancelTaskRefuse() {
      this.changeTaskState('cancelledP', 'accepted', '当前状态无法拒绝取消订单')
    },
    signTask() {
      this.changeTaskState('received', 'signed', '当前状态无法签收订单')
    },
    refuseTask() {
      this.changeTaskState('received', 'refused', '当前状态无法拒收订单')
    },
    changeTaskState(originState, finalState, alertMessage) {
      this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid).then(res => {
        if (res.data['id'] && res.data.current_state === originState) {
          const currentTask = res.data
          currentTask.current_state = finalState
          const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid
          this.$axios.put(url, currentTask).then(res => {
            this.handleData()
          })
        } else {
          alert(alertMessage)
          this.handleData()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
