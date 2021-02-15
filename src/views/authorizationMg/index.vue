<template>
  <div class="app-container agent-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="授权:">
        <el-input v-model="currentSearch" placeholder="<按软件信息>查找 授权" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">按计算机添加授权</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleGroupAdd">按分组添加授权</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="分组>计算机名>计算机备注" width="350">
        <template slot-scope="scope">
          <el-select v-model="scope.row.computer" value-key="id" class="width-320" placeholder="请选择">
            <el-option
              v-for="item in computerOptions"
              :key="item.id"
              :label="item.groupName + '>' + item.name + '>' +item.code"
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

      <el-table-column align="center" label="用户" width="150">
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

      <el-table-column align="center" label="用户编码" width="150">
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
          <el-form-item v-if="showGroupMask" label="计算机分组:" prop="computer">
            <el-select v-model="ruleForm.computer" value-key="id" class="width-192" placeholder="请选择">
              <el-option
                v-for="item in groupOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-else label="计算机:" prop="computer">
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
import * as SoftwareApi from '@/api/software'
import * as GroupApi from '@/api/computer-groups'
import * as ComputeApi from '@/api/computer'
import { types } from '@/utils/role'
import Pagination from '@/components/Pagination'
import _ from 'lodash'
import qs from 'qs'
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
      groupOptions: [],
      groupComputer: [],
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
        pageSize: 1000
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
      showGroupMask: false,
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
        })
        this.list = data
        this.total = Number(response1.headers['x-total-count']) || 0
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
      GroupApi.getList().then(response => {
        return new Promise((resolve, reject) => {
          resolve(response)
        })
      }).then(response => {
        const computers = []
        this.groupOptions = response.data
        response.data.forEach((e) => {
          computers.push(GroupApi.getById(e.id))
        })
        return Promise.all(computers)
      }).then(response => {
        // 重置数组数据
        this.groupComputer = []
        console.log(response)
        response.forEach((re) => {
          re.data.computers.forEach((c) => {
            c.groupName = re.data.name
            this.groupComputer.push(c)
          })
        })
        return ComputeApi.getList({
          page: this.computerListQuery.page - 1,
          size: this.computerListQuery.pageSize,
          sort: 'lastModifiedDate,desc'
        })
      }).then(response => {
        let computers = []
        // const minus = response.data.filter(x => !this.groupComputer.has(x))
        if (!_.isEmpty(this.groupComputer)) {
          console.log('groupComputer:' + JSON.stringify(this.groupComputer))
          // 排除掉有分组名称的
          const minus = _.differenceBy(response.data, this.groupComputer, 'id')
          console.log('minius' + JSON.stringify(minus))
          // 处理未分组名称
          minus.forEach((c) => {
            c.groupName = '未分组'
            computers.push(c)
          })
          // 组合未分组和已分组
          // computers.push(this.groupComputer)
          computers = _.concat(this.groupComputer, computers)
        } else {
          console.log('response.data:' + JSON.stringify(response.data))
          response.data.forEach((c) => {
            c.groupName = '未分组'
            computers.push(c)
          })
        }
        this.computerOptions = computers
      })
      //   .then(response => {
      //   console.log('计算机数据:' + JSON.stringify(response.data))
      //   console.log('分组数据:' + JSON.stringify(this.hasGroupComputerList))
      //   this.computerList = _.differenceBy(response.data, this.hasGroupComputerList, 'id')
      // })
      // Api.getGroupComputerList().then(response => {
      //   this.computerOptions = response.data
      // })
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
      this.showGroupMask = false
      this.maskTitle = '新增'
    },
    handleGroupAdd() {
      this.showMask = true
      this.showGroupMask = true
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
        SoftwareApi.getSearchList({
          query: this.currentSearch,
          page: this.listQuery.page - 1,
          size: this.listQuery.pageSize,
          sort: 'lastModifiedDate,desc'
        }).then(response => {
          const data = response.data
          const searchSoftwareIds = []
          data.forEach(software => {
            searchSoftwareIds.push(software.id)
          })
          console.log(searchSoftwareIds)
          const tempParams = { softwareId: { in: searchSoftwareIds }}
          const params = qs.stringify(tempParams, { arrayFormat: 'repeat', allowDots: true })
          console.log('temp' + JSON.stringify(tempParams))
          console.log('param' + params)
          return Api.getListByFilter(tempParams)
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
          if (!this.showGroupMask) {
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
            const authObject = this.ruleForm
            // 获取计算机id
            GroupApi.getById(authObject.computer.id).then(response => {
              if (response.data) {
                const computers = []
                response.data.computers.forEach((c) => {
                  const singleAuthObject = _.clone(authObject)
                  singleAuthObject.computer = c
                  singleAuthObject.startDate = authObject.currentDate[0]
                  singleAuthObject.endDate = authObject.currentDate[1]
                  computers.push(Api.saveOrUpdate(singleAuthObject))
                })
                Promise.all(computers).then(response => {
                  response.forEach(re => {
                    if (re.status === 201) {
                      this.$message({
                        message: '保存成功！',
                        type: 'success'
                      })
                      this.showMask = false
                      this.getList()
                      this.resetRuleForm()
                    }
                  })
                }).catch(err => {
                  console.error(err)
                })
              }
            })
          }
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
.width-320 {
  width: 320px;
}
.el-form-item__tip {
  font-size: 12px;
  color: #C0C4CC;
}
</style>
