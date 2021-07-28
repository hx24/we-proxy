<template>
  <div id="menu">
    <div class="menu-left grid-content">
      <el-tooltip class="item" effect="light" placement="bottom-end" v-if="!open">
        <div slot="content">启动代理服务器</div>
        <el-button type="success" icon="el-icon-caret-right" @click="toggleProxy" v-if="!open"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="light" placement="bottom-end" v-if="open">
        <div slot="content">关闭代理服务器</div>
        <el-button type="danger" icon="el-icon-close" @click="toggleProxy" v-if="open"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="light" placement="bottom-end">
        <div slot="content">清空列表</div>
        <el-button type="warning" icon="el-icon-delete" @click="clearRecorder"></el-button>
      </el-tooltip>
      <proxy-filter></proxy-filter>
    </div>
    <div class="menu-right grid-content">
      <el-popover ref="setting" placement="bottom" width="230" v-model="visibleSetting">
        <el-form ref="form" :model="setting" label-width="80px">
          <el-form-item class="show-record-list" v-if="recordlistView">
            抓包列表
            <el-switch v-model="recordlist" active-color="#13ce66" active-text="" inactive-text=""> </el-switch>
          </el-form-item>
          <el-form-item label="Port">
            <el-input v-model="setting.port"></el-input>
          </el-form-item>
          <el-form-item label="Global">
            <el-switch active-text="" inactive-text="" v-model="setting.global"></el-switch>
          </el-form-item>
          <el-form-item label="Https">
            <el-switch active-text="" inactive-text="" v-model="setting.forceProxyHttps"></el-switch>
          </el-form-item>
          <el-form-item label="Speed(kb/s)">
            <el-select v-model="setting.throttle" allow-create placeholder="No throttling">
              <el-option v-for="item in throttleOptions" :label="item.label" :value="item.value" :key="item.item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="menu-setting__btn">
            <el-button @click="visibleSetting = false">保存</el-button>
            <el-button type="success" @click="restartProxy">重启</el-button>
          </el-form-item>
        </el-form>
      </el-popover>
      <el-button type="primary" icon="el-icon-setting" :plain="true" v-popover:setting></el-button>
      <el-popover ref="popovertips" placement="bottom" width="160" v-model="visibleTips">
        <div style="text-align: right; margin: 0">
          <i class="el-icon-close" @click="visibleTips = false"></i>
        </div>
        <p v-if="proxyIp">
          代理地址：<br /><b>IP:</b> {{ proxyIp }} <br />
          <b>PORT:</b> {{ proxyPort }}
        </p>
        <p v-else>未开启代理</p>
      </el-popover>
      <el-button type="primary" icon="el-icon-info" :plain="true" v-popover:popovertips></el-button>
      <el-tooltip class="item" content="点击下载https证书" placement="bottom-end">
        <div slot="content">下载证书</div>
        <el-button type="primary" :plain="true" @click="downloadRootCA">证书</el-button>
      </el-tooltip>
      <el-popover placement="bottom" title="" width="200" trigger="click" class="crt-pop">
        <div class="crt-downlond">
          <img src="../assets/crt_qrcode.png" alt="crt_qrcode" />
          <div class="crt-tip">使用手机扫描二维码或直接访问<i>we.pro/crt</i></div>
          <div>具体安装方式同Fiddler或Charles</div>
        </div>
        <el-button slot="reference" type="primary" :plain="true">手机证书</el-button>
      </el-popover>
    </div>
  </div>
</template>
<script>
import proxyFilter from './filter.vue'
import { mapState } from 'vuex'
import _ from 'lodash'
import * as types from '../store/mutation-types'

