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

class Put_group extends Component{
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
        type: 'group_update',
        newarray:[],
      },
      sourceData: [],
      targetData: [],
      newData:[],
      record_source:[],
    }
  }

  componentWillMount(){
    let _this=this
    let id = this.props.item['id']
    let formData=this.state.formData
    let newarray = new Array()
    formData['id']=this.props.item['id']
    formData['name']=this.props.item['name']
    formData['desc']=this.props.item['comment']
  //  let newData = new Array()
  	
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=assert_host&id='+id,
      success(data) {
        let newData=(data['data']['tdata'])
        _this.setState({sourceData:data['data']['sdata'],targetData:data['data']['tdata'],newData})
        for (var i in data['data']['tdata']){
          newarray.push(data['data']['tdata'][i]['id'])
        }
        formData['newarray']=newarray
      }
    })
    this.setState({formData})
  }


  handleSuccess(res) {
    this.handleclose()
    this.props.getdata()
    if (res['status']==true){
      message.success('更新成功!')
    }else{
      message.danger(res['status'])
    }
  }

  handleChange(sourceData, targetData) {
    let newarray = new Array()
    let formData = this.state.formData
    for (var i in targetData){
    	newarray.push(targetData[i]['id'])
    }
    formData['newarray']=newarray
    this.setState({
      sourceData: sourceData,
      targetData: targetData,
      formData,
    })
  }

  test(a,b){
    var array=[];
    a.forEach(function(item){
    	console.log(item)
    	console.log(b,'b')
    	console.log(b.indexOf(item))
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
   // console.log(this.state.sourceData,this.state.targetData,'111111______')
    return (
      <Form
        action="/v1/cmdb/list/grouppost/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
        <FormItem label="主机组名" required name="name" help="5个字符以内">
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
        <FormItem label="备注" name="desc" help="500个字符以内">
          <FormTextarea />
        </FormItem>
        <FormSubmit>确定</FormSubmit>
        <Button onClick={::this.handleclose}>取消</Button>
      </Form>
    )
  }
}

export {Put_group}