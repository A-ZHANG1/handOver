<!--
使用说明:
   v-on:  map-confirm,参数为array数组,传递经纬度值
   v-on   cancel    取消时发出事件
   showMapComponent: 单击时显示地址详情弹框
   :position 设置在data return 中监听改变
-->
<template>
  <div style="padding-top:50px; border:1px solid lightGrey;width=980px;">

    <el-form ref="item" :model="item" v-model="showMapComponent" label-width="120px">
      <!-- 添加待取件物品 -->
      <el-form-item>
        <div style="font-size:26px;color:gray;">创建取送件任务</div>
      </el-form-item>
      <!-- 设置el-form-item style=width:可以不自适应页面宽度-->
      <div
        style="margin:0px 0px 20px 120px;padding:0;width:790px;height:1px;background-color:lightGrey;overflow:hidden;"/>

      <el-form-item style="width: 900px;">
        <el-row>
          <el-col>
            <el-input v-model="item.productName" placeholder="请填写物品名称"/>
          </el-col>

        </el-row>
      </el-form-item>

      <el-form-item style="width: 900px;">
        <el-col :span="24">
          <el-input v-model="item.des" type="textarea" placeholder="简要描述"/>
        </el-col>
      </el-form-item>

      <!-- 取件地址 -->
      <el-form-item style="width: 900px;">
        <el-col :span="24">
          <baidu-map
            :style="mapStyle"
            :center="center"
            :zoom="zoom"
            :scroll-wheel-zoom="true"
            class="bm-view"
            ak="K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy"
            @click="setItemAddress"
            @moving="syncCenterAndZoom"
            @moveend="syncCenterAndZoom"
            @zoomend="syncCenterAndZoom">
            <bm-view style="width: 100%; height:500px;"/>

            <bm-control :offset="{width: '10px', height: '10px'}">
              <bm-auto-complete v-model="keyword" :sug-style="{zIndex: 999999}">
                <input type="text" placeholder="请填写取件地址，如：闵行交大学生西67舍" class="serachinput">
              </bm-auto-complete>
            </bm-control>
            <bm-local-search
              :keyword="keyword"
              :auto-viewport="true"
              style="width:0px;height:0px;overflow: hidden;"/>
            <bm-marker :position="{lng:item.item_address.lng,lat:item.item_address.lat}"/>
          </baidu-map>
        </el-col>

      </el-form-item>

      <!-- 新建物品 -->
      <el-form-item style="width: 900px;">
        <el-col :span="16">
          <el-input v-model="item.item_address.detail" placeholder="请填写详细地址"/>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-button style="float: right;" type="success" @click="addItem">确认添加</el-button>
        </el-col>
      </el-form-item>

      <!-- 显示当前物品信息 -->
      <el-form-item label="已添加物品" style="width:900px">
        <el-table :data="itemList" highlight-current-row>
          <el-table-column prop="item_name" label="名称" width="100"/>
          <el-table-column prop="item_address.title" label="取件地址" width="200"/>
          <el-table-column prop="item_address.detail" label="详细地址" width="200"/>
          <el-table-column prop="item_des" label="简要描述" width="300"/>
        </el-table>
      </el-form-item>

      <!-- 选择收件人 -->
      <el-form-item label="收件人" style="width:900px">
        <div style="padding-button:5px; border:0px solid LightGrey;">
          <el-collapse :according="true">
            <el-collapse-item>
              <template slot="title">
                <div style="font-size:14px;paddingLeft:5px;color:gray;">{{ settedReceiver.receiver_name }} @
                  {{ settedReceiver.receiver_address&&settedReceiver.receiver_address.title }}
                </div>
              </template>
              <!-- v-for展开常用收件人 -->
              <el-row>
                <el-col>
                  <el-table :data="receiverData" highlight-current-row>
                    <el-table-column prop="receiver_name" width="80"/>
                    <el-table-column prop="receiver_address.title" width="380"/>
                    <el-table-column prop="receiver_address.detail" width="80"/>
                    <el-table-column prop="receiver_phone" width="110"/>
                    <el-table-column>
                      <template scope="scope">

                        <el-button
                          :type="settedReceiver.receiver_name===scope.row.receiver_name?'success':''"
                          size="mini"
                          icon="el-icon-check"
                          circle
                          @click="setReceiver(scope.row.receiver_name)"/>
                          <!-- <el-button v-else type="info"  icon="el-icon-check" circle @click="setReceiver(scope.row.receiver_name)"></el-button> -->
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-button style="marginTop:10px" icon="el-icon-circle-plus-outline" plain @click="showDialog()">新建
                  </el-button>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form-item>

      <!-- 任务悬赏金设置 -->
      <el-form-item label="悬赏金" placeholder="系统预估费用" style="width: 900px;">
        <el-row>
          <el-col :span="4">
            <el-input v-model.number="form.reward"/>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button @click="getPickUpOrder">顺序</el-button>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button @click="$showReward()">推荐</el-button>
          </el-col>
        </el-row>
        <el-row>
          <span v-if="rewardShow">系统推荐悬赏金：￥ {{ calculateReward }}距离 {{ calculateDistance }} km</span>
        </el-row>
      </el-form-item>

      <!-- 开始时间和结束时间 -->
      <el-form-item label="预约时间">
        <el-row>
          <el-col :span="3">
            <el-date-picker
              v-model="form.start_time"
              :picker-options="pickerOptions1"
              type="datetime"
              placeholder="预约取件时间"
              align="right"/>
          </el-col>
          <el-col :span="3" :offset="4">
            <el-date-picker
              v-model="form.end_time"
              :picker-options="pickerOptions1"
              type="datetime"
              placeholder="任务结束时间"
              align="right"/>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="备注" style="width: 900px;">
        <el-col :span="24">
          <el-input v-model="form.note" type="textarea" placeholder="特殊要求"/>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
        <!-- <el-button @click="onCancel">取消</el-button> -->
      </el-form-item>
    </el-form>
    <!-- </el-tab-pane>
  </el-tabs>  -->

    <!-- 添加收件人 弹窗-->
    <el-dialog :visible.sync="dialogFormVisible" title="添加收件人">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;">
        <!-- {{temp.receiver_name}}{{temp.receiver_address}}{{temp.receiver_tel}} -->
        <el-form-item label="姓名">
          <el-input v-model="temp.receiver_name"/>
        </el-form-item>
        <el-form-item label="地址">
          <baidu-map
            :style="mapStyle"
            :center="center"
            :zoom="zoom"
            :scroll-wheel-zoom="true"
            class="bm-view"
            ak="K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy"
            @click="setReceiverAddress"
            @moving="syncCenterAndZoom"
            @moveend="syncCenterAndZoom"
            @zoomend="syncCenterAndZoom">
            <bm-view style="width: 100%; height:500px;"/>

            <bm-control :offset="{width: '10px', height: '10px'}">
              <!-- v-model="temp.receiver_address.title" -->
              <bm-auto-complete v-model="keyword" :sug-style="{zIndex: 999999}">
                <input type="text" placeholder="如：闵行交大学生西67舍" class="serachinput">
              </bm-auto-complete>
            </bm-control>

            <bm-marker :position="{lng:temp.receiver_address.lng,lat:temp.receiver_address.lat}"/>
          </baidu-map>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="temp.receiver_address.detail" placeholder="如：5310室"/>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="temp.receiver_phone"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createReceiver">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker,
  BmPointCollection
} from 'vue-baidu-map'
import { getUserId } from '@/utils/auth'
import moment from 'moment'
import { traceRecommend } from '@/utils/TraceRecommend'

