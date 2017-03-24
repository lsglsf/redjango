var Toolkit ={

	version_show(_this){
	let nav=this.state.path_list ? this.state.path_list.map((item,str)=>{
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
        <div key={str}>
          <span style={{height:'20px',lineHeight:'20px',color:color1}}>{item['path']}</span>
          <span style={{float:'right'}}>
          <select onChange={::this.handselect.bind(this,str)} >
            <option key={0} value={false}>同步</option>
            <option key={1} value={true}>删除</option>
          </select>
          </span>

        </div>
        )
    }):<span></span>
	}
	

}


export default Toolkit