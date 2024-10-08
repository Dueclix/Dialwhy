const DashsmallCards = () => {
  const cardData = [
    {
      id: 1,
      heading: "543271",
      pra: "New requests",
    },
    {
      id: 2,
      heading: "543271",
      pra: "Total request",
    },
    {
      id: 3,
      heading: "543271",
      pra: "Ticketed",
    },
    {
      id: 4,
      heading: "543271",
      pra: "Cancelled",
    },
    {
      id: 5,
      heading: "543271",
      pra: "Ticket Failed",
    },
    {
      id: 6,
      heading: "543271",
      pra: "Booking Failed",
    },
  ];
  return (
    <div className="grid grid-cols-6 p-8 gap-4">
      {cardData.map((card) => (
        <div
          key={card.id}
          className="bg-[#232323] p-6 rounded-md hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col gap-2 items-center justify-center"
        >
          <p className="text-[#CEAE75] font-bold">{card.pra}</p>
          <h2 className="text-2xl font-bold">{card.heading}</h2>
        </div>
      ))}
    </div>
  );
};

export default DashsmallCards;
