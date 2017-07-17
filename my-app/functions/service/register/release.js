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
import {Select as Selects , Menu, Dropdown,Icon,Popconfirm } from 'antd';
import { Modal, Button as Buttons, Alert } from 'antd';
import OPEN from '../../data_request/request.js'
import { Row, Col } from 'antd'
import Tree from 'bfd/Tree'
import ReactDOM from 'react-dom'
import { Spin} from 'antd';
import { MultipleSelect, Option  } from 'bfd/MultipleSelect'
//import ReactDOM from 'react-dom'
import Switch from 'bfd/Switch'





class File_sync_get extends Component{
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
      select_host:'',
      loading: false,
      loading_s:[],
      backup_status:true,
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
  	//if (this.state.host_select_vd.length == 1){
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
	//}else{
	//message.danger('暂时只支持单节点操作')
	//}
  }

  detection_path(){
  	let path_list=this.state.path_list
  	let select_host = this.state.select_host
  	let _this = this
  	//console.log(path_list)
  	if (select_host && path_list.length > 0){
  		//console.log('sdfs')
  		let data={'path':path_list,serviceid:this.props.item['id'],'host':this.state.select_host}
  		this.setState({loading:true})
  		OPEN.filecheck(data,(data)=>{
  			//console.log(data['data'])
  			if (data['status']){
	  			this.setState({sync_data:data['data'],path_list:''})
	  			this.setState({loading:false})
  			}else{
  				this.setState({loading:false})
  				message.danger(data['data'])
  			}
  		})
  	}else{
  		message.danger("请选择主机或者添加目录")
  	}
  }

  sftp_rsync(value,value2){
   // console.log(this.refs.sftp_rsync.value)
    if (this.refs.sftp_rsync.value==1){
      this.setState({sftp_rsync:'rsync_files_w'})
    }else{
      this.setState({sftp_rsync:'file_write'})
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
		//console.log(this.state.sync_data)
		let _this = this
		let data = this.state.sync_data
		data['backup'] = this.state.backup_status
		data['serviceid'] = this.props.item['id']
		OPEN.filesync(data,(data)=>{
			//console.log(data)
	     _this.setState({path_list:'',sftp_rsync:'file_write',sync_data:''})
          _this.props._this.setState({
            activeIndex:1,
          })
          if (data['status']){
            message.success(data['id'])
          }else{
            message.danger(data['msg'])
          }

		})
  	}


  backupstatus(e){
  	let backup_status = this.state.backup_status 
  	backup_status=e.target.checked
  	//console.log(backup_status)
  	this.setState({backup_status})
  }

  write_close(){
    this.props._this.setState({visible:false})
  }

  select_host_v(value){
  	this.setState({select_host:value})
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
    
    return (
    	<div>
	    	<Form
	        action="/v1/cmdb/list/groupdelete/"
	        data={formData}
	        type='GET'
	        onChange={formData => this.update('set', { formData })}
	        rules={this.rules}
	        labelWidth={100}
	        onSuccess={::this.handleSuccess}
	      >
	        <FormItem label="选择主机" name="name" help="" style={{height:'17px',lineHeight:'30px'}}>
	      		<FormSelect defaultValues={[0]} onChange={::this.select_host_v}>
	      			<Option >请选择节点</Option>
	        		{host_select_v}
	      		</FormSelect>
	        </FormItem>
          
          	<FormItem label="是否备份" name="name" help="" style={{height:'17px',lineHeight:'30px'}}>
	        	<input type="checkbox" checked={this.state.backup_status } style={{marginTop:'8px'}} onChange={::this.backupstatus}/>
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
	                                  <FormTextarea style={{width:"600px",height:"150px"}}/>
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
	        </div>
          </Spin>
	      </Form>
      </div>
    )
  }
}


export default File_sync_get