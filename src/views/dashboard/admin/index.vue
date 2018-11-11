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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {BmlMarkerClusterer} from 'vue-baidu-map'

export default {
  name: 'DashboardAdmin',
  data() {
    // 插入 10 个随机点
    const markers = []
    for (let i = 0; i < 10; i++) {
      const position = {lng: Math.random() * 40 + 85, lat: Math.random() * 30 + 21}
      markers.push(position)
      console.log(position)
    }
    return {
      // center: "中国",
      // center: {lng: 0, lat: 0},
      // zoom: 3,
      markers
    }
  },
  components: {
    BmlMarkerClusterer
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
