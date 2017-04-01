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
import { Switch, Icon } from 'antd';
import OPEN from '../../data_request/request.js'

class Put_asset extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.rules = {
      name(v) {
        if (!v) return '不能为空'
        //if (v.length > 5) return '用户群名称不能超过5个字符'
      },
    }
    this.state = {
      formData: {
        brand: 0,
      },
      group:'',
      group_list:[],
      hosts_status:false,
      hosts_data: '',
      template_status:false,
      template_data:'',
      template_activation:[],
    }
  }

  componentWillMount(){
    let _this=this
    let hosts_status=false
    let template_activation=[]
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=group_all',
      success(data) {
        //console.log(data)
        _this.setState({group:data['data']})
      }
    })
    let formData=this.state.formData
    formData['id']=this.props.item['id']
    formData['name']=this.props.item['hostname']
    formData['ip']=this.props.item['ip']    
    formData['other_ip']=this.props.item['other_ip'] 
    formData['port']=this.props.item['port']
    formData['sys_name']=this.props.item['sys_name']
    formData['sys_version']=this.props.item['sys_version']
    formData['run_env']=this.props.item['run_env_id']
    formData['host_status']=this.props.item['host_status_id'] 
    formData['host_type']=this.props.item['host_type_id']
    formData['desc']=this.props.item['desc']
    formData['username']=this.props.item['username']
    //console.log(this.props.item['host_hostname'],"sdfsafsafsaf")
    if (this.props.item['host_hostname']){
      formData['test_host']=this.props.item['host_hostname']
      this.hosts_func(true)
    }
    if (this.props.item['template']){
      template_activation = Object.keys(this.props.item['template']).map((key,item)=>{return Number(key)})
      //console.log( Object.keys(this.props.item['template']).map((key,item)=>{return Number(key)}))
      this.template_func(true)
    }
    this.setState({group_list:this.props.item['group_id'],template_activation})
   // console.log(this.props.item['group_id'].toString())

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
      message.success('修改成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleclose(){
    this.props.modal.close()
  }

  hosts_func(evnet){
   // console.log(evnet,"evnet11111111")
   let formData = this.state.formData
   if(evnet){
     // formData['test_host']=this.props.item['host_hostname']
      if (this.props.item['host_hostname']){
      formData['test_host']=this.props.item['host_hostname']
      }
      this.setState({hosts_status:evnet,formData})
      OPEN.cmdb_all_list(this,'group_get',"hosts_all",this.Callback)
    }else{
      //formData['test_host']=''
      delete formData.test_host
      this.setState({hosts_status:evnet,formData})
    }
  }

  Callback(_this,data,status_data){
    _this.setState({hosts_data:data['data']})
  }
 

  handselect(values){
   // console.log('........values',values)
    let formData = this.state.formData
    formData['group_id'] = values
    this.setState({formData})
  }

  template_func(evnet){
    let formData=this.state.formData
    if (evnet){
      this.setState({template_status:evnet})
      OPEN.cmdb_all_list(this,'group_get',"template_all",(_this,data)=>{
      this.setState({template_data:data['data']})
    })}else{
      formData['template']=[]
      this.setState({template_status:evnet,formData}) 
    }

  }

  
  render() {
    //console.log(this.state.template_activation,"this.state.template_activation")
    const { formData } = this.state
    let nav = this.state.group ? Object.keys(this.state.group).map((item,str)=>{
      return (
        <Options key={item} value={this.state.group[item]['id']}>{this.state.group[item]['name']}</Options>
        )
    }):<span></span>
    let host_all = this.state.hosts_data ? Object.keys(this.state.hosts_data).map((item,str)=>{
    return (
      <Option key={item} value={this.state.hosts_data[item]['id']}>{this.state.hosts_data[item]['hostname']}</Option>
      )
    }):<span></span>
    let template_all = this.state.template_data ? Object.keys(this.state.template_data).map((item,str)=>{
      return (
        <Options key={item} value={this.state.template_data[item]['id']}>{this.state.template_data[item]['alias_name']?this.state.template_data[item]['service_name']+"-"+this.state.template_data[item]['alias_name']:this.state.template_data[item]['service_name']}</Options>
        )
    }):<span></span>
    return (
      <Form
        action="/v1/cmdb/list/assetupdate/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
        <FormItem label="主机名" required name="name" help="">
          <FormInput />
        </FormItem>
        <FormItem label="主机IP" required name="ip" help="">
          <FormInput />
        </FormItem>
        <FormItem label="其他IP" name="other_ip" help="">
          <FormInput />
        </FormItem>
        <FormItem label="端口" required name="port" help="">
          <FormInput />
        </FormItem>
        <FormItem label="用户名" required name="username" help="">
          <FormInput />
        </FormItem>
        <FormItem label="密码" required name="password" help="">
          <FormInput type='password'/>
        </FormItem>
        {/*<FormItem label="所属主机组" name="group">
          <FormSelect>
            <Option>请选择</Option>
            {nav}
          </FormSelect>
        </FormItem>*/}
        <FormItem label="所属主机组" name="group1">
		    <MultipleSelect defaultValues={this.state.group_list} onChange={::this.handselect}>
		      {nav}
		    </MultipleSelect>
        </FormItem>
        <FormItem label="预发布节点" name="test_host">
          { this.state.hosts_status ? 
          <FormSelect searchable defaultValues={[]} onChange={(values)=> {let formData = this.state.formData;formData['test_host'] = values;this.setState({formData})}} style={{marginRight:'10px'}}>
            <Option>请选择</Option>
            {host_all}
          </FormSelect>
          :<span></span>
          }
          <span><Switch  defaultChecked={this.state.hosts_status} checkedChildren={'开'} unCheckedChildren={'关'} onChange={::this.hosts_func} /></span>
        </FormItem>
        <FormItem label="选择应用" name="template">
          { this.state.template_status ?
          <MultipleSelect defaultValues={this.state.template_activation} onChange={(values)=> {let formData = this.state.formData;formData['template'] = values;this.setState({formData})}} style={{marginRight:'10px'}}>
            {template_all}
          </MultipleSelect>:<span></span>
        }
        <span><Switch defaultChecked={this.state.template_status} checkedChildren={'开'} unCheckedChildren={'关'} onChange={::this.template_func} /></span>
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


export {Put_asset}