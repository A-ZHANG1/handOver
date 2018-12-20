//  axios post promise 对象 (保证synchronize)
<template>
    <el-button @click="submit">提交</el-button>
</template>
<script>
export default{
    data:function(){
        return{

        }
    },
methods:{
  submit(){
    let axiosArray = []
    for (var x = 0; x < 2; x++) {
      let postData = {}
      let completeItem = {
            item_name: 'item'+x,
            item_address:'',
            item_des: '',
            item_state: 'off',
            item_price: '',
            item_image: '',
            _task_uid: ''
            }
      let newPromise = this.$axios({
        method: 'post',
        url: 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/Item',
        data: postData
      })
    axiosArray.push(newPromise)
}

this.$axios
  .all(axiosArray)
  .then(responses => {
      responses.forEach(res => console.log('Success'))
      console.log('submitted all axios calls')
    })
  .catch(error => {})
}    
}
}

</script>
