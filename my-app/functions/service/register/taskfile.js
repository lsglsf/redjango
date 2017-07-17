import Button  from 'bfd/Button'
import React, { Component } from 'react'
//import './index.less'
import update from 'react-update'
import { Form, FormItem, FormSubmit, FormInput, FormSelect, Option as Options, FormTextarea } from 'bfd/Form'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import Transfer from 'bfd/Transfer'
import xhr from 'bfd/xhr'
import { Select, Option as Optionh } from 'bfd/Select'
import {Select as Selects , Menu, Dropdown,Icon as Icons ,Popconfirm } from 'antd';
import { Modal, Button as Buttons, Alert } from 'antd';
import OPEN from '../../data_request/request.js'
import { Row, Col } from 'antd'
import Tree from 'bfd/Tree'
import ReactDOM from 'react-dom'
import { Spin} from 'antd';
import { MultipleSelect, Option  } from 'bfd/MultipleSelect'
const Optionss = Selects.Option;
import { Tabs, TabList, Tab, TabPanel } from 'bfd/Tabs'
import FixedTable from 'bfd/FixedTable'
import TextOverflow from 'bfd/TextOverflow'
import Icon from 'bfd/Icon'
import File_sync_get from './release'




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
      console.log(return_json)
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
          //let result_data = _this.state.result_data
          _this.setState({path_list:'',ws:'',sftp_rsync:'file_write',sync_data:''})
          _this.props._this.setState({
            activeIndex:1,
          })
          if (return_json['status']){
            message.success(return_json['id'])
          }else{
            message.danger(return_json['msg'])
          }
         // result_data['update']=return_json['update']
          //result_data['delete']=return_json['delete']
          //_this.setState({result_data,loading_s:[]})
          _this.setState({loading:false,loading_s:[]})
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


class Task_detail extends Component{
    constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
     // data:this.props.data,
      //status:this.props.status,
    }}
/*
    componentWillMount(){
      OPEN.taskdetail(this,this.props.task_id,(_this,data)=>{
        //console.log(data)
        _this.setState({data:data['msg'],status:data['status']})
      })
    }

    componentWillReceiveProps(nextProps,nextState){
    if(nextProps.task_id !== undefined){
      OPEN.taskdetail(this,nextProps.task_id,(_this,data)=>{
        //console.log(data)
        _this.setState({data:data['msg'],status:data['status']})
      })
    }
  }*/

  render(){
    let status=this.props.status
    let data = this.props.data
    let nva=''
    let delete_file = ''
    let update_file = ''
    let backup=''
    if (status === true && status !== '1'){
     // console.log(data)
      data.map((items,str)=>{
        if (items['pf'] === "write"){
          //console.log(items['delete'])
          //console.log(items['update'])
          delete_file = items['delete'].map((item,string)=>{
            return (<div key={string} style={{color:"red"}}>{item}</div>)
          })
          update_file=items['update'].map((item,string)=>{
            return (<div key={string} style={{color:"#7dda11"}}>{item}</div>)
           })
        }else if(items['pf'] === 'backup'){
          backup += items['data']
        }
      })
    }else if (status === false){
      if (typeof data === "string"){
        message.danger(data)
        this.props._this.setState({visible:false})
      }else{
      data.map((items,str)=>{
        if (items['pf'] === 'backup'){
           backup += items['data']
         }else{
           backup += items['msg']
         }
      })}
    } 
    return (<div style={{maxHeight:'500',overflow:'auto'}}>
            {backup}{delete_file}{update_file}
      </div>)
  }
}


class Task_detail_get extends Component{
    constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
     // data:this.props.data,
      //status:this.props.status,
    }}
