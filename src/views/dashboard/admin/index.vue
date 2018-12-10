<!--
使用说明:
   v-on:  map-confirm,参数为array数组,传递经纬度值
   v-on   cancel    取消时发出事件
   showMapComponent: 单击时显示地址详情弹框
   :position 设置在data return 中监听改变
-->
<template>
  <div style="padding-top:50px; border:0px solid red">
    {{ownerUID}}
<el-tabs type="border-card" v-model="showMapComponent">
  <!-- 采购任务tab -->
  <el-tab-pane label="代购">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商品名">
        <el-col :span=12>
          <el-input type="textarea" v-model="form.productName" placeholder="请输入商品名称及特殊要求，如：全家桶一个"/>
        </el-col>
      </el-form-item>
      <el-form-item label="预估费用">
        <el-col :span=12>
          <el-input v-model.number="form.taskPrice" placeholder="不超过500元" type="number"/>
      </el-col>
      </el-form-item>
      <el-form-item label="悬赏金" placeholder="加入悬赏金抢单更快噢">
        <el-col :span=12>
          <el-input v-model.number="form.reward"/>
      </el-col>
      </el-form-item>
     <!--  <el-form-item label="收件人姓名">
        <el-col :span=12>
          <el-input v-model="form.receiverName"/>
        </el-col>
      </el-form-item> -->
      <el-form-item label="收件人">
        <el-col :span=12>
          <el-button @click="showDialog()">添加</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="我的收件人">
        <el-collapse :span=12>
          <el-collapse-item title="常用收件人列表">
            <!-- v-for展开常用收件人 -->
            <el-col :span=12 v-for="receiver in receiverData" :offset="1">
            <el-card>
              <div>
                <!-- {{receiver.address}} -->
                <span>{{receiver.receiver_name}}</span>
                <span>{{receiver.receiver_address.title}}</span>
                <span>{{receiver.receiver_address.detail}}</span>
                <el-button @click="setReceiver">选定</el-button>
                <el-button @click="deleteReceiver(receiver.id)">删除</el-button>
              </div>
            </el-card>
          </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
      <el-form-item label="选择递客">
        <el-col :span=12>
      <baidu-map v-bind:style="mapStyle" class="bm-view" ak="K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy"
      :center="center" 
      :zoom="zoom" 
      :scroll-wheel-zoom="true" 
      @click="getClickInfo"
      @moving="syncCenterAndZoom" 
      @moveend="syncCenterAndZoom" 
      @zoomend="syncCenterAndZoom">
        <bm-view style="width: 100%; height:500px;"></bm-view>
        <!-- <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker> -->
        <bm-control :offset="{width: '10px', height: '10px'}">
          <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
            <input type="text" placeholder="请输入搜索关键字" class="serachinput">
          </bm-auto-complete>
        </bm-control>
        <bm-local-search :keyword="keyword" :auto-viewport="true" style="width:0px;height:0px;overflow: hidden;"></bm-local-search>

        <bm-point-collection :points="position" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_SMALL" @click="showPostManInfo"></bm-point-collection>
        <!-- <bm-marker v-for="marker of position" :position="{lng: marker.lng, lat: marker.lat}"></bm-marker> -->
      {{position}}
      {{keyword}}
      </baidu-map>
    </el-col>
       </el-form-item>

       <el-form-item>   
        <el-col :span=12>
          <el-button type="primary" @click="showRecommendedPostman">查看周边递客</el-button>   
        </el-col>  
        </el-form-item>
     
      <el-form-item label="备注">
        <el-col :span=12>
          <el-input v-model="form.note" type="textarea"/>
      </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
        <!-- <el-button @click="onCancel">取消</el-button> -->
      </el-form-item>
    </el-form>
  </el-tab-pane>
  <!-- 配送任务tab -->
  <el-tab-pane label="跑腿">
    

  </el-tab-pane>
</el-tabs>

