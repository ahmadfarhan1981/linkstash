'use client'

import {
  Cell,
  Row,
} from "react-aria-components";

import { FaUserGear } from "react-icons/fa6";
import { User } from "@/types";

interface UserTableRowProps {
  user: User;
  showPasswordChangeDialog: (user: User) => void;
  showUserPermissionsDialog: (user: User) => void;
  showDeleteUserDialog: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  showPasswordChangeDialog,
  showUserPermissionsDialog,
  showDeleteUserDialog,
}) => {
  return (
    <Row className={"even:bg-slate-200 odd:bg-white text-accent"}>
      <Cell className={""}>
        <abbr title="This is a username">
          {user.username}
          {user.userPermissions.isUserAdmin && (
            <FaUserGear className="react-icons" />
          )}
        </abbr>
      </Cell>
      <Cell className={""}>
        <details>
          <summary>Actions</summary>
          <div className="*:m-1  *:rounded-lg">
            <button
              className="button small-button"
              onClick={(e) => {
                e.preventDefault();
                showPasswordChangeDialog(user);
              }}
            >
              Change password
            </button>
            <button
              className="button small-button"
              onClick={(e) => {
                e.preventDefault();
                showUserPermissionsDialog(user);
              }}
            >
              Permissions
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                showDeleteUserDialog(user);
              }}
              className="small-button-original bg-red-600 drop-shadow hover:bg-red-600 text-[FFFFFF] hover:scale-105 border-black border-[1px]"
            >
              Delete user
            </button>
          </div>
        </details>
      </Cell>
    </Row>
  );
};
