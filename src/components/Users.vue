<template>
    <div class="users_container">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input placeholder="请输入内容" v-model="reqParams.query">           
                        <el-button @click="search()" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="18">
                    <el-button type="primary" @click="showDialogForm()" plain>添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                :data="userList"
                stripe
                style="width: 100%">
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <!-- <b>{{scope.row.mg_state?'已激活':'未激活'}}</b> -->
                        <el-switch
                            @change="updateState(scope.row.id,scope.row.mg_state)"
                            v-model="scope.row.mg_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-burron-grou>
                            <el-button icon="el-icon-edit" round></el-button>
                            <el-button icon="el-icon-delete" @click="delUsers(scope.row.id)" round></el-button>
                            <el-button icon="el-icon-setting" @click="showRoleDialogFormVisible(scope.row)" round></el-button>
                        </el-burron-grou>  
                    </template>                              
                </el-table-column>         
            </el-table>
            <!-- 分页 -->
            <div class="pager_container">
                <el-pagination
                    @current-change="changePager"
                    background
                    :current-page = "reqParams.pagenum"
                    layout="prev, pager, next"
                    :page-size= "reqParams.pagesize"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加用户表单 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px" autocomplete="off">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>     
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色表单 -->
        <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
            <el-form label-width="100px" autocomplete="off">
                <el-form-item label="当前用户">
                    {{roleUserName}}
                </el-form-item>
                <el-form-item label="当前用户">
                    {{roleUserRoleName}}
                </el-form-item>
                <el-form-item label="分配角色">
                    <el-select v-model="roleValue" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>  
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeRole()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'Users',
    data() {
        const checkMobile = (rule, value, callback)=>{
            if(!/^1[3456789]\d{9}$/.test(value)) return callback(new Error('手机号不对'))
            callback()
        }  
      return {
          //用户列表
        userList: [],
        // 传参
        reqParams:{
            query: '',
            pagenum: 1,
            pagesize: 2
        },
        total:"total",
        dialogFormVisible: false,
        addForm:{
            username:'',
            password: '',
            email:'',
            mobile:''
        },
        addRules:{
            username: [
                {required: true, message:'用户名必填',trigger:"blur"}
            ],
            password: [
                {required: true, message:'密码必填',trigger:"blur"},
                {min: 6, max: 18, message:'密码6-18个字符串',trigger:'blur'}
            ],
            email:[
                 {required: true, message:'邮箱必填', trigger:"blur"},
                 {type: 'email', message:'邮箱格式错误',trigger:'blur'}
            ],
            mobile:[
                {required: true, message: '手机号必填', trigger: 'blur'},
                {validator: checkMobile, trigger: 'blur'}
            ]
        },
        roleDialogFormVisible: false,
        roleValue:'',
        roleUserName:'',
        roleUserRoleName:'',
        roleUserId:'',
        options:[]

      }
    },
    mounted(){
        //用户列表数据获取
        this.getData()
    },
    methods:{
        async getData(){
            const{data:{data,meta}} = await this.$http.get('users',{params:this.reqParams})
            // console.log(data, meta)
            if(meta.status !==200) return this.$message.error('获取数据失败')
            this.userList = data.users
            this.total = data.total
        },
        changePager(newPage) {
            //进行分页查询 需要当前页码
            // console.log(newPage)
            //获取数据 
            this.reqParams.pagenum = newPage
            this.getData()
        },
        search(){
            this.reqParams.pagenum = 1
            this.getData()
        },
        addSubmit(){
            this.$refs.addForm.validate(async valid =>{
                if(valid){
                    const {data: {meta}}= await this.$http.post('users', this.addForm)
                    // console.log(meta)
                    if(meta.status !== 201) return this.$message.error('添加失败')
                    this.dialogFormVisible = false
                    this.getData()
                }
            })
        },
        showDialogForm(){
            this.dialogFormVisible=true
            console.log(this.$refs)
            this.$refs.addForm.resetFields()
        },
        delUsers(id){
            this.$confirm('是否删除该数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                const {data:{meta}} = await this.$http.delete(`users/${id}`)
                if(meta.status !== 200) return this.$message.error('删除失败')
                this.$message.success('删除成功')
                this.getData()
            }).catch(() => {});
        },
        async updateState(id, newState){
            const {data:{meta}}=await this.$http.put(`users/${id}/state/${newState}`)
            if(meta.status !== 200) return this.$message.error('修改状态失败')
            this.$message.success('修改状态成功')
            this.getData()
        },
        async showRoleDialogFormVisible(row){
            this.roleDialogFormVisible = true;
            const {data: {data, meta}}= await this.$http.get('roles')
            if(meta.status !== 200) return this.$message.error('获取角色失败')
            this.options = data
            console.log(data)
            this.roleUserId = row.id
            this.roleUserName = row.username
            this.roleUserRoleName = row.role_name
        },
        async changeRole(){
            const {data:{meta}} = await this.$http.put(`users/${this.roleUserId}/role`,{rid: this.roleValue})
            if(meta.status !==200) return this.$message.error('更改角色失败')
            this.$message.success('分配角色成功')
            this.roleDialogFormVisible = false
            this.getData()
        }
    }
}
</script>
<style>


</style>


