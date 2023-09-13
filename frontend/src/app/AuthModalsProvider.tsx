"use client";

import LoginModal from "@/components/auth/LoginModal";
import ResetPasswordModal from "@/components/auth/ResetPasswordModal";
import SignUpModal from "@/components/auth/SignUpModal";
import { ReactNode, createContext, useState } from "react";

interface AuthModalsContext {
    showLoginModal: () => void,
    showSignUpModal: () => void,
    showResetPasswordModal: () => void,
}

export const AuthModalsContext = createContext<AuthModalsContext>({
    showLoginModal: () => { throw Error("AuthModalsContext not implemented") },
    showSignUpModal: () => { throw Error("AuthModalsContext not implemented") },
    showResetPasswordModal: () => { throw Error("AuthModalsContext not implemented") },
});

interface AuthModalsProviderProps {
    children: ReactNode,
}

export default function AuthModalsProvider({ children }: AuthModalsProviderProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

    const [value] = useState({
        showLoginModal: () => setShowLoginModal(true),
        showSignUpModal: () => setShowSignUpModal(true),
        showResetPasswordModal: () => setShowResetPasswordModal(true),
    });

    return (
        <AuthModalsContext.Provider value={value}>
            {children}
            {showLoginModal &&
                <LoginModal
                    onDismiss={() => setShowLoginModal(false)}
                    onSignUpInsteadClicked={() => {
                        setShowLoginModal(false);
                        setShowSignUpModal(true);
                    }}
                    onForgotPasswordClicked={() => {
                        setShowLoginModal(false);
                        setShowResetPasswordModal(true);
                    }}
                />
            }
            {showSignUpModal &&
                <SignUpModal
                    onDismiss={() => setShowSignUpModal(false)}
                    onLoginInsteadClicked={() => {
                        setShowSignUpModal(false);
                        setShowLoginModal(true);
                    }}
                />
            }
            {showResetPasswordModal &&
                <ResetPasswordModal
                    onDismiss={() => setShowResetPasswordModal(false)}
                    onSignUpClicked={() => {
                        setShowResetPasswordModal(false);
                        setShowSignUpModal(true);
                    }}
                />
            }
        </AuthModalsContext.Provider>
    );
}