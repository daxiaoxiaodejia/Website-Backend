export default {
  name: 'Goods-Add',
  data () {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pic: [],
        attrs: []
      },
      rules: {
        goods_name: [
          {required: true, message: '商品名称必填', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '商品分类必填', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '商品价格必填', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '商品数量必填', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '商品重量必填', trigger: 'blur'}
        ]
      },
      categoryList: [],
      categoryValues: [],
      manyAttrs: [],
      onlyAttrs: [],
      dialogVisible: false,
      dialogImageUrl: '',
      action: this.$http.defaults.baseURL + 'upload/',
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    }
  },
  //   监听输入框的内容
  watch: {
    categoryValues (now, old) {
    //   console.log(now, old)
      if (now.length === 3) {
        this.form.goods_cat = now.join(',')
        // console.log(this.form.goods_cat)
      } else {
        this.form.goods_cat = ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 验证鼠标从第一项离开
    changeTabBefore (activeName, oldActiveName) {
    //   console.log(activeName, oldActiveName)
      if (oldActiveName === '0') {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate(valid => {
            if (valid) {
              this.active = +activeName
              this.getParams('many')
              console.log(this.getParams('many'))
              this.getParams('only')
              resolve()
            } else {
              reject(new Error('校验表单失败'))
            }
          })
        })
      } else {
        this.active = +activeName
      }
    },
    async getData () {
      const {data: {data, meta}} = await this.$http.get('categories')
      //   console.log(data)
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.categoryList = data
    },
    // 获取参数
    async getParams (type) {
      const id = this.categoryValues[2]
      const {data: {data, meta}} = await this.$http.get(`categories/${id}/attributes`, {
        params: {sel: type}
      })
      if (meta.status !== 200) return this.$message.error('获取参数数据失败')
      this[type + 'Attrs'] = data
    },
    // 上传图片成功后 追加图片
    handleSuccess (res) {
      this.form.pics.push({pic: res.data.tmp_path})
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 提交商品
    async addSubmit () {
      this.form.attrs = [...this.manyAttrs, ...this.onlyAttrs]
      const {data: {meta}} = await this.$http.post('goods', this.form)
      this.$message.success('商品录入成功')
      this.$router.push('/goods')
    }
  }
}