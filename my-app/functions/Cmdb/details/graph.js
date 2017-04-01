import React, { Component } from 'react'
import update from 'react-update'
import Input from 'bfd/Input'
import Button from 'bfd/Button'
import './index.less'
import echarts3 from 'echarts'
import { Row, Col } from 'antd';
import OPEN from '../../data_request/request.js'
import { Spin, Alert } from 'antd';
import { Card } from 'antd';
import Icon from 'bfd/Icon'
import message from 'bfd/message'

class Graph extends Component {

  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      list: [],
      graph_data:'',
      app_count:'',
      host_count:'',
      loading:true,
      unit_u:'B/s'
    }
  }

  componentWillMount(){
  }


  unit(unit){
    let unit_data = "B/S"
    switch (unit){
        case 'K':
            unit_data = "KB/S"
        case 'M':
            unit_data = "MB/S"
        case 'G':
            unit_data = "GB/S"
        case 'T':
            unit_data = "TB/S"
    }
    return unit_data
  }

  unit_data(s,t){
   let unit={'B/s':0,'K/s':1,'M/s':2,'G/s':3,'T/s':4}
    if (unit[s] < unit[t] ){
        return t
    }else{
        return s
    }
  }

  unit_s(s,t){
    let unit={'B/s':0,'K/s':1,'M/s':2,'G/s':3,'T/s':4}
    let i = (unit[t]-unit[s])*1000
    return i
  }

  series_t(lineName,dataArr){
    let dataArr_r = dataArr
    let data_list=[]
    let unit_u=this.state.unit_u
    for (let i in dataArr_r){
        data_list.push(dataArr_r[i])
       // data_list.push(dataArr[i].split(' ')[0])    
       // console.log(dataArr_r[i].split(' ')[1])        
       // unit_u = this.unit_data(unit_u,dataArr_r[i].split(' ')[1])
       // this.setState({unit_u})
    }
    /*
    for (let i in dataArr_r){
        let unit_i = this.unit_s(dataArr_r[i].split(' ')[1],unit_u)
        //console.log(unit_i,"testsss")
        if (unit_i !== 0){
            data_list.push(Number(dataArr_r[i].split(' ')[0])/unit_i) 
            console.log(Number(dataArr_r[i].split(' ')[0])/unit_i,dataArr_r[i],dataArr_r[i].split(' ')[0],'1111111111111')
        }else{
            data_list.push(dataArr_r[i].split(' ')[0]) 
        }
    }*/
    //console.log(data_list,"111111111111111")
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
        var newDate = new Date(i * 1000)
        date.push(newDate.toLocaleDateString().replace(/\//g, "-") + " " + newDate.toTimeString().substr(0, 8))
    }
    return date
  }

  componentWillReceiveProps(nextProps){
  if (nextProps.pid !== this.props.pid){
    this.setState({loading:true})
    this.graph_get(nextProps.pid)
  }
}
 unitConversion( oriValue,base,unitArr,significantFractionBit ){
    let value = oriValue
    let unitIndex = 0
    while (1){
      if ( value < base ){     // 如果当前值小于base，则说明无需再进行进制转换
        break
      }
      if ( unitIndex >= unitArr.length-1 ){       // 如果发现提供的单位不够，则亦不会继续转换下去
        break
      }
      
      value = value / base
      unitIndex += 1
    }
    if (significantFractionBit){
      value = value.toFixed( significantFractionBit )
    }
    return this.formatString( '{value} {unit}',{ 'value':value,'unit':unitArr[unitIndex] } )
  }


    formatString( templateStr,formatInfoDict ) {
      let result = templateStr
      for (let k in formatInfoDict){
        let v = formatInfoDict[k]
        if (undefined != v){
          result = this.replaceAll( result,"\\{"+k+"\\}", v);
        }
      }
      return result
    }

    replaceAll( templateStr,exp,newStr ) {
      return templateStr.replace( new RegExp(exp, "gm"), newStr )
    }


    Io_comput(value,index){
      let unitArr=index
      let unit_i=1000
      return this.unitConversion( value,unit_i,unitArr,0 )
    }
  

  graph_get(pid){
    let unitArr = ''
    let title=''
    if (pid['type']==="io"){
        unitArr=['B','K','M','G','T','P']
        title = '进程IO'
    }else if (pid['type']==="cpu_men") {
        unitArr = ['%']
        title = '进程CPU 内存'
    }

    let  Io_y = (value,index) => {
      //let unitArr=['B','K','M','G','T','P']
      let unit_i=1000
      return this.unitConversion( value,unit_i,unitArr,0 )
    }


    let Io_x=(value,index)=>{
        //console.log('test1','test2',value,index)
        let date_name=''
        let data=''
        let _this=this
        value.map((key,itms)=>{
            date_name=key.name+'<br/>'
           data=data+key.seriesName + ' : ' +this.Io_comput(key.value,unitArr)+'<br/>'
           return data
        })
        data=date_name+data
        return data
    }

    OPEN.system_graph(this,this.props.id,pid['type'],pid['pid'],(_this,data)=>{
                        let date = []
                        let name = []
                        let series=[]
                        let i_count = 0

                        //console.log(data,"testdataa")
                        //this.setState({data_graph:data})
                         Object.keys(data).map((keys,itms)=>{
                            //console.log(keys,itms)
                            if (i_count == 0){
                                i_count=i_count+1
                                date=this.date_list(data[keys])
                            }
                            name.push(keys)
                            series.push(this.series_t(keys,data[keys]))
                            
                         })
                        if (date.length >0){
                          this.setState({loading:false})
 
                        var connectChart = echarts3.init(document.getElementById('connect'));
                        connectChart.setOption({
                            title: {text: title},
                            tooltip : {trigger: 'axis',formatter:Io_x},
                            color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
                                    '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
                                    '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
                                    '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],
                            legend: {data: name},
                            toolbox: {feature: {saveAsImage: {}}},
                            grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true},
                            xAxis : [{type : 'category',boundaryGap : false,data : date}],
                            //yAxis : [{type : 'value',name:this.state.unit_u}],
                          'yAxis':{
                            'axisLabel':{
                              'show':true,
                              'formatter':Io_y
                            }
                          },
                            series : series})
                      }else{
                        message.danger('未获取到动态数据')
                      }
                    })
                  
  }

  componentDidMount(){
   // console.log(this.props.pid,"pid...........")
   this.graph_get(this.props.pid)
  var connectChart = echarts3.init(document.getElementById('connect'));
  connectChart.setOption({
    title: {
        text: 'null'
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
    'yAxis':{
        'axisLabel':{
          'show':true,
          'formatter':[]
        }
      },
    
    series : []
    })
}


  render() {
   // console.log(this.state.graph_data,"test11111111111")
    const { update, state } = this
    const { text, list } = state
    const title = (
      <h3>Panel title</h3>
    );
    return (
      <div >
        <div>
            <Spin spinning={this.state.loading} delay={500} >
                <div id="connect" style={{height:'500px',"width":"800px"}}></div>
            </Spin>

        </div>
      </div>
    )
  }
}

export default Graph