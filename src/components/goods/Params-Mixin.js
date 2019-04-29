export default {
  name: 'Params',
  data () {
    return {
      // 级联相关的数据
      categoryList: [],
      // 当前选中的分类的数据，包含每一级的分类ID
      categoryValues: [],
      activeName: 'many',
      disabled: true,
      // 动态参数列表
      manyAttrs: [],
      // 静态参数列表
      onlyAttrs: [],
      // 对话框相关数据
      addDialogFormVisible: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        att_name: [
          {required: true, message: '参数名称必填', trigger: 'blur'}
        ]
      }
      // inputShow: false
    }
  },
  mounted () {
    this.getData()
  },
  // 计算属性： 函数的名字就是一个数据的字段名称 使用和data中声明的数据一样
  computed: {
    id () {
      if (this.categoryValues.length === 3) {
        return this.categoryValues[2]
      } else {
        return null
      }
    }
  },
  methods: {
    // 隐藏input事件
    hideInput (row) {
      // console.log(111)
      row.inputShow = false
      if (row.inputValue) {
        // 把当前input输入的内容追加到attr_vals数组中
        // console.log(row.inputValue)
        row.attr_vals.push(row.inputValue)
        this.editAttr(row)
        row.inputValue = ''
      }
    },
    // 显示input事件
    showInput (row) {
      row.inputShow = true
      console.log(this.$refs['input' + row.attr_id])
      this.$nextTick(() => {
        this.$refs['input' + row.attr_id].focus()
      })
    },
    // 删除tag标签
    delTag (row, i) {
      // 删除tag的效果
      row.attr_vals.splice(i, 1)
      // 修改后台的参数的值
      // const id = this.categoryValues[2]
      // console.log(this.id)
      this.editAttr(row)
    },
    async editAttr (row) {
      const {data: {meta}} = await this.$http.put(`categories/${this.id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      console.log(meta)
      if (meta.status !== 200) return this.$message.error('更新参数值失败')
      this.$message.success('更新参数值成功')
    },
    // 删除参数
    delParams (attrId) {
      this.$confirm('是否删除该分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const id = this.categoryValues[2]
        const {data: {meta}} = await this.$http.delete(`categories/${id}/attributes/${attrId}`)
        if (meta.status !== 200) return this.$message.error('删除参数失败')
        this.$message.success('删除参数成功')
        this.getParams()
      }).catch(() => {})
    },
    showAddDialog () {
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    addSubmit () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const id = this.categoryValues[2]
          const {data: {meta}} = await this.$http.post(`categories/${id}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加参数成功')
          this.getParams()
          this.addDialogFormVisible = false
        }
      })
    },
    handleChange () {
      this.getParams()
    },
    handleClick () {
      // 切换tab时触发
      this.getParams()
    },
    async getData () {
      const {data: {data, meta}} = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      // console.log(data)
      this.categoryList = data
    },
    async getParams () {
      // 获取参数列表数据
      const len = this.categoryValues.length
      if (len === 3) {
        const id = this.categoryValues[len - 1]
        // 发送请求，获取数据
        // console.log(id)
        const {data: {data, meta}} = await this.$http.get(`categories/${id}/attributes`, {
          params: {sel: this.activeName}
        })
        if (meta.status !== 200) return this.$message.error('获取参数数据失败')
        // 参数列表获取成功 显示列表 依赖数据 data定义数据
        // console.log(this.activeName)
        // 根据当前activeName找到对应的列表赋值
        if (this.activeName === 'many') {
          data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            // 添加字段inputShow 控制tag和input显示隐藏
            item.inputShow = false
            item.inputValue = ''
          })
        }
        this[`${this.activeName}Attrs`] = data
        this.disabled = false
      } else {
        // 没选三级，清空当前不符合要求的选择
        this.categoryValues = []
      }
    }
  }
}
