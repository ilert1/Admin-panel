import { DataProvider, AuthProvider, HttpError } from "react-admin";

export const authCheckDataProviderWrapper = (dataProvider: DataProvider, authProvider: AuthProvider): DataProvider => {
    return new Proxy(dataProvider, {
        get(target, methodName: string) {
            return async (...args: any[]) => {
                try {
                    return await target[methodName](...args);
                } catch (error) {
                    // console.log(error);
                    if (error instanceof HttpError) {
                        if (error?.status === 401) {
                            await authProvider.checkAuth();
                            return target[methodName](...args); // Повторяем запрос
                        }
                    }
                    throw error;
                }
            };
        }
    });
};
