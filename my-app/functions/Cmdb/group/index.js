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
import {CreateModal} from './create_delet'
import FixedTable from 'bfd/FixedTable'
import xhr from 'bfd/xhr'
import {Put_group} from './group_edit'


/*
class DataTableDemo extends Component {
  constructor(props) {
    super()
    this.state = {
      url: "/v1/cmdb/list/groupget/",
      column: [{
        title: '序号',
        key: 'sequence'
      },{
        primary: true,
        title: 'ID',
        key: 'id',
        hide: true
      }, {
        title: '姓名',
        order: true,
        width: '100px',
        render: (text, item, index) => {
          return <a href="javascript:void(0);" onClick={this.handleClick.bind(this, item)}>{text}</a>
        },
        key: 'name'
      }, {
        title: '年龄',
        key: 'age',
        order: 'desc'
      }, {
        title: '国家/地区',
        key: 'country',
        width: '20%',
        render: (text, item, index) => {
          return item.country + "/" + item.area
        }
      }, {
        title: '注册日期',
        key: 'regdate',
        order: 'asc'
      }, {
        title: '操作',
        render: (item, component) => {
          return <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)}>编辑</a>
        },
        key: 'operation' //注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }]
    }
  }

  render() {
    return (
      <div>
        <div><h6>主机组详细信息列表</h6></div>
        <div><CreateModal/></div>
        <DataTable
          url={this.state.url}
          onPageChange={::this.onPageChange}
          showPage="true"
          column={this.state.column}
          howRow={10}
          onRowClick={::this.handleRowClick}
          onOrder={::this.handleOrder}
          onCheckboxSelect={::this.handleCheckboxSelect}
        />
      </div>
    )
  }

  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
    console.log(item)
  }

  onPageChange(page) {
    this.setState({
      url: "/v1/cmdb/list/groupget/"
    })
  }

  handleCheckboxSelect(selectedRows, allSelectedRows) {
    console.log('rows:', selectedRows)
    console.log('all:', allSelectedRows)
  }

  handleRowClick(row) {
    console.log('rowclick', row)
  }

  handleOrder(name, sort) {
    console.log(name, sort)
  }
}*/

class FixedTableDemo extends Component {
  constructor(props) {
    super()
    this.state = {
      url: "/api/table",
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
      data: [],
      host: '',
      rows: '',
      item: '',
      newData:'',
      sourceData:'',
      targetData:'',
    }
  }


  render() {
    return (
      <div>
        <div><h6>主机组详细信息列表</h6></div>
        <div><CreateModal host={this.state.host} getdata={::this.getdata} rows={this.state.rows}/></div>
        <FixedTable 
          height={500}
          data={this.state.data}
          column={this.state.column}
          onRowClick={::this.handleRowClick}
          onOrder={::this.handleOrder}
          onCheckboxSelect={::this.handleCheckboxSelect}
        />
        <div>
          <Modal ref="modal_p" className="create_cmdb_group">
            <ModalHeader className="create_cmdb_group" >
              <h6>主机组编辑</h6>
            </ModalHeader>
            <ModalBody className="create_cmdb_group">
              <Put_group item={this.state.item} modal={this.refs.modal_p} sourceData={this.state.sourceData} targetData={this.state.targetData} newData={this.state.newData}/>
            </ModalBody>
          </Modal>
        </div>
      </div>

    )
  }

  componentWillMount(){
    this.getdata()
  }

  getdata(){
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=group_all',
      success(data) {
        _this.setState({data:data['data'],host:data['host']})
      }
    })
  }

  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
    this.setState({item})
    this.handleOpen()
  }

  get_assect(item){
    let _this=this
    let id = item['id']
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=assert_host&id='+id,
      success(data) {
        _this.setState({sourceData:data['data']['sdata'],targetData:data['data']['tdata'],newData:data['data']['tdata']})
        _this.handleOpen()
      }
    })
  }

  handleOpen(type){
    this.refs.modal_p.open()
  }

  handleCheckboxSelect(selectedRows) {
  //  console.log('rows:', selectedRows)
    this.setState({rows:selectedRows})
  }

  handleRowClick(row) {
  //  console.log('rowclick', row)
  }

  handleOrder(name, sort) {
 //   console.log(name, sort)
  }
}


export default FixedTableDemo