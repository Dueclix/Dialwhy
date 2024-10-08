const Flights_table = () => {
  const theadData = [
    "Rule Name",
    "Rule Description",
    "Agencies",
    "Flights",
    "Status",
    "Action",
  ];

  const tbodyData = [
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },
    {
      RuleName: "Fly Dubai Rule",
      RuleDescription: "This rule is ",
      Agencies: "Haris Travels,",
      Flights: "Fly Dubai Rule",
      Status: "2h",
      Action: "PK123",
    },

    // Add more rows as needed
  ];

  return (
    <div className="m-8">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-xl">Galileo</p>
        <p className="text-[#CEAE75] font-semibold">({tbodyData.length})</p>
      </div>
      <div className="mt-8 ">
        <table className="table-fixed" id="table">
          <thead className="bg-[#CEAE75] rounded-lg sticky top-0 ">
            <tr>
              {theadData.map((header, index) => (
                <th id="th" key={index} className="p-5 w-[20%]  text-black ">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tbodyData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td id="td" className="p-5 w-[20%] ">
                  {row.RuleName}
                </td>
                <td id="td" className="p-5 w-[20%] ">
                  {row.RuleDescription}
                </td>
                <td id="td" className="p-5 w-[20%] ">
                  {row.Agencies}
                </td>
                <td id="td" className="p-5 w-[20%] ">
                  {row.Flights}
                </td>
                <td id="td" className="p-5 w-[20%]">
                  {row.Status}
                </td>
                <td id="td" className="">
                  <div className="flex gap-2 p-5 w-[20%]">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Flights_table;
