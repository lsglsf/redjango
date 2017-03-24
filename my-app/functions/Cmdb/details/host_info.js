import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import Button from 'bfd/Button'
//import List from './List'
import './index.less'
import echarts3 from 'echarts'
//import {Panel} from "react-bootstrap"
//import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from 'antd';
import { Tabs, TabList, Tab, TabPanel } from 'bfd/Tabs'
import { Table } from 'antd';
import OPEN from '../../data_request/request.js'


class Info extends Component {

  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      system_disk:[],
      system_men:[],
      host_info:{},
    }
  }

  handleListChange(type, value) {
    this.update(type, 'list', value)
  }

  componentWillMount(){
  	OPEN.host_info(this,this.props.id,(_this,data)=>{
  		console.log(data)
  		let host_info=data['host_info']
  		let system_men=new Array()
  		console.log(data['system_men'])
  		data['system_men']['mem']['name']='Mem'
  		data['system_men']['swap']['name']='Swap'
  		system_men.push(data['system_men']['mem'])
  		system_men.push(data['system_men']['swap'])
  		this.setState({
  			system_disk:data['system_disk']['disk'],
  			system_men,
  			host_info
  		})
  	})

  }

  componentDidMount(){ 

  }

   callback(key) {
   console.log(key);
    }


  render() {
    const TabPane = Tabs.TabPane;
    console.log(this.state.system_disk,this.state.system_men)
    const columns = [/*{
	  title: '名称',
	  dataIndex: 'device1',
	  key: 'device1',
	  render: text => <a href="#">{text}</a>,
	},*/ {
	  title: '磁盘分区',
	  dataIndex: 'device',
	  key: 'device',
	}, {
	  title: '文件系统类型',
	  dataIndex: 'fstype',
	  key: 'fstype',
	}, {
	  title: '挂载点',
	  key: 'mountpoint',
	  dataIndex:'mountpoint',
	},{
	  title: '容量',
	  key: 'total',
	  dataIndex:'total',
	},{
	  title: '已使用',
	  key: 'used',
	  dataIndex:'used',
	},{
	  title: '空闲',
	  key: 'free',
	  dataIndex:'free',
	}];

	const columns_mem = [/*{
	  title: '名称',
	  dataIndex: 'device1',
	  key: 'device1',
	  render: text => <a href="#">{text}</a>,
	},*/ {
	  title: 'name',
	  dataIndex: 'name',
	  key: 'name',
	},{
	  title: 'total',
	  dataIndex: 'total',
	  key: 'total',
	}, {
	  title: 'used',
	  dataIndex: 'used',
	  key: 'used',
	}, {
	  title: 'free',
	  key: 'free',
	  dataIndex:'free',
	},{
	  title: 'shared',
	  key: 'shared',
	  dataIndex:'shared',
	},{
	  title: 'buffers',
	  key: 'buffers',
	  dataIndex:'buffers',
	},{
	  title: 'cached',
	  key: 'cached',
	  dataIndex:'cached',
	}];


    return (
        <div>
        	<Row>
        	<Col span={9}>
        		<span className="title_1">基本信息</span>
        		<div className="Sys_info">
	        		<Row >
	        			<Col span={8} >内核发行版本:</Col><Col span={16} style={{textAlign:'left',paddingLeft:'15px'}} >{this.state.host_info.kernel}</Col>
	        		</Row>
	        	    <Row >
	        			<Col span={8} >系统架构:</Col><Col span={16} style={{textAlign:'left',paddingLeft:'15px'}} >{this.state.host_info.architecture}</Col>
	        		</Row>
	        	    <Row >
	        			<Col span={8} >系统发行版本:</Col><Col span={16} style={{textAlign:'left',paddingLeft:'15px'}}>{this.state.host_info.description}</Col>
	        		</Row>
	        		<Row >
	        			<Col span={8} >fqdn:</Col><Col span={16} style={{textAlign:'left',paddingLeft:'15px'}} >{this.state.host_info.fqdn}</Col>
	        		</Row>
	        		<Row >
	        			<Col span={8} >CPU 型号:</Col><Col span={16} style={{textAlign:'left',paddingLeft:'15px'}}>{this.state.host_info.processor}</Col>
	        		</Row>
	        		<Row >
	        			<Col span={8} >CPU 物理核数:</Col><Col span={16} style={{textAlign:'left',paddingLeft:'15px'}} >{this.state.host_info.processorcores}</Col>
	        		</Row>
	        		<Row >
	        			<Col span={8} >CPU 逻辑核数:</Col><Col span={16} style={{textAlign:'left',paddingLeft:'15px'}} >{this.state.host_info.processorcount}</Col>
	        		</Row>
        		</div>
        	</Col>
      		<Col span={13} offset={2}>
      			<div>
      				<span className="title_1">内存信息</span>
      				<Table columns={columns_mem} dataSource={this.state.system_men} pagination={false} />
      			</div>
      			<div>
      				<span className="title_1">磁盘信息</span>
      				<Table columns={columns} dataSource={this.state.system_disk} pagination={false} />
      			</div>
      		</Col>
        	</Row>
        </div>
 
    )
  }
}



export default Info