import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
//import Button from 'bfd/Button'
//import List from './List'
import './index.less'
import echarts3 from 'echarts'
//import {Panel} from "react-bootstrap"
//import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from 'antd';
//import { Tabs, TabList, Tab, TabPanel } from 'bfd/Tabs'
import { Table as Tables} from 'antd';
import OPEN from '../../data_request/request.js'
import { Tooltip } from 'antd';
import TextOverflow from 'bfd/TextOverflow'
import Icon from 'bfd/Icon'
import { Modal, Button } from 'antd';
import Graph from './graph'


class Info extends Component {

  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      system_disk:[],
      system_men:[],
      host_info:{},
      process_io:[],
      sortedInfo:{},
      visible:false,
      title:'',
      pid:{},
      data_graph:[],
    }
  }

  handleListChange(type, value) {
    this.update(type, 'list', value)
  }

  componentWillMount(){
  	OPEN.host_info(this,this.props.id,(_this,data)=>{
      //console.log('daaa',data,data['system_disk'].length, data['process_cpu_men'].length,)

    		let host_info=data['host_info']
    		let system_men=new Array()
    		let process_io= new Array()
        if (Object.keys(data['process_io']).length > 0 && Object.keys(data['system_men']).length ){
    		for (let i in data['process_io']){
    			data['process_io'][i]['name']=data['process_cpu_men'][i]['name']
    			data['process_io'][i]['cpu_percent']=data['process_cpu_men'][i]['cpu_percent']
    			data['process_io'][i]['memory_percent']=data['process_cpu_men'][i]['memory_percent']
    			process_io.push(data['process_io'][i])
    		}
       }
       if (Object.keys(data['system_men']).length > 0){
          data['system_men']['mem']['name']='Mem'
          data['system_men']['swap']['name']='Swap'
          system_men.push(data['system_men']['mem'])
          system_men.push(data['system_men']['swap'])
       }
    		this.setState({
    			system_disk:data['system_disk']['disk'],
    			system_men,
    			host_info,
    			process_io
    		})
    	
  	})

  }

  componentDidMount(){ 

  }

  showModal(){
  	this.setState({
      visible: true,
    });
  }

    handleOk(e){
    //console.log(e);
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


  process_io(io,pid,evnet){
  //	console.log(io,'ss',pid,"io pid",evnet)
   	evnet.preventDefault()
   	this.showModal()
   //	console.log('111')
   }


  render() {
    const columns = [{title: '磁盘分区',dataIndex: 'device',key: 'device',},
    				{title: '文件系统类型',dataIndex: 'fstype',key: 'fstype',},
    				{title: '挂载点',key: 'mountpoint',dataIndex:'mountpoint',},
    				{title: '容量',key: 'total',dataIndex:'total',},
    				{title: '已使用',key: 'used',dataIndex:'used',},
    				{title: '空闲',key: 'free',dataIndex:'free',}];

	const columns_mem = [{title: 'name',dataIndex: 'name',key: 'name',},
						{title: 'total',dataIndex: 'total',key: 'total',},
						{title: 'used',dataIndex: 'used',key: 'used',}, 
						{title: 'free',key: 'free',dataIndex:'free',},
						{title: 'shared',key: 'shared',dataIndex:'shared',},
						{title: 'buffers',key: 'buffers',dataIndex:'buffers',},
						{title: 'cached',key: 'cached',dataIndex:'cached',}];

	const columns_io = [{title: 'name',dataIndex: 'name',key: 'name',width:"20%"},
						{title: 'username',dataIndex: 'username',key: 'username',}, 
						{title: 'pid',dataIndex: 'pid',key: 'pid',}, 
						{title: 'cpu_percent',dataIndex: 'cpu_percent',key: 'cpu_percent',sorter: (a, b) => a.cpu_percent - b.cpu_percent,},
						{title: 'memory_percent',dataIndex: 'memory_percent', key: 'memory_percent',sorter: (a, b) => a.memory_percent - b.memory_percent,}, 
						{
	  title: 'read',
	  dataIndex: 'read',
	  key: 'read',
	  sorter: (a, b) => a.read - b.read,
	  //sorter: (a, b) => Number(a.read.split(' ')[0]) - Number(b.read.split(' ')[0]),
	//  width:"20%"
	}, {
	  title: 'write',
	  key: 'write',
	  dataIndex:'write',
	  sorter: (a, b) => a.write - b.write,
	  //sorter: (a, b) => Number(a.write.split(' ')[0]) - Number(b.write.split(' ')[0]),
	//  width:"20%"
	},{
	  title: 'cmdline',
	  key: 'cmdline',
	  //dataIndex:'cmdline',
	 // width:"20%",
    render: (item) => {
    	//console.log(text,item,"sdfsafsafas")
    	//let text_d = <span>sss</span>
    	return( <TextOverflow>
      <p style={{width: '100px'}}>{item.cmdline}</p>
    </TextOverflow>
    )}},{
	  title: 'graph',
	  key: 'graph',
	  render: (item) => {
    	//console.log(text,item,"sdfsafsafas")
    	let text_io = <span>io</span>
    	return( 
    		<div>
    			<Tooltip placement="top" title={text_io} >
        			{/*<a href="#" onClick={::this.process_io.call('io',item['id'])}><Icon type="area-chart"/></a>*/}
        			<a href="#" 
        			onClick={e=>{e.preventDefault();
        				let pid={'type':'io','pid':item['pid']}
        				this.setState({pid})
        				this.showModal();
    				}}
    				style={{marginRight:"20px"}}
        			>
        			<Icon type="area-chart"/>
        			</a>
      			</Tooltip>
      			<Tooltip placement="top" title="cpu_memory">
        			<a href="#" onClick={e=>{e.preventDefault();
        				let pid={'type':'cpu_men','pid':item['pid']}
        				this.setState({pid})
        				this.showModal()}}
        			><Icon type="area-chart" /></a>
      			</Tooltip>
    			
    		</div>
    )}}
	];


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
      				<Tables columns={columns_mem} dataSource={this.state.system_men} pagination={false} />
      			</div>
      			<div>
      				<span className="title_1">磁盘信息</span>
      				<Tables columns={columns} dataSource={this.state.system_disk} pagination={false} />
      			</div>
      		</Col>
        	</Row>
        	<div>
        		<div>
      				<span className="title_1">磁盘I0</span>
      				<Tables columns={columns_io} dataSource={this.state.process_io} pagination={false} />
      			</div>
        	</div>
        	 <div>
		        {/*<Button type="primary" onClick={::this.showModal}>Open a modal dialog</Button>*/}
		        <Modal title="进程状态" visible={this.state.visible}
		          onOk={::this.handleOk} onCancel={::this.handleCancel}
		          footer={false}
		          width="850"
		        >
		       		<Graph data_graph={this.state.data_graph} pid={this.state.pid} id={this.props.id}/>
        		</Modal>
     		 </div>
        </div>
    )
  }
}



export default Info