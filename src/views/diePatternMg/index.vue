<template>
  <div class="app-container banner-wrapper">
    <router-link to="/die-pattern/add">
      <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus">添加刀模图</el-button>
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
      <el-table-column align="center" label="笔记本品牌" >
        <template slot-scope="scope">
          <span>{{ scope.row.computerType.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="笔记本型号">
        <template slot-scope="scope">
          <span>{{ scope.row.diePatternType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="主页默认显示">
        <template slot-scope="scope">
          <span>{{ scope.row.recommendedStatus.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="刀模图">
        <template slot-scope="scope">
          <template v-if="scope.row.diePatternimagePath">
            <viewer :img-src="baseImgUrl + scope.row.diePatternimagePath" :zoom="1"/>
<!--            <img :src="'http://th.minio.boyuanziben.cn' + scope.row.diePatternimagePath" :alt="scope.row.diePatternType" width="50px;">-->
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button type="danger" class="del-btn" size="small" icon="el-icon-error" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import * as Api from '@/api/die-pattern'
import Pagination from '@/components/Pagination'
import { removeRemoteImage } from '@/utils/file-uploader.js'
import Viewer from '@/components/Viewer'
import config from '@/utils/config.js'
export default {
  name: 'DiePatternList',
  components: { Pagination, Viewer },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      baseImgUrl: config.baseImgUrl
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList()
    })
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
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.diePatternimagePath) {
          this.removeImageFromMinio(row.diePatternimagePath).then(() => {
            console.log(`Remove remote image successed!`)
          })
        }
        this.doDelete(row.id).then(response => {
          if (response && response.status === 204) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          }
        }).catch(err => {
          console.error(err)
        })
      }).catch(() => {
        // Do nothing
      })
    },
    /**
     * 删除Minio 服务器上的图片
     */
    removeImageFromMinio(url) {
      const fileName = url ? url.split('/')[2] : ''
      return removeRemoteImage('die-pattern', fileName)
    },
    doDelete(id) {
      return Api.deleteById(id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
