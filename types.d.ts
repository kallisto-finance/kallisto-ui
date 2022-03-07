export type TMap = {
  [key: string]: any;
};

export type LIQUIDITY_BUTTON_STATUS =
  | "success"
  | "enter_amount"
  | "insufficient";

export type LIQUIDITY_BUTTON_TEXT =
  | "Deposit UST"
  | "Enter an amount"
  | "Insufficient Balance";

export interface LIQUIDITY_BALANCE_STATUS {
  text: LIQUIDITY_BUTTON_TEXT;
  status: LIQUIDITY_BUTTON_STATUS;
}
