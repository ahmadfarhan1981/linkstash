"use client";

import { ApiCallOptions, User } from "@/types";
import { AuthenticatedSection, ConfirmActionButton, InputComponent, LinkStashDialog, UserTableRow } from "@/components";
import {
  Column,
  Table,
  TableBody,
  TableHeader
} from "react-aria-components";
import React, { useEffect, useState } from "react";
import { useAuthentication, useUsers } from "@/hooks";

import { makeApiCall } from "@/scripts";

export default function Home() {
  const { users, fetchUsers } = useUsers();
  const { AuthenticationState } = useAuthentication();
  useEffect(() => {
    fetchUsers({});
  }, [AuthenticationState.token, AuthenticationState.isLoggedIn]);

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteUserdModalOpen, setIsDeleteUserdModalOpen] = useState(false);
  const [isUserPermissionModalOpen, setIsUserPermissionModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const showPasswordChangeDialog = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordModalOpen(true);
  };

  const showDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserdModalOpen(true)
  };

  const showUserPermissionsDialog = (user: User) => {
    setSelectedUser(user);
    setIsUserPermissionModalOpen(true);
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
    setIsDeleteUserdModalOpen(false);
  };
  const handleUpdatePermissionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();        
    if (selectedUser) {      
      const form = e.currentTarget as HTMLFormElement;
      const isUserAdmin = form.isUserAdmin as HTMLInputElement;      
      
      const apiOptions:ApiCallOptions={
        endpoint: `/users/${selectedUser.id}/permissions`,
        body: {
                "isUserAdmin": isUserAdmin.checked
              },
        method: "PATCH",
        headers: {
                 Authorization: "Bearer ".concat(AuthenticationState.token),
               },
        successCallback: ()=>{ 
          setIsUserPermissionModalOpen(false);
          fetchUsers(apiOptions);
        }
      }
      makeApiCall(apiOptions)


      
    }
    setIsDeleteUserdModalOpen(false);
  };


  //TODO extract the various dialogs into components
  const ChangePasswordDialog = () => (
    <LinkStashDialog isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)}>
      <LinkStashDialog.Title>Change Password</LinkStashDialog.Title>
      <form onSubmit={handlePasswordSubmit}>
      <LinkStashDialog.Content>        
            <InputComponent
              type="password"
              id="newPassword"
              name="newPassword"
              minLength={3}
              label={`New password for ${selectedUser?.username}`}
              labelAuto = {true}
              placeholder="New password"
              className="w-full p-2 border rounded"
              required
            />                  
        </LinkStashDialog.Content>
        <LinkStashDialog.Actions>
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(false)}
              className="button mr-4 "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button accent-button"              
            >
              Change Password
            </button>
          </LinkStashDialog.Actions>
        </form>
    </LinkStashDialog>
  );

  const ConfirmDeleteDialog = ({ user }:{user:User|null}) => (
    <LinkStashDialog isOpen={isDeleteUserdModalOpen} onClose={() => setIsDeleteUserdModalOpen(false)}>
      <LinkStashDialog.Title>Change Password</LinkStashDialog.Title>
      <form action={(_data)=>{handleDeleteUser(user!.id)}}>
      <LinkStashDialog.Content>
        
            Aryou sure you want to delete {user?.username}
        
        </LinkStashDialog.Content>
        <LinkStashDialog.Actions>
          <ConfirmActionButton type="submit" className="mr-4">Yes</ConfirmActionButton>             
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-gray-200 rounded"              
              onClick={()=>{setIsDeleteUserdModalOpen(false)}}
            >
              No
            </button>
          </LinkStashDialog.Actions>
        </form>
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
              className="button mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button accent-button"              
            >
              OK
            </button>
          </LinkStashDialog.Actions>
        </form>
      </LinkStashDialog.Content>
    </LinkStashDialog>
  )

  const UserPermissionsDialog = () => (
    <LinkStashDialog
      isOpen={isUserPermissionModalOpen}
      onClose={() => setIsUserPermissionModalOpen(false)}
    >      
      <LinkStashDialog.Title>Set User Permissiopns</LinkStashDialog.Title>
      <LinkStashDialog.Content>        
        <form onSubmit={handleUpdatePermissionsSubmit}>
          <div className="mb-4">
            <div className="">
              <input type="checkbox" defaultChecked={selectedUser?.userPermissions?.isUserAdmin || false} className="w-4 h-4 rounded ring-accent focus:ring-1 focus:ring-accent-hover focus:checked:bg-accent-hover hover:checked:bg-accent-hover  checked:bg-accent " id="isUserAdmin" name="isUserAdmin" />
              <label className="ms-2" htmlFor="isUserAdmin">User admin</label>              
            </div>
          </div>
          <LinkStashDialog.Actions>
            <button
              type="button"
              onClick={() => setIsUserPermissionModalOpen(false)}
              className="button mr-4"
            >
              Cancel
            </button>
            <button type="submit" className="button accent-button">
              OK
            </button>
          </LinkStashDialog.Actions>
        </form>
      </LinkStashDialog.Content>
    </LinkStashDialog>
  );

  const handleDeleteUser =(userId:string)=>{    
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
  
  return (
    <>    
      <AuthenticatedSection>
        <ConfirmDeleteDialog user={selectedUser}/>
        <NewUserDialog />
        <ChangePasswordDialog />
        <UserPermissionsDialog />         
        <div>User list</div>          
        <div className="w-full grid py-2"><button className="button accent-button place-self-end " onClick={()=>setIsNewUserModalOpen(true)}>Add user</button></div>
       
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
               <UserTableRow
               key={user.id}
               user={user}
               showPasswordChangeDialog={showPasswordChangeDialog}
               showUserPermissionsDialog={showUserPermissionsDialog}
               showDeleteUserDialog={showDeleteUserDialog}
             />
            ))}
          </TableBody>
        </Table>
      </AuthenticatedSection>
    </>
  );
}
