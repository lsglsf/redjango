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
import {CreateModal} from './create_host'
import FixedTable from 'bfd/FixedTable'
import xhr from 'bfd/xhr'
import TextOverflow from 'bfd/TextOverflow'
import {Put_asset} from './asset_edit'
import { Nav, NavItem ,IndexNavItem } from 'bfd/Nav'




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
        title: '主机名',
        order: true,
        //width: '100px',
        render: (text, item) => {
          return (<a href="#" onClick={() => this.props.history.pushState(null, `/Cmdb/details/${item['id']}`)}>{text}</a>
            )
        },
        key: 'hostname',
      }, {
        title: 'IP地址',
        key: 'ip',
      //  order: 'desc'
      }, {
        title: '端口',
        key: 'port',
        //width: '20%',
        //render: (text, item) => {
       //   return item.country + "/" + item.area
       // }
      }, {
        title: '所属主机组',
        key: 'group',
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
        //order: 'asc'
      }, {
        title: '操作系统',
        key: 'system',
        //order: 'asc'
      }, {
        title: '主机类型',
        key: 'asset_type',
        //order: 'asc'
      }, {
        title: '运行环境',
        key: 'env',
        //order: 'asc'
      }, {
        title: '机器状态',
        key: 'status',
        //order: 'asc'
      }, {
        title: '操作',
        render: (item, component) => {
          return (
              <div>
                <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)}>编辑</a>
              </div>
            )
        },
        key: 'operation' //注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }],
      data: [],
      rows:'',
      item:'',
    }
  }


  render() {
    console.log(this.state.data)
    return (
      <div>
        <div><h6>主机详细信息列表</h6></div>
        <div><CreateModal rows={this.state.rows} getdata={::this.getdata}/></div>
        <FixedTable 
          height={500}
          data={this.state.data}
          column={this.state.column}
          onRowClick={::this.handleRowClick}
          onOrder={::this.handleOrder}
          onCheckboxSelect={::this.handleCheckboxSelect}
        />
        <div>
          <Modal ref="modal" className="create_cmdb_group">
            <ModalHeader className="create_cmdb_group" >
              <h6>主机编辑</h6>
            </ModalHeader>
            <ModalBody className="create_cmdb_group">
              <Put_asset item={this.state.item} modal={this.refs.modal} getdata={::this.getdata}/>
            </ModalBody>
          </Modal>
        </div>
        <div>
          <Modal ref="test" className="create_cmdb_group">
            <ModalHeader className="create_cmdb_group" >
              <h6>主机编1辑</h6>
            </ModalHeader>
            <ModalBody className="create_cmdb_group">
                                <div id="iFrame" style={{}} ref="iFrame">
                    <iframe name="iFrame" width="760" height="1000" src="http://127.0.0.1:9527/" scrolling="auto "
                            frameborder="0" style={{height: "588px"}}></iframe>
                  </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }

  componentWillMount(){
    this.getdata()
    console.log(this.props)
  }


  getdata(){
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/assetget/',
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
    this.setState({item})
    this.handleOpen()
  }

  handleOpen(){
    this.refs.modal.open()
  }

  handletest(item, event){
    this.refs.test.open()
  }

  handleCheckboxSelect(selectedRows) {
   // console.log('rows:', selectedRows)
    this.setState({rows:selectedRows})
  }

  handleRowClick(row) {
    console.log('rowclick', row)
  }

  handleOrder(name, sort) {
    console.log(name, sort)
  }
}


export default FixedTableDemo