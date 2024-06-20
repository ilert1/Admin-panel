type Value = {
    quantity: number;
    accuracy: number;
};

type Amount = {
    currency: string;
    id: string;
    type: string;
    value: Value;
};

type Meta = {
    caption: string;
};

type Account = {
    id: string;
    amounts: Amount[];
    meta: Meta;
    owner_id: string;
    state: number;
    type: number;
};

declare namespace Transaction {
    type Account = {
        id: string;
        amount: Omit<Amount, "type", "id">;
    };

    type RateInfo = {
        d_currency: string;
        s_currency: string;
        value: Value;
    };

    type Meta = {
        external_status: string;
        external_status_details: string;
        fail_url: string;
        success_url: string;
    };

    type State = {
        final: boolean;
        state_description: string;
        state_int: number;
    };

    type Result = {
        data: {
            callback_url: string;
            external_id: string;
            token: string;
        };
        error: number;
        error_details: {
            error_message: string;
            external_error_code: string;
            external_error_message: string | null;
            extra_data: string | null;
        };
        paymentUrl: string;
        provider: string;
    };

    type Transaction = {
        id: string;
        committed: boolean;
        created_at: string;
        destination: Account;
        dispute: boolean;
        fees: [];
        meta: Meta;
        rate_info: RateInfo;
        result: Result;
        source: Account;
        state: State;
        type: number;
    };

    type Fee = {
        resipient: string;
        type: number;
        currency: string;
        value: Value;
    };
}

declare namespace JWT {
    interface Payload {
        exp: number;
        iat: number;
        auth_time: number;
        jti: string;
        iss: string;
        aud: string;
        sub: string;
        typ: string;
        azp: string;
        nonce: string;
        session_state: string;
        acr: string;
        "allowed-origins": string[];
        realm_access: {
            roles: string[];
        };
        resource_access: {
            account: {
                roles: string[];
            };
        };
        scope: string;
        sid: string;
        email_verified: true;
        name: string;
        merchant_id: string;
        preferred_username: string;
        given_name: string;
        family_name: string;
        email: string;
    }
}
