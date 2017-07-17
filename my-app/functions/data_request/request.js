//import xhr from 'bfd-ui/lib/xhr'
import message from 'bfd-ui/lib/message'
import {notification} from 'antd';
import xhr from 'bfd/xhr'

//const ws_baseUrl='ws://127.0.0.1:8080'
const ws_baseUrl='ws://192.168.2.224:8080'


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
      'graph':'/v1/service/list/graph/',
      'connect':'/v1/service/list/connect/',
      'vnc':'/v1/sshsocket/',
      'task':'/v1/service/list/tasklist/',
      'taskdetail':'/v1/service/list/taskdetail/',
      'taskstatus':'/v1/service/list/taskstatus/',
      'serverlist':'/v1/service/list/serverlist/',
      'filecheck':'/v1/service/list/filecheck/',
      'filesync':'/v1/service/list/filesync/',
      'serverconf':'/v1/service/list/serverconf/',
      'serverrestart':'/v1/service/list/serverrestart/',
      'selectquery':'/v1/service/list/selectquery/',
    }
  },

  selectquery(_this,data,fun){
    let url = this.UrlList()['selectquery']+'?group='+data
    this.xhrGetData(_this,url,fun)
  },

  serverrestart(data,fun){
    let url = this.UrlList()['serverrestart']
    this.xhrPostdata(url,data,fun)
  },

  serverconf(_this,data,config,fun){
    let url = this.UrlList()['serverconf']+'?ip='+data+'&configpath='+config
    this.xhrGetData(_this,url,fun)
  },
  
  filesync(data,fun){
    let url = this.UrlList()['filesync']
    this.xhrPostdata(url,data,fun)
  },

  filecheck(data,fun){
    let url = this.UrlList()['filecheck']
    this.xhrPostdata(url,data,fun)
  },

  serverlist(_this,fun){
    let url=this.UrlList()['serverlist']
    this.xhrGetData(_this,url,fun)
  },

  vnc_host(data,fun){
    let url=ws_baseUrl+this.UrlList()['vnc']
    this.wssocket(url,data,fun)
  },

  task_list(_this,data,fun){
    let url=this.UrlList()['task']+'?id='+data
    this.xhrGetData(_this,url,fun)
  },

  task_status(_this,data,fun){
    let url=this.UrlList()['taskstatus']+'?id='+data
    this.xhrGetData(_this,url,fun)
  },

  task_delete(_this,data,fun){
    let url=this.UrlList()['taskdetail']+'?delete_id='+data
    this.xhrGetData(_this,url,fun)
  },

  taskdetail(_this,data,fun){
    let url=this.UrlList()['taskdetail']+'?id='+data
    this.xhrGetData(_this,url,fun)
  },


  host_info(_this,data,fun){
    let url=this.UrlList()['list_system']+'?id='+data
    this.xhrGetData(_this,url,fun)
  },

  system_graph(_this,id,type,pid,fun){
    let url=this.UrlList()['graph']+"?pid="+pid+"&type="+type+"&id="+id
    this.xhrGetData(_this,url,fun)
  },

  service_execute(_this,fun,data){
    //console.log(data)
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
    //console.log(data)
    let url=ws_baseUrl+this.UrlList()['service_sync']
    this.handsocket(_this,url,fun,data)
  },

  path_list(_this,data,fun){
    //console.log(data,'data')
    this.xhrPostData(_this,this.UrlList()['path_list'],data,'None',fun)
  },

  path_read(_this,data,fun){
    this.xhrPostData(_this,this.UrlList()['path_read'],data,'None',fun)
  },

  cmdb_all_list(_this,fun_url,name,fun){
   // console.log(name)
    let url=this.UrlList()[fun_url]+'?name='+name
    this.xhrGetData(_this,url,fun)
  },

  connect_test(_this,data,fun){
    this.xhrPostData(_this,this.UrlList()['connect'],data,'None',fun)
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

  xhrPostdata(url,data,fun){
    xhr({
      url: url,
      type: 'POST',
      data: {
        data: data
      },
      success: (retu_data) => {
        fun(retu_data)
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
        fun(_this,retu_data)
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
     // console.log('close',evt)
      console.log("WebSocketClosed!");
      _this.setState({ws:''})
    };
    ws.onerror = function(evt)
    {
      //console.log('error',evt)
      console.log("WebSocketError!");
    };
  },
  wssocket(url,data,fun){
    //console.log('socketsdfsa')
    let ws=new WebSocket(url);
    ws.onopen = function()
    {
      ws.send(JSON.stringify(data))
    //  _this.setState({ws})
    };
    ws.onmessage = function(evt){
      //console.log(evt)
      fun(ws,evt)
    };
      ws.onclose = function(evt)
    {
     //console.log('close',evt)
      console.log("WebSocketClosed!");

     // _this.setState({ws:''})
    };
    ws.onerror = function(evt)
    {
      //console.log('error',evt)
      console.log("WebSocketError!");
    };
  }
}


export default Datarequest