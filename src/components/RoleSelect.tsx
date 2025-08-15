import { Radio, RadioGroupField } from "@aws-amplify/ui-react";

const RoleSelect = () => {
  return (
    <RadioGroupField name="custom:role" legend="I am a real">
      <Radio value="patient">Patient</Radio>
      <Radio value="doctor">Doctor</Radio>
    </RadioGroupField>
  );
};

export default RoleSelect;
