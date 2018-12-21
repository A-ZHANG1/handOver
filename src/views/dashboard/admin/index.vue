<!--
使用说明:
   v-on:  map-confirm,参数为array数组,传递经纬度值
   v-on   cancel    取消时发出事件
   showMapComponent: 单击时显示地址详情弹框
   :position 设置在data return 中监听改变
-->
<template>
  <div style="padding-top:50px; border:0px solid LightGrey;width:980px;">
    <!-- {{current_time}}
    {{end_time}} -->
    <el-form label-width="120px" v-model="showMapComponent">

<!-- 动态添加商品和位置的表格 -->
<el-form :model="dynamicValidateForm" label-width="100px">
  <!-- 商品名 --> 
      <!-- :label="'商品名' + index" -->
      <!-- :key="domain.key" -->
  <el-form-item><div style="font-size:26px;color:gray;">代购任务</div></el-form-item>

<div style="margin:0px 0px 20px 110px;padding:0;width:820px;height:1px;background-color:lightGrey;overflow:hidden;"></div>

  <el-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"
    :key="domain.key"
    :prop="'domains.' + index + '.value'"
    style="width: 900px;"
    :label="'代购物品' + (index+1)" 
  >
  <el-row :gutter="32">
  <el-col :span="6">
    <el-input v-model="domain.value" placeholder="品名"></el-input>
  </el-col>
  <el-col :span="4">
    <el-input v-model.number="domain.price" placeholder="预估价格"></el-input>
  </el-col>
  <el-col :span="10">
    <el-input v-model="domain.des" placeholder="商品描述"></el-input>
  </el-col>
  <el-col :span="2">
      <el-button v-if="index!=0" @click="removeDomain(domain)" icon="el-icon-minus" type="" circle plain></el-button>
  </el-col>
  <el-col :span="2">
      <el-button v-if="index===0" @click="addDomain" icon="el-icon-plus" type="" circle plain></el-button>
    </el-col>
  </el-row>
  </el-form-item>

<!-- 显示总价 -->
<el-form-item>
  <el-row>
    <el-col :offset="0">
    <!-- <div v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">{{domain.price}}</div> -->
      <div  style="font-size:16px;color:gray;align:left;padding-left:18px;">预估总价:{{itemPriceSum()}}</div>
    </el-col>
  </el-row>
</el-form-item>
</el-form>

<!-- 选择收件人 -->
      <el-form-item label="收件人"  required="true">           
      <div style="padding-button:5px; border:0px solid LightGrey;width:820px;">
        <el-collapse :according=true>
          <el-collapse-item>
          <!-- <el-collapse-item :title="settedReceiver.receiver_name"> -->
            <template slot="title"><div style="font-size:16px;color:gray;">{{settedReceiver.receiver_name}} @ {{settedReceiver.receiver_address.title}}</div>
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

                    <el-button :type="settedReceiver.receiver_name===scope.row.receiver_name?'success':''"  icon="el-icon-check" circle @click="setReceiver(scope.row.receiver_name)"></el-button>
                    <!-- <el-button v-else type="info"  icon="el-icon-check" circle @click="setReceiver(scope.row.receiver_name)"></el-button> -->
                  </template>
                </el-table-column> 
            </el-table>
            </el-col>
            </el-row>
            <el-row>
            <el-col >
              <el-button @click="showDialog()" icon="el-icon-circle-plus-outline" plain>新建</el-button>
            </el-col>              
            </el-row>  
          </el-collapse-item>
        </el-collapse> 
        </div>
      </el-form-item> 

<!-- 系统推荐悬赏金 -->
  <el-form-item label="悬赏金" placeholder="系统预估费用" style="width: 900px;">
        <el-row>
        <el-col :span="4">
          <el-input v-model.number="form.reward"/>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button @click="$showReward()">推荐</el-button>
        </el-col>
        </el-row>
        <el-row>
          <span v-if="rewardShow">系统推荐悬赏金：￥ {{getOwnerInfo()}}</span>
        </el-row>
  </el-form-item>

      <el-form-item label="任务时间" placeholder="任务开始时间">
        <el-row>
          <el-col :span="3">
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions1">
        </el-date-picker>
