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

class Put_asset extends Component{
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
      group_list:[],
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
//    let group_list=[]
 //   for (var i in this.props.item['group_id']){
 //   	group_list.push(this.props.item['group_id'][i])
  //  }
    console.log(this.props.item)
    let formData=this.state.formData
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
    this.setState({group_list:this.props.item['group_id']})
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
      message.success('删除成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleclose(){
    this.props.modal.close()
  }
  
  render() {
    const { formData } = this.state
   //console.log(this.state.group_list,'............111')
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
        {/*<FormItem label="所属主机组" name="group">
          <FormSelect>
            <Option>请选择</Option>
            {nav}
          </FormSelect>
        </FormItem>*/}
        <FormItem label="所属主机组" name="group1">
		    <MultipleSelect defaultValues={this.state.group_list} onChange={values => console.log(values)}>
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


export {Put_asset}