<!--
使用说明:
   v-on:  map-confirm,参数为array数组,传递经纬度值
   v-on   cancel    取消时发出事件
   showMapComponent: 单击时显示地址详情弹框
   :position 设置在data return 中监听改变
-->
<template>
  <div style="padding-top:50px; border:0px solid red">
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
          <el-input v-model="form.taskPrice" placeholder="不超过500元"/>
      </el-col>
      </el-form-item>
      <el-form-item label="悬赏金" placeholder="加入悬赏金抢单更快噢">
        <el-col :span=12>
          <el-input v-model="form.reward"/>
      </el-col>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <el-col :span=12>
          <el-input v-model="form.receiverName"/>
        </el-col>
      </el-form-item>
      <el-form-item label="收件地址">
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
          <el-input v-model="form.desc" type="textarea"/>
      </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-tab-pane>
  <!-- 配送任务tab -->
  <el-tab-pane label="跑腿">
    

  </el-tab-pane>
</el-tabs>

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
        showMapComponent: this.value,
        keyword: '',
        mapStyle: {
          width: '100%',
          height: this.mapHeight + 'px'
        },
        // 121.443287,31.03201
        center: {lng: 121.443, lat:31.032},
        zoom: 15,
        form: {
            productName: '',
            reward: '',
            receiverName: '',
            keyword: '',
            note: ''
         },
         position:[],
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
    created(){
      // this.setPositions()
    },
    mounted(){
        // this.setPositions()
        console.log(getUserId())
        console.log("mounted")
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
        // alert(e.point.lng)
        // alert(e.point.lat)
     
      },
      syncCenterAndZoom (e) {
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
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
      /***
       * 表单提交事件
       */
      onSubmit(){
        
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