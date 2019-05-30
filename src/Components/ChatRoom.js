import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useSubscription, useMutation } from "react-apollo-hooks";
import { Layout, Input, Row, Col, Comment, Tooltip, List,Button, Radio, Icon  } from "antd";
import styled from "styled-components";
import moment from "moment";
const { Header, Footer, Sider, Content} = Layout;

const { TextArea } = Input;

const MESSAGES_IN_ROOM_QUERY = gql`
  query getMessages($id: ID!) {
    messagesInRoom(roomId: $id) {
      id
      text
      createdAt
      sentBy {
        id
        name
      }
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage($id: ID!) {
    newMessage(roomId: $id) {
      id
      text
      createdAt
      sentBy {
        id
        name
      }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation createMes($text: String!, $userId: ID!, $roomId: ID!){
    sentMessage(text: $text, userId: $userId, roomId: $roomId){
      id
      createdAt
      text
      sentBy {
        id

      }
    }
  }
`

const MyContent = styled(Content)`
  height: 525px;
  overflow-y: scroll;
`;
const ChatRoom = ({ chatRoomId }) => {
  return (
    <div>
      <Header>
        <h1 style={{ color: "white", marginBottom: '0px' }}>{chatRoomId}</h1>
      </Header>
      <MyContent>
        <ChatMessage chatRoomId={chatRoomId} />
        <NewMessage chatRoomId={chatRoomId} />
      </MyContent>
      <Footer>
        <InputMessage chatRoomId={chatRoomId} />
      </Footer>
    </div>
  );
};

const InputMessage = ({ chatRoomId }) => {
  const [text,setText] = useState('')
  const sendMessage = useMutation(CREATE_MESSAGE, {
    variables: { text, roomId: chatRoomId, userId: localStorage.getItem('userId')}, 
    optimisticResponse: {
      sentMessage:{
        createdAt: new Date(),
        id: "123",
        sentBy:{
          id: localStorage.getItem('userId'),
          __typename: "User"
        },
        text: 'hihi mock message',
        __typename: "Message"
      }
    },

    update: (client, mutationResult) => {
      const data = client.readQuery({
        query: MESSAGES_IN_ROOM_QUERY,
        variables: { id: chatRoomId }
      });
      const { sentMessage } = mutationResult.data;
      client.writeQuery({
        query: MESSAGES_IN_ROOM_QUERY,
        variables: { id: chatRoomId },
        data: {
          messagesInRoom: [sentMessage,...data.messagesInRoom ]
        }
      });
      
    }
  });
  return (
    <Row>
      <Col span={20}>
        <TextArea onChange={(e) => {
          setText(e.target.value)
        }}/>
      </Col>

      <Col span={4}>
        <Button type="primary" size={'large'} onClick={sendMessage} >
          Sent Message
        </Button>
      </Col>
    </Row>
  );
};

const NewMessage = ({ chatRoomId }) => {
  const { data, error, loading } = useSubscription(NEW_MESSAGE, {
    variables: { id: chatRoomId },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const data = client.readQuery({
        query: MESSAGES_IN_ROOM_QUERY,
        variables: { id: chatRoomId }
      });
      const { newMessage } = subscriptionData.data;
      let shouldUpdate = !(localStorage.getItem('userId') === newMessage.sentBy.id);
      console.log('subscribtion',newMessage.sentBy.id,localStorage.getItem('userId'));
      console.log('check',newMessage.id);
      let {messagesInRoom} = data
      if(shouldUpdate) messagesInRoom = [newMessage,...messagesInRoom]
      client.writeQuery({
        query: MESSAGES_IN_ROOM_QUERY,
        variables: { id: chatRoomId },
        data: {
          messagesInRoom
        }
      });
    }
  });
  if (loading) return <div />;
  if (error) return <div />;
  return <div />;
};
const ChatMessage = ({ chatRoomId }) => {
  const { data, error, loading } = useQuery(MESSAGES_IN_ROOM_QUERY, {
    variables: { id: chatRoomId }
  });
  if (loading) return <div>Load Messages ...</div>;
  if (error) return <div>error</div>;
  if( !data.messagesInRoom) return <div>earth</div>;
  const messages = data.messagesInRoom.map((message = {}) => {
    return {
      actions: [<span />],
      author: message.sentBy.name,
      avatar:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      content: <p>{message.text}</p>,
      datetime: (
        <Tooltip
          title={moment(message.createdAt)
            .subtract(1, "days")
            .format("YYYY-MM-DD HH:mm:ss")}
        >
          <span>
            {moment(message.createdAt)
              .subtract(1, "days")
              .fromNow()}
          </span>
        </Tooltip>
      )
    };
  });

  return (
    <List
      style={{ padding: "0px 10px" }}
      className="comment-list"
      header={`${messages.length} replies`}
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={item => (
        <li style={{ textAlign: "left" }}>
          <Comment
            author={item.author}
            avatar={item.avatar}
            content={item.content}
            datetime={item.datetime}
          />
        </li>
      )}
    />
  );
};

export default ChatRoom;