export default {
  props: ['recordlistView'],
  data() {
    return {
      visibleSetting: false,
      visibleTips: false,
      openHttps: false,
      setting: {
        port: '8001',
        forceProxyHttps: false,
        global: false,
        throttle: null
      },
      throttleOptions: [
        {
          label: 'GPRS(50kb/s)',
          value: 50
        },
        {
          label: 'Regular 2G(250kb/s)',
          value: 250
        },
        {
          label: 'Good 2G(450kb/s)',
          value: 450
        },
        {
          label: 'Regular 3G(750kb/s)',
          value: 750
        },
        {
          label: 'Good 3G(1.5Mb/s)',
          value: 1536
        },
        {
          label: 'Regular 4G(4Mb/s)',
          value: 4096
        },
        {
          label: 'DSL(2Mb/s)',
          value: 2048
        },
        {
          label: 'WiFi(30Mb/s)',
          value: 30720
        }
      ],
      recordlist: true //是否显示抓包列表
    }
  },
  mounted() {
    // this.onUpdateRecorder();
    // console.log(this.$router.currentRoute);
  },
  computed: mapState({
    open: (state) => !!state.proxy_is_open,
    proxyPort: (state) => state.proxy_port,
    proxyIp: (state) => state.proxy_ip,
    currentRule: (state) => state.current_rule,
    mockPaths: (state) => state.mock_paths
  }),
  methods: {
    toggleProxy() {
      console.log('this.mockPaths', this.mockPaths)
      if (this.open) {
        this.stopProxy()
      } else {
        this.startProxy()
      }
      this.$store.commit(types.TOGGLE_PROXY)
    },
    startProxy() {
      const self = this
      if (this.currentRule.id) {
        this.setting.ruleid = this.currentRule.id
      }
      if (this.mockPaths && this.mockPaths.length) {
        this.setting.mock = this.mockPaths
      }
      this.$remoteApi.startProxy(this.setting).then(
        (res) => {
          self.$notify({
            title: '代理开启成功!',
            message: 'IP:' + res.ip + '  ' + 'PORT:' + res.port,
            type: 'success',
            duration: 2000
          })
          self.$store.commit(types.SET_PROXY_IP, res.ip)
          self.$store.commit(types.SET_PROXY_PORT, res.port)
          if (self.recordlist) {
            self.onUpdateRecorder()
          }
        },
        (res) => {
          self.$notify({
            message: res.msg,
            type: 'error',
            duration: 2000
          })
        }
      )
    },
    stopProxy() {
      const self = this
      this.$remoteApi.stopProxy().then(
        (res) => {
          self.$notify({
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          self.$remoteApi.offUpdate()
        },
        (res) => {
          self.$notify({
            message: res.msg,
            type: 'error',
            duration: 2000
          })
        }
      )
    },
    restartProxy() {
      const self = this
      this.$remoteApi.stopProxy().then((res) => {
        self.startProxy()
      })
    },
    clearRecorder() {
      this.$store.commit(types.CLEAR_RECORDER)
      // this.$remoteApi.clearRecorder();
    },
    setRule() {
      // TODO 没有TOGGLE_RULE_PANEL变量
      alert('没有TOGGLE_RULE_PANEL变量')
      // this.$store.commit(types.TOGGLE_RULE_PANEL);
    },
    downloadRootCA() {
      const h = this.$createElement
      const self = this
      const message = {
        success: '证书下载成功，请双击安装',
        exist: '证书已经存在',
        error: '证书下载失败'
      }
      this.$remoteApi.generateRootCA(
        (msg) => {
          this.$notify({
            title: '提示',
            message: h('p', { style: 'color:green' }, message[msg]),
            duration: 2000
          })
        },
        (msg) => {
          this.$notify({
            title: '提示',
            message: h('p', { style: 'color:red' }, message[msg]),
            duration: 2000
          })
        }
      )
    },
    onUpdateRecorder() {
      console.log('listening')
      const self = this
      //websocket listener
      this.$remoteApi.onUpdate((data) => {
        self.fetchRecorder()
      })
    },
    fetchRecorder: _.debounce(function () {
      const self = this
      console.log('fetch')
      this.$remoteApi.getlatestLog().then((data) => {
        self.$store.commit(types.UPDATE_RECORDER, data)
      })
    }, 200)
  },
  components: {
    proxyFilter
  }
}
</script>
<style lang="less">
#menu {
  display: -webkit-box;
  display: -webkit-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 10px 0 160px;
  box-sizing: border-box;
}
.menu-left {
  -webkit-box-flex: 1;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-extra-light-gray {
  background: #eff2f7;
}
.grid-content {
  border-radius: 4px;
  height: 56px;
  line-height: 56px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.grid-content-right {
  text-align: right;
}

.memu-https-status {
  margin-left: 20px;
}

.el-switch__input:checked + .el-switch__core {
  border-color: #42d885;
  background-color: #42d885;
}
.el-form {
  margin-top: 10px;
}
.el-form-item {
  margin-bottom: 5px;
}
.menu-setting__btn > .el-form-item__content {
  text-align: center;
  margin-left: 0 !important;
}
.el-form-item__content .el-button {
  margin-top: 20px;
}
.show-record-list .el-form-item__content {
  margin-left: 20px !important;
}
.crt-downlond {
  text-align: center;
  .crt-title {
    font-size: 20px;
  }
}
.crt-pop {
  margin-left: 10px;
}
</style>