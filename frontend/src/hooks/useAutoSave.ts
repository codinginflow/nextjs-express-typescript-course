import { isServer } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";

/**	
 * A hook that automatically saves a value to sessionStorage at a specified interval.	
 */
export default function useAutoSave<T>(key: string, value: T, interval = 3000) {
    const stringifiedValue = JSON.stringify(value);

    const [lastSavedValue, setLastSavedValue] = useState(() => {
        if (isServer()) return null;
        return sessionStorage.getItem(key);
    });

    const [autoSave, setAutoSave] = useState(false);

    useEffect(() => {
        const i = setInterval(() => {
            setAutoSave(true);
        }, interval);

        return () => {
            setAutoSave(false);
            clearInterval(i);
        };
    }, [interval]);

    useEffect(() => {
        if (autoSave && stringifiedValue !== lastSavedValue) {
            console.log("autosave");
            sessionStorage.setItem(key, stringifiedValue);
            setAutoSave(false);
            setLastSavedValue(stringifiedValue);
        }
    }, [autoSave, key, lastSavedValue, stringifiedValue]);

    const getValue = useCallback((): T | null => {
        const savedValue = sessionStorage.getItem(key);
        return savedValue ? JSON.parse(savedValue) : null;
    }, [key]);

    const clearValue = useCallback(() => {
        sessionStorage.removeItem(key);
    }, [key]);

    return { getValue, clearValue };
}