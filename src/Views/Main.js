import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { withApollo } from "react-apollo";
import ChatRoom from "../Components/ChatRoom";
import ChatRoomList from "../Components/ChatRoomList";

import { Layout, Menu, Icon, Button } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const { SubMenu } = Menu;
const USER_QUERY = gql`
  {
    users {
      id
      name
    }
  }
`;

function Main({ client }) {
  const [user, setUser] = useState(null);
  const [chatRoomId, setChatRoomId] = useState("");
  return (
    <div style={{ height: "100vh" }}>
      <Layout style={{ height: "100vh" }}>
        <Sider>
          <Console setChatRoomId={setChatRoomId} />
        </Sider>
        <Layout>
          <ChatRoom chatRoomId={chatRoomId} />
        </Layout>
      </Layout>
    </div>
  );
}

const Console = props => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Menu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
    >
      <Menu.Item key="1">
        <Icon type="pie-chart" />
        <span>Hello: {MyProfile()}</span>
      </Menu.Item>
      <SubMenu
        key="sub1"
        title={
          <span>
            <Icon type="mail" />
            <span>All Rooms</span>
          </span>
        }
      > 
        <ChatRoomList setChatRoomId={props.setChatRoomId} />
      </SubMenu>
    </Menu>
    // <div className="">
    //
    //   
    // </div>
  );
};

const MyProfile = () => {
  const MYUSER_QUERY = gql`
    query user($id: ID!) {
      user(where: { id: $id }) {
        id
        name
      }
    }
  `;
  const { data, error, loading } = useQuery(MYUSER_QUERY, {
    variables: { id: localStorage.getItem("userId") }
  });
  let name = "";
  if (loading) {
    name = "Loading ...";
  } else if (error) {
    name = "error";
  } else {
    name = data.user.name;
  }
  return (
    name
  );
};

export default withApollo(Main);
