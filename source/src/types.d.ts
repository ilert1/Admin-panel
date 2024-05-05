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