</el-col>
      <el-col :span="3" :offset="4">
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions1">
        </el-date-picker>
      </el-col>
        </el-row>
      </el-form-item>
      <!-- <el-form-item label="任务截止时间" placeholder="任务截止时间"> -->
        
      <!-- </el-form-item> -->

      <el-form-item label="备注">
        <el-col :span=23>
          <el-input v-model="form.note" type="textarea"/>
      </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>

    </el-form>

<!-- 添加收件人 弹窗-->
  <el-dialog  title="添加收件人" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"  :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
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
      <!-- 地图显示 -->
        <bm-view style="width: 100%; height:500px;"></bm-view>
        <!-- 自动补全 -->
        <bm-control :offset="{width: '10px', height: '10px'}">
          <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
            <input type="text" placeholder="如：闵行交大学生西67舍" class="serachinput">
          </bm-auto-complete>
        </bm-control>
        <!-- 搜索功能 -->
        <bm-local-search :keyword="keyword" :auto-viewport="true" style="width:0px;height:0px;overflow: hidden;"></bm-local-search>
        <!-- 单击取点功能 -->
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
  import moment from "moment"

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
        rewardShow:false,
        recommandReward:0,
        current_time:moment().format('YYYY-MM-DD HH:mm:ss'),
        end_time:moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        ownerUID:getUserId(),
        showMapComponent: this.value,
        keyword: '',
        // receiverAddressKeyword: '学生西67舍',
        mapStyle: {
          width: '100%',
          height: this.mapHeight + 'px'
        },
        center: {lng: 121.443, lat:31.032},
        zoom: 15,       
        form: {
            priceSum:0,  
            note: '',
            start_time: '',
            end_time: ''
         },
         dynamicValidateForm: {
          domains: [{
            value: '',
            price:null,
            des:''
          }]
         },
         itemPosition:null,
        // form: {
        //     productName: '电脑',
        //     taskPrice:'100',
        //     reward: '5',
        //     note: '随手1'
        //  },
         temp:{
            receiver_name:'',
            receiver_address:{
              title:'',
              lng:'121.00',
              lat:'31.00',
              detail:''
            },
            receiver_phone:''
         },
        //  position:[],//marker position
         receiverData:null,
         settedReceiver:[],
         dialogFormVisible: false,
      }      
    },
    // computed:{
    //   itemSum:function(){
    //     var sum=0
    //     for(var domain in this.dynamicValidateForm.domains)
    //         return domain.price;
    //   }
    // },
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
    mounted(){
      this.getReceivers()
      this.getOwnerInfo()
    },
    methods: {
      /***
       * 删除物品输入框
       */
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      /***
       * 添加物品输入框
       */
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          price:'',
          key: Date.now()
        });
      },
      //强制重新生成DOM
      $showReward(){
        this.rewardShow=true
      },
      setPositions(){
          this.position=[{lng: 121.443, lat:31.032},{lng: 121.447, lat:31.032433}]
      },
      showReward(){
        return this.recommandReward
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
        this.temp.receiver_address.title=this.keyword
        // console.log(this.temp.receiver_address)
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
          for (var i in res.data.Receiver) {
            let receiver = res.data.Receiver[i]
            if(receiver.user_uid==this.ownerUID){
              receiver.receiver_address = JSON.parse(receiver.receiver_address)
              receiverOfCurrentOwner.unshift(receiver)
            }     
          }
          this.receiverData=receiverOfCurrentOwner
          this.settedReceiver=this.receiverData[0]
              })
      },
      /***
       * 选择收件人
       */
      setReceiver(receiverName) {
        for(var i in this.receiverData){
          // console.log("receivers:",this.receiverData[i].receiver_name)
          if(this.receiverData[i].receiver_name==receiverName){ 
            // console.log("setted receiver:")
            // console.log(this.receiverData[i])
            this.settedReceiver=this.receiverData[i]
            // this.temp=receiver
             console.log("setted receiver:")
             console.log(this.settedReceiver)
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
        // console.log(this.temp)
        this.receiverData.unshift(this.temp)
        this.$axios(
              {
                url:'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Receiver', 
                method:"post",
                data:JSON.stringify(newReceiver),
                headers:{
                  'Content-Type':'application/json'
                }
              })
              .then(function (response) {
              console.log(response);
              // console.log("posted");
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
       * 发布人位置,代商品位置
       */
      getOwnerInfo() {
        let url='http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/User'
        this.$axios.get(url).then(res=>{
          for(var i in res.data.User){
            // console.log(res.data)
            let owner=res.data.User[i]    
            if(owner.id==this.ownerUID){
              // console.log("if entered")          
              this.itemPosition=JSON.parse(owner.current_pos)
              this.ownerName=owner.user_name
            }
          }
               console.log("itemPosition:")
               console.log(this.itemPosition) 
               console.log(this.itemPosition.lat)  
               this.recommandReward=10+1800*Math.sqrt(Math.pow(this.settedReceiver.receiver_address.lat-this.itemPosition.lat,2),Math.pow(this.settedReceiver.receiver_address.lng-this.itemPosition.lng,2)) 
               console.log(this.recommandReward)  
        })
        // console.log("current position:")
        // console.log(this.itemPosition)  
        return this.recommandReward.toFixed(2)                   
      },      
      theReplacer(key, value) {
        if(key=== "total_price"){return +value}
        else if(key==="express_fee"){return +value}
        else{return value}
         // return key === "total_price" ? +value : value;
      },
      itemReplacer(key, value) {
         return key === "item_price" ? +value : value;
      },
      /**
       * 计算物品总价
       */
      itemPriceSum(){
        let sum=0
        for(var i in this.dynamicValidateForm.domains){
         sum=sum+this.dynamicValidateForm.domains[i].price;
        }          
        return sum
      },
      /**
       * 发布物品
       */
      submitItem(response){
          let itemList=this.dynamicValidateForm.domains;
          for(var item in itemList){
            let completeItem={
              item_name:itemList[item].value,
              item_address:this.itemPosition,
              item_des:itemList[item].des,
              item_state:"off",
              item_price:itemList[item].price,
              item_image:"",
              // _task_uid:"nan"
              _task_uid:response.data.id
            }
            // console.log(this.itemList[0].item_address)
            console.log(JSON.stringify(completeItem,this.itemReplacer))
            this.$axios({
                url:'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Item', 
                method:"post",
                data:JSON.stringify(completeItem,this.itemReplacer),
                headers:{
                  'Content-Type':'application/json'
                }
              }).then(res=> {
              console.log(response);
              console.log("item submitted")
            })
            .catch(function (error) {
              console.log(error);
            });
          }
      },
      /***
       * 表单提交事件
       */
      onSubmit(){
        // let ownerUID=getUserId()
        let newTask={
                  total_price:this.itemPriceSum(),
                  express_fee:"0",
                  current_state:"released",
                  task_type:"purchase",
                  task_des:this.form.note,
                  task_comment:"",
                  _owner_uid:getUserId(),
                  _receiver_uid:this.settedReceiver.user_uid,
                  _postman_uid:"",
                  // start_time:this.current_time,
                  // end_time:this.end_time,
                  start_time:  moment(this.form.start_time).format('YYYY-MM-DD HH:mm:ss'),
                  end_time: moment(this.form.end_time).format('YYYY-MM-DD HH:mm:ss'),
                  owner_name:this.ownerName,
                  postman_name:"",
                  postman_phone:"",
                  receiver_name:this.settedReceiver.receiver_name,
                  receiver_address:JSON.stringify(this.settedReceiver.receiver_address),
                  receiver_phone:this.settedReceiver.receiver_phone,
                  payment_state:""
                }
        console.log(JSON.stringify(newTask,this.theReplacer));         
        this.$axios(
              {
                url:'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task', 
                method:"post",
                data:JSON.stringify(newTask,this.theReplacer),
                headers:{
                  'Content-Type':'application/json'
                }
              })
        // let url="http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Task"  
        // this.$axios.post(url,JSON.stringify(newTask,this.theReplacer))
        // 不能用.then(function(response){ 否则this.submitItem()会报this undefined
              .then(res=> {
                console.log("task posted")
                // console.log(response)
              // console.log(response.data.id);
              //发布物品
              this.submitItem(res)
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