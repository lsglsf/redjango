import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import './index.less'
//import { Form, FormItem, FormSubmit, FormInput, FormSelect, Option, FormTextarea } from 'bfd/Form'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import DataTable from 'bfd/DataTable'
//import { Table, Icon as Icons } from 'antd/lib/Table'
import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import Button from 'bfd/Button'
import FixedTable from 'bfd/FixedTable'
import xhr from 'bfd/xhr'
import { Collapse } from 'antd'
import {CreateModal} from './create_delete'
import TextOverflow from 'bfd/TextOverflow'
import {Base_version} from './version2'
import { Select, Option } from 'bfd/Select'
import OPEN from '../../data_request/request.js'
//import { Select,Menu, Dropdown,Icon} from 'antd';
//const Options = Select.Option;


class FixedTableDemo1 extends Component {
  constructor(props) {
    super()
    this.state = {
      column: [{
        primary: true,
        title: 'ID',
        key: 'id',
        hide: true
      }, {
        title: '服务名称',
        order: true,
        //width: '100px',
        render: (text, item) => {
          return <a href="javascript:void(0);" onClick={this.handleClick.bind(this, item)}>{text}</a>
        },
        key: 'service_name'
      }, {
        title: '配置文件路径',
        key: 'path_config',
      //  order: 'desc'
      }, {
        title: '程序路径',
        key: 'path_root',
      }, {
        title: '项目路径',
        key: 'path_project',
        //order: 'asc'
      },
      {
        title:"重启命令",
        key:"service_restart",
        render:(text,item)=>{
          return (<TextOverflow>
            <p style={{width: '80px'}}>{text}</p>
          </TextOverflow>)
        }
      }, 
      {
        title:"日志文件",
        key:"path_log",
      },
      {
        title: '关联主机',
        key: 'host',
        render:(text,item)=>{
          let ff=function function_name(text) {
            let group_name=''
            for (var i in text){
              group_name=group_name+text[i]+' '
            }
            return group_name
          }
          return (<TextOverflow>
                   <p style={{width: '50px'}}>{ff(text)}</p>
                  </TextOverflow>)
        },
      }, {
        title: '描述',
        key: 'desc',
        //order: 'asc'
        render:(text,item)=>{
          return (<TextOverflow>
            <p style={{width: '80px'}}>{text}</p>
          </TextOverflow>)
        }
      },{
        title: '操作',
        width: '100px',
        render: (item, component) => {
          return (
              <div>
                  {/*<a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)} style={{float:'left'}}>编辑<span>|</span></a>
                  <Base_version item={item} host={this.state.host}/>*/}
                  <Base_version item={item} callback_get={::this.callback_get} status_update={::this.status_update} />
              </div>
            )
        },
        key: 'operation'
      }],
      data: [],
      type:[],
      count:0,
      vardata:[],
      host:[],
      Table_list:[],
      select_group:'',
      selectreturn:'',
      returnvalue:[],
      twoselect:true,
      defaultselect:'select',
    }
  }


  query_name(id_id){
    return this.state.type[id_id]
  }


  callback_get(value){
    let key_id=this.query_name(value)
    let _this=this
    let vardata = this.state.vardata
    xhr({
      type: 'GET',
      url: `/v1/service/list/query/?name=${key_id}`,
      success(data) {
        let data_list=data['data']
        for (let i in data_list){
          data_list[i]['coll_id']=value
        }
        vardata[value]=data_list
        _this.setState({vardata})
      }
    })
  }

