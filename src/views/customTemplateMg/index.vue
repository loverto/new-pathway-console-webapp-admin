<template>
  <div class="app-container banner-wrapper">
    <el-button type="text" icon="el-icon-refresh" @click="getList">刷新</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column
        align="center"
        type="index"
        width="50"
      />
      <el-table-column align="center" label="定制编号" >
        <template slot-scope="scope">
          <span>{{ scope.row.customNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="笔记本品牌" >
        <template slot-scope="scope">
          <span>{{ scope.row.diePattern.computerType.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="笔记本型号">
        <template slot-scope="scope">
          <span>{{ scope.row.diePattern.diePatternType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量" >
        <template slot-scope="scope">
          <span>{{ scope.row.customQuantity }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="淘宝ID">
        <template slot-scope="scope">
          <span>{{ scope.row.taobaoNickname }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收件人姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.theRecipientName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="定制类型">
        <template slot-scope="scope">
          <span>{{ scope.row.modelType.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户状态">
        <template slot-scope="scope">
          <span>{{ scope.row.finishedCondition.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="制造进度">
        <template slot-scope="scope">
          <span>{{ scope.row.customState.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属用户">
        <template slot-scope="scope">
          <span>{{ scope.row.user.login }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit">查看</el-button>
          <el-button type="danger" class="del-btn" size="small" icon="el-icon-error">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import * as Api from '@/api/custom-template'
import Pagination from '@/components/Pagination'
export default {
  name: 'BannerList',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize
      }).then(response => {
        this.list = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
