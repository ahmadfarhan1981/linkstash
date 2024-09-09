"use client";

import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import { InputComponent, LinkStashDialog } from "@/components";
import { useAuthentication, useUsers } from "@/hooks";
import { useEffect, useState } from "react";
import { User } from "@/types";

export default function Home() {
  const { users, fetchUsers } = useUsers();
  const { AuthenticationState } = useAuthentication();
  useEffect(() => {
    fetchUsers({});
  }, [AuthenticationState.token, AuthenticationState.isLoggedIn]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handlePasswordChange = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUser) {
      const form = e.currentTarget as HTMLFormElement;
      const newPasswordInput = form.newPassword as HTMLInputElement;

      console.log(`${selectedUser.id} to ${newPasswordInput.value}`);
      // In a real application, you would send this to your backend
      setIsModalOpen(false);
    }
  };

  const ChangePasswordDialog = () => (
    <LinkStashDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <LinkStashDialog.Title>Change Password</LinkStashDialog.Title>
      <LinkStashDialog.Content>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2">
              New Password for {selectedUser?.username}:
            </label>
            <InputComponent
              type="password"
              id="newPassword"
              name="newPassword"
              label={"New"}
              placeholder="New password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <LinkStashDialog.Actions>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
        </form>
      </LinkStashDialog.Content>
    </LinkStashDialog>
  );
  return (
    <>
      <ChangePasswordDialog />
      <div>User list</div>
      <progress value={75} max={100}></progress>
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
                  <div className="*:m-1  *:rounded-lg ">
                    <button
                      className="submit-button bg-primaryBackground text-primaryText border-black border-[1px]  hover:scale-110"
                      onClick={() => handlePasswordChange(user)}
                    >
                      Change
                    </button>
                    <button
                      className=" submit-button bg-[hsl(305,100%,38%)] hover:bg-[hsl(305,100%,43%)] text-white border-black border-[1px] drop-shadow hover:scale-110"
                      onClick={() => handlePasswordChange(user)}
                    >
                      Permissions
                    </button>
                    <button className="submit-button bg-red-500 hover:bg-red-600 text-[FFFFFF]  hover:scale-110">
                      Delete user
                    </button>
                  </div>
                </details>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
