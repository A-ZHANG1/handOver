<template>
  <div style="padding-top:50px; border:0px solid red">
    <Modal>
      <el-tabs v-if="myTask" type="border-card">
        <el-tab-pane label="基本信息">
          <baidu-map v-bind:style="mapStyle"
                     :center="center"
                     :zoom="zoom"
                     :scroll-wheel-zoom="true"
                     class="bm-view"
                     ak="K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy">
            <bm-view style="width: 100%; height:300px;"/>
            <bm-marker :position="receiverAddress" :title="receiverAddress.title + ' ' + receiverAddress.detail" animation="BMAP_ANIMATION_BOUNCE" @mouseover="onOverEndPoint" @mouseout="onLeavePoint"/>
            <bm-marker v-if="postman_pos" :position="postman_pos" :icon="{url: '/src/icons/png/postman-red-24.png', size: {width: 24, height: 24}}" title="递客当前位置" @mouseover="onOverPostman" @mouseout="onLeavePoint"/>
            <bm-marker v-for="item in items"
                       v-if="item.item_address"
                       :position="item.item_address"
                       :icon="item.item_state === 'on' ? {url: '/src/icons/png/item-on-24.png', size: {width: 24, height: 24}} : {url: '/src/icons/png/item-off-24.png', size: {width: 24, height: 24}}"
                       @mouseover="onOverItem(item)"
                       @mouseout="onLeavePoint" />
            <bm-point-collection :points="startPos" shape="BMAP_POINT_SHAPE_STAR" color="teal" size="BMAP_POINT_SIZE_HUGE"/>
            <bm-polyline :path="tracesPos"/>
          </baidu-map>
          <div v-if="mapMessagePad" style="width: 300px; background: #dfdfdf; position: absolute; top: 20px; right: 20px;">
            <pre style="margin: 2px; white-space: pre-wrap; word-wrap: break-word;">{{ mapMessagePad }}</pre>
          </div>

          <el-form label-width="120px">
            <el-form-item label="订单号">{{ myTask.id }}</el-form-item>
            <el-form-item label="商品总价">{{ myTask.total_price }}</el-form-item>
            <el-form-item label="递送费">{{ myTask.express_fee }}</el-form-item>
            <el-form-item label="当前状态">{{ translate(myTask.current_state) }}</el-form-item>
            <el-form-item label="订单类型">{{ translate(myTask.task_type) }}</el-form-item>
            <el-form-item label="开始时间">{{ myTask.start_time }}</el-form-item>
            <el-form-item label="结束时间">{{ myTask.end_time }}</el-form-item>
            <el-form-item label="备注">{{ myTask.task_des }}</el-form-item>
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
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="收货支付">
          <el-form label-width="120px">
            <el-form-item label="收件人">{{ myTask.receiver_name }}</el-form-item>
            <el-form-item label="收件地址">{{ receiverAddress.title }} &nbsp; {{ receiverAddress.detail }}</el-form-item>
            <el-form-item label="联系电话">{{ myTask.receiver_phone }}</el-form-item>
            <el-form-item v-if="postman" label="递客">{{ myTask.postman_name }}</el-form-item>
            <el-form-item v-if="postman" label="递客电话">{{ myTask.postman_phone }}</el-form-item>
          </el-form>

          <el-form v-if="myTask.current_state === 'paid'" label-width="120px">
            <el-form-item label="支付状态">已支付</el-form-item>
            <el-form-item label="支付金额">{{ myTask.total_price + myTask.express_fee }}</el-form-item>
          </el-form>
          <el-form v-else-if="myTask.current_state === 'signed'" label-width="120px">
            <el-form-item label="支付状态">未支付 请点击下方按钮扫码支付</el-form-item>
            <el-form-item label="应付金额">{{ myTask.total_price + myTask.express_fee }}</el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="el-icon-mobile-phone" @click="qrcode">支付</el-button>
                <el-button type="success" icon="el-icon-message" @click="checkPayment">通知递客</el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item id="qrcode_form_item">
              <canvas id="qrcode"/>
            </el-form-item>
          </el-form>
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

        <el-tab-pane label="实时对话">
          <el-form label-width="120px">
            <el-form-item v-for="message in messages" v-if="message.message_sender === 'postman'" label="递客">
              {{ message.message_time }}
              <pre style="line-height: 20px; margin: 2px;">{{ message.message_content }}</pre>
            </el-form-item>
            <el-form-item v-else-if="message.message_sender === 'owner'" label="我">
              {{ message.message_time }}
              <pre style="line-height: 20px; margin: 2px;">{{ message.message_content }}</pre>
            </el-form-item>
          </el-form>

          <el-form label-width="120px">
            <el-form-item label="我">
              <el-input v-model="newMessage" type="textarea" placeholder="您有什么相对递客说的"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitSendMessage">发送</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </Modal>
  </div>
</template>

<script>
import { BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker, BmPointCollection, BmPolyline } from 'vue-baidu-map'
import { translateState } from '../../utils/translate'
import { datePrototypeFormat } from '../../utils/dateFormat'
import QRCode from 'qrcode'

Date.prototype.Format = datePrototypeFormat

