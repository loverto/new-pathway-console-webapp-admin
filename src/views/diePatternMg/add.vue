<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="笔记本品牌:" prop="computerType">
          <el-select v-model="ruleForm.computerType" filterable clearable class="width-50p" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.value"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="笔记本型号:" prop="diePatternimageType">
          <el-input v-model="ruleForm.diePatternType" placeholder="笔记本型号(默认读取上传文件名称)..." class="width-50p"/>
        </el-form-item>

        <el-form-item label="图片:">
          <el-upload
            :multiple="false"
            :show-file-list="showFileList"
            :limit="1"
            :http-request="uploadSectionFile"
            :on-remove="removeImage"
            :before-upload="beforeUpload"
            list-type="picture"
            action="string"
            accept=".jpeg,.jpg,.png"
          >
            <el-button
              :disabled="ruleForm.diePatternimagePath ? true : false"
              size="small"
              type="primary"
            >
              <i :class="'el-icon-' + (uploading ? 'loading' : 'upload')"/>  点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png格式的文件哦~</div>
          </el-upload>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { add } from '@/api/die-pattern'
import { getList } from '@/api/computer-type'
import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
import { uploader, removeRemoteImage } from '@/utils/file-uploader.js'
export default {
  components: { ElSelectDropdown },
  data() {
    return {
      ruleForm: {
        computerType: {},
        recommendedStatus: {
          id: 1
        },
        diePatternType: '',
        diePatternimagePath: ''
      },
      total: 0,
      options: [],
      listQuery: {
        page: 1,
        pageSize: 10000
      },
      rules: {
        computerType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        diePatternType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        diePatternimagePath: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      uploading: false,
      showFileList: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    beforeUpload(file) {
      if (!file) return false

      const ext = /\.[^\.]+$/.exec(file.name)[0]

      if (!/\.(jpe?g|png)/.test(ext)) {
        this.showFileList = false
        this.$message({
          message: '只允许上传 jpg/jpeg/png 格式的图片哦~',
          type: 'warning'
        })
        return false
      }
    },
    /**
     * 新版上传方法
     */
    uploadSectionFile(data) {
      this.uploading = true
      this.ruleForm.diePatternType = data.file.name.split('.')[0]
      uploader('die-pattern', data.file).then(response => {
        this.uploading = false
        const { bucketName, fileName } = response
        this.ruleForm.diePatternimagePath = `/${bucketName}/${fileName}`
      })
        .catch(err => {
          this.uploading = false
          console.error(err)
        })
    },
    /**
     * 删除图片
     */
    removeImage(file) {
      const url = this.ruleForm.diePatternimagePath
      const fileName = url.split('/')[2]
      removeRemoteImage('die-pattern', fileName).then(() => {
        console.log(`Remove image '${fileName}' successed!`)
        this.ruleForm.diePatternimagePath = ''
        this.showFileList = false
      })
    },
    getList() {
      getList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize
      }).then(response => {
        this.options = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.ruleForm
          // debugger
          // data.computerType = this.ruleForm.ct
          add(data).then(response => {
            if (response.status === 201) {
              this.$message({
                message: '添加刀模图成功！',
                type: 'success'
              })
              // 重置表单
              this.resetForm(formName)
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .width-50p {
    width: 50%;
  }
  .form-wrapper {
    width: 50%;
  }
  .line {
    text-align: center;
  }

  .range-input {
    //
  }
</style>
