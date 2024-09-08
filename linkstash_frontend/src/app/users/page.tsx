"use client";

import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import { useAuthentication, useUsers } from "@/hooks";
import { User } from "@/types";
import { useEffect } from "react";

export default function Home() {
  const { users, fetchUsers } = useUsers();
  const { AuthenticationState } = useAuthentication();
  useEffect(() => {
    fetchUsers({});
  }, [AuthenticationState.token, AuthenticationState.isLoggedIn]);

  return (
    <>
      <div>User list</div>

      <progress value={75} max={100}></progress>
      <Table
        aria-label="Files"
        selectionMode="multiple"
        className={"border-[1px] border-black border-solid w-full"}
      >
        <TableHeader className={"border-[1px] border-black"}>
          <Column className={"justify-start justify-items-start"} isRowHeader>
            Username
          </Column>
          <Column>id</Column>
          {/* <Column>Date Modified</Column> */}
        </TableHeader>

        <TableBody>
          {users.map((user: User) => (
            <Row
              key={user.id}
              className={"even:bg-slate-200 odd:bg-white text-linkstashPurple"}
            >
              <Cell className={""}>
                <details>
                  <summary>
                    <abbr title="This is a userid">{user.id}</abbr>
                  </summary>
                  moar user stuff
                </details>
              </Cell>
              <Cell className={"opacity-100 hover:opacity-80"}>
                <details>
                  <summary>change pass</summary>
                  <p>{user.username}</p>
                </details>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
