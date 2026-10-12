import { useAuth } from "@/providers/auth-provider";

export default function Profile() {
    const { user } = useAuth();

    return (
        <main className="mx-auto max-w-5xl p-8">
            <h1 className="mb-6 text-3xl font-bold">
                Meu perfil
            </h1>

            <div className="rounded-xl border p-6">
                <p>
                    <strong>Nome:</strong> {user?.name}
                </p>

                <p className="mt-3">
                    <strong>E-mail:</strong> {user?.email}
                </p>
            </div>
        </main>
    );
}