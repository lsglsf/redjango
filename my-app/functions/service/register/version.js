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
import { Select, Option as Options } from 'bfd/Select'
import { Row, Col } from 'bfd/Layout'


class File_sync extends Component{
  constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
      formData: {
        brand: 0
      },
      detele_host:'',
      add_Path:false,
      path_list:[],
      path_dict:{},
      per_host:''
    }
  }

  componentWillMount(){
    /*let formData=this.state.formData
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
    this.setState({detele_host,formData})*/
    console.log(this.props.select_host,'sdfsfdsafsa')
    console.log(this.props.host,'11')
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

  test(test){
  //  console.log(test,'test1111111111')
  }

  add_path(){
    let add_Path='<FormItem label="添加目录" name="desc" help=""><FormTextarea style={{width:"400px",height:"150px"}} /></FormItem>'
    let path_list=new Array()
    if (this.state.add_Path==true){
      if (this.state.formData['desc']){
        for (var i in this.state.formData['desc'].split('\n')){
          let path_dict={}
          //console.log(this.state.formData['desc'].split('\n')[i].length,'iiiiiiii.1')
          if (this.state.formData['desc'].split('\n')[i].length > 1){
            path_dict['path']=this.state.formData['desc'].split('\n')[i]
            path_dict['status']=0
            path_dict['type']='none'
            //path_list.push(this.state.formData['desc'].split('\n')[i])
            path_list.push(path_dict)
          }
        }
        this.setState({path_list})
      }
      this.setState({add_Path:false})
    }else{

        this.setState({add_Path:true,path_list:[]})
    }
  }

  detection_path(){
    let path_list=this.state.path_list
    const _this = this
    xhr({
      type: 'POST',
      url: '/v1/service/list/file_dir/',
      data: {'path_list':path_list,'host':this.props.select_host,'per_host':this.state.per_host},
      success(data) {
        console.log(data)
        console.log(data['data'])
        _this.setState({path_list:data['data']})
      }
    })
  }

  handselect(var1,var2){
    //console.log(var1,var2,'1111111111')
    let path_list=this.state.path_list
    if (var2 == 1 ){
      console.log(path_list[var1])
      path_list[var1]['status']=var2
    }else{
      path_list[var1]['status']=0
    }
    this.setState({path_list})
  }

  pre_host(hostname){
    //console.log('1111',hostname)
    this.setState({per_host:hostname})
  }


  render() {
    const { formData } = this.state
    let nav=this.state.path_list ? this.state.path_list.map((item,str)=>{
      //console.log(item,str,'111111111')
    let color1='none'
    if (item['type']=='none'){
       color1='black'
    }else if (item['type']=='f') {
       color1='green'
    }else if (item['type']=='d') {
      color1='green'
    }else if (item['type']=='w') {
      color1 = 'yellow'
    }else{
      color1 = 'red'
    }
    return(
        <FormItem label="" name={str} key={str} labelWidth='0px'>
          <span style={{height:'20px',lineHeight:'20px',color:color1}}>{item['path']}</span>
          <FormSelect style={{left:'50px',float:'right'}} className="Select_heig" onChange={::this.handselect.bind(this,str)}>
            <Option >同步</Option>
            <Option value={1}>删除</Option>
          </FormSelect>
        </FormItem>
        )
    }):<span></span>
    let host=this.props.host? this.props.host.map((item,str)=>{
      return(
        <Options value={item}>{item}</Options>
        )
    }):<span></span>
    return (
    	<Form
        action="/v1/cmdb/list/groupdelete/"
        data={formData}
        type='GET'
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
      	<FormItem label="发布主机" required name="name" help="">
          <Select searchable onChange={::this.pre_host}>
            <Options>请选择</Options>
            {host}
          </Select>
          <span onClick={::this.add_path}>添加</span>
          <span onClick={::this.detection_path}>检测</span>
        </FormItem>
        {
          this.state.add_Path ?  <FormItem label="添加目录" name="desc" help=""><FormTextarea style={{width:"400px",height:"150px"}} onChange={::this.test} /></FormItem>: <div></div>
        }
        {nav}
      </Form>
    )
  }
}


