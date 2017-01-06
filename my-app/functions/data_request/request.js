//import xhr from 'bfd-ui/lib/xhr'
import message from 'bfd-ui/lib/message'
import {notification} from 'antd';
import xhr from 'bfd/xhr'

const ws_baseUrl='ws://127.0.0.1:8080'
//const ws_baseUrl='ws://114.215.199.94:8080/v1/sync_file/'
//let ws_baseUrl='wss://cmdb.winbons.com/v1/sync_file/'
//const ws_baseUrl='ws://192.168.44.130:8080'

var Datarequest = {
  UrlList() {
    return {
      'service_execute': '/v1/service_execute/',
    }
  },
  service_execute(_this,fun,data){
    console.log(data)
    let url=ws_baseUrl+this.UrlList()['service_execute']
    this.handsocket(_this,url,fun,data)
  },
  xhrPostData(_this, url, data_select, host_status, fun) {
    let self = this
    xhr({
        url: url,
        type: 'POST',
        data: {
          method: host_status,
          data: data_select
        },
        success: (retu_data) => {
          fun(_this, retu_data, host_status, url, self)
      },
      error:() => {
        message.danger('API异常！')
      }
  })
  },
  xhrGetData(_this, url, fun){
    xhr({
        url: url,
        type: 'GET',
        success: (retu_data) => {
        fun(_this, retu_data)
      }
    })
  },
  handsocket(_this,url,fun,data){
    console.log('socketsdfsa')
    let ws=new WebSocket(url);
    ws.onopen = function()
    {
      ws.send(JSON.stringify(data))
      _this.setState({ws})
    };
    ws.onmessage = function(evt)
    {
      fun(_this,evt.data)
    };
    ws.onclose = function(evt)
    {
      console.log('close',evt)
      console.log("WebSocketClosed!");
      _this.setState({ws:''})
    };
    ws.onerror = function(evt)
    {
      console.log('error',evt)
      console.log("WebSocketError!");
    };
  }
}

export default Datarequest