import { useState } from "react";
import styles from "./Card.module.css";

export class CardModel {
  private _question = "";
  private _answer = "";

  public get question() {
    return this._question;
  }

  public get answer() {
    return this._answer;
  }

  constructor(question: string, answer: string) {
    this._question = question;
    this._answer = answer;
  }
}

type CardProp = {
  cardContent: CardModel;
};

const Card: React.FC<CardProp> = ({ cardContent }) => {
  const question = cardContent.question;
  const answer = cardContent.answer;

  const [cardText, setCardText] = useState(question);

  const flipCard = () => {
    if (cardText === question) {
      setCardText(answer);
    } else {
      setCardText(question);
    }
  };

  return (
    <div
      onClick={flipCard}
      className={`${styles["card-container"]} ${
        cardText === question ? styles["card-question"] : styles["card-answer"]
      }`}
    >
      {cardText}
    </div>
  );
};

export default Card;
