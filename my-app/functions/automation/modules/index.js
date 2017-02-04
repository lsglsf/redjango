import React, { Component } from 'react'
import { Nav, NavItem ,IndexNavItem } from 'bfd/Nav'
import { Layout, LayoutSidebar, LayoutContent } from 'public/Layout'
import './index.less'
import { Collapse } from 'antd';
import { Row, Col } from 'antd';
const Panel = Collapse.Panel;

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
    const text = `
	  A dog is a type of domesticated animal.
	  Known for its loyalty and faithfulness,
	  it can be found as a welcome guest in many households across the world.
	`;
    return (
      <div className="body">
      	<Row>
      		<Col span={12}>
	      	  <Collapse defaultActiveKey={['1']} onChange={::this.callback}>
			    <Panel header="This is panel header 1" key="1">
			      <p>{text}</p>
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