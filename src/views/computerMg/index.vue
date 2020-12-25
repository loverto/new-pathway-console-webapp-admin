<template>
  <div class="app-container product-wrapper">
    <el-input v-model="currentSearch" placeholder="查找 计算机" clearable class="width-50p" />
    <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
    <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus" @click="handleAdd(null)">添加计算机名称</el-button>
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
      <el-table-column align="center" label="计算机分组">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="计算机名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑产品弹框 -->
    <el-dialog
      v-if="showMask"
      :visible.sync="showMask"
      :title="title"
      top="5vh"
      class="product-edit__dialog"
      @close="handleClose"
    >
      <add-page :form-data="curProd" :button-text="buttonText" />
    </el-dialog>
    <!-- 上传计算机包弹框 -->
    <el-dialog
      v-if="showFontMask"
      :visible.sync="showFontMask"
      :title="fontTitle"
      top="5vh"
      class="product-edit__dialog"
      @close="handleFontClose"
    >
      <upload-font :form-data="curProd" :button-text="buttonFontText" />
    </el-dialog>

  </div>
</template>

<script>
import * as Api from '@/api/computer'
import { types } from '@/utils/role.js'
import Pagination from '@/components/Pagination'
import AddPage from './add.vue'
import UploadFont from './edit.vue'
import config from '@/utils/config.js'
export default {
  name: 'FontList',
  components: { AddPage, Pagination, UploadFont },
  data() {
    return {
      list: [],
      total: 0,
      title: '编辑计算机名称',
      fontTitle: '编辑计算机名称',
      buttonFontText: '',
      buttonText: '',
      listLoading: true,
      currentSearch: '',
      studioConfig: {},
      listQuery: {
        page: 1,
        pageSize: 10
      },
      showMask: false,
      showFontMask: false,
      curProd: null,
      baseImgUrl: config.baseImgUrl
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
        this.list = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
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
          this.list = response.data
          this.total = Number(response.headers['x-total-count']) || 0
          this.listLoading = false
        })
        return
      }
      this.getList()
    },
    search(query) {
      if (!query) {
        return this.clear()
      }
      this.page = 0
      this.currentSearch = query
      this.loadAll()
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
      this.title = '编辑计算机名称'
      this.buttonText = '编辑'
    },
    handleAdd(row) {
      this.showMask = true
      this.curProd = row
      this.title = '添加计算机名称'
      this.buttonText = '添加'
    },
    handleAddFont(row) {
      this.showFontMask = true
      this.curProd = row
      this.fontTitle = '添加计算机包'
      this.buttonFontText = '添加'
    },
    handleClose() {
      this.curProd = null
    },
    handleFontClose() {
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
