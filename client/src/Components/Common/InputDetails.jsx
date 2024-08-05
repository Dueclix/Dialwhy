const InputDetails = ({ Label, Placeholder, value, onChange, name, type }) => {
  return (
    <div className="flex gap-5 items-center text-white">
      <p className="text-sm w-[150px] text-white pl-4 pt-2">{Label}:</p>
      <input
        type={type === "file" ? "file" : "text"}
        placeholder={Placeholder}
        className="py-[5px] px-[10px] w-[300px] p-[10px] bg-[#232323] rounded-sm placeholder:text-sm"
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};


export default InputDetails