/*
    componentWillMount(){
      OPEN.taskdetail(this,this.props.task_id,(_this,data)=>{
        //console.log(data)
        _this.setState({data:data['msg'],status:data['status']})
      })
    }

    componentWillReceiveProps(nextProps,nextState){
    if(nextProps.task_id !== undefined){
      OPEN.taskdetail(this,nextProps.task_id,(_this,data)=>{
        //console.log(data)
        _this.setState({data:data['msg'],status:data['status']})
      })
    }
  }*/

  render(){
    let status=this.props.status
    let data = this.props.data
    let nva=''
    let delete_file = ''
    let update_file = ''
    let backup=''
    if (status === true && status !== '1' && data.length > 1){
      backup = data[0] ? (()=>{
       // console.log(data[0])
        if (data[0]['status']){
          return (
            <div>
              <span>{data[0]['s']}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{data[0]['d']}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{data[0]['data']}</span>
            </div>
            )
        }
      })() : <span></span>

      delete_file = data[1]['delete'] ? (()=>{
          let map_list = data[1]['delete'].map((item,string)=>{
            return (<div key={string} style={{color:"red"}}>{item}</div>)
          })
          return map_list
      })():<span></span> 

      update_file = data[1]['update'] ? (()=>{
          let map_list = data[1]['update'].map((item,string)=>{
            return (<div key={string} style={{color:"#7dda11"}}>{item}</div>)
          })
          return map_list
      })():<span></span> 
    }else{
            backup = data[0] ? (()=>{
        console.log(data[0])
        if (data[0]['status']){
          return (
            <div>
              <span>{data[0]['s']}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{data[0]['d']}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{data[0]['data']}</span>
            </div>
            )
        }
      })() : <span></span>

      delete_file = data[0]['delete'] ? (()=>{
          let map_list = data[0]['delete'].map((item,string)=>{
            return (<div key={string} style={{color:"red"}}>{item}</div>)
          })
          return map_list
      })():<span></span> 

      update_file = data[0]['update'] ? (()=>{
          let map_list = data[0]['update'].map((item,string)=>{
            return (<div key={string} style={{color:"#7dda11"}}>{item}</div>)
          })
          return map_list
      })():<span></span> 
    } 
    return (<div style={{maxHeight:'500',overflow:'auto'}}>
            {backup}{delete_file}{update_file}
      </div>)
  }
}





