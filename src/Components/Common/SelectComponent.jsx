import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import * as React from "react";

export default function SelectComponent() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="flex gap-5 items-center">
      <p className="text-sm w-[130px]">Select Tier : </p>
      <Box
        sx={{
          minWidth: 300,
          color: "white",
          borderColor: "white",
          backgroundColor: "#232323",
        }}
      >
        <FormControl
          fullWidth
          sx={{
            color: "white",
            borderColor: "#232323",
            backgroundColor: "#232323",
          }}
        >
          <InputLabel
            id="demo-simple-select-label"
            sx={{ color: "white", backgroundColor: "#232323" }}
          >
            Select Tier
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
            sx={{
              color: "white",
              borderColor: "white",
              backgroundColor: "#232323",
            }}
          >
            <MenuItem value={10} sx={{ color: "black" }}>
              Ten
            </MenuItem>
            <MenuItem value={20} sx={{ color: "black" }}>
              Twenty
            </MenuItem>
            <MenuItem value={30} sx={{ color: "black" }}>
              Thirty
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
