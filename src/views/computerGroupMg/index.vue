<template>
  <div class="app-container product-wrapper">
    <el-input v-model="currentSearch" placeholder="查找 分组" clearable class="width-50p" />
    <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
    <router-link to="/computer-groups/add">
      <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus">添加分组</el-button>
    </router-link>
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

      <el-table-column align="center" label="分组">
        <template slot-scope="scope">
          <span @click="goComputer(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 编辑分组弹框 -->
    <el-dialog
      v-if="showMask"
      :visible.sync="showMask"
      title="编辑分组"
      top="5vh"
      class="product-edit__dialog"
      @close="handleClose"
    >
      <add-page :form-data="curProd" :list1="curComputerList" :list2="computerList" button-text="编辑" />
    </el-dialog>

  </div>
</template>

<script>
import * as Api from '@/api/computer-groups'
import * as ComputeApi from '@/api/computer'
import { types } from '@/utils/role.js'
import Pagination from '@/components/Pagination'
import AddPage from './add.vue'
import _ from 'lodash'

export default {
  name: 'ProductList',
  components: { AddPage, Pagination },
  data() {
    return {
      list: [],
      computerList: [],
      hasGroupComputerList: [],
      currentSearch: '',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      showMask: false,
      curProd: null,
      curComputerList: null
    }
  },
  created() {
    this.loadAll()

    // 监听一个保存成功的回调
    // 用于修改产品后触发列表刷新
    this.$on('saveNotify', (flag) => {
      this.showMask = false
      if (flag) this.loadAll()
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        sort: 'lastModifiedDate,desc'
      }
      Api.getList(data).then(response => {
        const groups = []
        console.log(response.headers)
        const count = response.headers['x-total-count']
        console.log(count)
        this.total = Number(count) || 0
        response.data.forEach((e) => {
          groups.push(Api.getById(e.id))
        })
        console.log('总数:' + this.total)
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
        this.hasGroupComputerList = tempGroupsComputer
        console.log('有分组的计算机4:: ' + JSON.stringify(this.hasGroupComputerList))
        this.list = tempGroups
        this.listLoading = false
        return ComputeApi.getList()
      }).then(response => {
        console.log('计算机数据:' + JSON.stringify(response.data))
        console.log('分组数据:' + JSON.stringify(this.hasGroupComputerList))
        this.computerList = _.differenceBy(response.data, this.hasGroupComputerList, 'id')
      })
    },
    getComputer() {
      ComputeApi.getList().then(response => {
        console.log('计算机数据:' + JSON.stringify(response.data))
        console.log('分组数据:' + JSON.stringify(this.hasGroupComputerList))
        this.computerList = _.differenceBy(response.data, this.hasGroupComputerList, 'id')
      })
    },
    clear() {
      this.page = 0
      this.currentSearch = ''
      this.loadAll()
    },
    loadAll() {
      if (this.currentSearch) {
        this.listLoading = true
        Api.getSearchList({
          query: this.currentSearch,
          page: this.listQuery.page - 1,
          size: this.listQuery.pageSize
        }).then(response => {
          const groups = []
          response.data.forEach((e) => {
            groups.push(Api.getById(e.id))
          })
          this.total = Number(response.headers['x-total-count']) || 0
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
          console.log('有分组的计算机3:: ' + JSON.stringify(tempGroupsComputer))
          this.hasGroupComputerList = tempGroupsComputer
          console.log('有分组的计算机4:: ' + JSON.stringify(this.hasGroupComputerList))
          this.list = tempGroups
          this.listLoading = false
          return ComputeApi.getList()
        }).then(response => {
          console.log('计算机数据:' + JSON.stringify(response.data))
          console.log('分组数据:' + JSON.stringify(this.hasGroupComputerList))
          this.computerList = _.differenceBy(response.data, this.hasGroupComputerList, 'id')
        })
        return
      }
      this.getList()
      // this.getComputer()
    },
    search(query) {
      if (!query) {
        return this.clear()
      }
      this.page = 0
      this.currentSearch = query
      this.loadAll()
    },
    goComputer(row) {
      this.$router.push({
        name: 'ComputerList',
        query: { groupId: row.id }
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleEdit(row) {
      this.showMask = true
      this.curProd = row
      this.curComputerList = row.computers
    },
    handleClose() {
      this.curProd = null
    },
    formatType(val) {
      return types.get(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 20px;
}
</style>
