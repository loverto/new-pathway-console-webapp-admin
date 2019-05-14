<template>
  <div class="app-container agent-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-date-picker
          v-model="currentSearch"
          :picker-options="pickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
        <el-select placeholder="选择用户">
          <el-option
          />
        </el-select>
        <el-button type="success" icon="el-icon-download">导出明细</el-button>
      </el-form-item>
    </el-form>

    <el-tabs type="border-card">
      <el-tab-pane label="笔记本">
        <el-table v-loading="listLoading" :data="bjblist" border fit highlight-current-row style="width: 100%">
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
          <el-table-column align="center" label="品牌" width="70" >
            <template slot-scope="scope">
              <span>{{ scope.row.diePattern.computerType.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="笔记本型号">
            <template slot-scope="scope">
              <span>{{ scope.row.diePattern.diePatternType }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="数量" width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.customQuantity }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="淘宝ID" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.taobaoNickname }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="收件人姓名" width="100" >
            <template slot-scope="scope">
              <span>{{ scope.row.theRecipientName }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="笔记本" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.modelType.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="用户状态" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.finishedCondition.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="制造进度" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.customState.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="添加日期" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="所属用户" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.user.login }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="鼠标垫">
        <el-table v-loading="listLoading" :data="sjblist" border fit highlight-current-row style="width: 100%">
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
          <el-table-column align="center" label="品牌" width="70" >
            <template slot-scope="scope">
              <span>{{ scope.row.diePattern.computerType.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="笔记本型号">
            <template slot-scope="scope">
              <span>{{ scope.row.diePattern.diePatternType }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="数量" width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.customQuantity }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="淘宝ID" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.taobaoNickname }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="收件人姓名" width="100" >
            <template slot-scope="scope">
              <span>{{ scope.row.theRecipientName }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="鼠标垫" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.modelType.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="用户状态" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.finishedCondition.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="制造进度" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.customState.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="添加日期" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="所属用户" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.user.login }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import * as Api from '@/api/custom-template'
import { types } from '@/utils/role'
import Pagination from '@/components/Pagination'
export default {
  name: 'DatatList',
  components: { Pagination },
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
      currentSearch: [],
      list: [],
      bjblist: [],
      sjblist: [],
      allbjblist: [],
      allsjblist: [],
      roleOptions: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      begin: new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 90)),
      end: new Date()
    }
  },
  created() {
    this.currentSearch.push(this.begin)
    this.currentSearch.push(this.end)
    this.getList()
    this.getRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.getBjbList()
      this.getSbdList()
    },
    getBjbList() {
      Api.getListByFinishedConditionAndModeTypeIdByPage(2, 1, {
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize
      }).then(response => {
        this.bjblist = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    getSbdList() {
      Api.getListByFinishedConditionAndModeTypeIdByPage(2, 2, {
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize
      }).then(response => {
        this.sjblist = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    search(query) {
      // 初始化查询时间
      this.begin = query[0]
      this.end = query[1]
      this.getList()
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
