import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import React from 'react'
import { Link } from 'react-router-dom';
import './Sidebar.scss';
import { AiFillAppstore, AiOutlineBars, AiOutlineCode } from 'react-icons/ai';
import Logo from './Logo.png';
function Sidebar() {
  const handleCollapsed = () => {
    if(window.innerWidth <= 960){
      document.querySelector('.menu-sidebar').classList.add('collapsed');
    }
    else{
      document.querySelector('.menu-sidebar').classList.remove('collapsed');
    }
    
  }
  window.addEventListener('resize', handleCollapsed)
  return (
    <div className="sidebar-container">
      <ProSidebar className="menu-sidebar" >
        <div className="logo" style={{ marginTop: 200}}>
        </div>
        <Menu iconShape="circle" >
          <MenuItem icon={<AiOutlineCode />}>
            Dashboard
              <Link to='/admin/dashboard' />
          </MenuItem>
          <SubMenu title="General" icon={<AiFillAppstore />}>
            <MenuItem>
              Announcement
               <Link to="/admin/announcement" />
            </MenuItem>
            <MenuItem >
              User
              <Link to="/admin/user" />
            </MenuItem>
          </SubMenu>
          <SubMenu title="Problem" icon={<AiOutlineBars />}>
            <MenuItem >
              Problem List
              <Link to="/admin/problem" />
            </MenuItem>
            <MenuItem>
              Create Problem
              <Link to='/admin/problem/create' />
            </MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>

    </div>
  )
}

Sidebar.propTypes = {

}

export default Sidebar

