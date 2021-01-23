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
        <el-select v-model="currentComputer" value-key="id" placeholder="选择计算机" @change="changeComputer()">
          <el-option
            v-for="item in computerOptions"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
        <el-select v-model="currentGroup" value-key="id" placeholder="选择分组" @change="changeGroup()">
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
        <el-button type="success" icon="el-icon-download" @click="handleDownload">导出明细</el-button>
      </el-form-item>
    </el-form>

    <el-tabs type="border-card">
      <el-tab-pane label="工作情况">
        <el-table v-loading="listLoading" :data="authorizationlist" border fit highlight-current-row style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            width="50"
          />

          <el-table-column align="center" label="计算机名称">
            <template slot-scope="scope">
              <span>{{ scope.row.computer.name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="计算机备注">
            <template slot-scope="scope">
              <span>{{ scope.row.computer.code }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="用户名称">
            <template slot-scope="scope">
              <span>{{ scope.row.userinfo.username }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="软件名称">
            <template slot-scope="scope">
              <span>{{ scope.row.software.name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="运行时间">
            <template slot-scope="scope">
              <span>{{ scope.row.runTime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="运行日期">
            <template slot-scope="scope">
              <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import * as Api from '@/api/loginfos'
import * as SoftwareApi from '@/api/software'
import * as GroupApi from '@/api/computer-groups'
import * as ComputeApi from '@/api/computer'
import * as UserApi from '@/api/agent'
import { types } from '@/utils/role'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import _ from 'lodash'

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
      computerIds: [],
      authorizationlist: [],
      sjblist: [],
      allbjblist: [],
      allsjblist: [],
      computerOptions: [],
      groupOptions: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      begin: new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)),
      downloadLoading: false,
      currentComputer: '',
      currentGroup: '',
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
    this.getComputersOptionList()
    this.getGroupOptionList()
  },
  methods: {
    changeComputer() {
      // 添加计算机编号
      this.computerIds = [this.currentComputer.id]
      this.currentGroup = null
      this.getList()
    },
    changeGroup() {
      // 添加计算机编号
      this.computerIds = []
      this.currentComputer = null
      console.log(this.currentGroup)
      this.currentGroup.computers.forEach(c => {
        this.computerIds.push(c.id)
      })
      this.getList()
    },
    handleDownload() {
      this.listLoading = true
      Promise.all([Api.getListByFilter({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        computerId: {
          in: this.computerIds
        }
      })])
        .then(responses => {
          this.allbjblist = responses[0].data
          this.listLoading = false
          this.downloadLoading = true
          import('@/vendor/Export2ExcelJs').then(excel => {
            const tHeader = ['计算机名称', '计算机备注', '用户名称', '软件名称', '运行时间', '运行日期']
            const filterVal = ['computer.name', 'computer.code', 'userinfo.username', 'software.name', 'runTime', 'createdDate']
            const allBjblist = []
            this.allbjblist.forEach(a => {
              a.runTime = this.difference(a.startDate, a.endDate)
              allBjblist.push(a)
            })
            let text = ''
            if (this.currentComputer) {
              text = this.currentComputer.name + '>' + this.currentComputer.code
            } else {
              text = '所有计算机'
            }
            const computerGroupObject = _.groupBy(this.allbjblist, 'computer.code')
            const keys = Object.keys(computerGroupObject)
            console.log(computerGroupObject)
            console.log(keys)
            const s = parseTime(this.begin, '{y}-{m}-{d}') + '至' + parseTime(this.end, '{y}-{m}-{d}')
            this.filename = s + text + '运行明细表'
            let multiHeader = []
            const datas = []
            const headers = []
            const sheetnames = []
            keys.forEach(k => {
              const computerGroupObjectElement = computerGroupObject[k]
              const bjbdata = this.formatJson(filterVal, computerGroupObjectElement)
              datas.push(bjbdata)
              multiHeader = [['', '', '', '新路通排版服务个性定制系统', '', '', '', ''], ['', '', '', '运行明细表', '', '', '', ''], ['查询日期：' + s, '', '', '', '', '', '', '查询范围：' + k]]
              sheetnames.push(computerGroupObjectElement.computer.name)
              headers.push(tHeader)
            })
            excel.export_json_to_excel_sheet({
              headers: headers,
              datas: datas,
              multiHeader: multiHeader,
              sheetnames: sheetnames,
              filename: this.filename,
              autoWidth: this.autoWidth,
              bookType: this.bookType
            })
            this.downloadLoading = false
          })
        })
    },
    getList() {
      this.listLoading = true
      this.getBjbList()
      // this.getSbdList()
    },
    getBjbList() {
      this.listLoading = true
      Api.getListByFilter({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        computerId: {
          in: this.computerIds
        }
      }).then(response => {
        const authorInfos = []
        response.data.forEach(a => {
          a.runTime = this.difference(a.startDate, a.endDate)
          authorInfos.push(a)
        })
        this.authorizationlist = authorInfos
        console.log(this.authorizationlist)
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
      // Api.getListByFinishedConditionAndModeTypeIdByPage(2, 1, {
      //   page: this.listQuery.page - 1,
      //   size: this.listQuery.pageSize,
      //   login: this.currentComputer
      // }).then(response => {
      //   this.bjblist = response.data
      //   this.total = Number(response.headers['x-total-count']) || 0
      //   this.listLoading = false
      // })
    },
    difference: function(beginTime, endTime) {
      var dateBegin = new Date(beginTime)
      var dateEnd = new Date(endTime)
      var dateDiff = dateEnd.getTime() - dateBegin.getTime()// 时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))// 计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000))// 计算出小时数
      // 计算相差分钟数
      var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
      // 计算相差秒数
      var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000)
      return '运行' + dayDiff + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒'
    },
    getAllBjbList() {
      this.listLoading = true
      Api.getListByFinishedConditionAndModeTypeId(2, 1).then(response => {
        this.allbjblist = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    getAllSbdList() {
      this.listLoading = true
      Api.getListByFinishedConditionAndModeTypeId(2, 2).then(response => {
        this.allsjblist = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    getSbdList() {
      this.listLoading = true
      Api.getListByFinishedConditionAndModeTypeIdByPage(2, 2, {
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        login: this.currentComputer
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
    getComputersOptionList() {
      ComputeApi.getList({ page: 0, size: 1000000 }).then(response => {
        this.computerOptions = response.data
      })
    },
    getGroupOptionList() {
      GroupApi.getList({ page: 0, size: 1000000 }).then(response => {
        const groups = []
        response.data.forEach((e) => {
          groups.push(GroupApi.getById(e.id))
        })
        // this.total = Number(response.headers['x-total-count']) || 0
        return Promise.all(groups)
      }).then(response => {
        const tempGroups = []
        let tempGroupsComputer = []
        response.forEach(re => {
          console.log('分组电脑返回值数组: ' + JSON.stringify(re.data.computers))
          tempGroups.push(re.data)
          // eslint-disable-next-line no-const-assign
          tempGroupsComputer = _.concat(tempGroupsComputer, re.data.computers)
          console.log('有分组的计算机:: ' + JSON.stringify(tempGroupsComputer))
        })
        console.log('有分组的计算机2:: ' + JSON.stringify(tempGroups))
        console.log('有分组的计算机3:: ' + JSON.stringify(tempGroupsComputer))
        // this.hasGroupComputerList = tempGroupsComputer
        // console.log('有分组的计算机4:: ' + JSON.stringify(this.hasGroupComputerList))
        this.groupOptions = tempGroups
        // this.listLoading = false
        // return ComputeApi.getList()
      })
      // GroupApi.getList().then(response => {
      //   this.groupOptions = response.data
      // })
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
