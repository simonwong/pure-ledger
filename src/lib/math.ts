import BigNumber from "bignumber.js";

export const amountSum = (amountArr: (string | number)[]) => {
  let amount = BigNumber(0);

  amountArr.forEach((amt) => {
    amount = amount.plus(amt);
  });

  return amount.toNumber();
};

export const amountShow = (amount: string | number) => {
  // TODO: 实际金额还是不限制位数的
  return BigNumber(amount).toFormat(2);
};
