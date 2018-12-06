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
            <bm-marker :position="receiver.receiver_address" :title="receiver.receiver_address.title" animation="BMAP_ANIMATION_BOUNCE"/>
            <bm-point-collection :points="itemsPos.on" shape="BMAP_POINT_SHAPE_CIRCLE" color="green" size="BMAP_POINT_SIZE_BIGGER"/>
            <bm-point-collection :points="itemsPos.off" shape="BMAP_POINT_SHAPE_CIRCLE" color="red" size="BMAP_POINT_SIZE_BIGGER"/>
            <bm-point-collection :points="startPos" shape="BMAP_POINT_SHAPE_STAR" color="teal" size="BMAP_POINT_SIZE_HUGE"/>
            <bm-polyline :path="tracesPos"/>
          </baidu-map>

          <el-form label-width="120px">
            <el-form-item label="订单号">{{ myTask.id }}</el-form-item>
            <el-form-item label="商品总价">{{ myTask.total_price }}</el-form-item>
            <el-form-item label="递送费">{{ myTask.express_fee }}</el-form-item>
            <el-form-item label="当前状态">{{ translate(myTask.current_state) }}</el-form-item>
            <el-form-item label="订单类型">{{ translate(myTask.task_type) }}</el-form-item>
            <el-form-item label="描述">{{ myTask.task_des }}</el-form-item>
          </el-form>

          <el-form label-width="120px">
            <el-form-item><el-button-group v-if="myTask.current_state === 'released'">
              <el-button type="danger" icon="el-icon-close" @click="cancelTask">取消订单</el-button>
            </el-button-group></el-form-item>
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
          </el-form>
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
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{ translate(scope.row.item_state) }}
              </template>
            </el-table-column>
            <el-table-column prop="item_des" label="描述"/>
            <el-table-column prop="item_image" label="图片"/>
          </el-table>
        </el-tab-pane>

        <el-tab-pane v-if="receiver" label="收货信息">

          <el-form label-width="120px">
            <el-form-item label="收件人">{{ receiver.receiver_name }}</el-form-item>
            <el-form-item label="收件地址">{{ receiver.receiver_address.title }} &nbsp; {{ receiver.receiver_address.detail }}</el-form-item>
            <el-form-item label="联系电话">{{ receiver.receiver_phone }}</el-form-item>
            <el-form-item v-if="postman" label="递客">{{ postman.user_name }}</el-form-item>
            <el-form-item v-if="postman" label="递客电话">{{ postman.phone_num }}</el-form-item>
          </el-form>

          <el-form v-if="myTask.task_comment" ref="comment" :model="comment" label-width="120px">
            <el-form-item label="评分">
              <span v-for="star in commentTemp.stars" style="padding: 0 2px 0 2px">
                <img v-if="star <= comment.rate" src="/src/icons/svg/star-on.svg" height="24px">
                <img v-if="star > comment.rate" src="/src/icons/svg/star-off.svg" height="24px">
              </span>
            </el-form-item>
            <el-form-item label="评价">
              <pre style="margin: 0; font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif"s>{{ comment.comment }}</pre>
            </el-form-item>
          </el-form>
          <el-form v-else-if="commentableStates.indexOf(myTask.current_state) > -1" ref="comment" :model="comment" label-width="120px">
            <el-form-item label="评分">
              <span v-for="star in commentTemp.stars" style="padding: 0 2px 0 2px">
                <img v-if="star <= commentTemp.rateTemp" src="/src/icons/svg/star-on.svg" height="24px" @click="setCommentRate(star)" @mouseenter="setCommentRateEnter(star)" @mouseleave="setCommentRateLeave">
                <img v-if="star > commentTemp.rateTemp" src="/src/icons/svg/star-off.svg" height="24px" @click="setCommentRate(star)" @mouseenter="setCommentRateEnter(star)" @mouseleave="setCommentRateLeave">
              </span>
            </el-form-item>
            <el-form-item label="评价">
              <el-input v-model="comment.comment" type="textarea" placeholder="感谢您的评价，我们将努力提高服务质量"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitComment">发布</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane v-if="payment" label="支付信息">
          <label>支付状态：</label>{{ translate(payment.payment_state) }}<br>
          <label>支付金额：</label>{{ payment.payment_amount }}<br>
          <label>支付方式：</label>{{ translate(payment.payment_mode) }}<br>
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
import { translateState } from '../../utils/translate'

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
      tracesPos: [],
      startPos: [],
      itemsPos: {
        off: [],
        on: []
      },
      commentableStates: ['signed', 'refused'],
      comment: {
        rate: 0,
        comment: ''
      },
      commentTemp: {
        rateTemp: 0,
        stars: [1, 2, 3, 4, 5]
      },
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
          this.itemsPos = { off: [], on: [] }
          for (const i in this.items) {
            const item = this.items[i]
            item.item_address = JSON.parse(item.item_address)
            if (item.item_state === 'on') {
              this.itemsPos.on.push(item.item_address)
            } else {
              this.itemsPos.off.push(item.item_address)
            }
          }
        }
      })
      url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Trace/?Trace._task_uid=' + this.$route.params.task_uid
      this.$axios.get(url).then(res => {
        if (res.data['Trace']) {
          this.traces = res.data['Trace']
          this.tracesPos = []
          this.traces.sort(function(a, b) {
            return a.trace_time.localeCompare(b.trace_time)
          })
          for (const i in this.traces) {
            const trace = this.traces[i]
            trace.trace_pos = JSON.parse(trace.trace_pos)
            this.tracesPos.push(trace.trace_pos)
          }
          if (this.traces.length > 0) {
            this.startPos = [this.traces[0].trace_pos]
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
          if (this.myTask.task_comment) {
            this.comment = JSON.parse(this.myTask.task_comment)
            this.commentTemp.rateTemp = this.comment.rate
          }
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
    setCommentRate(rate) {
      this.comment.rate = rate
    },
    setCommentRateEnter(rate) {
      this.commentTemp.rateTemp = rate
    },
    setCommentRateLeave() {
      this.commentTemp.rateTemp = this.comment.rate
    },
    onSubmitComment() {
      this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid).then(res => {
        if (res.data['id'] && this.commentableStates.indexOf(res.data.current_state) > -1 && !res.data.task_comment) {
          const currentTask = res.data
          currentTask.task_comment = JSON.stringify({ rate: this.comment.rate, comment: this.comment.comment })
          const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid
          this.$axios.put(url, currentTask).then(res => {
            this.handleData()
          })
        } else {
          alert('请在完成订单后再进行评价，请不要重复评价')
          this.handleData()
        }
      })
    },
    translate(state) {
      return translateState(state)
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
