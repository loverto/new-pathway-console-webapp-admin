<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link to="/agents/index">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户人数</div>
            <count-to :start-val="0" :end-val="agentNumber" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </router-link>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getList } from '@/api/dashboard'
import * as Api from '@/api/custom-template'

export default {
  components: {
    CountTo
  }, data() {
    return {
      agentNumber: 0,
      order: 0,
      cust: 0,
      madeOrder: 0,
      sentOrder: 0
    }
  },
  created() {
    this.agentList()
    this.orderList()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    agentList() {
      getList().then(response => {
        this.agentNumber = Number(response.headers['x-total-count']) || 0
      })
    },
    orderList() {
      Api.getListByCustomState(1, { page: 0, size: 1 }).then(response => {
        this.order = Number(response.headers['x-total-count']) || 0
      })
      Api.getListByCustomState(2, { page: 0, size: 1 }).then(response => {
        this.madeOrder = Number(response.headers['x-total-count']) || 0
      })
      Api.getListByCustomState(3, { page: 0, size: 1 }).then(response => {
        this.sentOrder = Number(response.headers['x-total-count']) || 0
      })
      Api.getList({ page: 0, size: 1 }).then(response => {
        this.cust = Number(response.headers['x-total-count']) || 0
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
