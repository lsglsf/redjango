import React, { Component } from 'react'
import { Nav, NavItem ,IndexNavItem } from 'bfd/Nav'
import { Layout, LayoutSidebar, LayoutContent } from 'public/Layout'
import './index.less'

class Body extends Component {

  constructor() {
    super()
    this.state = {
      open: false
    }
  }

  toggle(open) {
    this.setState({ open })
  }

  render() {
    const { open } = this.state
    const { children } = this.props
    return (
      <div className="body">
        <Layout open={open} onToggle={open => this.toggle(open)}>
          <LayoutSidebar>
            <Nav href="/" onItemClick={() => this.toggle(false)}>
              <IndexNavItem herf="overview/todos" icon="th" title="概况" />
              <NavItem href="#" icon="th" title="主机信息" >
                <NavItem href="Cmdb" icon="th" title="资产管理" >
                  <NavItem href="Cmdb/group" title="资产组" />
                  <NavItem href="Cmdb/asset" title="主机资产"/>
                  <NavItem href="Cmdb/idc" title="机房" />
                </NavItem>
                <NavItem href="Service" icon="th" title="服务管理" >
                  <NavItem href="Service/register" title="服务注册" />
                </NavItem>   
              </NavItem>
            </Nav>
          </LayoutSidebar>
          <LayoutContent>{children}</LayoutContent>
        </Layout>
      </div>
    )
  }
}

export default Body