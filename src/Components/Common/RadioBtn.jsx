import { Checkbox, FormControlLabel } from "@mui/material";
/* eslint-disable react/prop-types */

const RadioBtn = ({ label, ...props }) => {
  return (
    <div>
      <FormControlLabel
        variant="standard"
        control={
          <Checkbox
            color="success"
            {...props}
            sx={{
              "& .MuiSvgIcon-root": {
                stroke: "#292929", // Change this to your desired color
              },
            }}
          />
        }
        label={label}
      />
    </div>
  );
};

export default RadioBtn;
