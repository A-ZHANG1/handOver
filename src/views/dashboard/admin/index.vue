<!--
使用说明:
   v-on:  map-confirm,参数为array数组,传递经纬度值
   v-on   cancel    取消时发出事件
-->
<template>
  <div style="padding-top:50px; border:0px solid red">
    <Modal @on-cancel="cancel" v-model="showMapComponent" width="800" :closable="false" :mask-closable="false">

<el-tabs type="border-card">
  <!-- 采购tab -->
  <el-tab-pane label="采购任务">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商品名">
        <el-input v-model="form.productName"/>
      </el-form-item>
      <el-form-item label="悬赏金">
        <el-input v-model="form.reward"/>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <el-input v-model="form.receiverName"/>
      </el-form-item>
      <el-form-item label="收件地址">

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
        <bm-marker :position="postionMap" />
      </baidu-map>
       </el-form-item>

       <el-form-item>   
        <el-button type="primary" @click="confirm">查看周边递客</el-button>     
        </el-form-item>
     
      <el-form-item label="备注">
        <el-input v-model="form.desc" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-tab-pane>
  <!-- 配送tab -->
  <el-tab-pane label="配送任务">
    

  </el-tab-pane>
</el-tabs>

      
    </Modal>
  </div>  
</template>
<script>
  import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map'
  export default {
    components: {
      BaiduMap,
      BmControl,
      BmView,
      BmAutoComplete,
      BmLocalSearch,
      BmMarker
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
         }
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
    methods: {
      /***
       * 地图点击事件。
       */
      getClickInfo (e) {
        this.center.lng = e.point.lng
        this.center.lat = e.point.lat
        alert( e.point.lng)
      },
      syncCenterAndZoom (e) {
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      },
      /***
       * 确认
       */
      confirm: function () {
        this.showMapComponent = false
        alert("您有要优先选择的递客吗")
        this.$emit('map-confirm', this.center)

      },
      /***
       * 取消
       */
      cancel: function () {
        this.showMapComponent = false
        this.$emit('cancel', this.showMapComponent)
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