  callback(key) {
    let _this=this
    let vardata=this.state.vardata
    let key_id=this.query_name(key[key.length-1])
    if (this.state.count<key.length){
      xhr({
        type: 'GET',
        url: `/v1/service/list/query/?name=${key_id}`,
        success(data) {
         // console.log(data['data'])
          let data_list=data['data']
          for (let i in data_list){
            data_list[i]['coll_id']=key[key.length-1]
          }
          vardata[key[key.length-1]]=data_list
          _this.setState({vardata,host:data['host']})
        }
      })
    }
    this.setState({count:key.length,Table_list:key})
   }

  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
  //  console.log(item)
  }

  /*handleCheckboxSelect(selectedRows) {
    console.log('rows:', selectedRows)
  }*/

  handleRowClick(row) {
   // console.log('rowclick', row)
  }

  handleOrder(name, sort) {
 //   console.log(name, sort)
  }

  componentWillMount(){
    let _this=this
    //xhr({
    //  type: 'GET',
    //  url: '/v1/service/list/type_list/',
   //   success(data) {
       // console.log(data['data'])
  //      _this.setState({type:data['data']})
  //    }
  //  })
    let vardata=this.state.vardata
    //let key_id=this.query_name(key[key.length-1])
    xhr({
      type: 'GET',
      url: `/v1/service/list/query/`,
      success(data) {
        //console.log(data)
        vardata=data['data']
        _this.setState({vardata})
      }
    })
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=group_all',
      success(data) {
        console.log(data)
        _this.setState({select_group:data})
       // _this.setState({data:data['data'],host:data['host']})
      }
    })
  }


  status_update(){
    let _this = this
    let vardata=this.state.vardata
    xhr({
      type: 'GET',
      url: `/v1/service/list/query/`,
      success(data) {
       // console.log(data['data'])
        vardata=data['data']
        _this.setState({vardata})
      }
    })
  }

  handleButtonClick(e) {
    message.info('Click on left button.');
  //  console.log('click left button', e);
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
   // console.log('click', e);
  }
   
  selectgroupget(value){
    let value_data = value
    let _this = this
    if (value_data){
      OPEN.selectquery(this,value_data,(_this,data)=>{
      //console.log(data)
       _this.setState({vardata:data['data'],returnvalue:data,twoselect:false,defaultselect:'select'})
       _this.refs.selectref.setState({value:'select'})
      })
    }else{
      xhr({
      type: 'GET',
      url: `/v1/service/list/query/`,
      success(data) {
        //console.log(data)
        let vardata=data['data']
        _this.setState({vardata,twoselect:true,returnvalue:[]})
        _this.refs.selectref.setState({value:'select'})
      }
    })
    }
  }

  selectreturn(value){
    //console.log(value)
    this.selectgroupget(value)
    //this.setState({selectreturn:value})
  }

  twoselectreturn(value,e){
    //console.log(value,this.refs.selectref)
    if (value != "select"){
      let vardata=[]
      let data = this.state.returnvalue['data'][value]
      vardata.push(data)
      this.setState({vardata})
    }
  }  


  render() {
    console.log(this.state.returnvalue)
    let group_oj=this.state.select_group['data'] ? this.state.select_group['data'].map((item,str)=>{
      //console.log(item,str)
      return (
        <Option value={item['id']} key={str}>{item['name']}</Option>
      )
    })
    :''
    let returnvalue_l = this.state.returnvalue['data'] ? this.state.returnvalue['data'].map((item,str)=>{
      console.log(item,str)
      return (
        <Option value={str} key={str}>{item['service_name']}-{item['alias_name']}</Option>
      )
    }):''
    return (
      <div>
          <div><h5>主机组服务详细信息列表</h5></div>
          <div>
            <div style={{float:"left"}}>
              <CreateModal callback_get={::this.callback_get} Table_list={this.state.Table_list} status_update={::this.status_update} vardata={this.state.data}/>
            </div>
            <div>
              <Select searchable style={{marginLeft:"39px"}} onChange={::this.selectreturn}>
                <Option>请选择</Option>
                {group_oj}
              </Select>
              <Select ref="selectref" searchable onChange={::this.selectreturn} disabled={this.state.twoselect} onChange={::this.twoselectreturn} defaultValue={this.state.defaultselect}>
                <Option value={'select'}>请选择</Option>
                {returnvalue_l}
              </Select>
             {/* <Button onClick={::this.selectgroupget}>搜索</Button>*/}
            </div>
          </div>
          <div>
            <FixedTable 
              height={500}
              data={this.state.vardata}
              column={this.state.column}
              onRowClick={::this.handleRowClick}
              onOrder={::this.handleOrder}
              //onCheckboxSelect={::this.handleCheckboxSelect}
            />
          </div>
      </div>
    )
  }
}

