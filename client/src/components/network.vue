<template>
  <div id="network">
    <proxy-menu></proxy-menu>
    <el-table
      id="nt-record-list"
      :data="tableData"
      :height="'100%'"
      :row-class-name="tableRowClassName"
      highlight-current-row
      stripe
      row-key="id"
      style="width: 100%; font-size: 12px"
      @row-click="handleCurrentChange"
    >
      <el-table-column type="index" width="80"> </el-table-column>
      <el-table-column prop="method" label="Method" width="150"> </el-table-column>
      <el-table-column prop="statusCode" label="Code" width="100"> </el-table-column>
      <el-table-column prop="host" label="Host" width="280"> </el-table-column>
      <el-table-column prop="path" label="Path" width="250"> </el-table-column>
      <el-table-column prop="mime" label="Mime" width="120"> </el-table-column>
      <el-table-column prop="startTime" :formatter="dateFormatter" label="Start"> </el-table-column>
    </el-table>
    <transition name="slide-fade">
      <div id="network_pannel" v-if="detailPanelStatus">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Headers" name="headers"></el-tab-pane>
          <el-tab-pane label="Preview" name="preview"></el-tab-pane>
          <el-tab-pane label="Response" name="response"></el-tab-pane>
          <el-tab-pane label="Cookies" name="cookies"></el-tab-pane>
          <network-detail :detail-content="detailContent" :headers="currentRow" :panel-type="activeName"> </network-detail>
        </el-tabs>
        <i id="close_panel" class="el-icon-close" @click="detailPanelStatus = false"></i>
      </div>
    </transition>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
// import proxyMenu from './menu.vue'
import networkDetail from './network-detail.vue'
import * as types from '../store/mutation-types'
import proxyMenu from './menu.vue'

export default {
  data() {
    return {
      responseData: '',
      currentRow: {
        reqHeader: {},
        resHeader: {}
      },
      activeName: 'headers',
      detailPanelStatus: false,
      detailContent: {}
    }
  },
  components: {
    networkDetail,
    proxyMenu
  },
  computed: {
    tableData() {
      return this.$store.getters.filterTableDate
    }
  },
  methods: {
    tableRowClassName(row, index) {
      if (row.method == 'CONNECT') {
        return 'gray-row'
      } else if (row.statusCode >= 400) {
        return 'error-row'
      } else if (row.statusCode == 200) {
        return 'success-row'
      }
      return ''
    },
    handleCurrentChange(val) {
      let self = this
      if (this.currentRow.id === val.id) {
        this.detailPanelStatus = !this.detailPanelStatus
      } else {
        this.detailPanelStatus = true

        this.$remoteApi.getSingleLog(val.id).then(
          (rec) => {
            self.currentRow = rec || {}
          },
          () => {}
        )
        this.$remoteApi.fetchBody(val.id).then(
          (data) => {
            self.detailContent = data
          },
          () => {}
        )
      }
    },
    dateFormatter(row, column) {
      return moment(row.start).format('hh:mm:ss')
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
}
</script>
<style lang="less">
#network {
  -webkit-box-flex: 1;
  -webkit-box-orient: vertical;
  padding: 10px;
  user-select: text;
  box-sizing: border-box;
  margin-top: 60px;
  #network_pannel {
    position: absolute;
    top: 30px;
    right: 0;
    background-color: #fff;
    width: 50%;
    height: 100%;
    overflow-y: scroll;
    box-shadow: -3px 2px 9px rgba(0, 0, 0, 0.4);
    z-index: 999;
    padding: 10px;
  }
  .el-table .gray-row {
    color: #999;
  }
  .el-table tr.current-row > td {
    background-color: #58b7ff;
  }
  .el-table .success-row td:nth-child(3) {
    color: #13ce66;
  }
  .el-table .error-row {
    color: #ff4949;
  }
  .el-table .odd-row {
    background: #fafafa;
  }
  .el-icon-close {
    transition: transform 0.2s ease-in;
    &:hover {
      transform: rotate(180deg);
    }
  }

  .el-tabs__content {
    margin-bottom: 0;
  }
  .el-tabs__content {
    height: 100%;
    overflow-y: scroll;
    padding: 20px;
  }

  #nt-record-list {
    td {
      height: 30px;
      .cell {
        white-space: nowrap;
      }
    }
  }

  #close_panel {
    position: absolute;
    right: 12px;
    top: 12px;
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }
  .slide-fade-enter,
  .slide-fade-leave-active {
    transform: translate3d(200px, 0, 0);
    opacity: 0;
  }
}
</style>