// const position=[{lng: 121.443, lat:31.032},{lng: 122, lat:28}]

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
  props: {
    value: Boolean,
    mapHeight: {
      type: Number,
      default: 500
    }
  },
  data: function() {
    return {
      pickerOptions1: {
        shortcuts: [
          {
            text: '现在',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '明天',
            onClick(picker) {
              picker.$emit('pick', new Date() + 3600 * 1000 * 24)
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
      },
      rewardShow: false,
      testText: {}, // 遗传算法确定的取件顺序
      current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      ownerUID: getUserId(),
      showMapComponent: this.value,
      keyword: '',
      // receiverAddressKeyword: '学生西67舍',
      mapStyle: {
        width: '100%',
        height: this.mapHeight + 'px'
      },
      center: { lng: 121.443, lat: 31.032 },
      zoom: 15,
      form: {
        reward: 0,
        note: '',
        start_time: '',
        end_time: ''
      },
      item: {
        productName: '',
        productSize: null,
        des: '',
        item_address: {
          title: '',
          lng: '',
          lat: '',
          detail: ''
        },
        senderName: null,
        senderPhoneNum: null
      },
      itemList: [],
      orderedItemList: [],
      temp: {
        receiver_name: '',
        receiver_address: {
          title: '',
          lng: '',
          lat: '',
          detail: ''
        },
        receiver_phone: ''
      },
      position: [],
      receiverData: [],
      settedReceiver: [],
      dialogFormVisible: false,
      pickUp_address: []
    }
  },
  computed: {
    calculateReward: function() {
      // console.log(distance)
      return (10 + 180 * this.calculateDistance / 110).toFixed(2)
    },
    calculateDistance: function() {
      var distance = 0
      for (let k = 1; k < this.orderedItemList.length; k++) {
        console.log(this.orderedItemList[k])
        distance = distance + Math.sqrt(Math.pow(this.orderedItemList[k].item_address.lat - this.orderedItemList[k - 1].item_address.lat, 2) + Math.pow(this.orderedItemList[k].item_address.lng - this.orderedItemList[k - 1].item_address.lng, 2))
      }
      return (distance * 110).toFixed(2)
    }
  },
  watch: {
    value: function(currentValue) {
      this.showMapComponent = currentValue
      if (currentValue) {
        this.keyword = ''
      }
    }
  },
  mounted() {
    this.getReceivers()
    this.getOwnerInfo()
  },
  methods: {
    setPositions() {
      this.position = [{ lng: 121.443, lat: 31.032 }, { lng: 121.447, lat: 31.032433 }]
    },
    /** *
       * 地图点击事件。
       */
    // getClickInfo (e) {
    //   this.center.lng = e.point.lng
    //   this.center.lat = e.point.lat
    // },
    /** *
       * 弹窗地图点击事件。
       */
    setReceiverAddress(e) {
      this.temp.receiver_address.lng = e.point.lng
      this.temp.receiver_address.lat = e.point.lat
      this.temp.receiver_address.title = this.keyword
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    /** *
       * 发布人位置,代商品位置
       * todo:获取其它发布人信息并显示在界面上
       */
    getOwnerInfo() {
      const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/User'
      this.$axios.get(url).then(res => {
        for (var i in res.data.User) {
          const owner = res.data.User[i]

          if (owner.id == this.ownerUID) {
            this.senderName = owner.user_name
            this.senderPhoneNum = owner.phone_num
            console.log(owner)
          }
        }
      })
    },
    /** *
       *  查看常用收件人
       */
    getReceivers() {
      const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver'
      const receiverOfCurrentOwner = []
      this.$axios.get(url).then(res => {
        for (var i in res.data.Receiver) {
          const receiver = res.data.Receiver[i]
          if (receiver.user_uid == this.ownerUID) {
            receiver.receiver_address = JSON.parse(receiver.receiver_address)
            receiverOfCurrentOwner.unshift(receiver)
          }
        }
        this.receiverData = receiverOfCurrentOwner
        this.settedReceiver = this.receiverData[0]
      })
    },
    /** *
       * 选择收件人
       */
    setReceiver(receiverName) {
      for (var i in this.receiverData) {
        if (this.receiverData[i].receiver_name == receiverName) {
          this.settedReceiver = this.receiverData[i]
        }
      }
    },
    /** *
       * 删除常用收件人
       */
    // deleteReceiver(id) {
    //   let url='http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver'
    // this.$axios.delete(url+"id")
    // },
    showDialog() {
      this.dialogFormVisible = true
    },
    /** *
       * 添加收件人
       */
    createReceiver() {
      const newReceiver = {
        user_uid: this.ownerUID,
        receiver_name: this.temp.receiver_name,
        receiver_phone: this.temp.receiver_phone,
        receiver_address: JSON.stringify(this.temp.receiver_address)
      }
      // console.log(this.temp)
      this.receiverData.unshift(this.temp)
      this.$axios(
        {
          url: 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver',
          method: 'post',
          data: JSON.stringify(newReceiver),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function(response) {
          console.log(response)
          // console.log("posted");
        })
        .catch(function(error) {
          console.log(error)
        })
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      })
    },
    /** *
       * 继续添加物品
       */
    addItem() {
      const currentItem = {
        item_name: this.item.productName,
        item_address: {
          lng: this.item.item_address.lng,
          lat: this.item.item_address.lat,
          title: this.item.item_address.title,
          detail: this.item.item_address.detail
        },
        item_des: this.item.des,
        item_state: 'off',
        item_price: 0,
        item_image: '',
        _task_uid: '',
        senderName: this.item.senderName,
        senderPhoneNum: this.item.senderPhoneNum
      }
      this.itemList.unshift(currentItem)

      // 清空输入框
      this.item.productName = ''
      this.item.productSize = ''
      this.item.des = ''
      this.item.item_address.title = ''
      this.item.item_address.lng = ''
      this.item.item_address.lat = ''
      this.item.item_address.detail = ''
      this.item.senderPhoneNum = ''
      this.item.senderName = ''
    },
    // 强制重新生成DOM
    $showReward() {
      this.rewardShow = true
    },
    /**
       * 地图单击时确定取件位置
       */
    setItemAddress(e) {
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
      this.item.item_address.lng = e.point.lng
      this.item.item_address.lat = e.point.lat
      this.item.item_address.title = this.keyword
    },
    /** *
       * 遗传算法确定取件顺序,及在此基础上确定悬赏金
       */
    getPickUpOrder() {
      const _traceList = []
      const _distanceTable = []
      let _startPoint = null
      const _startPointDistance = []
      let _endPoint = null
      const _endPointDistance = []
      _startPoint = { lat: this.itemList[0].item_address.lat, lon: this.itemList[0].item_address.lng }

      _endPoint = { lat: this.settedReceiver.receiver_address.lat, lon: this.settedReceiver.receiver_address.lng }
      // _endPoint = { lat: 6, lon: 9 }
      for (let i = 0; i < this.itemList.length; i++) {
        _traceList.push({ lat: this.itemList[i].item_address.lat, lon: this.itemList[i].item_address.lng })
      }
      for (let i = 0; i < _traceList.length; i++) {
        if (_startPoint) {
          _startPointDistance.push(Math.sqrt(Math.pow(_traceList[i].lat - _startPoint.lat, 2) + Math.pow(_traceList[i].lon - _startPoint.lon, 2)))
        }
        if (_endPoint) {
          _endPointDistance.push(Math.sqrt(Math.pow(_traceList[i].lat - _endPoint.lat, 2) + Math.pow(_traceList[i].lon - _endPoint.lon, 2)))
        }
        _distanceTable.push([])
        for (let j = 0; j < _traceList.length; j++) {
          _distanceTable[i][j] = Math.sqrt(Math.pow(_traceList[i].lat - _traceList[j].lat, 2) + Math.pow(_traceList[i].lon - _traceList[j].lon, 2))
        }
      }
      this.testText = traceRecommend(_traceList, _startPointDistance, _endPointDistance, _distanceTable)

      for (var i in this.testText.trace) {
        this.orderedItemList.unshift(this.itemList[this.testText.trace[i]])
      }
    },
    /*
        *计算费用
        ***/

    /*
         *task JSONStringify
         */
    theReplacer(key, value) {
      if (key === 'total_price') {
        return +value
      } else if (key === 'express_fee') {
        return +value
      } else {
        return value
      }
      // return key === "total_price" ? +value : value;
    },

    /**
       * 发布物品
       */
    submitItem(response) {
      var requestList = []
      for (var item in this.orderedItemList) {
        const completeItem = {
          item_name: this.orderedItemList[item].item_name,
          item_address: JSON.stringify(this.orderedItemList[item].item_address),
          item_des: this.orderedItemList[item].item_des || '',
          item_state: 'off',
          item_price: this.orderedItemList[item].price || 0,
          item_image: '',
          _task_uid: response.data.id
        }
        var newPromise = this.$axios({
          url: 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Item',
          method: 'post',
          data: JSON.stringify(completeItem, this.itemReplacer),
          headers: { 'Content-Type': 'application/json' }
        })
        requestList.push(newPromise)
      }
      console.log('requestList:')
      console.log(requestList)
      this.$axios
        .all(requestList)
      // then中用spread或forEach
        .then(responses => {
          responses.forEach(res => console.log('Success'))
          console.log('submitted all axios calls')
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    /** *
       * 表单提交事件
       */
    onSubmit() {
      // let ownerUID=getUserId()
      // this.$messae
      const newTask = {
        total_price: 0,
        express_fee: this.form.reward,
        current_state: 'released',
        task_type: 'express',
        task_des: this.form.note,
        task_comment: '',
        _owner_uid: getUserId(),
        _receiver_uid: '',
        _postman_uid: '',
        start_time: moment(this.form.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(this.form.end_time).format('YYYY-MM-DD HH:mm:ss'),
        owner_name: this.senderName,
        postman_name: '',
        postman_phone: '',
        receiver_name: this.settedReceiver.receiver_name,
        receiver_address: JSON.stringify(this.settedReceiver.receiver_address),
        receiver_phone: this.settedReceiver.receiver_phone,
        payment_state: ''
      }

      console.log(JSON.stringify(newTask, this.theReplacer))
      this.$axios(
        {
          url: 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task',
          method: 'post',
          data: JSON.stringify(newTask, this.theReplacer),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          console.log('Task posted')
          this.$message('任务创建成功')
          this.$router.push('/userCentre')
          this.submitItem(res)
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  .serachinput {
    width: 400px;
    box-sizing: border-box;
    padding: 9px;
    border: 1px solid #dddee1;
    line-height: 20px;
    font-size: 16px;
    height: 38px;
    color: #333;
    position: relative;
    border-radius: 4px;
    -webkit-box-shadow: #666 0px 0px 10px;
    -moz-box-shadow: #666 0px 0px 10px;
    box-shadow: #666 0px 0px 10px;
  }
</style>