export default {
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
    BmPointCollection,
    BmPolyline
  },
  data: function() {
    return {
      mapStyle: {
        width: '100%',
        height: this.mapHeight + 'px'
      },
      center: { lng: 121, lat: 31 },
      zoom: 15,
      myTask: null,
      receiverAddress: null,
      items: [],
      traces: [],
      messages: [],
      postman: false,
      tracesPos: [],
      startPos: [],
      itemsPart: {
        off: [],
        on: []
      },
      postman_pos: null,
      mapMessagePad: null,
      commentableStates: ['signed', 'refused', 'paid'],
      comment: {
        rate: 0,
        comment: ''
      },
      commentTemp: {
        rateTemp: 0,
        stars: [1, 2, 3, 4, 5]
      },
      newMessage: ''
    }
  },
  created() {
    this.handleData()
    setInterval(this.handleData, 1000 * 10)
  },
  mounted() {
  },
  methods: {
    handleData() {
      this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid).then(res => {
        if (res.data['id']) {
          this.myTask = res.data
          if (this.myTask.task_comment) {
            this.comment = JSON.parse(this.myTask.task_comment)
            this.commentTemp.rateTemp = this.comment.rate
          }
          if (this.myTask.receiver_address) {
            this.receiverAddress = JSON.parse(this.myTask.receiver_address)
            this.center = this.receiverAddress
          }
          if (this.myTask.postman_phone && this.myTask.postman_phone !== '') {
            this.postman = true
          }
          this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Item/?Item._task_uid=' + this.$route.params.task_uid).then(res => {
            if (res.data['Item']) {
              this.items = res.data['Item']
              this.itemsPart = { off: [], on: [] }
              for (const i in this.items) {
                const item = this.items[i]
                if (item.item_address) {
                  item.item_address = JSON.parse(item.item_address)
                  if (item.item_state === 'on') {
                    this.itemsPart.on.push(item)
                  } else {
                    this.itemsPart.off.push(item)
                  }
                }
              }
            }
            this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Trace/?Trace._task_uid=' + this.$route.params.task_uid).then(res => {
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
              this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Message/?Message._task_uid=' + this.$route.params.task_uid).then(res => {
                if (res.data['Message']) {
                  this.messages = res.data['Message']
                  this.messages.sort(function(a, b) {
                    return a.message_time.localeCompare(b.message_time)
                  })
                }
                this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/User/' + this.myTask._postman_uid).then(res => {
                  if (res.data['current_pos']) {
                    this.postman_pos = JSON.parse(res.data['current_pos'])
                  }
                })
              })
            })
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
    onSubmitSendMessage() {
      const message = {
        message_sender: 'owner',
        message_time: new Date().Format('yyyy-MM-dd HH:mm:ss'),
        message_content: this.newMessage,
        _task_uid: this.$route.params.task_uid
      }
      this.$axios.post('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Message/', message).then(res => {
        this.newMessage = ''
        this.handleData()
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
      this.changeTaskState('received', 'signed', '当前状态无法签收订单', this.askForComment)
    },
    refuseTask() {
      this.changeTaskState('received', 'refused', '当前状态无法拒收订单', this.askForComment)
    },
    changeTaskState(originState, finalState, alertMessage, callback) {
      this.$axios.get('http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid).then(res => {
        if (res.data['id'] && res.data.current_state === originState) {
          const currentTask = res.data
          currentTask.current_state = finalState
          const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task/' + this.$route.params.task_uid
          this.$axios.put(url, currentTask).then(res => {
            this.handleData()
            if (callback) {
              callback()
            }
          })
        } else {
          alert(alertMessage)
          this.handleData()
        }
      })
    },
    qrcode() {
      QRCode.toCanvas(document.getElementById('qrcode'), JSON.stringify(this.myTask), function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
    },
    checkPayment() {
      this.handleData()
      if (this.myTask.payment_state === 'unpaid') {
        this.$message('未收到支付回执，请与递客或第三方支付平台进行确认')
        document.getElementById('qrcode_form_item').firstChild.nextSibling.innerHTML = '<canvas id="qrcode"/>'
      }
    },
    askForComment() {
      this.$message('此次订单已结束，请您为订单进行评价')
    },
    onOverItem(item) {
      if (item) {
        this.mapMessagePad = item.item_name + ' (' + this.translate(item.item_state) + ')\n' +
          item.item_address.title + '\n' + item.item_address.detail
      } else {
        this.mapMessagePad = ''
      }
    },
    onOverPostman() {
      this.mapMessagePad = '递客当前位置\n' + this.myTask.postman_name + '(' + this.myTask.postman_phone + ')\n我们的递客正在全速为您运送物品'
    },
    onOverEndPoint() {
      this.mapMessagePad = '收件人地址\n' + this.myTask.receiver_name + '(' + this.myTask.receiver_phone + ')\n' +
        this.receiverAddress.title + '\n' + this.receiverAddress.detail
    },
    onLeavePoint() {
      this.mapMessagePad = ''
    }
  }
}
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 2px !important;
  }
  canvas {
    max-height: 200px !important;
    max-width: 200px !important;
  }
</style>
