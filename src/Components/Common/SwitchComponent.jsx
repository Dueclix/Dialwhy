import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
/* eslint-disable react/prop-types */

const SwitchComponent = ({ label, checked, onChange, baaki }) => {
  return (
    <div className="flex gap-5 items-center">
      <p className="text-sm w-[130px]">{baaki} : </p>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            name="checked"
            color="secondary"
          />
        }
        label={label}
      />
    </div>
  );
};

export default SwitchComponent;
