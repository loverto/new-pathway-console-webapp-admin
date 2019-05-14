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
          end-placeholder="结束日期"
        />
        <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
        <el-select placeholder="选择用户">
          <el-option />
        </el-select>
        <el-button type="success" icon="el-icon-download" @click="handleDownload">导出明细</el-button>
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

          <el-table-column align="center" label="定制编号">
            <template slot-scope="scope">
              <span>{{ scope.row.customNumber }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制型号">
            <template slot-scope="scope">
              <span>{{ scope.row.diePattern.diePatternType }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制类型">
            <template slot-scope="scope">
              <span>{{ scope.row.modelType.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="收件人姓名">
            <template slot-scope="scope">
              <span>{{ scope.row.theRecipientName }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="客户ID">
            <template slot-scope="scope">
              <span>{{ scope.row.taobaoNickname }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制状态">
            <template slot-scope="scope">
              <span>{{ scope.row.finishedCondition.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制日期">
            <template slot-scope="scope">
              <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="代理用户">
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

          <el-table-column align="center" label="定制编号">
            <template slot-scope="scope">
              <span>{{ scope.row.customNumber }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制型号">
            <template slot-scope="scope">
              <span>{{ scope.row.diePattern.diePatternType }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制类型">
            <template slot-scope="scope">
              <span>{{ scope.row.modelType.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="收件人姓名">
            <template slot-scope="scope">
              <span>{{ scope.row.theRecipientName }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="客户ID">
            <template slot-scope="scope">
              <span>{{ scope.row.taobaoNickname }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制状态">
            <template slot-scope="scope">
              <span>{{ scope.row.finishedCondition.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="定制日期">
            <template slot-scope="scope">
              <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="代理用户">
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
import { parseTime } from '@/utils'

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
      downloadLoading: false,
      currentUser: '',
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['定制编号', '定制型号', '定制类型', '收件人姓名', '客户ID', '定制状态', '定制日期', '代理用户']
        const filterVal = ['customNumber', 'diePattern.diePatternType', 'modelType.value', 'theRecipientName', 'taobaoNickname', 'finishedCondition.value', 'createdDate', 'user.login']
        const list = this.bjblist
        let text = ''
        if (this.currentUser) {
          text = this.currentSearch
        } else {
          text = '所有用户'
        }
        this.filename = parseTime(this.begin, '{y}-{m}-{d}') + '至' + parseTime(this.end, '{y}-{m}-{d}') + text + '作品明细表'
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
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
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createdDate') {
          return parseTime(v[j], '{y}-{m}-{d}')
        } else {
          if (j.indexOf('.') > 0) {
            const t = j.split('.')
            return v[t[0]][t[1]]
          }
          return v[j]
        }
      }))
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
