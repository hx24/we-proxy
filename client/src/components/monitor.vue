<template>
  <div class="monitor-page">
    <h1 class="page-title">
      <div class="monitor-switcher">
        <!-- <el-switch class="switch-btn" v-model="checked" active-color="#13ce66" inactive-color="#eee" :active-text="checked ? '监控中' : '已关闭'"> </el-switch> -->
        <!-- <el-button class="remove-all" @click="removeAll" size="medium" type="primary" icon="el-icon-delete">清除</el-button> -->
        <el-input class="key-word-wrap" placeholder="请输入过滤内容" size="medium" v-model="inputKeyWord" clearable>
          <el-select class="key-word-select" v-model="selectKeyWord" slot="prepend" placeholder="请选择" clearable>
            <el-option class="key-word-option" label="事件名" value="click_event"></el-option>
            <el-option class="key-word-option" label="clickId" value="click_id"></el-option>
          </el-select>
        </el-input>
      </div>
      <div class="monitor-filter-page">
        <el-checkbox v-model="filterPageMonitor">过滤页面埋点(PV)</el-checkbox>
      </div>
    </h1>
    <ul class="list" id="list">
      <li v-for="(data, dataIndex) in filteredDataList" :key="dataIndex">
        <template v-if="data.isPageMonitor">
          <li>
            <div class="list-row event">
              <div class="list-item">
                <span class="name title">页面埋点</span>
              </div>
            </div>
            <div class="list-row click-id">
              <div class="list-item">
                <span class="name title">页面路径:</span>
                <span class="detail">{{ data.pageUrl }}</span>
              </div>
            </div>
          </li>
        </template>
        <template v-else>
          <div class="list-row event">
            <div class="list-item">
              <span class="name title">事件名:</span>
              <span class="detail">{{ data.event }}</span>
            </div>
          </div>
          <div class="list-row click-id">
            <div class="list-item">
              <span class="name title">clickId:</span>
              <span class="detail">{{ data.clickId }}</span>
            </div>
          </div>
          <!-- 上报data为String： -->
          <template v-if="typeof data.params === 'string'">
            <div class="list-row visit-string-value">
              <span class="name title">上报data:</span>
              <span class="detail">{{ data.params }}</span>
            </div>
          </template>
          <!-- 上报data为Object -->
          <template v-else>
            <div class="list-title">私有参数:</div>
            <div class="list-row" v-for="(key, itemIndex) in Object.keys(data.params || {})" :key="itemIndex">
              <span class="name param-title">{{ key }}：</span>
              <pre class="detail param-detail">{{ data.params[key] | formatText }}</pre>
            </div>
          </template>
        </template>
        <div class="time">{{ data.time | formatTime }}</div>
      </li>
    </ul>
  </div>
  <!-- <transition name="slide-fade">
    </transition> -->
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import * as types from '../store/mutation-types'

export default {
  name: 'monitor',
  filters: {
    formatTime(timestamp) {
      return moment(timestamp).format('hh:mm:ss')
    },
    formatText(t) {
      return Array.isArray(t) ? JSON.stringify(t, null, 4) : t
    }
  },
  data() {
    return {
      responseData: '',
      activeName: 'headers',
      curDataList: [],
      checked: false, // 初始关闭功能
      inputKeyWord: '', // 输入框关键词
      selectKeyWord: '', // 多选框关键词
      filterPageMonitor: true // 过滤页面埋点
    }
  },
  computed: {
    dataList() {
      return this.$store.getters.monitorRecords
    },
    filteredDataList() {
      const { inputKeyWord, selectKeyWord } = this
      let { dataList } = this

      if (this.filterPageMonitor) {
        dataList = dataList.filter((item) => !item.isPageMonitor)
      }

      if (!inputKeyWord) return dataList

      if (selectKeyWord === 'click_event') {
        return dataList.filter(({ event }) => event && event.includes(inputKeyWord))
      }

      if (selectKeyWord === 'click_id') {
        return dataList.filter(({ clickId }) => clickId && String(clickId).includes(inputKeyWord))
      }

      return dataList.filter((item) => {
        const hasEvent = item.event && item.event.includes(this.inputKeyWord)
        const hasClickId = item.clickId && String(item.clickId).includes(this.inputKeyWord)
        if (typeof item.params === 'string') {
          // monitor.visit('xxx') 情况
          const hasData = item.params && item.params.includes(this.inputKeyWord)
          return hasEvent || hasClickId || hasData
        } else {
          // monitor.click('event_name', 私参Object)
          item.params = item.params || {}
          const hasKey = Object.keys(item.params || {}).includes(this.inputKeyWord)
          const hasValue =
            Object.values(item.params || {}).filter((i) => {
              // 模糊查询
              return JSON.stringify(i).indexOf(this.inputKeyWord) > -1
            }).length > 0
          return hasEvent || hasClickId || hasKey || hasValue
        }
      })
    }
  },
  watch: {
    inputKeyWord(val) {
      this.inputKeyWord = val.trim()
    }
  },
  methods: {}
}
</script>
<style lang="less">
// .slide-fade-enter-active {
//   transition: all 0.3s ease;
// }
// .slide-fade-leave-active {
//   transition: all 0.3s ease;
// }
// .slide-fade-enter,
// .slide-fade-leave-active {
//   transform: translate3d(200px, 0, 0);
//   opacity: 0;
// }

.monitor-page {
  background: #fff;
  height: 100%;
  overflow: auto;

  -webkit-box-flex: 1;
  -webkit-box-orient: vertical;
  padding: 20px;
  user-select: text;
  box-sizing: border-box;
  // margin-top: 60px;
  h1 {
    margin: 0;
  }
  .page-title {
    font-size: 18px;
    color: #1f233e;
    font-weight: normal;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    .monitor-filter-page {
      margin-left: 20px;
    }
  }
  .list {
    padding: 0;
    list-style: none;
  }
  .key-word-wrap {
    width: 350px;
  }
  .key-word-select {
    width: 90px;
  }
  .key-word-search {
    width: 40px;
  }
  .list-row.event {
    margin-bottom: 15px;
  }
  .list-row.click-id {
    margin-bottom: 10px;
  }
  .time {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #638096;
  }
  .list-row:after {
    content: '';
    display: block;
    visibility: hidden;
    clear: both;
  }
  .list > li {
    padding: 12px;
    background-color: #f0f3f5;
    border: 1px solid #eee;
    border-radius: 3px;
    transition: all 0.3s ease;
    animation: 0.3s ease-in slidein;
    position: relative;
  }
  .list > li + li {
    margin-top: 15px;
  }
  .list > li:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
  }
  .list .title {
    font-size: 18px;
    font-weight: bold;
  }
  .param-detail {
    margin-bottom: 10px;
    white-space: pre-wrap;
    overflow: hidden;
  }
  .list .list-title {
    color: #638096;
    padding: 8px 0;
    font-size: 18px;
    font-weight: bold;
  }
  .list .list-item {
    float: left;
  }
  @keyframes slidein {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .list .list-item + .list-item {
    margin-left: 15px;
  }
  .list .name {
    color: #638096;
  }
  .list .detail {
    color: #34495e;
    margin-left: 10px;
  }
  .monitor-switcher {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>