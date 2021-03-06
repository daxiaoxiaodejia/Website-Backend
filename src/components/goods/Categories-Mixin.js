export default {
  name: 'Categories',
  data () {
    return {
      reqParams: {
        pagenum: 1,
        pagesize: 5
      },
      categories: [],
      total: 0,
      // 添加分类相关
      addDialogFormVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: ''
      },
      addRules: {
        cat_name: [
          {required: true, message: '分类名称必填', trigger: 'blur'}
        ]
      },
      categoryList: [],
      categoryValues: [],
      editDialogFormVisible: false,
      editForm: {},
      editRules: {
        cat_name: [
          {required: true, message: '分类名称必填', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const {data: {data, meta}} = await this.$http.get('categories', {
        params: this.reqParams
      })
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      //   console.log(data)  {total, result}
      this.categories = data.result
      this.total = data.total
    },
    changePager (newPage) {
      // 改变页码
      this.reqParams.pagenum = newPage
      // 获取数据
      this.getData()
    },
    // 显示添加对话框
    async showAddDialog () {
      this.categoryValues = []
      const {data: {data, meta}} = await this.$http.get('categories', {
        params: {type: 2}
      })
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.categoryList = data     
      this.addDialogFormVisible = true
      // 重置表单
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      }) 
    },
    addSubmit () {
      // 提交前校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const len =this.categoryValues.length
          if (len) {
            this.addForm.cat_pid = this.categoryValues[len-1]
          } else {
            this.addForm.cat_pid = 0
          }
          this.addForm.cat_level = len
          // console.log(this.addForm)
          const {data: {data, meta}} = await this.$http.post('categories', this.addForm)
          if (meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.getData()
          this.addDialogFormVisible = false                
        }
      })
    },
    showEditDialog (id) {
      this.editDialogFormVisible = true
      this.$nextTick(async () => {
        this.$refs.editForm.resetFields()
        // 填充表单
        const {data: {data, meta}} = await this.$http.get(`categories/${id}`)
        if (meta.status !== 200) return this.$message.error('获取分类失败')
        this.editForm = data
      })
    },
    editSubmit () {
      console.log(11)
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const {data: {meta}} = await this.$http.put(`categories/${this.editForm.cat_id}`, {
            cat_name: this.editForm.cat_name
          })
          if (meta.status !== 200) return this.$message.error('编辑分类失败')
          this.$message.success('编辑分类成功')
          this.getData()
          this.editDialogFormVisible = false
        }
      })
    },
    // 删除分类列表
    delCategory (id) {
      this.$confirm('是否删除该分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then (async () => {
        const {data: {meta}} = await this.$http.delete(`categories/${id}`)
        if (meta.status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.getData()
      }).catch(() => {})
    }

  }
}