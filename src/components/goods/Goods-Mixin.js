export default {
  name: 'Goods',
  data () {
    return {
      goodsList: [],
      reqParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    toAdd () {
      this.$router.push('/goods/add')
    },
    async getData () {
      const {data: {data, meta}} = await this.$http.get('goods', {params: this.reqParams})
      if (meta.status !== 200) return this.$message.error('获取商品信息失败')
      console.log(data)
      this.goodsList = data.goods
      this.total = data.total
    },
    changePager (newPage) {
      this.reqParams.pagenum = newPage
      this.getData()
    },
    search () {
      this.reqParams.pagenum = 1
      this.getData()
    },
    // 删除商品
    delGoods (id) {
      this.$confirm('是否删除该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: {meta}} = await this.$http.delete(`goods/${id}`)
        if (meta.status !== 200) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        this.getData()
      }).catch(() => {})
    }
  }
}