import { FeeCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    directionEndpointsAddFeeEnigmaV1DirectionDirectionIdFeePatch,
    directionEndpointsDeleteFeeEnigmaV1DirectionDirectionIdFeeFeeIdDelete
} from "@/api/enigma/direction/direction";
import {
    merchantEndpointsAddFeeEnigmaV1MerchantMerchantIdFeePatch,
    merchantEndpointsDeleteFeeEnigmaV1MerchantMerchantIdFeeFeeIdDelete
} from "@/api/enigma/merchant/merchant";
import {
    terminalEndpointsAddFeeEnigmaV1ProviderProviderNameTerminalTerminalIdFeePatch,
    terminalEndpointsDeleteFeeEnigmaV1ProviderProviderNameTerminalTerminalIdFeeFeeIdDelete
} from "@/api/enigma/terminal-legacy/terminal-legacy";

export enum FeesResource {
    DIRECTION = "direction",
    MERCHANT = "merchant",
    TERMINAL = "terminal"
}
interface FeesDataProviderProps {
    id: string;
    resource: FeesResource;
    providerName?: string;
}
const feesDataProvider = (props: FeesDataProviderProps) => {
    const { resource, providerName } = props;
    let { id } = props;

    const setId = (newId: string) => {
        id = newId;
    };

    const addFee = async (body: FeeCreate) => {
        const createFeeInResource = async () => {
            if (resource === FeesResource.DIRECTION) {
                return directionEndpointsAddFeeEnigmaV1DirectionDirectionIdFeePatch(id, body, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                });
            } else if (resource === FeesResource.MERCHANT) {
                return merchantEndpointsAddFeeEnigmaV1MerchantMerchantIdFeePatch(id, body, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                });
            } else if (resource === FeesResource.TERMINAL && providerName) {
                return terminalEndpointsAddFeeEnigmaV1ProviderProviderNameTerminalTerminalIdFeePatch(
                    providerName,
                    id,
                    body,
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        }
                    }
                );
            }

            return Promise.resolve({
                data: {
                    success: false,
                    error: {
                        error_message: "Fail"
                    }
                }
            });
        };

        const { data } = await createFeeInResource();

        if ("data" in data && !data.success) {
            throw new Error(data.error?.error_message);
        } else if ("detail" in data) {
            throw new Error(data.detail?.[0].msg);
        }
    };

    const removeFee = async (fee_id: string) => {
        const deleteFeeInResource = async () => {
            if (resource === FeesResource.DIRECTION) {
                return directionEndpointsDeleteFeeEnigmaV1DirectionDirectionIdFeeFeeIdDelete(id, fee_id, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                });
            } else if (resource === FeesResource.MERCHANT) {
                return merchantEndpointsDeleteFeeEnigmaV1MerchantMerchantIdFeeFeeIdDelete(id, fee_id, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                });
            } else if (resource === FeesResource.TERMINAL && providerName) {
                return terminalEndpointsDeleteFeeEnigmaV1ProviderProviderNameTerminalTerminalIdFeeFeeIdDelete(
                    providerName,
                    id,
                    fee_id,
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        }
                    }
                );
            }

            return Promise.resolve({
                data: {
                    success: false,
                    error: {
                        error_message: "Fail"
                    }
                }
            });
        };

        const { data } = await deleteFeeInResource();

        if ("data" in data && !data.success) {
            throw new Error(data.error?.error_message);
        } else if ("detail" in data) {
            throw new Error(data.detail?.[0].msg);
        }
    };

    return { addFee, removeFee, setId };
};

export default feesDataProvider;
