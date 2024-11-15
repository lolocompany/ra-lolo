import React from 'react'; import { List, Datagrid,
TextField, EditButton, NumberField
} from 'react-admin'; const
List = (props) => (
<List {...props}>
  <Datagrid>
      <TextField source="id" />
      <ReferenceField source="accountId" reference="accounts">
            <TextField source="name" />
          </ReferenceField>
      <NumberField source="version" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="createdBy" />
      <TextField source="updatedBy" />
      <TextField source="iccid" />
      <TextField source="imsi" />
      <TextField source="msisdn" />
      <TextField source="imei" />
      <ReferenceField source="deviceId" reference="devices">
            <TextField source="name" />
          </ReferenceField>
      <SelectField source="simStatus" />
      <SelectField source="serviceStatus" />
      <TextField source="servicePlan" />
      <TextField source="ratePlan" />
      <ReferenceField source="inputFileId" reference="inputFiles">
            <TextField source="name" />
          </ReferenceField>
      <TextField source="eid" />
  </Datagrid>
</List>
); export default
List;