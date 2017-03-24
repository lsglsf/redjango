import React, { Component } from 'react'
import { Nav, NavItem ,IndexNavItem } from 'bfd/Nav'
import { Layout, LayoutSidebar, LayoutContent } from 'public/Layout'
import './index.less'
import { Collapse } from 'antd';
import { Row, Col } from 'antd';
import Button from 'bfd/Button'
const Panel = Collapse.Panel;


class  Show_model extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
  }

  toggle(open) {
    this.setState({ open })
  }

  callback(key) {
  	console.log(key);
  }

  render() {
    const { open } = this.state
    const { children } = this.props
    return (
      <div >
      	<Row>
      		<Col span={12}>
      			<span>名称:</span><span>mysql</span>
      		</Col>
     		<Col span={12}>
     			<span>已安装:</span><span>aaa</span>
     		</Col>
    	</Row>
    	<Row>
      		<Col span={12}>
      			<span>创建时间:</span><span>2017-2-8 18:00:00</span>
      		</Col>
     		<Col span={12}>
     			<span>修改时间:</span><span>2017-2-8 19:00:00</span>
     		</Col>
    	</Row>
    	<Row>
      		<Col span={12}>
      		</Col>
     		<Col span={12}>
     			<div style={{textAlign:'right'}}><Button>安装</Button><Button>删除</Button></div>
     		</Col>
    	</Row>
      </div>
    )
  }
}


class Modules extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
  }

  toggle(open) {
    this.setState({ open })
  }

  callback(key) {
  	console.log(key);
  }

  render() {
    const { open } = this.state
    const { children } = this.props
    const text =`
		<div>
			<span>创建时间:</span><span>2017-11-1</span>
		</div>`
	;
    return (
      <div >
      	<div style={{marginBottom:'10px'}}><Button>同步模块</Button></div>
      	<Row>
      		<Col span={12}>
	      	  <Collapse defaultActiveKey={['1']} onChange={::this.callback}>
			    <Panel header="mysql" key="1">
			      <Show_model/>
			    </Panel>
			    <Panel header="This is panel header 2" key="2">
			      <p>{text}</p>
			    </Panel>
			    <Panel header="This is panel header 3" key="3">
			      <p>{text}</p>
			    </Panel>
			  </Collapse>
      		</Col>
     		<Col span={12}>
     			<div>
     				<div>
     				<h1>详情</h1>
     				</div>
     			</div>
     		</Col>
    	</Row>

      </div>
    )
  }
}

export default Modules