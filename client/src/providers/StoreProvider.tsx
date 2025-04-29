import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/src/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({ children }: { children: React.ReactNode; }) {
    const storeRef = useRef<AppStore>();

    // Create the store instance the first time this renders
    if (!storeRef.current) storeRef.current = makeStore();

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={storeRef.current.__persistor!}>
                {children}
            </PersistGate>
        </Provider>
    );
}