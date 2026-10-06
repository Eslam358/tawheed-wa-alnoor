import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiError } from "@/lib/apiResponse";

/**
 * يتأكد إن فيه مستخدم مسجّل دخول. يرجّع { session } أو { errorResponse }.
 * استخدمها في بداية أي route محتاج تسجيل دخول:
 *   const { session, errorResponse } = await requireAuth();
 *   if (errorResponse) return errorResponse;
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, errorResponse: apiError("من فضلك سجّل الدخول", 401) };
  }
  return { session, errorResponse: null };
}

/**
 * زي requireAuth بس بيتأكد كمان إن المستخدم أدمن.
 */
export async function requireAdmin() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return { session: null, errorResponse };
  if (session.user.role !== "admin") {
    return { session: null, errorResponse: apiError("غير مصرح لك بهذا الإجراء", 403) };
  }
  return { session, errorResponse: null };
}
