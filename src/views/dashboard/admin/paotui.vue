<!--
使用说明:
   v-on:  map-confirm,参数为array数组,传递经纬度值
   v-on   cancel    取消时发出事件
   showMapComponent: 单击时显示地址详情弹框
   :position 设置在data return 中监听改变
-->
<template>
  <div style="padding-top:50px; border:1px solid lightGrey;width=1980px;">
    <el-tabs type="border-card" v-model="showMapComponent">

      <!-- 配送任务tab -->
      <el-tab-pane label="跑腿">
        <el-form ref="item" :model="item" label-width="120px">
          <!-- 添加待取件物品 -->
          <el-form-item>
            <div style="font-size:26px;color:gray;">物品信息</div>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="8">
                <el-input v-model="item.productName" placeholder="物品名称">
                </el-input>
              </el-col>
              <el-col :offset="2" :span=4>
                <el-input v-model="item.productSize" placeholder="预估重量">
                  <template slot="append">kg</template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item>

            <el-col :span="14">
              <el-input type="textarea" v-model="item.des" placeholder="简要描述"></el-input>
            </el-col>
          </el-form-item>

          <!-- 取件地址 -->
          <el-form-item>
            <el-col :span=12>
              <baidu-map v-bind:style="mapStyle" class="bm-view" ak="K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy"
                         :center="center"
                         :zoom="zoom"
                         :scroll-wheel-zoom="true"
                         @click="setItemAddress"
                         @moving="syncCenterAndZoom"
                         @moveend="syncCenterAndZoom"
                         @zoomend="syncCenterAndZoom">
                <bm-view style="width: 100%; height:500px;"></bm-view>

                <bm-control :offset="{width: '10px', height: '10px'}">
                  <!-- v-model="temp.receiver_address.title" -->
                  <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
                    <input type="text" placeholder="请填写取件地址，如：闵行交大学生西67舍" class="serachinput">
                  </bm-auto-complete>
                </bm-control>
                <bm-local-search :keyword="keyword" :auto-viewport="true"
                                 style="width:0px;height:0px;overflow: hidden;"></bm-local-search>
                <bm-marker :position="{lng:item.item_address.lng,lat:item.item_address.lat}">
                </bm-marker>
              </baidu-map>
            </el-col>

          </el-form-item>

          <!-- 新建物品 -->
          <el-form-item>
            <el-col :offset="10">
              <el-button type="success" @click="addItem">确认添加</el-button>
            </el-col>
          </el-form-item>

          <!-- 显示当前物品信息 -->
          <el-form-item>
            <div style="font-size:26px;color:gray;">已添加物品</div>
            <el-table :data="itemList" highlight-current-row>
              <el-table-column prop="item_name" width="180"/>
              <el-table-column prop="item_address.title" width="380"/>
              <el-table-column prop="senderPhoneNum" width="180"/>
              <!-- <el-table-column prop="receiver_phone" width="180"/> -->
              <el-table-column>
                <template scope="scope">
                  <el-button type="info" icon="el-icon-goods" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="任务开始时间" placeholder="任务开始时间">
            <el-date-picker
              v-model="form.start_time"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务截止时间" placeholder="任务截止时间">
            <el-date-picker
              v-model="form.end_time"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>
          <!-- 任务悬赏金设置 -->
          <el-form-item label="悬赏金" placeholder="系统预估费用">
            <el-row>
              <el-col :span=12>
                <el-input v-model.number="form.express_fee"/>
              </el-col>
            </el-row>
            <el-row>
              <span>系统推荐悬赏金：￥</span>
            </el-row>
          </el-form-item>

          <!-- 选择收件人 -->
          <el-form-item label="收件人" size="mini" required="true">
            <div style="padding-button:5px; border:1px solid LightGrey;width:820px;">
              <el-collapse :according=true>
                <el-collapse-item>
                  <!-- <el-collapse-item :title="settedReceiver.receiver_name"> -->
                  <template slot="title">
                    <div style="font-size:28px;color:gray;">{{settedReceiver.receiver_name}} @
                      {{settedReceiver.receiver_address.title}}
                    </div>
                  </template>
                  <!-- v-for展开常用收件人 -->
                  <el-col>
                    <el-table :data="receiverData" highlight-current-row>
                      <el-table-column prop="receiver_name" width="80"/>
                      <el-table-column prop="receiver_address.title" width="380"/>
                      <el-table-column prop="receiver_address.detail" width="180"/>
                      <el-table-column prop="receiver_phone" width="180"/>
                      <el-table-column>
                        <template scope="scope">
                          <el-button type="info" icon="el-icon-check" circle
                                     @click="setReceiver(scope.row.receiver_name)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                  <el-col>
                    <el-card>
                      <el-button type="success" @click="showDialog()">添加</el-button>
                    </el-card>
                  </el-col>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-form-item>


          <el-form-item label="备注">
            <el-col :span=12>
              <el-input v-model="form.task_des" type="textarea"/>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">发布</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加收件人 弹窗-->
    <el-dialog title="添加收件人" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <!-- {{temp.receiver_name}}{{temp.receiver_address}}{{temp.receiver_tel}} -->
        <el-form-item label="姓名">
          <el-input v-model="temp.receiver_name"/>
        </el-form-item>
        <el-form-item label="地址">
          <baidu-map v-bind:style="mapStyle" class="bm-view" ak="K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy"
                     :center="center"
                     :zoom="zoom"
                     :scroll-wheel-zoom="true"
                     @click="setReceiverAddress"
                     @moving="syncCenterAndZoom"
                     @moveend="syncCenterAndZoom"
                     @zoomend="syncCenterAndZoom">
            <bm-view style="width: 100%; height:500px;"></bm-view>

            <bm-control :offset="{width: '10px', height: '10px'}">
              <!-- v-model="temp.receiver_address.title" -->
              <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
                <input type="text" placeholder="如：闵行交大学生西67舍1" class="serachinput">
              </bm-auto-complete>
            </bm-control>

            <bm-marker :position="{lng:temp.receiver_address.lng,lat:temp.receiver_address.lat}">
            </bm-marker>
          </baidu-map>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input placeholder="如：5310室" v-model="temp.receiver_address.detail"/>
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
    name: 'paotui',
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
        current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        ownerUID: getUserId(),
        senderName: null,
        senderPhoneNum: null,
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
          express_fee: 0,
          task_des: '如果收件人不在，放在工位上就可以了',
          start_time: '',
          end_time: ''
        },
        item: {
          productName: '顺丰快递',
          productSize: 5,
          des: '淘宝到货的毛巾架',
          item_address: {
            title: '',
            lng: '',
            lat: '',
            detail: ''
          }
        },
        itemList: [],
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
    watch: {
      value: function(currentValue) {
        this.showMapComponent = currentValue
        if (currentValue) {
          this.keyword = ''
        }
      }
    },
    props: {
      value: Boolean,
      mapHeight: {
        type: Number,
        default: 500
      }
    },
    mounted() {
      this.getReceivers()
      this.getOwnerInfo()

    },
    computed: {},
    methods: {
      setPositions() {
        this.position = [{ lng: 121.443, lat: 31.032 }, { lng: 121.447, lat: 31.032433 }]
      },
      /***
       * 地图点击事件。
       */
      // getClickInfo (e) {
      //   this.center.lng = e.point.lng
      //   this.center.lat = e.point.lat
      // },
      /***
       * 弹窗地图点击事件。
       */
      setReceiverAddress(e) {
        // this.center.lng = e.point.lng
        // this.center.lat = e.point.lat
        this.temp.receiver_address.lng = e.point.lng
        this.temp.receiver_address.lat = e.point.lat
        this.temp.receiver_address.title = this.keyword
        // console.log(this.temp.receiver_address)
      },
      syncCenterAndZoom(e) {
        const { lng, lat } = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      },
      /***
       * 发布人位置,代商品位置
       * todo:获取其它发布人信息并显示在界面上
       */
      getOwnerInfo() {
        let url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/User'
        this.$axios.get(url).then(res => {
          for (var i in res.data.User) {
            let owner = res.data.User[i]

            if (owner.id == this.ownerUID) {
              this.senderName = owner.user_name
              this.senderPhoneNum = owner.phone_num
              console.log(owner)
            }
          }
        })
        // console.log(this.itemPosition)

      },
      /***
       *  查看常用收件人
       */
      getReceivers() {
        let url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver'
        let receiverOfCurrentOwner = []
        this.$axios.get(url).then(res => {
          for (var i in res.data.Receiver) {
            let receiver = res.data.Receiver[i]
            // console.log(receiver.user_uid)
            if (receiver.user_uid == this.ownerUID) {
              // console.log("added")
              receiver.receiver_address = JSON.parse(receiver.receiver_address)
              receiverOfCurrentOwner.unshift(receiver)
            }
          }
          this.receiverData = receiverOfCurrentOwner
          this.settedReceiver = this.receiverData[0]
        })
        // console.log("userId:")
        // console.log(getUserId())
      },
      /***
       * 选择收件人
       */
      setReceiver(receiverName) {
        for (var i in this.receiverData) {
          // console.log("receivers:",this.receiverData[i].receiver_name)
          if (this.receiverData[i].receiver_name == receiverName) {
            // console.log("setted receiver:")
            // console.log(this.receiverData[i])
            this.settedReceiver = this.receiverData[i]
            // this.temp=receiver
          }
        }
      },
      /***
       * 删除常用收件人
       */
      // deleteReceiver(id) {
      //   let url='http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver'
      // this.$axios.delete(url+"id")
      // },
      showDialog() {
        this.dialogFormVisible = true
      },
      /***
       * 添加收件人
       */
      createReceiver() {
        let newReceiver = {
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
      /***
       * 继续添加物品
       */
      addItem() {
        let currentItem = {
          item_name: this.item.productName,
          item_address: {
            lng: this.item.item_address.lng,
            lat: this.item.item_address.lat,
            title: this.item.item_address.title
          },
          item_des: this.item.des,
          item_state: 'off',
          item_price: 0,
          item_image: 'nan',
          _task_uid: 'nan'
        }
        this.itemList.unshift(currentItem)
// console.log(currentItem)
        //清空输入框
        this.item.productName = ''
        this.item.productSize = ''
        this.item.des = ''
        this.item.item_address.title = ''
        this.item.item_address.lng = ''
        this.item.item_address.lat = ''
        this.item.item_address.detail = ''
        console.log(this.itemList)
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
      /***
       * 遗传算法确定取件顺序
       */
      addAnotherPickUpAddress(pickUp_address) {

        const _traceList = this.pickUp_address
        const _distanceTable = []
        let _startPoint = null
        const _startPointDistance = []
        let _endPoint = null
        const _endPointDistance = []
        _startPoint = { lat: -1, lon: 0 }
        _endPoint = { lat: 6, lon: 9 }
        _traceList.push({ lat: 0, lon: 0 })
        _traceList.push({ lat: 0.5, lon: 0 })
        _traceList.push({ lat: 1, lon: 0 })
        _traceList.push({ lat: 1.5, lon: 0 })
        _traceList.push({ lat: 2, lon: 0 })
        _traceList.push({ lat: 2.5, lon: 0 })
        _traceList.push({ lat: 3, lon: 0 })
        _traceList.push({ lat: 3.75, lon: 1 })
        _traceList.push({ lat: 4.5, lon: 2 })
        _traceList.push({ lat: 5.25, lon: 3 })
        _traceList.push({ lat: 6, lon: 4 })
        _traceList.push({ lat: 6, lon: 4.5 })
        _traceList.push({ lat: 6, lon: 5 })
        _traceList.push({ lat: 6, lon: 5.5 })
        _traceList.push({ lat: 6, lon: 6 })
        _traceList.push({ lat: 6, lon: 6.5 })
        _traceList.push({ lat: 6, lon: 7 })
        _traceList.push({ lat: 6, lon: 7.5 })
        _traceList.push({ lat: 6, lon: 8 })
        _traceList.push({ lat: 6, lon: 8.5 })
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
        this.task_des = traceRecommend(_traceList, _startPointDistance, _endPointDistance, _distanceTable)
      },
      /***
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
        for (var i in this.itemList) {
          let completeItem = {
            item_name: this.itemList[i].item_name,
            item_address: JSON.stringify(this.itemList[i].item_address),
            item_des: this.itemList[i].des,
            item_state: 'off',
            item_price: this.itemList[i].item_price,
            item_image: '',
            _task_uid: response.data.id
          }
          console.log(JSON.stringify(completeItem, this.itemReplacer))
          this.$axios({
            url: 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Item',
            method: 'post',
            data: JSON.stringify(completeItem, this.itemReplacer),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => {
            console.log(res)
            console.log('item submitted')
          })
            .catch(function(error) {
              console.log(error)
            })
        }
      },
      /***
       * 表单提交事件
       */
      onSubmit() {
        // let ownerUID=getUserId()
        let newTask = {
          total_price: this.itemList.reduce((a, b) => a + b.price, 0),
          current_state: 'released',
          task_type: 'express',
          _owner_uid: getUserId(),
          receiver_name: this.settedReceiver.receiver_name,
          receiver_address: JSON.stringify(this.settedReceiver.receiver_address),
          receiver_phone: this.settedReceiver.receiver_phone,
          ...this.form,
          start_time: moment(this.form.start_time).format('YYYY-MM-DD HH:mm:ss'),
          end_time: moment(this.form.end_time).format('YYYY-MM-DD HH:mm:ss'),
        }

        this.$axios(
          {
            url: 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task',
            method: 'post',
            data: JSON.stringify(newTask),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => {
            console.log('Task posted')
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
