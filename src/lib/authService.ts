import { FirebaseError } from "firebase/app";
import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "./firebase";
import { api } from "@/lib/api";
import { clearStoredToken, setStoredToken } from "@/lib/token";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginResponse = {
  mensagem?: string;
  message?: string;
  usuario?: unknown;
  idToken?: string;
};

const mapAuthError = (err: unknown, fallback: string): Error => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/email-already-in-use":
        return new Error("Este e-mail ja esta registado. Faca login ou recupere a senha.");
      case "auth/invalid-email":
        return new Error("E-mail invalido.");
      case "auth/weak-password":
        return new Error("Senha fraca. Use pelo menos 6 caracteres.");
      case "auth/user-not-found":
      case "auth/wrong-password":
        return new Error("E-mail ou senha incorretos.");
      case "auth/popup-closed-by-user":
        return new Error("Janela do Google fechada. Tente novamente.");
      case "auth/popup-blocked":
        return new Error("Popup bloqueado pelo navegador. Ative os popups e tente novamente.");
      case "auth/account-exists-with-different-credential":
        return new Error("Conta ja existe com outro metodo de login.");
      case "auth/too-many-requests":
        return new Error("Muitas tentativas. Tente novamente mais tarde.");
      case "auth/network-request-failed":
        return new Error("Falha de rede. Verifique a sua ligacao.");
      case "auth/invalid-action-code":
        return new Error("Link invalido ou expirado.");
      case "auth/expired-action-code":
        return new Error("Link expirado. Solicite um novo.");
      default:
        return new Error(fallback);
    }
  }

  if (err instanceof Error) return err;
  return new Error(fallback);
};

const persistLoginToken = (backendToken: string | undefined, fallback: string) => {
  setStoredToken(backendToken ?? fallback);
};

export async function registerWithEmail({
  name,
  email,
  password,
}: RegisterPayload) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    await sendEmailVerification(userCredential.user);

    const idToken = await userCredential.user.getIdToken();
    const response = await api.post<LoginResponse>("/auth/login", { idToken });
    persistLoginToken(response?.idToken, idToken);

    return userCredential.user;
  } catch (err) {
    throw mapAuthError(err, "Erro ao criar conta.");
  }
}

export async function registerWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const idToken = await userCredential.user.getIdToken();
    const response = await api.post<LoginResponse>("/auth/login", { idToken });
    persistLoginToken(response?.idToken, idToken);
    return userCredential.user;
  } catch (err) {
    throw mapAuthError(err, "Erro ao criar conta com Google.");
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      throw new Error(
        "Email ainda nao verificado. Enviamos um novo link.",
      );
    }

    const idToken = await userCredential.user.getIdToken();
    const response = await api.post<LoginResponse>("/auth/login", { idToken });
    persistLoginToken(response?.idToken, idToken);

    return userCredential.user;
  } catch (err) {
    throw mapAuthError(err, "Erro ao iniciar sessao.");
  }
}

export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const idToken = await userCredential.user.getIdToken();
    const response = await api.post<LoginResponse>("/auth/login", { idToken });
    persistLoginToken(response?.idToken, idToken);
    return userCredential.user;
  } catch (err) {
    throw mapAuthError(err, "Erro ao iniciar sessao com Google.");
  }
}

export async function requestPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw mapAuthError(err, "Erro ao enviar o email.");
  }
}

export async function verifyResetCode(code: string) {
  try {
    return await verifyPasswordResetCode(auth, code);
  } catch (err) {
    throw mapAuthError(err, "Link invalido ou expirado.");
  }
}

export async function confirmReset(code: string, newPassword: string) {
  try {
    await confirmPasswordReset(auth, code, newPassword);
  } catch (err) {
    throw mapAuthError(err, "Erro ao redefinir senha.");
  }
}

export async function applyEmailVerification(code: string) {
  try {
    await applyActionCode(auth, code);
  } catch (err) {
    throw mapAuthError(err, "Erro ao ativar conta.");
  }
}

export async function logoutAll() {
  await signOut(auth);
  clearStoredToken();
}
