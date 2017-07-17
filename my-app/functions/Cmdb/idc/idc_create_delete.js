import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import Button from 'bfd/Button'
import React, { Component } from 'react'
import './index.less'
import update from 'react-update'
import { Form, FormItem, FormSubmit, FormInput, FormSelect, Option, FormTextarea } from 'bfd/Form'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import Transfer from 'bfd/Transfer'
import Terminal from 'xterm'
import "../../../node_modules/xterm/dist/xterm.css"
import OPEN from '../../data_request/request.js'



class Delete_group extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.rules = {
      name(v) {
        if (!v) return '请填写用户群'
        if (v.length > 5) return '用户群名称不能超过5个字符'
      },
    }
    this.state = {
      formData: {
        brand: 0
      },
      ws:false,
    }
  }

  handleDateSelect(date) {
    this.update('set', 'formData.date', date)
  }

  handleCitySelect(selects) {
    this.update('set', 'formData.cities', selects)
  }

  handleSuccess(res) {
    console.log(res)
    message.success('操作成功！')
  }

  data_ens(data){
    let data_r = {"tp":"client","data":data}
    return JSON.stringify(data_r)
  }

  componentDidMount(){
    let term = new Terminal({cols: 200, rows: 35, screenKeys: false, useStyle:true})
    var shellprompt = '$ ';
    let _this=this

    term.prompt = function (test) {
      //term.write('\r\n' + shellprompt);
      term.write(test)
    };
    let data={'aa':'ttt','tp':'init'}
    OPEN.wssocket('ws://192.168.2.224:8080/v1/sshsocket/',data,(ws,evt)=>{

      //console.log(ws,evt)
      //term.write('\r\n'+evt.data+'$ ')
      term.prompt(evt.data)
      if (_this.state.ws == false){
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

  handleChange(sourceData, targetData) {
    let formData = this.state.formData
    formData['sourceData']=sourceData
    formData['targetData']=targetData
    this.setState({
      sourceData: sourceData,
      targetData: targetData,
      formData,
    })
  }

  handleSearch(label, keyValue) {
    return label.indexOf(keyValue) != -1;
  }

  render() {
    const { formData } = this.state
    return (
    	<Form
        action="/api/form"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
      	<h6>删除的组是</h6>
        <div style={{}} id="terminal"></div>
        <FormSubmit>保存</FormSubmit>
      </Form>
    )
  }
}


class Create_gruop extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.rules = {
      name(v) {
        if (!v) return '请填写用户群'
        if (v.length > 5) return '用户群名称不能超过5个字符'
      },
    }
    const sourceData = [
      {id: 1, label: "张三", description: '描述1'},
      {id: 2, label: "李四", description: '描述2'},
      {id: 3, label: "李五", description: '描述3'},
      {id: 4, label: "李六", description: '描述4'},
      {id: 5, label: "李七五", description: '描述5'},
      {id: 6, label: "李八", description: '描述6'},
      {id: 7, label: "李九四", description: '描述7'},
      {id: 8, label: "李十", description: '描述8'},
      {id: 9, label: "李时珍", description: '描述9'}
    ];
    const targetData = [
      {id: 10, label: "张三疯", description: '描述10'},
      {id: 11, label: "王二小", description: '描述11'}
    ];
    this.state = {
      formData: {
        brand: 0
      },
      sourceData: sourceData,
      targetData: targetData
    }
  }

  handleDateSelect(date) {
    this.update('set', 'formData.date', date)
  }

  handleCitySelect(selects) {
    this.update('set', 'formData.cities', selects)
  }

  handleSuccess(res) {
    console.log(res)
    message.success('操作成功！')
  }

  handleChange(sourceData, targetData) {
    let formData = this.state.formData
    formData['sourceData']=sourceData
    formData['targetData']=targetData
    this.setState({
      sourceData: sourceData,
      targetData: targetData,
      formData,
    })
  }

  handleSearch(label, keyValue) {
    return label.indexOf(keyValue) != -1;
  }

  render() {
    const { formData } = this.state
    return (
      <Form
        action="/v1/cmdb/list/groupput/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
        <FormItem label="机房名称" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="机房带宽" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="运营商" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="联系人" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="联系电话" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="机房地址" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="备注" name="desc" help="500个字符以内">
          <FormTextarea />
        </FormItem>
        <FormSubmit>确定</FormSubmit>
      </Form>
    )
  }
}



class CreateModal extends Component {
	constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
    	title:'',
    	fun:'',
    }
  }

  handleOpen(type){
  	//console.log(type)
    this.refs.modal.open()
    let title=this.handletitle()[type]
    let fun=this.handlefun()[type]
    this.setState({title,fun})
  }

  handletitle(){
  	return {
  		'create':'主机组基本信息',
  		'detele':'删除主机组',
  	}
  }

  handlefun(){
  	return {
  		'create':<Create_gruop/>,
  		'detele':<Delete_group/>
  	}
  }

  render() {
    return (
      <div style={{'marginBottom':'15px'}}>
        <Button onClick={::this.handleOpen.bind(this,'create')} >添加机房</Button>
        <Button onClick={::this.handleOpen.bind(this,'detele')} >删除所选</Button>
        <Modal ref="modal" className="create_cmdb_group">
          <ModalHeader className="create_cmdb_group" >
            <h6>{this.state.title}</h6>
          </ModalHeader>
          <ModalBody className="create_cmdb_group">
            {this.state.fun}
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export {CreateModal}