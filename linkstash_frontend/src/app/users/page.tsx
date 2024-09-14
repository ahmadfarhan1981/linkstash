"use client";

import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";


import { AuthenticatedSection, InputComponent, LinkStashDialog } from "@/components";
import { useAuthentication, useUsers } from "@/hooks";
import React, { useEffect, useState } from "react";
import { User } from "@/types";
import { EMPTY_FUNCTION, makeApiCall } from "@/scripts";
import { confirmAlert } from "react-confirm-alert";

export default function Home() {
  const { users, fetchUsers } = useUsers();
  const { AuthenticationState } = useAuthentication();
  useEffect(() => {
    fetchUsers({});
  }, [AuthenticationState.token, AuthenticationState.isLoggedIn]);

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteUserdModalOpen, setIsDeleteUserdModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const showPasswordChangeDialog = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordModalOpen(true);
  };


  const handleNewUserSubmit = (e: React.FormEvent)=>{
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const username = (form.username as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value

    makeApiCall(
      {
        endpoint: "/signup",
        body: {
                username: username,
                password: password
              },
        method: "POST",
        headers: {
                 Authorization: "Bearer ".concat(AuthenticationState.token),
               },
        successCallback: ()=>{ 
          setIsNewUserModalOpen(false);
          fetchUsers({});
        }
      }
    )

  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUser) {
      
      const form = e.currentTarget as HTMLFormElement;
      const newPasswordInput = form.newPassword as HTMLInputElement;
      
      handlePasswordChange(selectedUser.id, newPasswordInput.value)
      
    }
  };

  const ChangePasswordDialog = () => (
    <LinkStashDialog isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)}>
      <LinkStashDialog.Title>Change Password</LinkStashDialog.Title>
      <LinkStashDialog.Content>
        <form onSubmit={handlePasswordSubmit}>
            <InputComponent
              type="password"
              id="newPassword"
              name="newPassword"
              label={`New password for ${selectedUser?.username}`}
              labelAuto = {true}
              placeholder="New password"
              className="w-full p-2 border rounded"
              required
            />          
        </form>
        </LinkStashDialog.Content>
        <LinkStashDialog.Actions>
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(false)}
              className="px-4 py-2 mr-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: "hsl(305, 100%, 38%)" }}
            >
              Change Password
            </button>
          </LinkStashDialog.Actions>
    </LinkStashDialog>
  );

  const ConfirmDeleteDialog = ({ user }:{user:User|null}) => (

    <LinkStashDialog isOpen={isDeleteUserdModalOpen} onClose={() => setIsDeleteUserdModalOpen(false)}>
      <LinkStashDialog.Title>Change Password</LinkStashDialog.Title>
      <LinkStashDialog.Content>
        <form onSubmit={handlePasswordSubmit}>
            Aryou sure you want to delete {user?.username}
        </form>
        </LinkStashDialog.Content>
        <LinkStashDialog.Actions>
            <button
              type="button"
              
              className="px-4 py-2 mr-2 bg-gray-200 rounded"
              onClick={()=>{handleDeleteUser(user?.id)}}
            >
              Yes
            </button>
            <button
              type="submit"
              className="px-4 py-2 mr-2 bg-gray-200 rounded"
              onClick={() => setIsDeleteUserdModalOpen(false)}
            >
              No
            </button>
          </LinkStashDialog.Actions>
    </LinkStashDialog>
  );


  const NewUserDialog = () => (
    <LinkStashDialog isOpen={isNewUserModalOpen} onClose={() => setIsNewUserModalOpen(false)}>
      <LinkStashDialog.Title>New user</LinkStashDialog.Title>
      <LinkStashDialog.Content>
        <form onSubmit={handleNewUserSubmit}>
          <div className="mb-4">
          <div className="">                    
          <InputComponent
              type="text"
              id="username"
              name="username"
              label={`Username`}
              
              placeholder="New password"
              className="w-full p-2 border rounded"
              required
            />
            </div>
            <div className="">        
            <InputComponent
              type="password"
              id="password"
              name="password"
              label={`Password`}
              
              placeholder="New password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          </div>
          <LinkStashDialog.Actions>
            <button
              type="button"
              onClick={() => setIsNewUserModalOpen(false)}
              className="px-4 py-2 mr-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: "hsl(305, 100%, 38%)" }}
            >
              OK
            </button>
          </LinkStashDialog.Actions>
        </form>
      </LinkStashDialog.Content>
    </LinkStashDialog>
  )




  const handleDeleteUser =(userId:string)=>{
    // alert(userId)
    makeApiCall(
      { 
        endpoint: `/users/${userId}`,
        method: "DELETE",
        successCallback: ()=>{
          setIsDeleteUserdModalOpen(false)
          fetchUsers({});          
        },
        headers: {
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
      }
    )
    
    
  }

  const handlePasswordChange = (userId:string, newPassword:string) =>{
    makeApiCall(
      {
        endpoint: "/change-password",
        body: {
                userId: userId,
                newPassword: newPassword
              },
        method: "POST",
        headers: {
                 Authorization: "Bearer ".concat(AuthenticationState.token),
               },
        successCallback: ()=>{ setIsChangePasswordModalOpen(false)}
      }
    )
  }


  const confirmDelete= (userId:string)=>{
    const options = {
      title: 'Delete user?',
      message: 'Confirm delet user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteUser(userId)
        },
        {
          label: 'No',
          onClick: EMPTY_FUNCTION
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],  
    };
    
    confirmAlert(options);
  }

  return (
    <>    
      <AuthenticatedSection>
        <ConfirmDeleteDialog user={selectedUser}/>
        <NewUserDialog />
        <ChangePasswordDialog />
        <div>User list</div>
        {/* <progress value={75} max={100}></progress> */}
        <div className="w-full grid py-2"><button className="submit-button place-self-end " onClick={()=>setIsNewUserModalOpen(true)}>Add user</button></div>
        <Table
          aria-label="Users"
          className={"border-[1px] border-black border-solid w-full"}
        >
          <TableHeader className={"border-[1px] border-black bg-purple-100"}>
            <Column
              className={"justify-start justify-items-start w-7/12"}
              isRowHeader
            >
              Username
            </Column>
            <Column>Actions</Column>
          </TableHeader>
  
          <TableBody>
            {users.map((user: User) => (
              <Row
                key={user.id}
                className={"even:bg-slate-200 odd:bg-white text-linkstashPurple"}
              >
                <Cell className={""}>
                  <abbr title="This is a username">{user.username}</abbr>
                </Cell>
                <Cell className={""}>
                  <details>
                    <summary>Actions</summary>
                    <div className="*:m-1  *:rounded-lg ">
                      <button
                        // className=" submit-button bg-[hsl(305,100%,38%)] hover:bg-[hsl(305,100%,43%)] text-white border-black border-[1px]  hover:scale-110"
                        className="small-button bg-primaryBackground drop-shadow text-primaryText border-black border-[1px]  hover:scale-105 "
                        onClick={() => showPasswordChangeDialog(user)}
                      >
                        Change password
                      </button>
                      <button
                        // className=" submit-button bg-[hsl(305,100%,38%)] hover:bg-[hsl(305,100%,43%)] text-white border-black border-[1px]  hover:scale-110"
                        className="small-button bg-primaryBackground text-primaryText border-black border-[1px] drop-shadow hover:scale-105"
                        onClick={() => showPasswordChangeDialog(user)}
                      >
                        Permissions
                      </button>
                      <button onClick={
                         (e)=>{
                          e.preventDefault();                           
                          setSelectedUser(user);
                          setIsDeleteUserdModalOpen(true)
                        }
                        } className="small-button bg-red-500 drop-shadow hover:bg-red-600 text-[FFFFFF]  hover:scale-105 border-black border-[1px]">
                        Delete user
                      </button>
                    </div>
                  </details>                  
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </AuthenticatedSection>
    </>
  );
}
