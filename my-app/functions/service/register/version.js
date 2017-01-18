//import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import Button  from 'bfd/Button'
import React, { Component } from 'react'
import './index.less'
import update from 'react-update'
import { Form, FormItem, FormSubmit, FormInput, FormSelect, Option as Options, FormTextarea } from 'bfd/Form'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import Transfer from 'bfd/Transfer'
import xhr from 'bfd/xhr'
//import { Select, Option as Options } from 'bfd/Select'
//import { Row, Col } from 'bfd/Layout'
import { Menu, Dropdown,Icon,Popconfirm } from 'antd';
import { Modal, Button as Buttons, Alert } from 'antd';
import CodeMirror from 'react-codemirror'
import codeMirror from 'codemirror'
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/theme/ambiance.css";
import "../../../node_modules/codemirror/theme/blackboard.css";
import "../../../node_modules/codemirror/mode/javascript/javascript.js";
import "../../../node_modules/codemirror/mode/python/python.js";
import "../../../node_modules/codemirror/mode/ttcn-cfg/ttcn-cfg.js";
import OPEN from '../../data_request/request.js'
import { Row, Col } from 'antd'
import Tree from 'bfd/Tree'
import ReactDOM from 'react-dom'
import { Spin} from 'antd';




class File_sync extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      formData: {
        brand: 0
      },
      detele_host:'',
      add_Path:false,
      path_list:[],
      path_dict:{},
      per_host:'',
      sync_data:'',
      result_data:{},
      backup:[],
      ws:'',
    }
  }

  componentWillMount(){
    /*let formData=this.state.formData
    let delete_id=new Array()
    let detele_host=''
    for (let i in this.props.rows) {
      if (i==this.props.rows.length-1){
        delete_id.push(this.props.rows[i]['id'])
        detele_host = detele_host +'"'+ this.props.rows[i]['name']+'"'}else{
        delete_id.push(this.props.rows[i]['id'])
        detele_host = detele_host + '"'+this.props.rows[i]['name']+'"' + '、'
      }
    }
    formData['delete_id']=delete_id
    this.setState({detele_host,formData})*/
   // console.log(this.props.select_host,'sdfsfdsafsa')
   // console.log(this.props.host,'11')
  // this.handsocket()
  console.log(this.props.item,'item')
  
  }

  handleSuccess(res) {
    this.handleclose()
    this.props.getdata()
    if (res['status']==true){
      message.success('删除成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleclose(){
    this.props.modal.close()

  }

  add_path(){
    //let add_Path='<FormItem label="添加目录" name="desc" help=""><FormTextarea style={{width:"400px",height:"150px"}} /></FormItem>'
    let path_list=new Array()
    if (this.state.add_Path==true){
      if (this.state.formData['desc']){
        for (var i in this.state.formData['desc'].split('\n')){
          let path_dict={}
          //console.log(this.state.formData['desc'].split('\n')[i].length,'iiiiiiii.1')
          if (this.state.formData['desc'].split('\n')[i].length > 1){
            path_dict['path']=this.state.formData['desc'].split('\n')[i]
            path_dict['delete']=false
            path_dict['type']='none'
            //path_list.push(this.state.formData['desc'].split('\n')[i])
            path_list.push(path_dict)
          }
        }
        if (!this.state.ws){
          //console.log('adfsaf')
          this.handsocket()
        }
        this.setState({path_list})
      }
      this.setState({add_Path:false,sync_data:'',result_data:{},backup:[]})
    }else{
        this.setState({add_Path:true,path_list:[],sync_data:'',result_data:{},backup:[]})
    }
  }

  detection_path(){
    /*let path_list=this.state.path_list
   console.log('path_list',path_list)
    const _this = this
    xhr({
      type: 'POST',
      url: '/v1/service/list/file_dir/',
      data: {'path_list':path_list,'host':this.props.select_host,'per_host':this.state.per_host},
      success(data) {
        console.log(data)
        console.log(data['data'])
        _this.setState({path_list:data['data']})
      }
    })*/
    let path_list=this.state.path_list
    let path_dict={'data':path_list,'pf':'init','fun':'fun_file','t_host':this.props.item['ip'],'app':this.props.item['service_name'],ip:this.props.item['ip']}
    this.ws_websokct(path_dict)
    //let ws=this.state.ws
    //ws.send()
  }

  ws_websokct(data){
    let ws = this.state.ws
    ws.send(JSON.stringify(data))
    /*ws.onopen=function(){
      ws.send(JSON.stringify(data))
    }*/
  }


  handselect(var1,var2,){
    let path_list=this.state.path_list
    if (var2 == 1 ){
      console.log(path_list[var1])
      path_list[var1]['delete']=var2.target.value
    }else{
      path_list[var1]['delete']=var2.target.value
    }
    this.setState({path_list})
    console.log(path_list,'path_list111111')
  }

  pre_host(hostname){
    //console.log('1111',hostname)
    this.setState({per_host:hostname})
  }

  write_file(){
    console.log(this.state.sync_data)
    let sync_data=this.state.sync_data
    sync_data['fun']='file_write'
    sync_data['pf']='init'
    sync_data['data']='aaa'
    sync_data['ip']=this.props.item['ip']
    this.ws_websokct(sync_data)
  }

  write_close(){
    this.state.ws.close()
    this.props._this.setState({visible:false})
  }

  handsocket(){
    let ws_baseUrl='ws://192.168.44.130:8080/v1/sync_file/'
    //let ws_baseUrl='wss://cmdb.winbons.com/v1/sync_file/'
    //let ws_baseUrl='ws://127.0.0.1:8080/v1/sync_file/'
    //let ws_baseUrl='ws://114.215.199.94:8080/v1/sync_file/'
    let _this=this
    console.log('socketsdfsa')
    //let ws=new WebSocket("ws://127.0.0.1:8080/v1/sync_file/");
    let ws=new WebSocket(ws_baseUrl);
    ws.onopen = function()
    {
      console.log("open");
     _this.setState({ws})

    };
    ws.onmessage = function(evt)
    {
      let return_json=JSON.parse(evt.data)
      if (return_json['status'] != "stop"){
      if (return_json['pf'] == 'read'){
        _this.setState({sync_data:JSON.parse(evt.data),path_list:''})
      }else if (return_json['pf'] == 'backup'){
        let backup = _this.state.backup
        backup.push(return_json['data'])
        _this.setState({sync_data:'',backup})
      }else if (return_json['pf']=='write') {
        let result_data = _this.state.result_data
        result_data['update']=return_json['update']
        result_data['delete']=return_json['delete']
        _this.setState({result_data})
      }
    }else{
      message.danger(return_json['data'])
    }
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
    return ws
  }


  render() {
    const { formData } = this.state
    let nav=this.state.path_list ? this.state.path_list.map((item,str)=>{
    let color1='none'
    if (item['type']=='none'){
       color1='black'
    }else if (item['type']=='f') {
       color1='green'
    }else if (item['type']=='d') {
      color1='green'
    }else if (item['type']=='w') {
      color1 = 'yellow'
    }else{
      color1 = 'red'
    }
    return(
        <div key={str}>
          <span style={{height:'20px',lineHeight:'20px',color:color1}}>{item['path']}</span>
          {/*<FormSelect style={{left:'50px',float:'right'}} className="Select_heig" onChange={
          .bind(this,str)}>
            <Option >同步</Option>
            <Option value={1}>删除</Option>
          </FormSelect>*/}
          <span style={{float:'right'}}>
          <select onChange={::this.handselect.bind(this,str)} >
            <option key={0} value={false}>同步</option>
            <option key={1} value={true}>删除</option>
          </select>
          </span>

        </div>
        )
    }):<span></span>

    let source_file=this.state.sync_data['s'] ? this.state.sync_data['s'].map((item,str)=>{
    //console.log(item,str,'1111111111')
    let color1='none'
    if (item['type']=='none'){
       color1='black'
    }else if (item['type']=='f') {
       color1='green'
    }else if (item['type']=='d') {
      color1='green'
    }else if (item['type']=='w') {
      color1 = 'yellow'
    }else{
      color1 = 'red'
    }
      return(
        <div key={str}>
          <span style={{height:'20px',lineHeight:'20px',color:color1}}>{item['path']}</span>
          <span style={{float:'right'}}>
          <select onChange={::this.handselect.bind(this,str)} >
            <option key={0} value={false}>同步</option>
            <option key={1} value={true}>删除</option>
          </select>
          </span>
        </div>)
    }):<span></span>

    let target_file=this.state.sync_data['d'] ? this.state.sync_data['d'].map((item,str)=>{
  //  console.log(item,str,'1111111111')
    let color1='none'
    if (item['type']=='none'){
       color1='black'
    }else if (item['type']=='f') {
       color1='green'
    }else if (item['type']=='d') {
      color1='green'
    }else if (item['type']=='w') {
      color1 = 'yellow'
    }else{
      color1 = 'red'
    }
      return(
        <div key={str} >
          <span style={{height:'20px',lineHeight:'20px',color:color1}}>{item['path']}</span>
          <span style={{float:'right'}}>
          <select onChange={::this.handselect.bind(this,str)} >
            <option key={0} value={false}>同步</option>
            <option key={1} value={true}>删除</option>
          </select>
          </span>
        </div>)
    }):<span></span>

    let backup = this.state.backup ? this.state.backup.map((item,str)=>{
      return (
          <div key={str}>
            <h5>{item}</h5>
          </div>
        )
    }):<span></span>

    let update = this.state.result_data['update'] ? this.state.result_data['update'].map((item,str)=>{
      return(
        <div key={str}>
          <h5><span>{item}</span><span>...................</span><span>同步成功</span></h5>
        </div>
        )
    }):<span></span>

    let host=this.props.host? this.props.host.map((item,str)=>{
      return(
        <Options value={item}>{item}</Options>
        )
    }):<span></span>
    return (
    	<Form
        action="/v1/cmdb/list/groupdelete/"
        data={formData}
        type='GET'
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        labelWidth={'200px'}
        onSuccess={::this.handleSuccess}
      >
      	<FormItem label="添加同步文件或者目录" name="name" help="" style={{height:'17px',lineHeight:'30px'}}>
          <a href='#' style={{marginRight:'20px'}}><span onClick={::this.add_path}>添加</span></a>
          <a href='#' ><span onClick={::this.detection_path} >检测</span></a>
        </FormItem>
        <div style={{maxHeight:'500',overflow:'auto'}}>
          {
            this.state.add_Path ? <FormItem label="添加目录" name="desc" help=""><FormTextarea style={{width:"700px",height:"150px"}}/></FormItem>: <div></div>
          }
          {nav}
          {this.state.sync_data ?
            <div>
              <h4>{this.state.sync_data['s_host']}</h4>
              {source_file}
              <h4>{this.state.sync_data['t_host']}</h4>
              {target_file}
              <div style={{paddingTop:'20px'}}>
                <Button onClick={::this.write_close} type='minor' >取消</Button>
                <Button onClick={::this.write_file} type='minor' style={{marginLeft:'632px'}} >同步</Button>
              </div>
            </div>
          :<span></span>
          }
          {backup}
          {update}
        </div>
      </Form>
    )
  }
}


class Version_update extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.rules = {
      name(v) {
        if (!v) return '名称不能为空'
        if (v.length > 5) return '用户群名称不能超过5个字符'
      },
    }
    this.state = {
      formData: {
        brand: 0,
        type: 'group_create',
      },
      sourceData: [],
      targetData: [],
      newData:[],
      record_source:[],
      select_host:[],
    }
  }

  componentWillMount(){
   /* this.setState({sourceData:this.props.host,record_source:this.props.host})
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=assert_all',
      success(data) {
        console.log(data['data'])
        _this.setState({sourceData:data['data']})

      }
    })*/
  }


  handleSuccess(res) {
    this.handleclose()
    this.props.getdata()
    if (res['status']==true){
      message.success('创建成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleChange(sourceData, targetData) {
   // this.test(this.state.newData,sourceData)
    console.log(targetData)
    let formData = this.state.formData
    //formData['sourceData']=sourceData
    formData['targetData']=targetData
    this.setState({
      sourceData: sourceData,
      targetData: targetData,
      newData:targetData,
      formData,
    })
  }

  handleSearch(label, keyValue) {
    return label.indexOf(keyValue) != -1;
  }

  handleclose(){
    this.props.modal.close()
  }

  host_select(var11){
    console.log('Selecthost',this.props.item)
    this.props._this.setState({select_host:var11})
  }

  render() {
    const { formData } = this.state
    let nav = this.props.item['host'] ? this.props.item['host'].map((item,str)=>{
      console.log(item,str)
      return (
          <Checkbox value={item} key={item}>{item}</Checkbox>
        )
    }):<span></span>
    return (
      <Form
        action="/v1/service/list/register/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
        <div ><span>请确认前置已经进行切换</span></div>
        <div className='init1'><span>请选择需要发布版本的机器</span></div>
        <CheckboxGroup block onChange={::this.host_select}>
          {nav}
        </CheckboxGroup>
      </Form>
    )
  }
}


class Execute extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      formData: {
        brand: 0,
        type: 'group_create',
      },
      sourceData: [],
      targetData: [],
      newData:[],
      record_source:[],
      select_host:[],
      ws_data:[]
    }
  }


  componentWillReceiveProps(nextProps){
    this.setState({
      ws_data:nextProps.ws_data
    });
  }

  handleSuccess(res) {
    this.handleclose()
    this.props.getdata()
    if (res['status']==true){
      message.success('创建成功！')
    }else{
      message.danger(res['status'])
    }
  }


  handleclose(){
    this.props.modal.close()
  }

  host_select(var11){
    console.log('Selecthost',this.props.item)
    this.props._this.setState({select_host:var11})
  }

  data_return(){

  }

  render() {
    let options = {
      lineNumbers: true,
      mode: "text",
      theme: "blackboard"
    };
   // console.log(this.state.ws_data,'likesIncreasing this.props.')
    let data=(()=>{
      let return_data=''
      //let reverse_ws_data1=''
      //reverse_ws_data1=this.state.ws_data
      //let reverse_ws_data1 = JSON.parse(JSON.stringify(this.state.ws_data)) //复制object
      let reverse_ws_data1 = this.state.ws_data.slice()
      let reverse_ws_data=reverse_ws_data1.reverse()
      for (let i in reverse_ws_data){
       // console.log(i,reverse_ws_data[i],'sdfsaf')
        if (i==0){
          return_data=reverse_ws_data[i]['data']
        }else{
        return_data=return_data+'\n'+reverse_ws_data[i]['data']
      }
      }
      //console.log(return_data,'return_data')
      return return_data
    })
   // console.log(this.props.ws_data,'this.props.')
  //  console.log(this.props._this.state.ws_data,'thi')
    return (
      <div >
      {/*<Alert
        message="Warning"
        description="重启会影响服务正常使用"
        type="warning"
        showIcon
      />*/}
        <CodeMirror value={data()} options={options} />
        <CheckboxGroup block onChange={::this.host_select}>
        </CheckboxGroup>
      </div>
    )
  }
}



