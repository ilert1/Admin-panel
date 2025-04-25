import { AZNIcon } from "./MONATA";
import { RUBIcon } from "./RUB";
import { USDIcon } from "./USD";
import { USDTIcon } from "./USDT";

export const currenciesIconsMap: { [key: string]: (props: { className?: string }) => JSX.Element } = {
    USDT: USDTIcon,
    USD: USDIcon,
    RUB: RUBIcon,
    AZN: AZNIcon
};