<!-- 添加收件人 弹窗-->

  <el-dialog  title="添加收件人" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"  :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        {{temp.receiver_name}}
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

        <bm-marker :position="{lng:temp.receiver_address.lng,lat:temp.receiver_address.lat}" >
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
  import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker,BmPointCollection} from 'vue-baidu-map'
  import { getUserId } from '@/utils/auth'

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
    data: function () {
      return {
        ownerUID:getUserId(),
        showMapComponent: this.value,
        keyword: '软件学院',
        receiverAddressKeyword: '学生西67舍',
        mapStyle: {
          width: '100%',
          height: this.mapHeight + 'px'
        },
        center: {lng: 121.443, lat:31.032},
        zoom: 15,
        // form: {
        //     productName: '',
        //     taskPrice:'',
        //     reward: '',
        //     receiverName: '',
        //     note: ''
        //  },
        form: {
            productName: '电脑',
            taskPrice:'100',
            reward: '5',
            receiverName: '张三',
            note: '随手1'
         },
         temp:{
            receiver_name:'',
            receiver_address:{
              title:'',
              lng:'121',
              lat:'31',
              detail:''
            },
            receiver_phone:''
         },
         position:[],
         receiverData:[],
         receiverOfCurrentOwner:[],
         dialogFormVisible: false,

      }      
    },
    watch: {
      value: function (currentValue) {
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
    updated(){
      // this.setPositions()
      
    },
    mounted(){
      this.getReceivers()
    },
    methods: {
      setPositions(){
          this.position=[{lng: 121.443, lat:31.032},{lng: 121.447, lat:31.032433}]
      },
      /***
       * 地图点击事件。
       */
      getClickInfo (e) {
        this.center.lng = e.point.lng
        this.center.lat = e.point.lat
     
      },
      /***
       * 弹窗地图点击事件。
       */
      setReceiverAddress (e) {
        this.center.lng = e.point.lng
        this.center.lat = e.point.lat
        this.temp.receiver_address.lng=e.point.lng
        this.temp.receiver_address.lat=e.point.lat
        console.log(this.temp.receiver_address)
      },
      syncCenterAndZoom (e) {
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      },
      /***
      *  查看常用收件人
      */
      getReceivers(){
        let url='http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver'
        let receiverOfCurrentOwner=[]
        this.$axios.get(url).then(res => {
          // console.log(res.data.Receiver)
          // this.receiverData=res.data.Receiver
          for (var i in res.data.Receiver) {
            let receiver = res.data.Receiver[i]
            // console.log(receiver.user_uid)
            if(receiver.user_uid==this.ownerUID){
              // console.log("added")
              receiver.receiver_address = JSON.parse(receiver.receiver_address)
              receiverOfCurrentOwner.unshift(receiver)
            }
            
          }
          this.receiverData=receiverOfCurrentOwner
          // console.log(this.receiverOfCurrentOwner)
          // console.log(this.receiverData)
              })  
      },
      /***
       * 选择收件人
       */
      showRecommendedPostman() {
        
        this.setPositions()

      },
      /***
       * 删除常用收件人
       */
      // deleteReceiver(id) {
      //   let url='http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver'
      // this.$axios.delete(url+"id")
      // },
      showDialog(){
        this.dialogFormVisible=true
      },
      /***
       * 添加收件人
       */
      createReceiver(){
        let newReceiver={
                user_uid:this.ownerUID,
                receiver_name:this.temp.receiver_name,
                receiver_phone:this.temp.receiver_phone,
                receiver_address:JSON.stringify(this.temp.receiver_address)
            }
        console.log(this.temp)
        this.receiverData.unshift(this.temp)

        this.$axios(
              {
                url:'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/', 
                method:"post",
                data:JSON.stringify(newReceiver),
                headers:{
                  'Content-Type':'application/json'
                }
              })
              .then(function (response) {
              console.log(response);
              console.log("posted");
            })
            .catch(function (error) {
              console.log(error);
            });


        this.dialogFormVisible = false
        this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })

      },
      /***
       * 查看周边递客
       */
      showRecommendedPostman() {
        
        this.setPositions()

      },
      /***
       * 单击时查看递客详情及是否选定确认按钮
       */
      showPostManInfo(){

      },
      theReplacer(key, value) {
        if(key=== "total_price"){return +value}
        else if(key==="express_fee"){return +value}
        else{return value}
         // return key === "total_price" ? +value : value;
      },
      /***
       * 表单提交事件
       */
      onSubmit(){
        // let ownerUID=getUserId()
        let newTask={
                  total_price:this.form.taskPrice,
                  express_fee:this.form.reward,
                  current_state:"released",
                  task_type:"purchase",
                  task_des:this.keyword,
                  task_comment:this.note,
                  _owner_uid:"1542712704340"
                }

     // console.log(JSON.stringify(newTask,this.theReplacer));           
        this.$axios(
              {
                url:'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task', 
                method:"post",
                data:JSON.stringify(newTask,this.theReplacer),
                headers:{
                  'Content-Type':'application/json'
                }
              })
              .then(function (response) {
              console.log(response);
              console.log("posted");
            })
            .catch(function (error) {
              console.log(error);
            });
      }
    }
  }
</script>
 
<style scoped>
.serachinput{
  width: 300px;
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