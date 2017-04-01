import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import Button from 'bfd/Button'
//import List from './List'
//import './index.less'
import echarts3 from 'echarts'
//import {Panel} from "react-bootstrap"
//import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from 'antd';
import { Tabs, TabList, Tab, TabPanel } from 'bfd/Tabs'
import Info from './host_info'



class List_host extends Component {

  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      list: [],
      id :''
    }
  }

  handleListChange(type, value) {
    this.update(type, 'list', value)
  }

  componentWillMount(){
    const id = this.props.params.id
    this.setState({id})
  }

  componentDidMount(){      
    }

   callback(key) {
  // console.log(key);
    }


  render() {
    const TabPane = Tabs.TabPane;
    return (
        <div>
            <h4>主机详情展示</h4>
            <Tabs>
              <TabList>
                <Tab>主机基本信息</Tab>
                {/*<Tab>监控数据</Tab>*/}
              </TabList>
              <TabPanel>
                <Info id={this.state.id}/>
              </TabPanel>
              <TabPanel></TabPanel>
            </Tabs>
        </div>
 
    )
  }
}

export default List_host