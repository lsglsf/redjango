//import Button from 'bfd/Button'
import React, { Component } from 'react'
import './index.less'
import update from 'react-update'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import Transfer from 'bfd/Transfer'
import Terminal from 'xterm'
import xterm from 'xterm'
//import "../../../node_modules/xterm/dist/xterm.css"
import OPEN from '../../data_request/request.js'
import { Modal, Button } from 'antd'
import Icon from 'bfd/Icon'
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;


class VNC extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      ws:false,
    }
  }

  data_ens(data){
    let data_r = {"tp":"client","data":data}
    return JSON.stringify(data_r)
  }

  componentDidMount(){
    //let term = new Terminal({tabStopWidth:100,scrollback:100,cols:120,rows:50, screenKeys: false, useStyle:true,cursorBlink: true})
    let term = new xterm({cols:120,rows:35,cursorBlink: true})
    var shellprompt = '$ ';
    let _this=this

    term.prompt = function (test) {
      //term.write('\r\n' + shellprompt);
      term.write(test)
    };
    let data={'tp':'init','id':this.props.host_id}
    OPEN.vnc_host(data,(ws,evt)=>{
      term.prompt(evt.data)
      if (_this.state.ws == false){
      	let ws_list=_this.props.ws_list
      	ws_list.push(ws)
      	_this.props._this.setState({ws_list})
        _this.setState({ws})
      }
    })

    term.on('key', function (key, ev) {
        let data_obj= _this.data_ens(key)
        _this.state.ws.send(data_obj)

    });

    term.on('paste', function (data, ev) {
        //term.write(data);
    });
    let terminal = 'terminal'+this.props.panes_id
    term.open(document.getElementById(terminal),{focus:false});
  }

  render() {
  	let terminal_vnc='terminal'+this.props.panes_id
    return (
    	<div>
        	<div id={terminal_vnc}></div>
        </div>
    )
  }
}




class VNC_model extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      ws:false,
      visible:false,
    }
  }

  data_ens(data){
    let data_r = {"tp":"client","data":data}
    return JSON.stringify(data_r)
  }

  handletest(item, event){
    this.refs.test111.open()
    //this.test1()
  }

  test1(){
    let term = new Terminal({tabStopWidth:1000,scrollback:1000,cols:1000,rows:35, screenKeys: false, useStyle:true})
    var shellprompt = '$ ';
    let _this=this

    term.prompt = function (test) {
      //term.write('\r\n' + shellprompt);
      term.write(test)
    };
    let data={'tp':'init'}
    OPEN.vnc_host(data,(ws,evt)=>{
      term.prompt(evt.data)
      if (_this.state.ws == false){
      	let ws_list=_this.props.ws_list
      	ws_list.push(ws)
      	_this.props._this.setState({ws_list})
        _this.setState({ws})
      }
    })

    term.on('key', function (key, ev) {
        //console.log(key,'testxxx')
        //console.log(_this.data_ens(key))
        let data_obj= _this.data_ens(key)
        _this.state.ws.send(data_obj)

    });

    term.on('paste', function (data, ev) {
        //term.write(data);
    });

    term.open(document.getElementById('terminal'));
  }

  showModal(){
  	//this.test1()
    this.setState({visible: true})
    
  }

  handleOk (e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel(e){
    console.log(e);
    this.setState({
      visible: false,
    });
  }


  render() {

    return (
    	<a herf="#" style={{marginLeft:"10px"}} onClick={::this.showModal}><Icon type="desktop" />
	        <Modal
	          title="Basic Modal"
	          visible={this.state.visible}
	          onOk={::this.handleOk}
	          onCancel={::this.handleCancel}
	          width={'1000px'}
	        >
	        	{/*<VNC host_id={this.props.host_id}/>*/}
	        	<VNC_Tabl host_id={this.props.host_id}/>
	        </Modal>
	     
        </a>
    )
  }
}



class VNC_Tabl extends Component{
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    let panes = [
      { title: 'Tab 1', content: <VNC host_id={this.props.host_id}/>, key: '1' },
     // { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
    ];
    this.state = {
      activeKey: panes[0].key,
      panes:[{ title: 'Tab 1', content: <VNC host_id={this.props.host_id}/>, key: '1' }],
    };
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
    let panes_id=this.props.host_id+activeKey
    panes.push({ title: 'New Tab', content: <VNC host_id={this.props.host_id} panes_id={panes_id}/>, key: activeKey });
    this.setState({ panes, activeKey });
  }
  remove(targetKey){
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  }
  render() {
  	console.log(this.state.panes)
    return (
      <div style={{height:'500px'}}>
        <div style={{ marginBottom: 16 }}>
         <Button onClick={::this.add}>ADD</Button>
        </div>
        <Tabs
          hideAdd
          onChange={::this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={::this.onEdit}
          height='500px'
        >
          {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
        </Tabs>
      </div>
    );
  }
}





export  {VNC,VNC_model,VNC_Tabl}