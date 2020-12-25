<template>
  <div class="app-container agent-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="授权:">
        <el-input v-model="currentSearch" placeholder="查找 授权" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加授权</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="计算机" width="220">
        <template slot-scope="scope">
          <el-select v-model="scope.row.computer" value-key="id" class="width-192" placeholder="请选择">
            <el-option
              v-for="item in computerOptions"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="软件" width="250">
        <template slot-scope="scope">
          <el-select v-model="scope.row.software" value-key="id" class="width-192" placeholder="请选择">
            <el-option
              v-for="item in softwareOptions"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户" width="250">
        <template slot-scope="scope">
          <el-select v-model="scope.row.userinfo" value-key="id" class="width-192" placeholder="请选择">
            <el-option
              v-for="item in userinfoOptions"
              :key="item.id"
              :label="item.username"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户编码" width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.userinfo && scope.row.userinfo.code">{{ scope.row.userinfo.code }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="加入日期-有效日期" width="350">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.currentDate"
            :picker-options="pickerOptions"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="加入日期"
            end-placeholder="有效日期"
          />
        </template>

      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleSave(scope.row)">
            <svg-icon icon-class="password" /> 保存
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="loadAll" />

    <!-- 新增编辑授权弹框 -->
    <el-dialog v-if="showMask" :visible.sync="showMask" :title="maskTitle" width="650px">
      <div class="dialog-form__wrapper">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rule" label-width="100px">
          <el-form-item label="计算机:" prop="computer">
            <el-select v-model="ruleForm.computer" value-key="id" class="width-192" placeholder="请选择">
              <el-option
                v-for="item in computerOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="软件:" prop="software">
            <el-select v-model="ruleForm.software" value-key="id" class="width-192" placeholder="请选择">
              <el-option
                v-for="item in softwareOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="用户:" prop="userinfo">
            <el-select v-model="ruleForm.userinfo" value-key="id" class="width-192" placeholder="请选择">
              <el-option
                v-for="item in userinfoOptions"
                :key="item.id"
                :label="item.username"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始-截至" prop="currentDate">
            <el-date-picker
              v-model="ruleForm.currentDate"
              :picker-options="pickerOptions"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="加入日期"
              end-placeholder="有效日期"
            />
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{ maskTitle }}</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from '@/api/authorization'
import { types } from '@/utils/role'
import Pagination from '@/components/Pagination'
export default {
  name: 'AuthorizationList',
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 360)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '二年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 720)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '五年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 1800)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '十年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 3600)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      list: [],
      currentDate: [],
      currentSearch: '',
      activatedOptions: [{ id: true, value: '启用' }, { id: false, value: '禁用' }],
      computerOptions: [],
      softwareOptions: [],
      userinfoOptions: [],
      roleOptions: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      computerListQuery: {
        page: 1,
        pageSize: 10
      },
      ruleForm: null,
      rule: {
        computer: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        userinfo: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        software: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        currentDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      showMask: false,
      maskTitle: '新增'
    }
  },
  created() {
    this.resetRuleForm()
    this.loadAll()
    this.getUserinfoList()
    this.getSoftwareList()
    this.getComputerList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        sort: 'lastModifiedDate,desc'
      }).then(response1 => {
        const data = response1.data
        data.forEach(item => {
          item.currentDate = []
          item.currentDate.push(item.startDate, item.endDate)
          this.list = data
          this.total = Number(response1.headers['x-total-count']) || 0
        })
        this.listLoading = false
      })
    },
    getUserinfoList() {
      Api.getUserinfoList().then(response => {
        this.userinfoOptions = response.data
      })
    },
    getSoftwareList() {
      Api.getSoftwareList().then(response => {
        this.softwareOptions = response.data
      })
    },
    getComputerList() {
      Api.getComputerList().then(response => {
        this.computerOptions = response.data
      })
    },
    getComputerSelectedList(query) {
      this.listLoading = true
      Api.getSearchList({
        query: query,
        page: this.computerListQuery.page - 1,
        size: this.computerListQuery.pageSize
      }).then(response => {
        this.computerOptions = response.data
        this.listLoading = false
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
    handleAdd() {
      this.showMask = true
      this.maskTitle = '新增'
    },
    handleEdit(row) {
      this.showMask = true
      this.maskTitle = '编辑'
      this.ruleForm = Object.assign({}, row || {})
    },
    handleDelete(row) {
      this.$confirm('您此操作会很严重，将会删除当前选中授权，请再次确认！！！', '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.deleteById(row.id).then(response => {
          if (response.status === 204) {
            this.getList()
          }
        })
      })
    },
    handleSave(row) {
      const authObject = row
      authObject.startDate = authObject.currentDate[0]
      authObject.endDate = authObject.currentDate[1]
      Api.saveOrUpdate(row, 'put').then(response => {
        if (response.status === 200) {
          this.getList()
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        }
      })
    },
    modify(row) {
      Api.modify(row).then(response => {
        if (response.status === 200) {
          this.getList()
        }
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
          size: this.listQuery.pageSize,
          sort: 'lastModifiedDate,desc'
        }).then(response => {
          const data = response.data
          data.forEach(item => {
            item.currentDate = []
            item.currentDate.push(item.startDate, item.endDate)
            this.list = data
            this.total = Number(response.headers['x-total-count']) || 0
          })
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
    handleActived(row) {
      const r = JSON.parse(JSON.stringify(row))
      r.activated = true
      this.modify(r)
    },
    handleDisabled(row) {
      const r = JSON.parse(JSON.stringify(row))
      r.activated = false
      this.modify(r)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const authObject = this.ruleForm
          authObject.startDate = authObject.currentDate[0]
          authObject.endDate = authObject.currentDate[1]
          Api.saveOrUpdate(authObject).then(response => {
            if (response.status === 201) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.showMask = false
              this.getList()
              this.resetRuleForm()
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    resetPwd(row) {
      this.$confirm('确定要重置密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.resetpwd({
          authorities: row.authorities,
          id: row.id,
          computer: row.computer,
          login: row.login,
          password: '123456',
          activated: row.activated,
          langKey: row.langKey,
          email: row.email
        }).then(response => {
          if (response.status === 200) {
            this.$message({
              message: '重置密码成功！默认密码为：123456',
              type: 'success'
            })
          } else {
            this.$message.error('重置密码失败！')
          }
        })
      }).catch(() => {
        // Do nothing
      })
    },
    resetRuleForm() {
      this.ruleForm = {
        computer: '',
        login: '',
        password: '123456',
        activated: false,
        langKey: 'zh-cn',
        email: ''
      }
    },
    resetForm() {
      this.showMask = false
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
