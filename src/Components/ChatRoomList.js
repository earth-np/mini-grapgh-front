import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import React from 'react';

import { Layout, Menu, Icon, Button } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const { SubMenu } = Menu;

const GET_ROOMS = gql`
  {
    rooms {
      id
      name
    }
  }
`


const ChatRoomList = ({setChatRoomId}) => {
  const { data, error, loading } = useQuery(GET_ROOMS);
  if (loading) return <Menu.Item className="ant-menu-item">Loading ...</Menu.Item>
  if (error) return <Menu.Item className="ant-menu-item">ERROR</Menu.Item>
  const selectRoom = (room) => {
    setChatRoomId(room.id)
  }
  console.log(data);
  return (
    <>
      {data.rooms.map(room => (
        <Menu.Item className="ant-menu-item" key={room.id} onClick={()=>{selectRoom(room)}} >{room.name}</Menu.Item>
      ))} 
      </>
  )

}

export default ChatRoomList;