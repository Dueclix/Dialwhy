const BookkingTable = () => {
  const cardData = [
    {
      id: 1,
      pra: "You have a new request from “Khurram Air Travels” for cancellation.",
    },
    {
      id: 2,
      pra: "You have a new request from “Ali Hassan Air Travels” for cancellation.",
    },
    {
      id: 3,

      pra: "You have a new request from “Waris Air Travels” for cancellation.",
    },
    {
      id: 4,

      pra: "You have a new request from “Tahir Air Travels” for cancellation.",
    },
    {
      id: 5,

      pra: "You have a new request from “Ahmad Air Travels” for cancellation.",
    },
  ];
  return (
    <>
      <p className="text-[#CEAE75] relative left-8 top-5 text-2xl font-bold">
        Requests :
      </p>
      <div className="grid  m-8 bg-[#232323] rounded-md p-2">
        {cardData.map((card) => (
          <div key={card.id} className=" p-4 ">
            <p className="">{card.pra}</p>
            <p className="text-end text-xs">12 Jan,2024</p>
            <hr className="mt-4" />
          </div>
        ))}
      </div>
    </>
  );
};

export default BookkingTable;
