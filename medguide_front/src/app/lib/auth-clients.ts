// lib/auth-clients.ts - CORRIGIDO
import { getServerSession as getServerSessionNextAuth } from "next-auth";
import { authOptions } from "./auth";

export const getServerSession = () => getServerSessionNextAuth(authOptions);