class Configuration extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      ws_data:[],
      data:[],
      read_data:'',
      loading:false,
    }
  }

  componentWillMount(){
  //  console.log(this.props.item,'11111item')
    this.setState({loading:true})
    OPEN.path_list(this,this.props.item,this.Callback)
  }

  Callback(_this,data){
    //console.log(data['status'],data['data_d']['data'])
    //console.log(JSON.parse(data['data_d'])['data'],'test1111111')
    if (data['status'] != "stop"){
      _this.setState({
        data:JSON.parse(data['data_d'])['data'],
        loading:false
        //data:data1
      })
    }else{
      message.danger(data['data_d'],5)
    }
  }

  handleclose(){
    this.props.modal.close()
  }

  host_select(var11){
    console.log('Selecthost',this.props.item)
    this.props._this.setState({select_host:var11})
  }

  red_callback(_this,data){
    if (data['msg']==undefined){
      let data_f=data['stdout_lines'].join('\n')
      _this.refs.input_read.setState({data:data_f,loading:false})
    }else{
      message.danger(data['msg'],10)
    }
  }

  handfun(data,event){
   // console.log(ReactDOM.findDOMNode(this.refs.input_read).childNodes[1].defaultValue="adfsaf")
   // console.log(ReactDOM.findDOMNode(this.refs.input_read).childNodes)
    if (data['children'] == undefined){
      let path=new Array()
      let data_object={}
     // console.log('sdfsafdf111111')
      for (let i in event){
        //console.log(event[i]['name'])
        path.push(event[i]['name'])
      }
      data_object['ip']=this.props.item['ip']
      data_object['path']=path
      this.refs.input_read.setState({loading:true})
      OPEN.path_read(this,data_object,this.red_callback)
    }
  }

  render() {
    let options = {
      lineNumbers: true,
      mode: 'text/x-ttcn-cfg',
      readOnly: false,
      theme: 'blackboard',
     height: '800px'
    };

    return (
      <div >

        <Row>
          <Col span={6} className="input_lef_s">
            <Spin spinning={this.state.loading} style={{height:'500px'}}>
              <Tree defaultData={this.state.data} data={this.state.data} getIcon={data => data.open ? 'folder-open' : 'folder'} onSelect={::this.handfun} />
            </Spin>
          </Col>
          <Col span={18}>
            {/*<CodeMirror value={'import os \n aaa'} className="input_codemirror" options={options} ref="input_read"/>*/}
            <File_show item={'\n'} ref="input_read"/>
          </Col>
        </Row>

      </div>
    )
  }
}

