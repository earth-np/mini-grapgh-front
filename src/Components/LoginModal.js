import React, { useState, useRef } from "react";
import gql from 'graphql-tag';
import { useMutation } from "react-apollo-hooks";

const SIGNUP_MUTATION = gql`
  mutation createUser($name: String! , $email: String! , $password: String! ){
    createUser(data:{email: $email, name: $name, password: $password}){
      id
    }
  }
`

const LoginModal = ({ setIsLogin }) => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const SignUp = useMutation(SIGNUP_MUTATION, {
    update: (proxy, mutationResult) => {
      /* your custom update logic */
      console.log(proxy,mutationResult);
      localStorage.setItem('userId',mutationResult.data.createUser.id)
      setIsLogin(true)
    },
    variables: {
      name: name,
      email: email,
      password: password
    },
  });
  return (
    <div>
      <div>
        <input type="text" placeholder="email" onChange={(e)=>{setEmail(e.target.value)}} />
        <input type="text" placeholder="password" onChange={(e)=>{setPassword(e.target.value)}} />
        <button onClick={() => setIsLogin(true)}>Login</button>
        <input type="text" placeholder="name" onChange={(e)=>{setName(e.target.value)}} />
        <button onClick={SignUp}>Sign up</button>
      </div>
      <div>
        sdfdsfds
      </div>
    </div>
  );
};

export default LoginModal;
