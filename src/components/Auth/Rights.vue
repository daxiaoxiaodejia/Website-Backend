<template>
  <div class="rights_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table height="400px" :data="rightsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column property="authName" label="权限名称"></el-table-column>
        <el-table-column property="path" label="路径"></el-table-column>
        <el-table-column property="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                <el-tag type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
                <el-tag type="warning" v-if="scope.row.level === '2'">三级权限</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import mixin from "./Rights-Mixin";
export default {
  mixins: [mixin]
};
</script>
<style>

</style>