class Version_update extends Component{
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
      select_host:[],
    }
  }

  componentWillMount(){
   /* this.setState({sourceData:this.props.host,record_source:this.props.host})
    let _this=this
    xhr({
      type: 'GET',
      url: '/v1/cmdb/list/groupget/?name=assert_all',
      success(data) {
        console.log(data['data'])
        _this.setState({sourceData:data['data']})

      }
    })*/
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

  handleSearch(label, keyValue) {
    return label.indexOf(keyValue) != -1;
  }

  handleclose(){
    this.props.modal.close()
  }

  host_select(var11){
    console.log('Selecthost',this.props.item)
    this.props._this.setState({select_host:var11})
  }

  render() {
    const { formData } = this.state
    let nav = this.props.item['host'] ? this.props.item['host'].map((item,str)=>{
      console.log(item,str)
      return (
          <Checkbox value={item} key={item}>{item}</Checkbox>
        )
    }):<span></span>
    return (
      <Form
        action="/v1/service/list/register/"
        data={formData}
        onChange={formData => this.update('set', { formData })}
        rules={this.rules}
        onSuccess={::this.handleSuccess}
      >
        <div ><span>请确认前置已经进行切换</span></div>
        <div className='init1'><span>请选择需要发布版本的机器</span></div>
        <CheckboxGroup block onChange={::this.host_select}>
          {nav}
        </CheckboxGroup>
      </Form>
    )
  }
}



class Base_version extends Component {
	constructor(props) {
    super()
    this.update = update.bind(this)
    this.state = {
    	title:'',
    	fun:'',
      current:0,
      select_host:[],
    }
  }

  handleOpen(type){
  	//console.log(type)
    this.refs.modal.open()
    let title=this.handletitle()[type]
    let fun=this.handlefun()[type]
    this.setState({title,fun,current:0})
  }

  handletitle(){
  	return {
  		'version':'版本更新',
  		'detele':'删除主机组',
  	}
  }

  handlefun(){
  	return {
  		'version':<Version_update item={this.props.item} _this={this}/>,
  		'detele':<File_sync rows={this.props.rows} modal={this.refs.modal} />
  	}
  }

  list(){
    return [{
      title: 'First',
      content: <Version_update item={this.props.item} _this={this} />,
    }, {
      title: 'Second',
      content: <File_sync select_host={this.state.select_host} host={this.props.host}/>,
    }, {
      title: 'Last',
      content: 'Last-content',
    }]
  }

  next() {
    const current = this.state.current + 1;
    //this.setState({ current });
    if (current < this.list().length){
     //console.log(this.list()[current]['title'])
     // console.log('222')
      this.setState({title:this.list()[current]['title'],current,fun:this.list()[current]['content']})
    }

  }

  prev() {
    const current = this.state.current - 1;
    if (current >= 0){
      console.log(this.list()[current]['title'])
      console.log('222')
      this.setState({title:this.list()[current]['title'],current,fun:this.list()[current]['content']})
    }
  }

  render() {
    console.log(this.props.item,'111')

    return (
      <div style={{'marginBottom':'15px',float:'left'}}>
       { /*<Button onClick={::this.handleOpen.bind(this,'create')} >添加服务</Button>*/}
        <a href = "javascript:void(0);" onClick={::this.handleOpen.bind(this,'version')}>发布版本</a>
        <Modal ref="modal" className="create_cmdb_group">
          <ModalHeader className="create_cmdb_group" >
            <h6>{this.state.title}</h6>
          </ModalHeader>
          <ModalBody className="create_cmdb_group">
            {this.state.fun}
          <div style={{marginTop:'20px'}}>
            <Button onClick={::this.prev}>上一步</Button>
            <Button style={{float:"right"}} onClick={::this.next}>下一步</Button>
          </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export {Base_version}