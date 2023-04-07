import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";

export default function useUnsavedChangesWarning(condition: boolean) {
    const router = useRouter();

    useEffect(() => {
        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            if (condition) {
                e.preventDefault();
                e.returnValue = true;
            }
        }

        const routeChangeStartHandler = () => {
            if (condition && !window.confirm("You have unsaved changes. Do you want to leave the page?")) {
                nProgress.done();
                throw "routeChange aborted";
            }
        }

        window.addEventListener("beforeunload", beforeUnloadHandler);
        router.events.on("routeChangeStart", routeChangeStartHandler);

        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
            router.events.off("routeChangeStart", routeChangeStartHandler);
        }
    }, [condition, router.events]);
}