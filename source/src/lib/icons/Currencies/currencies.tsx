import { RUBIcon } from "./RUB";
import { USDIcon } from "./USD";
import { USDTIcon } from "./USDT";

export const currenciesIconsMap: { [key: string]: JSX.Element } = {
    USDT: <USDTIcon fill />,
    USD: <USDIcon fill />,
    RUB: <RUBIcon fill />
};
