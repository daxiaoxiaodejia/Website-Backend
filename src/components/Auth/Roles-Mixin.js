export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      addDialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          {required: true, message: '角色名称必填', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '角色描述必填', trigger: 'blur'}
        ]
      },
      editDialogFormVisible: false,
      editForm: {},
      editRules: {
        roleName: [
          {required: true, message: '角色名称必填', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '角色描述必填', trigger: 'blur'}
        ]
      },
      rightDialogFormVisible: false,
      rightTree: [],
      rightCheckedList: [],
      rightRoleId: null,
      defaultProps: {
        // 数据结构中 下一级数据的字段名称
        children: 'children',
        // 显示的文字  的数据字段的名称
        label: 'authName'
      }      
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const {data: {data, meta}} = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取权限列表失败')
      data.forEach(item => {
        item.child = item.children
        delete item.children
        item.child.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
            delete item.children
          })
        })
      })
      this.rolesList = data
    //   console.log(data)
    },
    // 添加用户列表显示
    showAddDialog () {
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    // 添加用户点击事件
    addSubmit () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const {data: {data, meta}} = await this.$http.post('roles', this.addForm)
          if (meta.status !== 201) return this.$message.error('添加用户失败')
          this.$message.success('添加角色成功')
          this.addDialogFormVisible = false
          this.getData()
        }
      })
    },
    // 删除用户点击事件
    delRoles (id) {
      this.$confirm('是否删除该数据？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {                      
        const {data: {meta}} = await this.$http.delete(`roles/${id}`)
        if (meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getData()
      }).catch(() => {})
    },
    // 编辑用户列表
    showEditDialog (role) {
      this.editDialogFormVisible = true
      this.$nextTick(async () => {
        this.$refs.editForm.resetFields()
        const {data: {data, meta}} = await this.$http.get(`roles/${role.id}`)
        if (meta.status !== 200) return this.$message.error('获取角色失败')
        this.editForm = data
      })  
    },
    editSubmit () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const {data: {meta}} = await this.$http.put(`roles/${this.editForm.roleId}`, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          if (meta.status !== 200) return this.$message.error('编辑角色失败')
          this.$message.success('编辑角色成功')
          this.editDialogFormVisible = false
          this.getData()
        }
      })
    },
    // 删除权限
    delRights (row, rightId) {
      this.$confirm('是否删除该权限？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {                      
        const {data: {data, meta}} = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
        if (meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        // this.getData()
        data.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
          })
        })
        row.child = data
      }).catch(() => {})
    },
    // 权限分配对话框
    async showRightDialog (row) {
      // this.rightCheckedList = []
      this.rightRoleId = row.id
      const {data: {data, meta}} = await this.$http.get('rights/tree')
      if (meta.status !== 200) return this.$message.error('删除失败')
      this.rightTree = data
      // row获取当前行已有权限  已有权限row.child
      const arr = []
      row.child.forEach(item =>{
        item.child.forEach(item=>{
          item.child.forEach(item=>{
            arr.push(item.id)
          })
        })
      })
      // console.log(arr)
      this.rightCheckedList = arr
      this.rightDialogFormVisible = true
    },
    // 权限分配函数
    async rightSubmit () {
      // 合并全选与半选操作
      const treeDom = this.$refs.tree
      const checkedArr = treeDom.getCheckedKeys()
      const halfCheckArr = treeDom.getHalfCheckedKeys()
      const arr = [...checkedArr, ...halfCheckArr]
      // console.log(arr)
      const {data: {data, meta}} = await this.$http.post(`roles/${this.rightRoleId}/rights`, {
        rids: arr.join(',')
      })
      if (meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.rightDialogFormVisible = false
      this.getData()
    }
  }
}