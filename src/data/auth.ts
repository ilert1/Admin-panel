export class AuthProvider {
    login({ username, password }: { username: string; password: string }) {
        if (username !== "admin" || password !== "Qwerty123!") {
            return Promise.reject();
        }
        sessionStorage.setItem("username", username);
        return Promise.resolve();
    }

    logout() {
        sessionStorage.removeItem("username");
        return Promise.resolve();
    }

    checkAuth() {
        return sessionStorage.getItem("username") ? Promise.resolve() : Promise.reject();
    }

    checkError(error: any) {
        const status = error.status;
        if (status === 401 || status === 403) {
            sessionStorage.removeItem("username");
            return Promise.reject();
        }
        return Promise.resolve();
    }

    getIdentity() {
        return Promise.resolve({
            id: "user",
            fullName: "John Doe"
        });
    }

    getPermissions() {
        return Promise.resolve("");
    }
}
