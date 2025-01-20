import { TronWeb } from "tronweb";
export const isTRC20Address = (address: string): boolean => {
    return TronWeb.isAddress(address);
};
