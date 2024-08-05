const Flights_List_Galileo = () => {
  const additionalHeadings = [
    "PIA",
    "Air Blue",
    "Air Sial",
    "Fly Dubai",
    "Emirates",
    "Gulf Air",
    "Air Arabia",
    "Fly Jinnah",
    "Al-Saudia",
    "Swiss Air",
    "China Airlines",
    "Air Canada",
    "PIA",
    "Air Blue",
    "Air Sial",
    "Fly Dubai",
    "Emirates",
    "Gulf Air",
    "Air Arabia",
    "Fly Jinnah",
    "Al-Saudia",
    "Swiss Air",
    "China Airlines",
    "Air Canada",
    "PIA",
    "Air Blue",
    "Air Sial",
    "Fly Dubai",
    "Emirates",
    "Gulf Air",
    "Air Arabia",
    "Fly Jinnah",
    "Al-Saudia",
    "Swiss Air",
    "China Airlines",
    "Air Canada",
  ];
  const numberOfCards = additionalHeadings.length;

  const cardData = Array.from({ length: numberOfCards }, (_, index) => ({
    id: index + 1,
    heading: additionalHeadings[index],
    pra: `${index + 1}`,
  }));
  return (
    <div className="m-8">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-xl">Galileo</p>
        <p className="text-[#CEAE75] font-semibold">
          ({additionalHeadings.length})
        </p>
      </div>
      <div className="mt-8 grid grid-cols-6 gap-5">
        {cardData.map((card) => (
          <div key={card.id} className="flex items-center gap-2">
            <div id="goll-tick" className="text-black p-4 text-xs">
              {card.pra}
            </div>
            <h3>{card.heading}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flights_List_Galileo;
