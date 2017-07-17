import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import './index.less'
//import { Form, FormItem, FormSubmit, FormInput, FormSelect, Option, FormTextarea } from 'bfd/Form'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import DataTable from 'bfd/DataTable'
//import { Table, Icon } from 'antd/lib/Table'
import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import Button from 'bfd/Button'
import {CreateModal} from './create_host'
import FixedTable from 'bfd/FixedTable'
import xhr from 'bfd/xhr'
import TextOverflow from 'bfd/TextOverflow'
import {Put_asset} from './asset_edit'
import Icon from 'bfd/Icon'
import {VNC,VNC_model,VNC_Tabl} from './vnc'
import Terminal from 'xterm'
import "../../../node_modules/xterm/dist/xterm.css"
import OPEN from '../../data_request/request.js'
import { Select,Option } from 'bfd/Select'
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;




class FixedTableDemo extends Component {
  constructor(props) {
    super()
    this.newTabIndex = 0;
   // let panes = [
 //     { title: 'Tab 1', content: <VNC host_id={this.state.host_id}/>, key: '1' },
     // { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
  //  ];
    this.state = {
      column: [{title: '序号', key: 'sequence', // width:'50px'
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
          //console.log(item.id)
          let host_id=item.id
          return (
            <div>
              <a href="#" onClick={() => this.props.history.pushState(null, `/Cmdb/details/${item['id']}`)}>{text}</a>
              {/*<VNC_model host_id={host_id} />*/}
              {/*<a herf="#" style={{marginLeft:"10px"}} onClick={::this.handletest}><Icon type="desktop" /></a>*/}
            </div>
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
      ws:'',
      host_id:'',
      host_list:[],
      activeKey: '1',
      panes:[],
      title:'',
      ws_list:[],
    }
  }

  Selectcallback(event){
    //console.log(event)
    //console.log(this.state.data[event])
    let title = this.state.data[event]['hostname']+' - '+this.state.data[event]['ip']
    this.setState({title,host_id:this.state.data[event]['id']})
  }

  render() {
    //console.log(this.state.data)
    return (
      <div>
        <div><h6>主机详细信息列表</h6></div>
        <div><CreateModal rows={this.state.rows} getdata={::this.getdata} handletest={::this.handletest}/></div>
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
        <div >
          <Modal ref="test" onClose={::this.closecallback} style={{width:'1000px !important'}} width={'956px'} lock>
            <ModalHeader className="" style={{width:'1000px !important'}} >
              <h6 >ssh终端</h6>
            </ModalHeader>
            <ModalBody className="" style={{width:'1000px !important'}}>
              <div>
                {/*<VNC_Tabl host_id={this.state.host_id}/>*/}
                <div style={{ marginBottom: 16 }}>
                  <Select searchable onChange={::this.Selectcallback}>
                    <Option>请选择</Option>
                    {this.state.data.map((str,item)=>{
                      return (<Option key={item} value={item}>{str.hostname}</Option>)
                    })}
                  </Select> 
                <Button onClick={::this.add}>打开终端</Button>
                </div>
              <Tabs
                hideAdd
                onChange={::this.onChange}
                activeKey={this.state.activeKey}
                type="editable-card"
                onEdit={::this.onEdit}
              >
                {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
              </Tabs>
              </div>
            </ModalBody>
          </Modal>
        {/*
          <Modal ref="test" className="create_cmdb_group">
            <ModalHeader className="create_cmdb_group" >
              <h6>ssh终端</h6>
            </ModalHeader>
            <ModalBody className="create_cmdb_group">
                <div style={{}} id="terminal"></div>
            </ModalBody>
          </Modal>*/}
        </div>
      </div>
    )
  }

  componentWillMount(){
    this.getdata()
   // console.log(this.props)
  }


  getdata(){
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/assetget/',
      success(data) {
       // console.log(data['data'])
        _this.setState({data:data['data']})

      }
    })
  }


  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
   // console.log(item)
    this.setState({item})
    this.handleOpen()
  }

  handleOpen(){
    this.refs.modal.open()
  }

  handletest(item, event){
    this.refs.test.open()
   // this.refs.test.close(this.closecallback)
  }

  closecallback(){
    console.log(this.state.ws_list)
    this.state.ws_list.map((str,item)=>{
      str.close()
    })
    this.setState({panes:[]})
  }

  handleCheckboxSelect(selectedRows) {
   // console.log('rows:', selectedRows)
    this.setState({rows:selectedRows})
  }

  handleRowClick(row) {
    console.log('rowclick', row.id)
    let _this = this
    console.log(this.state.host_list)
    if (this.state.host_list.length===0){
      this.state.host_list.push(row.id)
      this.setState({host_id:row.id})
    }else{
      if (this.state.host_list.indexOf(row.id) === -1){
        this.state.host_list.push(row.id)
        this.setState({host_id:row.id})
      }
    }
  }

  handleOrder(name, sort) {
  //  console.log(name, sort)
  }

  onChange(activeKey){
    this.setState({ activeKey });
  }
  onEdit(targetKey, action){
    this[action](targetKey);
  }
  add(){
    const panes = this.state.panes;
    const activeKey = `newTab${this.newTabIndex++}`;
    let panes_id=this.state.host_id+activeKey
    panes.push({ title: this.state.title, content: <VNC host_id={this.state.host_id} panes_id={panes_id} _this={this} ws_list={this.state.ws_list}/>, key: activeKey });
    this.setState({ panes, activeKey });
  }
  remove(targetKey){
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
        let ws_object=this.state.ws_list[i]
        ws_object.close()
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    console.log(lastIndex)
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  }

}


export default FixedTableDemo