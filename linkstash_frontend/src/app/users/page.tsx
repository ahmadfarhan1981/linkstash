'use client'


import {Cell, Column, Row, Table, TableBody, TableHeader} from 'react-aria-components';
import {useAuthentication, useUsers} from '@/hooks'
import { User } from '@/types';
import { useEffect } from 'react';



  


export default function Home() {
  const {users, fetchUsers} = useUsers()
  const { AuthenticationState } = useAuthentication();
  useEffect(()=>{
    fetchUsers({})
  },[ AuthenticationState.token, AuthenticationState.isLoggedIn]);
       
    return(
      <>
    
    <div>User list</div>
        

<Table aria-label="Files" selectionMode="multiple" >
  <TableHeader >
    
    <Column isRowHeader>Username</Column>
    <Column>id</Column>
    {/* <Column>Date Modified</Column> */}
  </TableHeader>

  <TableBody>

  {users.map( (user:User) => (
          <Row key={user.id} >
            <Cell>{user.id}</Cell>
            <Cell>{user.username}</Cell>
          </Row>
        ))}

    
  </TableBody>
</Table>
    </>)
}