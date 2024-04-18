import { PROJECT_TOKEN_COOKIE, USER_TOKEN_COOKIE } from "@/constants/cookies";
import { getCookie } from "@/lib/utils";
import axios from "axios";

axios.interceptors.request.use((request) => {
    request.withCredentials = true;
    const isRunningOnNode = typeof window === "undefined";
    if (!isRunningOnNode) {
        console.log("document.cookie", document.cookie);

        const userToken = getCookie(USER_TOKEN_COOKIE);
        const projectToken = getCookie(PROJECT_TOKEN_COOKIE);
        request.headers.Authorization = `Bearer ${userToken}`;
        request.headers.Project = `Bearer ${projectToken}`;
    }

    console.log("he::", JSON.stringify(request.headers));

    return request;
});
