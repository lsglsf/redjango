import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import DatePicker from 'bfd/DatePicker'
import message from 'bfd/message'
//import { Table, Icon as Icons } from 'antd/lib/Table'
//import {Popconfirm} from 'antd'
import {Menu, Dropdown,Icon,Popconfirm } from 'antd';
//import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import Button from 'bfd/Button'
import FixedTable from 'bfd/FixedTable'
import { Collapse } from 'antd'
import { Modal } from 'antd';
import OPEN from '../../data_request/request.js'
import { Select } from 'antd';
import { Spin } from 'antd';
const Option = Select.Option;
const Panel = Collapse.Panel;



class Restartservice extends Component {
	constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
    	item:'',
    	fun:'',
    	visible:false,
    	selectedvalue:'',
    	returndata:'',
    	loading:false,
    }
  }


  restart(){
  	//console.log('dafasfas',this.porps.item)
    //let data_ws={'host':this.props.item['host'],'cmd':this.props.item['service_restart'],'app':'start','path':this.props.item['path_log'],ip:this.props.item['ip']}
    //OPEN.service_execute(this,this.callback,data_ws)
    //OPEN.serverrestart()
    this.setState({visible:true})
  }

  handleOk(e){
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel(e){
    //console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleChange(value) {
  	//console.log(`selected ${value}`);
  	this.setState({selectedvalue:value})
  }

  handleonClick(){
  	let data={id:this.state.item['id'],host:this.state.selectedvalue}
  	this.setState({loading:true,returndata:''})
  	OPEN.serverrestart(data,(data)=>{
  		//console.log(data['stdout'])
  		this.setState({returndata:data['stdout'],loading:false})
  	})
  }

  render() {
  	//console.log(this.state.item,'ss')
  	let host_ip= this.state.item['host_ip']
  	let Nav_l = host_ip ?  Object.keys(host_ip).map((item,str)=>{
  		return (
  			 <Option value={item} key={str}>{host_ip[item]}</Option>
  			)
  	}):''
    return (
      <Popconfirm title='确认重启？' onConfirm={::this.props.restart} okText="Yes" cancelText="No">
          <a href="#">
          重启服务
          <Modal
           title="服务重启"
           visible={this.state.visible}
           onOk={::this.handleOk}
           onCancel={::this.handleCancel}
           width='800px'
           footer={[]}
          >
          <div>
          	<Spin spinning={this.state.loading}>
          	<div>
          	 <Select
			    showSearch
			    style={{ width: 100 }}
			    placeholder="Select a person"
			    optionFilterProp="children"
			    onChange={::this.handleChange}
			    //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
			  >
			    {Nav_l}
			</Select>
			 <Button type="primary" style={{float:"right"}} onClick={::this.handleonClick}>重启</Button>
			 </div>
			 <div style={{marginTop:"10px"}}>
		 	  <Collapse accordion>
			    <Panel header={'执行结果'} key="1">
			      <p>{this.state.returndata}</p>
			    </Panel>
			  </Collapse>
			 </div>
			 </Spin>
          </div>
        </Modal>
          </a>
     </Popconfirm>
    )
  }
}



export default Restartservice