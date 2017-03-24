import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import Button from 'bfd/Button'
import React, { Component } from 'react'
import './create.less'
import update from 'react-update'
import { Form, FormItem, FormSubmit, FormInput, FormSelect, Option as Options, FormTextarea } from 'bfd/Form'
import DatePicker from 'bfd/DatePicker'
import Checkbox, { CheckboxGroup } from 'bfd/Checkbox'
import message from 'bfd/message'
import Transfer from 'bfd/Transfer'
import xhr from 'bfd/xhr'
import { Select,Menu, Dropdown, Icon} from 'antd';
const Option = Select.Option;


class Delete_group extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
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
        detele_host = detele_host +'"'+ this.props.rows[i]['name']+'"'}else{
        delete_id.push(this.props.rows[i]['id'])
        detele_host = detele_host + '"'+this.props.rows[i]['name']+'"' + '、'
      }
    }
    formData['delete_id']=delete_id
    this.setState({detele_host,formData})
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
    return (
    	<Form
        action="/v1/cmdb/list/groupdelete/"
        data={formData}
        type='GET'
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
      	<h6>删除的组是{this.state.detele_host}</h6>
        <FormSubmit>确定</FormSubmit>
        <Button onClick={::this.handleclose}>取消</Button>
      </Form>
    )
  }
}

/*
class Create_gruop extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.rules = {
      name(v) {
        if (!v) return '名称不能为空'
        if (v.length > 5) return '用户群名称不能超过5个字符'
      },
    }
    this.state = {
      formData: {
        brand: 0,
        type: 'group_create',
      },
      sourceData: [],
      targetData: [],
      newData:[],
      record_source:[],
    }
  }

  componentWillMount(){
    this.setState({sourceData:this.props.host,record_source:this.props.host})
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=assert_all',
      success(data) {
        console.log(data['data'])
        _this.setState({sourceData:data['data']})

      }
    })
  }


  handleSuccess(res) {
    this.handleclose()
    this.props.getdata()
    if (res['status']==true){
      message.success('创建成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleChange(sourceData, targetData) {
   // this.test(this.state.newData,sourceData)
    console.log(targetData)
    let formData = this.state.formData
    //formData['sourceData']=sourceData
    formData['targetData']=targetData
    this.setState({
      sourceData: sourceData,
      targetData: targetData,
      newData:targetData,
      formData,
    })
  }

  test(a,b){
    var array=[];
    a.forEach(function(item){
        if(b.indexOf(item)>-1) array.push(item);
    })
    return array;
  }

  handleSearch(label, keyValue) {
    return label.indexOf(keyValue) != -1;
  }

  handleclose(){
    this.props.modal.close()
  }

  render() {
    const { formData } = this.state
    return (
      <Form
        action="/v1/service/list/register/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
        <FormItem label="运行环境" required name="name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="服务名称" required name="service_name" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="服务命令" required name="service_restart" help="5个字符以内">
          <FormInput />
        </FormItem>
		<FormItem label="配置路径" required name="path_config" help="5个字符以内">
          <FormInput />
        </FormItem>
		<FormItem label="程序路径" required name="path_root" help="5个字符以内">
          <FormInput />
        </FormItem>
		<FormItem label="项目路径" required name="path_project" help="5个字符以内">
          <FormInput />
        </FormItem>
        <FormItem label="主机" name="cities" required>
  	      <Transfer 
  	        height={200} 
  	        title="已选主机" 
  	        sdata={this.state.sourceData} 
  	        tdata={this.state.targetData}
  	        onChange={::this.handleChange}
  	        onSearch={::this.handleSearch}
  	        render={item => `${item.label}-${item.description}`}
  	      />
        </FormItem>
        <FormItem label="描述" name="desc" help="500个字符以内">
          <FormTextarea />
        </FormItem>
        <FormSubmit>确定</FormSubmit>
        <Button onClick={::this.handleclose}>取消</Button>
      </Form>
    )
  }
}
*/

