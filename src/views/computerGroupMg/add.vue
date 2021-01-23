<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="分组:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="分组名称" class="width-50p" />
        </el-form-item>
        <dnd-list v-if="buttonText == '编辑'" :list1Title="ruleForm.name" list2Title="未分组计算机" :list1="list1" :list2="list2" />

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即{{ buttonText }}</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>

import DndList from '@/components/DndList'
import { saveOrUpdate } from '@/api/computer-groups'
import { deepClone } from '@/utils'
import _ from 'lodash'

export default {
  name: 'AddOrEditProductPage',
  components: { DndList },
  props: {
    list1: {
      type: Array,
      default: null
    },
    list2: {
      type: Array,
      default: null
    },
    formData: {
      type: Object,
      default: null
    },
    buttonText: {
      type: String,
      default: '添加'
    }
  },
  data() {
    return {
      ruleForm: {
        // 分组代码值
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log('分组数据:' + JSON.stringify(this.list1))
    console.log('未分组数据:' + JSON.stringify(this.list2))
    if (this.formData) this.ruleForm = deepClone(this.formData)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 检查当前是新增还是保存
          let method = 'post'
          if (this.ruleForm.id || this.buttonText === '编辑') {
            method = 'put'
          }
          this.ruleForm.computers = this.list1

          // 新增或保存操作
          saveOrUpdate(this.ruleForm, method).then(response => {
            if (response.status === 201 || response.status === 200) {
              this.$message({
                message: `${this.buttonText}分组成功！`,
                type: 'success'
              })

              // 产品列表组件
              const productIndexComp = this.$parent.$parent
              if (this.buttonText === '编辑' || productIndexComp.$options.name === 'ProductList') {
                // 通知父组件中的监听回调方法
                productIndexComp.$emit('saveNotify', true)
              } else {
                // 新增完重置表单
                this.resetForm(formName)
              }
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
    },
    uploadIcon() {
      const self = this
      const fileNode = document.getElementById('file')
      fileNode.click()
      fileNode.onchange = (evt) => {
        const reader = new FileReader()
        const file = evt.target.files[0]
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          const result = this.result
          self.ruleForm.icon = result.substring(result.indexOf(',') + 1, result.length)
          self.ruleForm.iconContentType = file.type

          self.$message({
            message: '上传成功！',
            type: 'success'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .width-50p {
//   width: 50%;
// }
// .form-wrapper {
//   width: 50%;
// }
.line {
  text-align: center;
}

.range-input {
  //
}
</style>
