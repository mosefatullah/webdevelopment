import React from "react";
import { useCallback, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
 CARD: "card",
};

const Card = ({ id, text, index, moveCard }) => {
 const ref = useRef(null);
 const [{ handlerId }, drop] = useDrop({
  accept: ItemTypes.CARD,
  collect(monitor) {
   return {
    handlerId: monitor.getHandlerId(),
   };
  },
  hover(item, monitor) {
   if (!ref.current) {
    return;
   }
   const dragIndex = item.index;
   const hoverIndex = index;
   // Don't replace items with themselves
   if (dragIndex === hoverIndex) {
    return;
   }
   // Determine rectangle on screen
   const hoverBoundingRect = ref.current?.getBoundingClientRect();
   // Get vertical middle
   const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
   // Determine mouse position
   const clientOffset = monitor.getClientOffset();
   // Get pixels to the top
   const hoverClientY = clientOffset.y - hoverBoundingRect.top;
   // Only perform the move when the mouse has crossed half of the items height
   // When dragging downwards, only move when the cursor is below 50%
   // When dragging upwards, only move when the cursor is above 50%
   // Dragging downwards
   if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return;
   }
   // Dragging upwards
   if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return;
   }
   // Time to actually perform the action
   moveCard(dragIndex, hoverIndex);
   // Note: we're mutating the monitor item here!
   // Generally it's better to avoid mutations,
   // but it's good here for the sake of performance
   // to avoid expensive index searches.
   item.index = hoverIndex;
  },
 });
 const [{ isDragging }, drag] = useDrag({
  type: ItemTypes.CARD,
  item: () => {
   return { id, index };
  },
  collect: (monitor) => ({
   isDragging: monitor.isDragging(),
  }),
 });
 const opacity = isDragging ? 0 : 1;
 drag(drop(ref));
 return (
  <div
   ref={ref}
   style={{
    border: "1px dashed gray",
    padding: "0.5rem 1rem",
    marginBottom: ".5rem",
    backgroundColor: "white",
    color: "black",
    cursor: "move",
    opacity,
   }}
   data-handler-id={handlerId}
  >
   {text}
  </div>
 );
};

export default function Sortable() {
 const [cards, setCards] = useState([
  {
   id: 1,
   text: "Write a cool JS library",
  },
  {
   id: 2,
   text: "Make it generic enough",
  },
  {
   id: 3,
   text: "Write README",
  },
  {
   id: 4,
   text: "Create some examples",
  },
  {
   id: 5,
   text:
    "Spam in Twitter and IRC to promote it (note that this element is taller than the others)",
  },
  {
   id: 6,
   text: "???",
  },
  {
   id: 7,
   text: "PROFIT",
  },
 ]);
 const moveCard = useCallback((dragIndex, hoverIndex) => {
  setCards((prevCards) =>
   prevCards.map((card, i) => {
    if (i === dragIndex) {
     return prevCards[hoverIndex];
    }
    if (i === hoverIndex) {
     return prevCards[dragIndex];
    }
    return card;
   })
  );
 }, []);
 const renderCard = useCallback((card, index) => {
  return (
   <Card
    key={card.id}
    index={index}
    id={card.id}
    text={card.text}
    moveCard={moveCard}
   />
  );
 }, []);
 return (
  <>
   <div
    style={{
     width: 400,
    }}
   >
    {cards.map((card, i) => renderCard(card, i))}
   </div>
  </>
 );
}