class Task_get extends Component{
    constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
    	title:'',
    	column: [{ title: '发布时间',  width: '20%',key: 'date', render: (item, component) => {
          		return (<TextOverflow>
      			<p style={{width: '100px'}}>{item}</p>
    			</TextOverflow>)
       			 }},
    			{ primary: false,  width: '20%',title: '发布ID', key: 'task_id',render: (item, component) => {
          		return (<TextOverflow>
      			<p style={{width: '100px'}}>{item}</p>
    			</TextOverflow>)
       			 }}, 
    			{ title: '执行状态', width: '20%',key: 'task_status',render:(item,component)=>{
                let _this = this
                //let OPEN=OPEN
                if (item == "True"){
                  return (<span>{item}</span>)
                }else{
                 let task_id = component.task_id
                // console.log('component',component.task_id)
                 let taks_list_status = setInterval(()=>{
                    OPEN.task_status(_this,component.task_id,(_this,str,item)=>{
                     // console.log('sssss',str['status'])
                      if (str['status']){
                       // console.log('ssdfsafasfdsa')
                        clearInterval(taks_list_status)
                        _this.setState({loading:false})
                        _this.task_list()
                        
                      }
                    })
                  },6000)
                  return (<Spin spinning={this.state.loading} />)
                }
          }},
    			{ title: '执行结果', width: '20%',key: 'results_status'},
    			{title: '操作', width: '20%',render: (item, component) => {
          		return (<div>
                      <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)}>详情</a>
                      <a href = "javascript:void(0);" onClick = {this.handle_deler.bind(this, item)}><Icon type="times" /></a>
                      </div>)
        		},key: 'operation'}
    			],
    	data:[],
      visible: false,
      task_id:'',
      data_list:'',
      status:'1',
      loading:true
    }
  }

  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
    //console.log(item.task_id,'aaaaa')
    let _this=this
    OPEN.taskdetail(this,item.task_id,(_this,data)=>{
        //console.log(data)
        if (data['status'] ===false ){
          if (typeof data['msg'] === "string"){
            message.danger(data['msg'])
           // console.log(data)
          }
        }else{
        _this.setState({data_list:data['msg'],status:data['status']})

        _this.setState({
          visible: true
        })}
    })
    this.setState({
        //visible: true,
        task_id:item.task_id
    });
  }

  
  componentWillReceiveProps(nextProps,nextState){
  //  console.log(nextProps.activeIndex,nextState.activeIndex)
    if(nextProps.data !== undefined){
        //console.log(nextProps.data)
        //let data=nextProps.data
        //this.setState({data})
       OPEN.task_list(this,this.props.item['id'],(_this,data)=>{
      //console.log(data)
      this.setState({data:data['data']})
    })
   }
  }

  handle_deler(item,event){
    event = event ? event : window.event;
    event.stopPropagation();
    let _this=this
   // console.log(item.task_id)
    OPEN.task_delete(this,item.task_id,(_this,data)=>{
     // console.log(data)
      if (data['status']){
        _this.task_list()
        message.success(data['msg'])
      }else{
        message.danger(data['msg'])
      }
    })
  }

  handleCheckboxSelect(selectedRows) {
    //console.log('rows:', selectedRows)
  }

  handleRowClick(row) {
   // console.log('rowclick', row)
  }

  handleOrder(name, sort) {
    //console.log(name, sort)
  }

  task_list(){
     OPEN.task_list(this,this.props.item['id'],(_this,data)=>{
      //console.log(data)
      _this.setState({data:data['data']})
    })
  }

  componentWillMount(){
    this.task_list()
  }


  showModal(){
   // console.log(this.state.visible)
    this.setState({
      visible: true,
    });
  }

  handleOk(e){
 //   console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel(e){
 //   console.log(e);
    this.setState({
      visible: false,
    });
  }


  render(){
  	return (
  		<div>
  		  <FixedTable
	        height={200}
	        data={this.state.data}
	        column={this.state.column}
	       // onRowClick={::this.handleRowClick}
	        //onOrder={::this.handleOrder}
	        //onCheckboxSelect={::this.handleCheckboxSelect}
	      />
        <Modal
          title="发布详情"
          visible={this.state.visible}
          onOk={::this.handleOk}
          onCancel={::this.handleCancel}
                    footer={[
            //<Buttons key="back" type="ghost" size="large" onClick={::this.handleCancel}>关闭</Buttons>,
          ]}
        >
          <div sytle={{maxHeight:'500',overflow:'auto'}} >
            <Task_detail_get task_id={this.state.task_id} _this={this} data={this.state.data_list} status={this.state.status}/>
          </div>
        </Modal>
  		</div>
  		)
  }

}





class Task_list extends Component {
	constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      data:[],
      activeIndex:1,
    }
  }


  request_task(){
    console.log(1)
    /*
      OPEN.task_list(this,this.props.item['id'],(_this,data)=>{
      console.log(data)
      _this.setState({data:data['data']})
    })*/
  }

  render() {
    const { activeIndex} = this.state
   // console.log(activeIndex,tabs)
    return (
       <div>
	   <Tabs 
     dynamic
     activeIndex={activeIndex}
     onChange={activeIndex => this.setState({ activeIndex }) }
      >
	      <TabList>
	        <Tab >发布版本更新</Tab>
	        <Tab onClick={::this.request_task} >发布任务</Tab>
	      </TabList>
	      <TabPanel ><File_sync_get select_host={this.props.select_host} host={this.props.host} item={this.props.item} _this={this}/></TabPanel>
	      <TabPanel ><Task_get data={this.state.data} activeIndex={this.state.activeIndex} item={this.props.item}/></TabPanel>
	    </Tabs>
	  </div>
    )
  }
}

export default Task_list