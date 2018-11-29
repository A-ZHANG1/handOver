<template>
<!--   <div class="dashboard-editor-container">
 -->
  <div>
     <div class=" clearfix">
       Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Admin's Dashboard</span>
      </div>
    </div>
  <!--   <div>
      <img :src="adminGif" class="emptyGif">
    </div> -->
    <!-- :zoom="zoom" -->
      <baidu-map class="map" center="中国" :dragging="true" :pinch-to-zoom="true" :scroll-wheel-zoom="true" >
        <!-- @ready="handler"> -->
        <!-- 获取当前定位 -->
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        <!-- 城市列表 -->
        <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
        <!-- 显示定点 -->
        <bml-marker-clusterer :averageCenter="true">
          <bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}"></bm-marker>
        </bml-marker-clusterer>
  </baidu-map>

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

          <label>地址：<input v-model="keyword"></label>

          <!-- <baidu-map class="map" center="上海" :dragging="true" :pinch-to-zoom="true" :scroll-wheel-zoom="true" @click="getPoint" > -->
            <baidu-map class="map" center="杭州市" :zoom="zoom" :scroll-wheel-zoom="true" @click="getPoint" >
            <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
            <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" zoom="12.8" style="display: none"></bm-local-search>

            <bm-marker :position="postionMap" >
            <bm-info-window :show="show" style="font-size: 14px">
            <!--   <p>站点：{{ add.siteName }}</p>
              <p>站点地址：{{ add.site }}</p> -->
            </bm-info-window>
          </bm-marker>

          </baidu-map>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {BmlMarkerClusterer} from 'vue-baidu-map'
import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map'
export default {
  name: 'DashboardAdmin',
  data() {
    // 插入 10 个随机点
    const markers = []
    for (let i = 0; i < 10; i++) {
      const position = {lng: Math.random() * 40 + 85, lat: Math.random() * 30 + 21}
      markers.push(position)
      // console.log(position)
    }
    return {
      // center: "中国",
      // center: {lng: 0, lat: 0},
      // zoom: 3,
      markers,
      form: {
        productName: '',
        reward: '',
        receiverName: '',
        keyword: '',
        note: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    getPoint(e){
      this.show = true;
      this.postionMap.lng = e.point.lng;     //通过  e.point.lng获取经度
      this.postionMap.lat = e.point.lat;     //通过  e.point.lat获取纬度
      // this.add.jd = e.point.lng;
      // this.add.wd = e.point.lat;
      this.zoom = e.target.getZoom()
 
      let geocoder= new BMap.Geocoder();  //创建地址解析器的实例
      geocoder.getLocation(e.point,rs=>{
      // this.add.site = rs.address;
      console.log(rs.address)
    });

    }
  },
  components: {
    BmlMarkerClusterer,
    BaiduMap,
      BmControl,
      BmView,
      BmAutoComplete,
      BmLocalSearch,
      BmMarker
  },
  // methods: {
  //   handler ({BMap, map}) {
  //     console.log(BMap, map)
  //     this.center.lng = 116.404
  //     this.center.lat = 39.915
  //     this.zoom = 15
  //   }
  // },
  computed: {
    ...mapGetters([
      'name',
      // 'avatar',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }
  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
  /* 地图容器必须设置宽和高属性 */
.map {
  width: 500px;
  height: 500px;
}
</style>