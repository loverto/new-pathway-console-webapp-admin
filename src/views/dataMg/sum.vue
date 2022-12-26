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
        <el-select v-model="currentUser" filterable value-key="id" placeholder="选择用户" @change="changeUser()">
          <el-option
            v-for="item in usersOptions"
            :key="item.id"
            :label="item.username"
            :value="item"
          />
        </el-select>
        <el-select v-model="currentSoftware" filterable value-key="id" placeholder="选择软件" @change="changeSoftware()">
          <el-option
            v-for="item in softwaresOptions"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
        <el-button type="success" icon="el-icon-download" @click="handleDownload">导出汇总明细</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.userinfo.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户编号">
        <template slot-scope="scope">
          <span>{{ scope.row.userinfo.code }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="软件名称">
        <template slot-scope="scope">
          <span>{{ scope.row.software.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运行时间">
        <template slot-scope="scope">
          <span>{{ scope.row.runtimeShow }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import * as Api from '@/api/loginfos'
import * as UserInfoApi from '@/api/userinfo'
import * as SoftwareApi from '@/api/software'
import { types } from '@/utils/role'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
export default {
  name: 'SumList',
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
      exportlist: [],
      usersOptions: [],
      softwaresOptions: [],
      total: 0,
      begin: new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)),
      end: new Date(),
      listLoading: true,
      downloadLoading: false,
      currentUser: '',
      currentSoftware: '',
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      totalTm: 0,
      totalSbd: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.currentSearch.push(this.begin)
    this.currentSearch.push(this.end)
    this.getList()
    this.getUsersOptionList()
    this.getSoftwaresOptionList()
  },
  methods: {
    changeUser() {
      this.getList()
    },
    changeSoftware() {
      this.getList()
    },
    difference: function(dateDiff) {
      // 把相差的毫秒数转换为小时数
      var hours = Math.floor(dateDiff / (3600 * 1000))
      return '运行' + hours + '小时'
    },
    handleDownload() {
      this.listLoading = true
      this.downloadLoading = true
      Api.getWorkListData({
        page: this.listQuery.page - 1,
        size: 100000000,
        startDate: this.begin,
        endDate: this.end,
        userinfo: this.currentUser.id,
        software: this.currentSoftware.id
      }).then(response => {
        this.exportlist = response.data
        import('@/vendor/Export2ExcelJs').then(excel => {
          const tHeader = ['用户名', '用户编号', '软件名称', '运行时间']
          const filterVal = ['userinfo.username', 'userinfo.code', 'software.name', 'runtime']
          const list = this.exportlist
          let text = ''
          if (this.currentUser) {
            text = this.currentUser.username
          } else {
            text = '所有用户'
          }
          const s = parseTime(this.begin, '{y}-{m}-{d}') + '至' + parseTime(this.end, '{y}-{m}-{d}')
          this.filename = s + text + '运行情况汇总表'

          const data = this.formatJson(filterVal, list)
          const multiHeader = [['', '', '新路通排版服务个性定制系统', '', ''], ['', '', '运行情况汇总表', '', ''], ['查询日期：' + s, '', '', '', '查询范围：' + text]]
          console.log(data)
          excel.export_json_to_excel_sheet({
            headers: [tHeader],
            datas: [data],
            multiHeaders: [multiHeader],
            sheetnames: ['运行情况汇总表'],
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
        this.listLoading = false
      })
    },
    getList() {
      this.listLoading = true
      Api.getWorkList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        startDate: this.begin,
        endDate: this.end,
        userinfo: this.currentUser.id,
        software: this.currentSoftware.id
      }).then(response => {
        this.list = response.data
        this.totalTm = 0
        this.totalSbd = 0
        this.list.forEach((item) => {
          item.runtimeShow = this.difference(item.runtime)
          // 遍历 tmCount 这个字段，并累加
          this.totalTm += item.tmCount
          // 遍历 sbdCount 这个字段，并累加
          this.totalSbd += item.sbdCount
        })

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
    getUsersOptionList() {
      UserInfoApi.getList({ page: 0, size: 1000000 }).then(response => {
        this.usersOptions = response.data
      })
    },
    getSoftwaresOptionList() {
      SoftwareApi.getList({ page: 0, size: 1000000 }).then(response => {
        this.softwaresOptions = response.data
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
        } else if (j === 'runtime') {
          return this.difference(v[j])
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
