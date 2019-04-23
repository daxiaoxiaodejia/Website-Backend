<template>
  <el-container class="home_comtainer">
  <el-header class="home_header">
    <el-button icon="iconfont icon-menu" @click="toggleMenu()" size="mini" circle></el-button>
    <span class="title">拼拼购后台管理系统</span>
    <el-button type="danger" size="mini" class="logout" @click="logout()" round>退出</el-button>
  </el-header>
  <el-container>
    <el-aside class="home_aside" :width="collapse?'65px':'180px'">
       <el-menu
      router="false"
      :collapse="collapse"
      :collapse-transition ="false"
      :unique-opened="true"
      style="border:none; margin-top: 5px"
      background-color="#333741"
      text-color="#fff"
      active-text-color="#ffd04b">
      <!-- 一级菜单 -->
      <!-- 一级index和二级菜单index是有从属关系 -->
      <el-submenu :index="item.id.toString()" v-for="(item, i) in menus" :key="item.id">
        <template slot="title">      
          <i :class="['iconfont', iconArr[i]]"></i>
          <span>&nbsp;{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->    
          <el-menu-item :index="lastItem.path" v-for="lastItem in item.children" :key="lastItem.id">
            <i class="el-icon-menu"></i>
            <span>{{lastItem.authName}}</span>
          </el-menu-item>   
        </el-submenu>
      </el-menu>    
    </el-aside>
    <el-main class="home_main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  name: "Home",
  data(){
    return{
      collapse: false,
      menus: [],
      // list:[],
      iconArr: ['icon-Account', 'icon-yidiandiantubiao01', 'icon-eye-slash', 'icon-user-fill', 'icon-power-off']
    }
  },
  mounted () {
      this.getData()
    },
  methods: {
    toggleMenu(){
      this.collapse = !this.collapse
    },
    async getData(){
      // this.$http.get('menus').then(res=>{console.log(res.data), this.list = res.data.data}) 
      const {data:{data, meta}} = await this.$http.get('menus')
      // console.log(data, meta)
      //判断是否获取成功
      if (meta.status !== 200) return this.$message.error('获取菜单数据失败')
      // 修改data中的菜单数据
      this.menus = data
      //更新视图 前提是视图用了该数据 渲染视图
    },
    logout(){
      //清除token 就是退出，但是也得跳转登录页
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
};
</script>
<style scope>
.home_comtainer {
    height: 100%;
}
.home_header {
    background: #373D41;
    line-height: 60px;
}
.home_aside {
    background: #333741
}
.home_main {
    background: #EAEDF1;
}
.title {
  color:#ccc;
  font-size: 18px;
  padding-left: 20px;
}
.logout {
  margin-top: 15px;
  float: right
}
</style>


