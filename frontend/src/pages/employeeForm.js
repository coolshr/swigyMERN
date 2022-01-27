// import { FormControl, FormControlLabel, FormLabel, RadioGroup, TextField, Radio } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { Grid } from "@material-ui/core";
import { UseForm, Form } from "../components/useForm";
import { Controls } from "../components/controls/controls";
import Buyer from './Buyer';
import Vendor from './Vendor';
import Pageheader from '../components/pageHeader'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';


function MainForm(props) {
  const { userType, setTitle, title } = props;
  if (userType === "vendor") {
    setTitle("New Vendor");
    return (
      <Vendor />
    )
  }
  else if (userType === "buyer") {
    setTitle("New Buyer");
    return (
      <Buyer />
    )
  }
  else {
    return (<div>
    </div>)
  }
};



export default function EmployeeForm() {

  const [userType, setUserType] = useState("");

  const [title, setTitle] = useState("Sign Up Page");

  function handleUserType(e) {
    setUserType(e.target.value);
  }

  return (
    <div>
      <Pageheader
        title={title}
        // subtitle="Form Design"
        icon={<PersonAddAltIcon fontSize="large" />}
      />
      <div>
        <Form>
          <Controls.RadioGroup
            label="User Type"
            name="userType"
            value={userType}
            onChange={handleUserType}
            items={[{ id: "vendor", title: "Vendor" }, { id: "buyer", title: "Buyer" }]}
          /><br />

        </Form>
        <MainForm userType={userType} title={title} setTitle={setTitle} />
      </div>
    </div>
  )
}