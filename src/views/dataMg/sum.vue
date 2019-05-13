<template>
  <div class="app-container agent-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="用户名称:">
        <el-date-picker
          v-model="value2"
          :picker-options="pickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        <el-button type="success" icon="el-icon-search">查询</el-button>
        <el-select placeholder="选择用户">
          <el-option
          />
        </el-select>
        <el-button type="success" icon="el-icon-download">导出明细</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="账号" >
        <template slot-scope="scope">
          <span>{{ scope.row.login }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理名称" >
        <template slot-scope="scope">
          <span>{{ scope.row.lastName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="贴膜使用次数" >
        <template slot-scope="scope">
          <span>{{ scope.row.tmCount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="鼠标垫使用次数" >
        <template slot-scope="scope">
          <span>{{ scope.row.sbdCount }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import * as Api from '@/api/agent'
import { types } from '@/utils/role'
import Pagination from '@/components/Pagination'
import ElSlPanel from 'element-ui/packages/color-picker/src/components/sv-panel'
export default {
  name: 'SumList',
  components: { ElSlPanel, Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value2: '',
      list: [],
      roleOptions: [],
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
    this.getRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getWorkList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        begin: '',
        end: '',
        login: ''
      }).then(response => {
        this.list = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    getRoleList() {
      Api.getRoleList().then(response => {
        this.roleOptions = response.data
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    formatRole(val) {
      return types.get(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .width-192 {
    max-width: 192px;
  }
  .el-form-item__tip {
    font-size: 12px;
    color: #C0C4CC;
  }
</style>
