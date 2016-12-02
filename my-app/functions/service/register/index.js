import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import './index.less'
import { Form, FormItem, FormSubmit, FormInput, FormSelect, Option, FormTextarea } from 'bfd/Form'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import DataTable from 'bfd/DataTable'
import { Table, Icon } from 'antd/lib/Table'
import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import Button from 'bfd/Button'
import FixedTable from 'bfd/FixedTable'
import xhr from 'bfd/xhr'
import { Collapse } from 'antd'
import {CreateModal} from './create_delete'
import TextOverflow from 'bfd/TextOverflow'
import {Base_version} from './version'

/*
class FixedTableDemo extends Component {
  constructor(props) {
    super()
    this.state = {
      column: [{
        title: '序号',
        key: 'sequence',
       // width:'50px'
      },{
        primary: true,
        title: 'ID',
        key: 'id',
        hide: true
      }, {
        title: '主机组名',
        order: true,
        //width: '100px',
        render: (text, item) => {
          return <a href="javascript:void(0);" onClick={this.handleClick.bind(this, item)}>{text}</a>
        },
        key: 'name'
      }, {
        title: '数量',
        key: 'age',
      //  order: 'desc'
      }, {
        title: '创建时间',
        key: 'country',
        //width: '20%',
        //render: (text, item) => {
       //   return item.country + "/" + item.area
       // }
      }, {
        title: '备注',
        key: 'comment',
        //order: 'asc'
      }, {
        title: '操作',
        render: (item, component) => {
          return <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)}>编辑</a>
        },
        key: 'operation' //注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }],
      data: []
    }
  }


  render() {
    console.log(this.state.data)
    return (
      <div>
        <div><h6>环境展示</h6></div>
        <FixedTable 
          height={500}
          data={this.state.data}
          column={this.state.column}
          onRowClick={::this.handleRowClick}
          onOrder={::this.handleOrder}
          onCheckboxSelect={::this.handleCheckboxSelect}
        />
      </div>
    )
  }

  componentWillMount(){
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/',
      success(data) {
        console.log(data['data'])
        _this.setState({data:data['data']})

      }
    })
  }

  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
    console.log(item)
  }

  handleCheckboxSelect(selectedRows) {
    console.log('rows:', selectedRows)
  }

  handleRowClick(row) {
    console.log('rowclick', row)
  }

  handleOrder(name, sort) {
    console.log(name, sort)
  }
}*/


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
        //width: '20%',
        //render: (text, item) => {
       //   return item.country + "/" + item.area
       // }
      }, {
        title: '项目路径',
        key: 'path_project',
        //order: 'asc'
      },  {
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
      },{
        title: '操作',
        render: (item, component) => {
        	console.log(item,component,'111')
          return (
          		<div>
          		  <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)} style={{float:'left'}}>编辑<span>|</span></a>
          		  <Base_version item={item} host={this.state.host}/>
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
    }
  }


  query_name(id_id){
  	return this.state.type[id_id]
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
	        vardata[key[key.length-1]]=data['data']
	       	_this.setState({vardata,host:data['host']})
	      }
	    })
	  }
	  this.setState({count:key.length})
   }

  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
    console.log(item)
  }

  /*handleCheckboxSelect(selectedRows) {
    console.log('rows:', selectedRows)
  }*/

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


  render() {
  	const Panel = Collapse.Panel
  	let nav = this.state.type ? this.state.type.map((item,str)=>{
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
        <div><h6>主机组详细信息列表</h6></div>
        <div><CreateModal /></div>
	  <Collapse defaultActiveKey={[]} onChange={::this.callback}>
	    {nav}
	  </Collapse>
      </div>
    )
  }
}






export default FixedTableDemo1