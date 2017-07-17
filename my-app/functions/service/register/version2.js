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
import { Select, Option as Optionh } from 'bfd/Select'
//import { Row, Col } from 'bfd/Layout'
import {Select as Selects , Menu, Dropdown,Icon,Popconfirm } from 'antd';
import { Modal, Button as Buttons, Alert } from 'antd';
import CodeMirror from 'react-codemirror'
//import codeMirror from 'codemirror'
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
import { MultipleSelect, Option  } from 'bfd/MultipleSelect'
const Optionss = Selects.Option;
import Task_list from './taskfile'
import Restartservice from './Sservicemanagement'
const SubMenu = Menu.SubMenu;




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
      sftp_rsync:'file_write',
      host_select_vd:'',
      loading: false,
      loading_s:[],
    }
  }

  componentWillMount(){
  //  console.log(this.props.item,'item')
  //  console.log('test11111111')
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
  	if (this.state.host_select_vd.length == 1){
    let path_list=new Array()
    if (this.state.add_Path==true){
      if (this.state.formData['desc']){
        for (var i in this.state.formData['desc'].split('\n')){
          let path_dict={}
          if (this.state.formData['desc'].split('\n')[i].length > 1){
            path_dict['path']=this.state.formData['desc'].split('\n')[i]
            path_dict['delete']=false
            path_dict['type']='none'
            path_list.push(path_dict)
          }
        }
        this.setState({path_list})
      }
      this.setState({add_Path:false,sync_data:'',result_data:{},backup:[]})
    }else{
        this.setState({add_Path:true,path_list:[],sync_data:'',result_data:{},backup:[]})
    }
}else{
	message.danger('暂时只支持单节点操作')
}
  }

  detection_path(){
  	let path_list=this.state.path_list
  //	console.log(path_list)
  	if (path_list.length > 0 && !this.state.ws){
      this.setState({loading:true})
  		let path_dict={'data':path_list,'pf':'init','fun':'fun_file','s_host':this.state.host_select_vd,id:this.props.item['id'],'app':this.props.item['service_name'],t_host:this.state.host_select_vd}
  		this.handsocket_io(path_dict)
  	//	console.log('test1')
  	} else if (path_list && this.state.ws){
      this.setState({loading:true})
  		let path_list=this.state.path_list
  		let path_dict={'data':path_list,'pf':'init','fun':'fun_file','s_host':this.state.host_select_vd,id:this.props.item['id'],'app':this.props.item['service_name'],t_host:this.state.host_select_vd}
  		this.ws_websokct(path_dict)
  	//	console.log('test2')
  	}else{
  		message.danger("没有可以操作目录或者目录以检测过")
  	}
  }




  ws_websokct(data){
    let ws = this.state.ws
    ws.send(JSON.stringify(data))
  }


  sftp_rsync(value,value2){
   // console.log(this.refs.sftp_rsync.value)
    if (this.refs.sftp_rsync.value==1){
      this.setState({sftp_rsync:'rsync_files_w'})
    }else{
      this.setState({sftp_rsync:'file_write'})
    }
  }


  handsocket_io(data){
  	OPEN.service_sync(this,this.callback,data)
  }


  callback(_this,data){
  	  let return_json=JSON.parse(data)
      //console.log(return_json)
      if (return_json['status'] != "stop" && return_json['status'] != false){
        if (return_json['pf'] == 'read'){
          _this.setState({sync_data:JSON.parse(data),path_list:'',loading_s:[]})
          _this.setState({loading:false})
        }else if (return_json['pf'] == 'backup'){
          let backup = _this.state.backup
          backup.push(return_json['data'])
          _this.setState({sync_data:'',backup,loading_s:[]})
          _this.setState({loading:false})
        }else if (return_json['pf']=='write') {
          let result_data = _this.state.result_data
          result_data['update']=return_json['update']
          result_data['delete']=return_json['delete']
          _this.setState({result_data,loading_s:[]})
          _this.setState({loading:false})
        }else if (return_json['pf']=='status'){
          let loading_s = _this.state.loading_s
          loading_s.push('.')
          _this.setState({loading_s})
        }
      }else{
        message.danger(return_json['data'])
        _this.setState({loading:false,loading_s:[]})
      }
  }

  handselect(var1,var2){
    let path_list=this.state.path_list
    if (var2 == 1 ){
      path_list[var1]['delete']=var2.target.value
    }else{
      path_list[var1]['delete']=var2.target.value
    }
    this.setState({path_list})
   // console.log(path_list,'path_list111111')
  }

  pre_host(hostname){
    //console.log('1111',hostname)
    this.setState({per_host:hostname})
  }

  write_file(){
   // console.log(this.state.sync_data)
    let sync_data=this.state.sync_data
    sync_data['fun']=this.state.sftp_rsync
    sync_data['pf']='init'
    sync_data['id']=this.props.item['id'] 
    //sync_data['data']='aaa'
    sync_data['ip']=this.props.item['ip']
    this.setState({sftp_rsync:'file_write'})
    this.ws_websokct(sync_data)
  }

  write_close(){
    this.state.ws.close()
    this.props._this.setState({visible:false})
  }

  select_host_v(value){
  	//console.log(value)
  	if (value.length == 1){
  		this.setState({host_select_vd:value})
  	}else if (value.length == 0){
  		message.danger("请选择节点")
  	}else{
  		message.danger("暂时只支持单节点操作")
  	}
  }

  componentDidMount(){
    window.onresize = ()=> {
         console.log('sfdsfsadf')
    }
    window.onbeforeunload=()=>{
      alert("你正在刷新页面");
    }

  }

  color_l(type){
  	let color1='none'
    if (type=='none'){
       color1='black'
    }else if (type=='f') {
       color1='green'
    }else if (type=='d') {
      color1='green'
    }else if (type=='w') {
      color1 = 'yellow'
    }else{
      color1 = 'red'
    }
    return color1
  }

  render() {
    const { formData } = this.state
    let nav=this.state.path_list ? this.state.path_list.map((item,str)=>{
    return(
        <div key={str}>
          <span style={{height:'20px',lineHeight:'20px'}}>{item['path']}</span>
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
     let color_f=this.color_l(item['type'])
    // console.log(color_f)
      return(
        <div key={str}>
          <span style={{height:'20px',lineHeight:'20px',color:color_f}}>{item['path']}</span>
          <span style={{float:'right'}}>
          {
             item['delete'] ? <span style={{color:'red'}}>删除</span>:<span style={{color:'green'}}>同步</span>
          }
          </span>
        </div>)
    }):<span></span>

    let target_file=this.state.sync_data['d'] ? this.state.sync_data['d'].map((item,str)=>{
      let color_f=this.color_l(item['type'])
      return(
        <div key={str} >
          <span style={{height:'20px',lineHeight:'20px',color:color_f}}>{item['path']}</span>
          <span style={{float:'right'}}>
          {          
            item['delete'] ? <span style={{color:'red'}}>删除</span>:<span style={{color:'green'}}>同步</span>
          }
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
          <h5><span>{item}</span></h5>
        </div>
        )
    }):<span></span>

    let delete_file = this.state.result_data['delete'] ? this.state.result_data['delete'].map((item,str)=>{
      return(
        <div key={str}>
          <h5 style={{color:"red"}}><span>{item}</span></h5>
        </div>
        )
    }):<span></span>


    let host=this.props.host? this.props.host.map((item,str)=>{
      return(
        <Options value={item}>{item}</Options>
        )
    }):<span></span>

    let host_select_v= this.props.item['host_ip'] ? Object.keys(this.props.item['host_ip']).map((items,str)=>{
    	return (
    		<Option key={items} value={items}>{this.props.item['host_ip'][items]}</Option>
    		)
    }) :<span></span>

    let loading_s = this.state.loading_s ? this.state.loading_s.map((item,str)=>{
      return (
        <span style={{fontSize:"15px"}}>{item}</span>
        )
    }): <span></span>
    
    return (
    	<div>
	    	<Form
	        action="/v1/cmdb/list/groupdelete/"
	        data={formData}
	        type='GET'
	        onChange={formData => this.update('set', { formData })}
	        rules={this.rules}
	        labelWidth={'200px'}
	        onSuccess={::this.handleSuccess}
	      >
	        <FormItem label="选择主机" name="name" help="" style={{height:'17px',lineHeight:'30px'}}>
	      		<MultipleSelect defaultValues={[]} onChange={::this.select_host_v}>
	        		{host_select_v}
	      		</MultipleSelect>
	        </FormItem>
          
	      	<FormItem label="同步内容" name="name" help="" style={{height:'17px',lineHeight:'30px'}}>
	          <a href='#' style={{marginRight:'20px'}}><span onClick={::this.add_path}>添加</span></a>
	          <a href='#' ><span onClick={::this.detection_path} >检测</span></a>
	        </FormItem>
          <Spin  spinning={this.state.loading}>
	        <div style={{maxHeight:'500',overflow:'auto'}}>
	          {
	            this.state.add_Path ? <div><FormItem label="选择模式" name="test" help="">
	                                  <select onChange={::this.sftp_rsync.bind(this)} ref="sftp_rsync">
	                                    <option key={0} value='0' >SFTP</option>
	                                    <option key={1} value='1'>RSYNC</option>
	                                  </select>
	                                  </FormItem>
	                                  <FormItem label="添加目录" name="desc" help="">
	                                  <FormTextarea style={{width:"700px",height:"150px"}}/>
	                                  </FormItem></div>: <div></div>
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
	          :<span></span>}
	          {backup}
            {delete_file}
	          {update}
            <div>{loading_s}</div>
	        </div>
          </Spin>
	      </Form>
      </div>
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
    //console.log(targetData)
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
   // console.log('Selecthost',this.props.item)
    this.props._this.setState({select_host:var11})
  }

  render() {
    const { formData } = this.state
    let nav = this.props.item['host'] ? this.props.item['host'].map((item,str)=>{
      //console.log(item,str)
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
   // console.log('Selecthost',this.props.item)
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
      ip:'',
    }
  }

  componentWillMount(){
  //  console.log(this.props.item,'11111item')
   // this.setState({loading:true})
    //OPEN.path_list(this,this.props.item,this.Callback)
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
    //console.log('Selecthost',this.props.item)
    this.props._this.setState({select_host:var11})
  }

  red_callback(_this,data){
    if (data['msg']==undefined){
      let data_f=data['stdout_lines'].join('\n')
      //console.log(_this.refs.input_read)
      //_this.setState({read_data:data_f})
      _this.refs.input_read.setState({data:data_f})
    }else{
      message.danger(data['msg'],4)
    }
  }

  choice_c(value){
  	let items = this.props.item
  	items['ip']=value
    //console.log(items)
  	this.setState({loading:true})
  	OPEN.path_list(this,items,this.Callback)
  }


  choice_c_get(value){
    //console.log(value)
    //let items = this.props.item
   // items['ip']=value
    this.setState({loading:true,ip:value})

    OPEN.serverconf(this,value,this.props.item['path_config'],(_this,data)=>{
      //console.log(data)
      if(data['status']){
        _this.setState({
        data:data['msg'],
        loading:false
        //data:data1
      })

      }else{
        message.danger(data['msg'])
      }
    })
  }

  handfun(data,event){
   // console.log(ReactDOM.findDOMNode(this.refs.input_read).childNodes[1].defaultValue="adfsaf")
   // console.log(ReactDOM.findDOMNode(this.refs.input_read).childNodes)
    if (data['children'] == undefined){
      let path=new Array()
      let data_object={}
      for (let i in event){
        path.push(event[i]['name'])
      }
      data_object['ip']=this.state.ip
      data_object['path']=path
      //this.refs.input_read.setState({loading:true})
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



    let host_select_v= this.props.item['host_ip'] ? Object.keys(this.props.item['host_ip']).map((items,str)=>{
    	return (
    		<Optionh key={items} value={items}>{this.props.item['host_ip'][items]}</Optionh>
    		)
    }) :<span></span>

    return (
      <div >
        <Row>
          <Col span={6}>
          	<div> 
          		{/*<span>选择主机:</span>    */}
          		<Select searchable onChange={::this.choice_c_get}>
			      <Optionh>请选择</Optionh>
			      {host_select_v}
			    </Select>
          	</div>
          	<div  className="input_lef_s">
            <Spin spinning={this.state.loading} style={{height:'500px'}}>
              <Tree defaultData={this.state.data} data={this.state.data} getIcon={data => data.open ? 'folder-open' : 'folder'} onSelect={::this.handfun} />
            </Spin>
            </div>
          </Col>
          <Col span={18}>
            {/*<codeMirror value={'import os \n aaa'} className="input_codemirror" options={options} />*/}
            <File_show  ref="input_read" read_data={this.state.read_data}/>
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
    //console.log(this.props.read_data,'11111item')
    //OPEN.path_list(this,this.props.item,this.Callback)
  }

  //host_select(var11){
   // console.log('Selecthost',this.props.item)
  //  this.props._this.setState({select_host:var11})
  //}

 // red_callback(_this,data){
   // console.log(data['stdout_lines'],'red_callback')
  //  _this.setState({read_data:data['stdout_lines'][0]})
//  }


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
          <CodeMirror value={this.state.data} className="" options={options} />
        </Spin>
      </div>
    )
  }
}



class Modify extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
    	formData: {
        	brand: 0,
       },
      data:'',
      loading: false,
      host:[],
      service_id:[],
    }
  }

  componentWillMount(){
  //	console.log(this.props.item['host'],"sddddddddddddddddddddd")

  	let formData= this.state.formData
  	formData['service_name'] = this.props.item['service_name']
  	formData['alias_name'] = this.props.item['alias_name']
  	formData['service_restart'] = this.props.item['service_restart']
  	formData['path_config'] = this.props.item['path_config']
  	formData['path_root'] = this.props.item['path_root']
  	formData['path_project'] = this.props.item['path_project']
  	formData['log_path'] = this.props.item['path_log']
  	formData['desc'] = this.props.item['desc']
  	formData['id'] = this.props.item['id']
    this.props.item['service_id'] ? formData['service_id'] = this.props.item['service_id'] : false
  //  formData['service_id'] = this.props.item['service_id']
  	let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=assert_all',
      success(data) {
       // console.log(data['data'])
        _this.setState({host:data['data']})
      }
    })
    OPEN.serverlist(_this,(_this,data)=>{
      _this.setState({service_id:data['data']})
    })

  }

  handleSuccess(res) {
    this.handleclose()
   // this.props.getdata()
   for (let i in this.props.Table_list){
      this.props.callback_get(this.props.Table_list[i])
   }
    if (res['status']==true){
      this.props.status_update()
      message.success('修改成功！')
    }else{
      this.props.status_update()
      message.danger(res['status'])
    }
  }

  handleclose(){
    this.props._this.setState({visible:false})
  }

  handleChange(value) {
   // console.log(`selected ${value}`);
   // console.log(value,'sdfsaf')
    let formData = this.state.formData
    //formData['sourceData']=sourceData
    formData['targetData']=value
    this.setState({
      formData,
    })
 }

  render() {
  	const { formData } = this.state
  	const children = [];
    let host_all=this.state.service_id.map((item,str)=>{
        return (<Options key={str} value={item.id}>{item.name}</Options>)
    })
  	for (let i = 0; i< this.state.host.length; i++) {
      children.push(<Optionss key={this.state.host[i].id} value={this.state.host[i].description}>{this.state.host[i].description}</Optionss>);
    }
    return (
      <Form
        action="/v1/service/list/register_p/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
       <FormItem label="主机" required name="name" help="选择主机">
          <Selects
              multiple
              style={{ width: '30%' }}
              placeholder="host select"
              defaultValue={this.props.item['host']}
              onChange={::this.handleChange}
            >
              {children}
          </Selects>
        </FormItem>
        <FormItem label="服务名称" required name="service_name" help="">
          <FormInput />
        </FormItem>
        <FormItem label="别名"  name="alias_name" help="相同程序安装不目录">
          <FormInput />
        </FormItem>
        <FormItem label="服务关联" name="service_id">
          <FormSelect searchable defaultValues={[0]} style={{marginRight:'10px'}}>
            <Options>请选择</Options>
            {host_all}
          </FormSelect>
        </FormItem>
        <FormItem label="重启服务" required name="service_restart" help="">
          <FormInput />
        </FormItem>
        <FormItem label="配置路径" required name="path_config" help="">
          <FormInput />
        </FormItem>
        <FormItem label="程序路径" required name="path_root" help="">
          <FormInput />
        </FormItem>
        <FormItem label="项目路径" required name="path_project" help="">
          <FormInput />
        </FormItem>
        <FormItem label="日志路径" required name="log_path" help="">
          <FormInput />
        </FormItem>
        <FormItem label="描述" name="desc" help="500个字符以内">
          <FormTextarea />
        </FormItem>
        <FormSubmit>确定</FormSubmit>
        <Button onClick={::this.handleclose}>取消</Button>
      </Form>
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
      	'configuration':'配置文件',
      	'modify':"修改",
  	}
  }

  handlefun(){
  	return {
  	  'version1':<Version_update item={this.props.item} _this={this}/>,
  	  'detele':<File_sync rows={this.props.rows} modal={this.refs.modal}  />,
      //'version': <File_sync select_host={this.state.select_host} host={this.props.host} item={this.props.item} _this={this}/>,
      'version':<Task_list select_host={this.state.select_host} host={this.props.host} item={this.props.item} _this={this} />,
      'execute':<Execute ws_data={this.state.ws_data} _this={this} />,
      'configuration':<Configuration item={this.props.item}/>,
      'modify':<Modify item={this.props.item} _this={this} status_update={this.props.status_update}/>
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
    if (current < this.list().length){
      this.setState({title:this.list()[current]['title'],current,fun:this.list()[current]['content']})
    }

  }

  prev() {
    const current = this.state.current - 1;
    if (current >= 0){
      this.setState({title:this.list()[current]['title'],current,fun:this.list()[current]['content']})
    }
  }

  handleButtonClick(e) {
    message.info('Click on left button.');
  //  console.log('click left button', e);
  }

  handleMenuClick(e) {
  //  console.log('click', e.key);
   // console.log(this.handletitle())
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
       // console.log(data)
        if (data['status']){
          message.success('操作成功')}
          _this.props.callback_get(coll_id)
          _this.props.status_update()
        }
    })
  }

  restart(){
    //let data_ws={'host':this.props.item['host'],'cmd':this.props.item['service_restart'],'app':'start','path':this.props.item['path_log'],ip:this.props.item['ip']}
    //OPEN.service_execute(this,this.callback,data_ws)
   // console.log(this.refs.refsrestart)
   // console.log(this.props.item)
    this.refs.refsrestart.setState({visible:true,item:this.props.item})

  }

  callback(_this,data){
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
     // console.log('sdfsafas')
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
  //  console.log(this.props.item['host_ip'])
    const menu = (
    <Menu onClick={::this.handleMenuClick}>
      <Menu.Item key="modify" >编辑</Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm title="确认删除？" onConfirm={::this.confirm} okText="Yes" cancelText="No">
          <a href="#">删除</a>
        </Popconfirm>
      </Menu.Item>
      {/*<Menu.Item key="2">编辑</Menu.Item>*/}
      <Menu.Item key="configuration">配置文件</Menu.Item>
      <Menu.Item key="execute1">
        {/*<Popconfirm title='确认重启？' onConfirm={::this.restart} okText="Yes" cancelText="No">
          <a href="#">重启服务</a>
        </Popconfirm>*/}
        <Restartservice restart={::this.restart} ref="refsrestart"/>
      </Menu.Item>
      <Menu.Item key="version">版本发布</Menu.Item>
    </Menu>
    );

    return (

      <div >
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#" style={{fontSize:14}}>
            更多操作<Icon type="down" />
          </a>
        </Dropdown>
        <Modal
          visible={this.state.visible}
          title={this.state.title}
          onOk={::this.handleOk}
          onCancel={::this.handleCancel}
          maskClosable={false}
          width={'800px'}
          //closable={false}
          footer={[
            //<Buttons key="back" type="ghost" size="large" onClick={::this.handleCancel}>关闭</Buttons>,
          ]}
        >
          {this.state.fun}
        </Modal>
      </div>
    )
  }
}

export {Base_version}