class File_show extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      data:'',
      loading: false
    }
  }

  componentWillMount(){
  //  console.log(this.props.item,'11111item')
    //OPEN.path_list(this,this.props.item,this.Callback)
  }

  host_select(var11){
    console.log('Selecthost',this.props.item)
    this.props._this.setState({select_host:var11})
  }

  red_callback(_this,data){
    console.log(data['stdout_lines'],'red_callback')
    _this.setState({read_data:data['stdout_lines'][0]})
  }


  render() {
    let options = {
      lineNumbers: true,
      mode: 'text/x-ttcn-cfg',
      readOnly: false,
      theme: 'blackboard',
     height: '800px'
    };

    return (
      <div >
        <Spin spinning={this.state.loading}>
          <CodeMirror value={this.state.data} className="input_codemirror" options={options} ref="input_read"/>
        </Spin>
      </div>
    )
  }
}



class Base_version extends Component {
	constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
    	title:'',
    	fun:'',
      current:0,
      select_host:[],
      loading: false,
      visible: false,
      ws:false,
      ws_data:[],
     // ws_data:'',
      models:true
    }
  }

  handleOpen(type){
  	//console.log(type)
    this.refs.modal.open()
    let title=this.handletitle()[type]
    let fun=this.handlefun()[type]
    this.setState({title,fun,current:0})
  }

  handletitle(){
  	return {
  		'version':'版本更新',
  		'detele':'删除服务',
      'execute':'重启服务日志',
      'configuration':'配置文件'
  	}
  }

  handlefun(){
  	return {
  		'version1':<Version_update item={this.props.item} _this={this}/>,
  		'detele':<File_sync rows={this.props.rows} modal={this.refs.modal} />,
      'version': <File_sync select_host={this.state.select_host} host={this.props.host} item={this.props.item} _this={this}/>,
      'execute':<Execute ws_data={this.state.ws_data} _this={this} />,
      'configuration':<Configuration item={this.props.item}/>
  	}
  }

  list(){
    return [{
      title: 'First',
      content: <Version_update item={this.props.item} _this={this} />,
    }, {
      title: 'Second',
      content: <File_sync select_host={this.state.select_host} host={this.props.host}/>,
    }, {
      title: 'Last',
      content: 'Last-content',
    }]
  }

  next() {
    const current = this.state.current + 1;
    //this.setState({ current });
    if (current < this.list().length){
     //console.log(this.list()[current]['title'])
     // console.log('222')
      this.setState({title:this.list()[current]['title'],current,fun:this.list()[current]['content']})
    }

  }

  prev() {
    const current = this.state.current - 1;
    if (current >= 0){
      console.log(this.list()[current]['title'])
      console.log('222')
      this.setState({title:this.list()[current]['title'],current,fun:this.list()[current]['content']})
    }
  }

  handleButtonClick(e) {
    message.info('Click on left button.');
    console.log('click left button', e);
  }

  handleMenuClick(e) {
    console.log('click', e.key);
    console.log(this.handletitle())
    if (e.key != 'delete' && e.key != 'execute1'){
      let title=this.handletitle()[e.key]
      let fun = this.handlefun()[e.key]
      this.setState({title,fun})
      this.showModal()
    }
  }

  confirm() {
    let id=this.props.item['id']
    const coll_id=this.props.item['coll_id']
    let _this=this
    xhr({
      type: 'POST',
      url: '/v1/service/list/delete_server/',
      data: {id:id},
      success(data) {
        console.log(data)
        if (data['status']){
          message.success('操作成功')}
          _this.props.callback_get(coll_id)
        }
    })
  }

  restart(){
    //console.log('aaaa',this.props.item)
    let data_ws={'host':this.props.item['host'],'cmd':this.props.item['service_restart'],'app':'start','path':this.props.item['path_log'],ip:this.props.item['ip']}
    OPEN.service_execute(this,this.callback,data_ws)

   // OPEN.service_execute()
  }

  callback(_this,data){
   //console.log(_this,data,'callback')
   /// _this.state.ws.close()
   if (JSON.parse(data)['status']!="stop"){
   let ws_data = _this.state.ws_data
     ws_data.push(JSON.parse(data))
     //ws_data = JSON.parse(data)
      _this.setState({ws_data})
      //console.log(_this.state.ws_data,'this.state.')
     // for (let i in _this.state.ws_data ){
      //  console.log(_this.state.ws_data[i]['count'])
     // }
      _this.setState({title:_this.handletitle()['execute'],fun:_this.handlefun()['execute']})
      if (_this.state.models){
        _this.setState({models:false})
        _this.showModal()
      }

  }else{
      console.log('sdfsafas')
      message.danger(JSON.parse(data)['data'])
      _this.handleCancel()

    }

  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }

  handleCancel() {
    this.setState({ visible: false });
    if (this.state.ws){
      this.state.ws.close()
      this.setState({models:true})
  }
  }

  render() {
    const menu = (
    <Menu onClick={::this.handleMenuClick}>
      <Menu.Item key="delete">
        <Popconfirm title="确认删除？" onConfirm={::this.confirm} okText="Yes" cancelText="No">
          <a href="#">删除</a>
        </Popconfirm>
      </Menu.Item>
      {/*<Menu.Item key="2">编辑</Menu.Item>*/}
      <Menu.Item key="configuration">配置文件</Menu.Item>
      <Menu.Item key="execute1">
        <Popconfirm title='确认重启？' onConfirm={::this.restart} okText="Yes" cancelText="No">
          <a href="#">重启服务</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item key="version">版本发布</Menu.Item>
    </Menu>
    );

    return (

      <div >
       { /*<Button onClick={::this.handleOpen.bind(this,'create')} >添加服务</Button>
        <a href = "javascript:void(0);" onClick={::this.handleOpen.bind(this,'version')}>发布版本</a>*/}
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#" style={{fontSize:14}}>
            更多操作<Icon type="down" />
          </a>
        </Dropdown>
        {/*<Modal ref="modal" className="create_cmdb_group">
          <ModalHeader className="create_cmdb_group" >
            <h6>{this.state.title}</h6>
          </ModalHeader>
          <ModalBody className="create_cmdb_group">
            {this.state.fun}
          <div style={{marginTop:'20px'}}>
            <Button onClick={::this.prev}>上一步</Button>
            <Button style={{float:"right"}} onClick={::this.next}>下一步</Button>
          </div>
          </ModalBody>
        </Modal>*/}
        <Modal
          visible={this.state.visible}
          title={this.state.title}
          onOk={::this.handleOk}
          onCancel={::this.handleCancel}
          maskClosable={false}
          width={'800px'}
          //closable={false}
          footer={[
            <Buttons key="back" type="ghost" size="large" onClick={::this.handleCancel}>关闭</Buttons>,
          ]}
        >
          {this.state.fun}
        </Modal>
      </div>
    )
  }
}

export {Base_version}