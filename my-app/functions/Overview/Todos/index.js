import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import Button from 'bfd/Button'
import List from './List'
import './index.less'
import echarts3 from 'echarts'
import {Panel} from "react-bootstrap"
//import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from 'antd';
//import $ from jqure
import OPEN from '../../data_request/request.js'
import { Spin, Alert } from 'antd';
import { Card } from 'antd';
import Icon from 'bfd/Icon'

class Todos extends Component {

  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      list: [],
      graph_data:'',
      app_count:'',
      host_count:'',
      loading:true
    }
  }

  handleListChange(type, value) {
    this.update(type, 'list', value)
  }

  componentWillMount(){
    OPEN.home_count(this,(_this,data)=>{    
        console.log(data,'testxxx')
        this.setState({app_count:data['app_count'],host_count:data['host_count']})
    })
  }

  series_t(lineName,dataArr){
    let data_list=[]
    for (let i in dataArr){
        data_list.push(dataArr[i]['value'])
    }
    let obj = {
      type: 'line',
      itemStyle: {normal: {areaStyle: {type: 'default'}}},    
      name: lineName,
      data: data_list,
    }
    return obj
  }

  date_list(list){
    let date=[]
    for (let i in list){
        var newDate = new Date(list[i]['clock'] * 1000)
        date.push(newDate.toLocaleDateString().replace(/\//g, "-") + " " + newDate.toTimeString().substr(0, 8))
    }
    return date
  }

  componentDidMount(){
    OPEN.home_demo(this,(_this,data)=>{
        let graph = data['zabbix']['graph']['data']
        let host = data['host']
        let date = []
        let name = []
        let series=[]
        let host_data=[]
        let i = 0
        this.setState({loading:false})
        Object.keys(graph).map((keys,item)=>{
            name.push(keys)
            if (i == 0){
                i=i+1
                date=this.date_list(graph[keys])
            }
            let series_d=this.series_t(keys,graph[keys])
            console.log(series_d)
            series.push(series_d)
        })
        host.map((keys,item)=>{
            host_data.push(keys['name'])
        })
        console.log('test', host_data)
    var myChart = echarts3.init(document.getElementById('main'));
    var connectChart = echarts3.init(document.getElementById('connect'));
    myChart.setOption({
    title : {
        text: '主机分布',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
   // color:['#8fc31f','#f35833','#00ccff','#ffcc00'],
    color: [
        '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
        '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
    ],
    legend: {
        orient : 'vertical',
        x : 'left',
        data:host_data
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: false, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: false},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'主机数量',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:data['host']
        }
    ]
  })

    connectChart.setOption({
    title: {text: '连接数'},
    tooltip : {trigger: 'axis'},
    color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
            '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
            '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
            '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],
    legend: {data: name},
    toolbox: {feature: {saveAsImage: {}}},
    grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true},
    xAxis : [{type : 'category',boundaryGap : false,data : date}],
    yAxis : [{type : 'value'}],
    series : series})})

  var myChart = echarts3.init(document.getElementById('main'));
  var connectChart = echarts3.init(document.getElementById('connect'));
  myChart.setOption({
  title : {
        text: '主机分布',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
   // color:['#8fc31f','#f35833','#00ccff','#ffcc00'],
    legend: {
        orient : 'vertical',
        x : 'left',
        data:[]
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: false, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: false},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'主机数量',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[]
        }
    ]
  })

  connectChart.setOption({
    title: {
        text: '连接数'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:[]
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : []
    })
}


  render() {
    console.log(this.state.graph_data,"test11111111111")
    const { update, state } = this
    const { text, list } = state
    const title = (
      <h3>Panel title</h3>
    );
    return (
      <div className="todos">
        {/*<Input onChange={e => update('set', 'text', e.target.value)} />
        <Button onClick={() => update('push', 'list', text)}>添加</Button>*/}
        <div style={{height:'200px'}}>
            <Row gutter={16}>
              <Col span={6} style={{height:'131px'}}>
                  <Card title="主机数量" extra={<a href="#">More</a>} >
                    <Row>
                        <Col span={12} >
                            <Icon type="desktop" style={{fontSize:'82px'}}/> 
                        </Col>
                        <Col span={12}>
                            <div style={{fontSize:"40px"}}>{this.state.host_count}</div>
                            <div></div>
                        </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                  <Card title="应用数量" extra={<a href="#">More</a>} >
                    <Row>
                        <Col span={12} >
                            <Icon type="clone" style={{fontSize:'82px'}}/> 
                        </Col>
                        <Col span={12}>
                            <div style={{fontSize:"40px"}}>{this.state.app_count}</div>
                            <div></div>
                        </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                  <Card title="客户端在线数" extra={<a href="#">More</a>} >
                    <Row>
                        <Col span={12} >
                            <Icon type="refresh" style={{fontSize:'82px'}}/> 
                        </Col>
                        <Col span={12}>
                            <div style={{fontSize:"40px"}}>10</div>
                            <div></div>
                        </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                  <Card title="develop" extra={<a href="#">More</a>} >
                  </Card>
              </Col>
            </Row>
        </div>
        {/*
        <List data={list} onChange={::this.handleListChange} />*/}
        <div>
           <Col span={10} style={{height:'50px'}}>
                 <Spin spinning={this.state.loading} delay={500} >
                <div id="main" style={{height:'300px'}}></div>
                </Spin>
            </Col>
            <Col span={14} style={{height:'50px'}}>
                 <Spin spinning={this.state.loading} delay={500} >
                <div id="connect" style={{height:'300px'}}></div>
                </Spin>
            </Col>
        </div>
      </div>
    )
  }
}

export default Todos