"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/validations"
import { signIn } from "@/auth"
import { ZodError } from "zod"

export type RegisterResult =
    | { success: true }
    | { success: false; error: string; fieldErrors?: Record<string, string> }

export async function registerUser(
    formData: FormData
): Promise<RegisterResult> {
    const raw = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    }

    try {
        const validated = await signUpSchema.parseAsync(raw)

        // Check for existing account
        const existing = await prisma.user.findUnique({
            where: { email: validated.email },
        })
        if (existing) {
            return { success: false, error: "An account with this email already exists." }
        }

        const hashedPassword = await bcrypt.hash(validated.password, 12)

        await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                password: hashedPassword,
            },
        })

        // Automatically sign in after registration
        await signIn("credentials", {
            email: validated.email,
            password: validated.password,
            redirectTo: "/",
        })

        return { success: true }
    } catch (error) {
        if (error instanceof ZodError) {
            const fieldErrors: Record<string, string> = {}
            for (const issue of error.issues) {
                const field = issue.path[0] as string
                if (field) fieldErrors[field] = issue.message
            }
            return {
                success: false,
                error: "Please fix the errors below.",
                fieldErrors,
            }
        }

        // signIn throws a redirect — let it propagate
        throw error
    }
}