class Create_server extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.rules = {
      /*name(v) {
        console.log('vvvvvvvv',v)
        if (!v) return '名称不能为空'
        if (v.length > 5) return '用户群名称不能超过5个字符'
      },*/
    }
    this.state = {
      formData: {
        brand: 0,
        type: 'group_create',
      },
      host: [],
      targetData: [],
      newData:[],
      record_source:[],
    }
  }

  componentWillMount(){
   // this.setState({sourceData:this.props.host,record_source:this.props.host})
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=assert_all',
      success(data) {
        console.log(data['data'])
        _this.setState({host:data['data']})

      }
    })
  }


  handleSuccess(res) {
    this.handleclose()
   // this.props.getdata()
   for (let i in this.props.Table_list){
      this.props.callback_get(this.props.Table_list[i])
   }
    if (res['status']==true){
      message.success('创建成功！')
    }else{
      message.danger(res['status'])
    }
  }

  handleChange(sourceData, targetData) {
   // this.test(this.state.newData,sourceData)
    console.log(targetData)
    let formData = this.state.formData
    //formData['sourceData']=sourceData
    formData['targetData']=targetData
    this.setState({
      sourceData: sourceData,
      targetData: targetData,
      newData:targetData,
      formData,
    })
  }


  handleButtonClick(e) {
    message.info('Click on left button.');
    console.log('click left button', e);
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }




  handleclose(){
    this.props.modal.close()
  }

  handleChange(value) {
    console.log(`selected ${value}`);
    console.log(value,'sdfsaf')
    let formData = this.state.formData
    //formData['sourceData']=sourceData
    formData['targetData']=value
    this.setState({
      formData,
    })
 }

  render() {
    const { formData } = this.state
    const children = [];
    for (let i = 0; i< this.state.host.length; i++) {
      //console.log('iddd',this.state.host.length,i,this.state.host[i].description)
      children.push(<Option key={this.state.host[i].id}>{this.state.host[i].description}</Option>);
    }
    return (
      <Form
        action="/v1/service/list/register/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
       <FormItem label="主机" required name="name" help="选择主机">
          <Select
              multiple
              style={{ width: '30%' }}
              placeholder="host select"
              defaultValue={[]}
              onChange={::this.handleChange}
            >
              {children}
          </Select>
        </FormItem>
        <FormItem label="服务名称" required name="service_name" help="">
          <FormInput />
        </FormItem>
        <FormItem label="别名" required name="alias_name" help="相同程序安装不目录">
          <FormInput />
        </FormItem>
        <FormItem label="重启服务" required name="service_restart" help="">
          <FormInput />
        </FormItem>
        <FormItem label="配置路径" required name="path_config" help="">
          <FormInput />
        </FormItem>
        <FormItem label="程序路径" required name="path_root" help="">
          <FormInput />
        </FormItem>
        <FormItem label="项目路径" required name="path_project" help="">
          <FormInput />
        </FormItem>
        <FormItem label="日志路径" required name="log_path" help="">
          <FormInput />
        </FormItem>
        <FormItem label="描述" name="desc" help="500个字符以内">
          <FormTextarea />
        </FormItem>
        <FormSubmit>确定</FormSubmit>
        <Button onClick={::this.handleclose}>取消</Button>
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
  		'create':'添加服务',
  		'detele':'删除主机组',
  	}
  }

  handlefun(){
  	return {
  		'create':<Create_server host={this.props.host} modal={this.refs.modal} callback_get={::this.props.callback_get} Table_list={this.props.Table_list}/>,
  		'detele':<Delete_group rows={this.props.rows} modal={this.refs.modal} />
  	}
  }

  render() {
    return (
      <div style={{'marginBottom':'15px'}}>
        <Button onClick={::this.handleOpen.bind(this,'create')} >添加服务</Button>
        {/*<Button onClick={::this.handleOpen.bind(this,'detele')} >删除服务</Button>*/}
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