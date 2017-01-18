import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import Button from 'bfd/Button'
import List from './List'
import './index.less'
import echarts3 from 'echarts'


class Todos extends Component {

  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      list: []
    }
  }

  handleListChange(type, value) {
    this.update(type, 'list', value)
  }

  componentDidMount(){
    var myChart = echarts3.init(document.getElementById('main'));
  myChart.setOption({
  title : {
        text: '项目主机数',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    color:['#8fc31f','#f35833','#00ccff','#ffcc00'],
    legend: {
        orient : 'vertical',
        x : 'left',
        data:['prd','uat','vip']
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
            data:[
                {value:335, name:'prd'},
                {value:310, name:'uat'},
                {value:234, name:'vip'},
            ]
        }
    ]
  }
  )}

  render() {
    const { update, state } = this
    const { text, list } = state
    return (
      <div className="todos">
        {/*<Input onChange={e => update('set', 'text', e.target.value)} />
        <Button onClick={() => update('push', 'list', text)}>添加</Button>*/}
        <List data={list} onChange={::this.handleListChange} />
        <div id="main" style={{height:'200px',width:'500px'}}></div>
      </div>
    )
  }
}

export default Todos