/*
class FixedTableDemo1 extends Component {
  constructor(props) {
    super()
    this.state = {
    	column: [{
        primary: true,
        title: 'ID',
        key: 'id',
        hide: true
      }, {
        title: '服务名称',
        order: true,
        //width: '100px',
        render: (text, item) => {
          return <a href="javascript:void(0);" onClick={this.handleClick.bind(this, item)}>{text}</a>
        },
        key: 'service_name'
      }, {
        title: '配置文件路径',
        key: 'path_config',
      //  order: 'desc'
      }, {
        title: '程序路径',
        key: 'path_root',
      }, {
        title: '项目路径',
        key: 'path_project',
        //order: 'asc'
      },
      {
        title:"重启命令",
        key:"service_restart",
        render:(text,item)=>{
          return (<TextOverflow>
            <p style={{width: '80px'}}>{text}</p>
          </TextOverflow>)
        }
      }, 
      {
        title:"日志文件",
        key:"path_log",
        render:(text,item)=>{
          return (<TextOverflow>
            <p style={{width: '80px'}}>{text}</p>
          </TextOverflow>)
        }
      },
      {
        title: '关联主机',
        key: 'host',
        render:(text,item)=>{
          let ff=function function_name(text) {
            let group_name=''
            for (var i in text){
              group_name=group_name+text[i]+' '
            }
            return group_name
          }
          return (<TextOverflow>
                   <p style={{width: '50px'}}>{ff(text)}</p>
                  </TextOverflow>)
        },
      }, {
        title: '描述',
        key: 'desc',
        //order: 'asc'
        render:(text,item)=>{
          return (<TextOverflow>
            <p style={{width: '80px'}}>{text}</p>
          </TextOverflow>)
        }
      },{
        title: '操作',
        width: '100px',
        render: (item, component) => {
          return (
          		<div>
 
                  <Base_version item={item} callback_get={::this.callback_get} />
              </div>
          	)
        },
        key: 'operation'
      }],
      data: [],
      type:[],
      count:0,
      vardata:{},
      host:[],
      Table_list:[]
    }
  }


  query_name(id_id){
  	return this.state.type[id_id]
  }


  callback_get(value){
    let key_id=this.query_name(value)
    let _this=this
    let vardata = this.state.vardata
    xhr({
      type: 'GET',
      url: `/v1/service/list/query/?name=${key_id}`,
      success(data) {
        let data_list=data['data']
        for (let i in data_list){
          data_list[i]['coll_id']=value
        }
        vardata[value]=data_list
        _this.setState({vardata})
      }
    })
  }

  callback(key) {
	  console.log(key,'key111111');
	  let _this=this
	  let vardata=this.state.vardata
	  let key_id=this.query_name(key[key.length-1])
	  if (this.state.count<key.length){
	  	xhr({
	      type: 'GET',
	      url: `/v1/service/list/query/?name=${key_id}`,
	      success(data) {
	        console.log(data['data'])
          let data_list=data['data']
          for (let i in data_list){
            data_list[i]['coll_id']=key[key.length-1]
          }
	        vardata[key[key.length-1]]=data_list
	       	_this.setState({vardata,host:data['host']})
	      }
	    })
	  }
	  this.setState({count:key.length,Table_list:key})
   }

  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
    console.log(item)
  }

  handleRowClick(row) {
    console.log('rowclick', row)
  }

  handleOrder(name, sort) {
    console.log(name, sort)
  }

  componentWillMount(){
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/service/list/type_list/',
      success(data) {
       // console.log(data['data'])
        _this.setState({type:data['data']})
      }
    })
  }

  handleButtonClick(e) {
    message.info('Click on left button.');
    console.log('click left button', e);
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }


  render() {
  	const Panel = Collapse.Panel
  	//let nav = this.state.type ? this.state.type.map((item,str)=>{
    let nav = this.state.vardata ? this.state.type.map((item,str)=>{
      return (
        <Panel header={item} key={str}>
	      	<FixedTable 
	          height={500}
	          data={this.state.vardata[str]}
	          column={this.state.column}
	          onRowClick={::this.handleRowClick}
	          onOrder={::this.handleOrder}
	          //onCheckboxSelect={::this.handleCheckboxSelect}
	        />
	    </Panel>
        )
    }):<span></span>
    return (
      <div>
        <div><h5>主机组服务详细信息列表</h5></div>
        <div><CreateModal callback_get={::this.callback_get} Table_list={this.state.Table_list}/></div>
	      <Collapse onChange={::this.callback}>
	        {nav}
	      </Collapse>
      </div>
    )
  }
}*/


export default FixedTableDemo1