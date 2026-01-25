import api from "./api";

export const UsersApi = {
    create: async (body: any, code: string) => {
        if (process.env.NEXT_PUBLIC_CODE !== code) {
            console.log("Código de registro inválido"); return;
        }

        try {
            const response = await api.post("/users", {
                ...body,
                isActive: true,
                role: "user",
            });

            return response.data;
        } catch (error) {
            console.log("Erro ao criar usuário:", error);
            throw error;
        }
    },
};
