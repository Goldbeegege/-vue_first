<template>
  <div id="app">
    <vheader v-show="show_header"></vheader>
    <router-view/>
  </div>
</template>

<script>
import vheader from "./components/header"
export default {
  name: 'App',
  data(){
    return {
      show_header:true,
    }
  },
  components:{
      vheader,
  },
  created(){
    if(this.$route.meta.requireAuth){
      if(!this.$Cookies.get("token")){
      this.$router.push({name:"login",query:{backName:this.$route.name}})
    }
    }
  },
  methods:{
   
  }
}
</script>

<style>
</style>
