"use client";

import { CommonUserFormGroupProps } from "@/types/user";
import { FormGroup, Input, Label } from "reactstrap";

const CommonUserFormGroup = (props: CommonUserFormGroupProps) => {
  return (
    <FormGroup>
      <Label check>{props.title}</Label>
      <Input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value || props.defaultValue || ""}
        defaultValue={props.defaultValue}
        rows={props.row}
        onChange={props.onChange}
        name={props.name}
        readOnly={props.readOnly}
        disabled={props.disabled}
        tag={props.tag || "input"}
        invalid={props.invalid}
      />
    </FormGroup>
  );
};

export default CommonUserFormGroup;