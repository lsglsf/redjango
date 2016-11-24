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
}


class FixedTableDemo1 extends Component {
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

   callback(key) {
	  console.log(key);
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

  render() {
  	const text = `
		crm主机
		mysql
		oss
	`;
  	const Panel = Collapse.Panel
    return (
      <div>
        <div><h6>主机组详细信息列表</h6></div>
        <div><CreateModal /></div>
	  <Collapse defaultActiveKey={['']} onChange={::this.callback}>
	    <Panel header="生产环境" key="1">
	      	<FixedTable 
	          height={500}
	          data={this.state.data}
	          column={this.state.column}
	          onRowClick={::this.handleRowClick}
	          onOrder={::this.handleOrder}
	          onCheckboxSelect={::this.handleCheckboxSelect}
	        />
	    </Panel>
	    <Panel header="uat环境" key="2">
	      <p>{text}</p>
	    </Panel>
	    <Panel header="vip环境" key="3">
	      <p>{text}</p>
	    </Panel>
	  </Collapse>
      </div>
    )
  }
}






export default FixedTableDemo1