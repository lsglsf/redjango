//import xhr from 'bfd-ui/lib/xhr'
import message from 'bfd-ui/lib/message'
import {notification} from 'antd';
import xhr from 'bfd/xhr'

//const ws_baseUrl='ws://127.0.0.1:8080'
//const ws_baseUrl='ws://114.215.199.94:8080/v1/sync_file/'
//let ws_baseUrl='wss://cmdb.winbons.com'
const ws_baseUrl='ws://192.168.44.130:8080'

var Datarequest = {
  UrlList() {
    return {
      'service_execute': '/v1/service_execute/',
      'path_list':'/v1/path_list/',
      'path_read':'/v1/service/list/path_list/',
      'group_get':'/v1/cmdb/list/groupget/',
      'service_sync':'/v1/sync_file/',
      'list_system':'/v1/service/list/list_system/',
      'home_demo':'/v1/service/list/Home/',
      'home_count':'/v1/service/list/Home_number/',
    }
  },

  host_info(_this,data,fun){
    let url=this.UrlList()['list_system']+'?id='+data
    this.xhrGetData(_this,url,fun)
  },

  service_execute(_this,fun,data){
    console.log(data)
    let url=ws_baseUrl+this.UrlList()['service_execute']
    this.handsocket(_this,url,fun,data)
  },

  home_demo(_this,fun){
    let url=this.UrlList()['home_demo']
    this.xhrGetData(_this,url,fun)
  },

  home_count(_this,fun){
    let url=this.UrlList()['home_count']
    this.xhrGetData(_this,url,fun)
  },

  service_sync(_this,fun,data){
    console.log(data)
    let url=ws_baseUrl+this.UrlList()['service_sync']
    this.handsocket(_this,url,fun,data)
  },

  path_list(_this,data,fun){
    console.log(data,'data')
    this.xhrPostData(_this,this.UrlList()['path_list'],data,'None',fun)
  },

  path_read(_this,data,fun){
    this.xhrPostData(_this,this.UrlList()['path_read'],data,'None',fun)
  },

  cmdb_all_list(_this,fun_url,name,fun){
    console.log(name)
    let url=this.UrlList()[fun_url]+'?name='+name
    this.xhrGetData(_this,url,fun)
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
          fun(_this, retu_data)
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
    //console.log('socketsdfsa')
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