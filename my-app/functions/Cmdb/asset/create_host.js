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
import xhr from 'bfd/xhr'
import { MultipleSelect, Option as Options } from 'bfd/MultipleSelect'


class Delete_asset extends Component{
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
      detele_host:'',
    }
  }

  componentWillMount(){
    let formData=this.state.formData
    let delete_id=new Array()
    let detele_host=''
    for (let i in this.props.rows) {
      if (i==this.props.rows.length-1){
        delete_id.push(this.props.rows[i]['id'])
        detele_host = detele_host +'"'+ this.props.rows[i]['hostname']+'"'}else{
        delete_id.push(this.props.rows[i]['id'])
        detele_host = detele_host + '"'+this.props.rows[i]['hostname']+'"' + '、'
      }
    }
    formData['delete_id']=delete_id
    this.setState({detele_host,formData})
  }

  handleDateSelect(date) {
    this.update('set', 'formData.date', date)
  }

  handleCitySelect(selects) {
    this.update('set', 'formData.cities', selects)
  }

  handleSuccess(res) {
    this.handleclose()
    this.props.getdata()
    if (res['status']==true){
      message.success('删除成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleclose(){
    this.props.modal.close()
  }

  handleChange(sourceData, targetData) {
    let formData = this.state.formData
    this.setState({
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
        action="/v1/cmdb/list/assetdelete/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
      	<h6>删除的主机是{this.state.detele_host}</h6>
        <FormSubmit>保存</FormSubmit>
      </Form>
    )
  }
}


class Create_asset extends Component{
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
      group:'',
    }
  }


  componentWillMount(){
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=group_all',
      success(data) {
        console.log(data)
        _this.setState({group:data['data']})
      }
    })
  }

  handleDateSelect(date) {
    this.update('set', 'formData.date', date)
  }

  handleCitySelect(selects) {
    this.update('set', 'formData.cities', selects)
  }

  handleSuccess(res) {
    this.handleclose()
    this.props.getdata()
    if (res['status']==true){
      message.success('删除成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleclose(){
    this.props.modal.close()
  }

  handselect(values){
    //console.log('........values',values)
    let formData = this.state.formData
    formData['group'] = values
    this.setState({formData})
  }

  render() {
    const { formData } = this.state
    let nav = this.state.group ? Object.keys(this.state.group).map((item,str)=>{
      return (
        <Options key={item} value={this.state.group[item]['id']}>{this.state.group[item]['name']}</Options>
        )
    }):<span></span>
    return (
      <Form
        action="/v1/cmdb/list/assetpost/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
        <FormItem label="主机名" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="主机IP" required name="ip" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="其他IP" required name="other_ip" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="端口" required name="port" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="用户名" required name="username" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="密码" required name="password" help="5个字符以内">
          <FormInput type='password'/>
        </FormItem>
        {/*<FormItem label="所属主机组" name="group">
          <FormSelect>
            <Option>请选择</Option>
            {nav}
          </FormSelect>
        </FormItem>*/}
        <FormItem label="所属主机组" name="group">
          <MultipleSelect defaultValues={[]} onChange={::this.handselect}>
            {nav}
          </MultipleSelect>
        </FormItem>
        <FormItem label="系统类型" required name="sys_name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="系统版本号" required name="sys_version" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="主机类型" name="host_type">
          <FormSelect>
            <Option>请选择</Option>
            <Option value={1}>物理机</Option>
            <Option value={2}>虚拟机</Option>
            <Option value={3}>交换机</Option>
            <Option value={4}>路由器</Option>
            <Option value={5}>防火墙</Option>
            <Option value={6}>Docker</Option>
            <Option value={7}>其他</Option>
          </FormSelect>
        </FormItem>
        <FormItem label="运行环境" name="run_env">
          <FormSelect>
            <Option>请选择</Option>
            <Option value={1}>生产环境</Option>
            <Option value={2}>测试环境</Option>
          </FormSelect>
        </FormItem>
        <FormItem label="机器状态" name="host_status">
          <FormSelect>
            <Option>请选择</Option>
            <Option value={1}>已使用</Option>
            <Option value={2}>未使用</Option>
            <Option value={3}>报废</Option>
          </FormSelect>
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
  	console.log(type)
    this.refs.modal.open()
    let title=this.handletitle()[type]
    let fun=this.handlefun()[type]
    this.setState({title,fun})
  }

  handletitle(){
  	return {
  		'create':'主机组基本信息',
  		'detele':'删除主机',
  	}
  }

  handlefun(){
  	return {
  		'create':<Create_asset getdata={::this.props.getdata} modal={this.refs.modal}/>,
  		'detele':<Delete_asset rows={this.props.rows} getdata={::this.props.getdata} modal={this.refs.modal}/>
  	}
  }

  render() {
    return (
      <div style={{'marginBottom':'15px'}}>
        <Button onClick={::this.handleOpen.bind(this,'create')} >添加主机</Button>
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