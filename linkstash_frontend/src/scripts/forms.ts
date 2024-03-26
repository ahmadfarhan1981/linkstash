import { ChangeEvent, SetStateAction } from "react";

export function handleFormChange(
  event: ChangeEvent<HTMLInputElement>,
  setter: SetStateAction<any>
) {
  const { name, value } = event.target;
  setter((prevFormData: any) => ({ ...prevFormData, [name]: value }));
}
