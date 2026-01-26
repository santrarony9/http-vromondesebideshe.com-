import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

export const createSafeServerClient = (): SupabaseClient => {
    const cookieStore = cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        // Return a recursive proxy that mocks the Supabase client interface
        // This allows chaining .from().select().eq()... without crashing
        // and resolves to { data: null, error: ... } when awaited.
        const createMockChain = (): any => {
            return new Proxy(() => { }, {
                get: (target, prop) => {
                    if (prop === 'then') {
                        // When awaited, return empty data
                        return (resolve: any) => resolve({
                            data: null,
                            error: { message: "Supabase environment variables missing" }
                        });
                    }
                    return createMockChain();
                },
                apply: (target, thisArg, args) => createMockChain()
            });
        };

        // The root object also acts like the client with .from(), .auth, etc.
        return new Proxy({}, {
            get: (target, prop) => {
                if (prop === 'auth') {
                    return {
                        getUser: async () => ({ data: { user: null }, error: null }),
                        getSession: async () => ({ data: { session: null }, error: null }),
                        signInWithPassword: async () => ({ data: null, error: { message: "Auth unavailable" } }),
                    };
                }
                return createMockChain();
            }
        }) as unknown as SupabaseClient;
    }

    return createServerComponentClient({ cookies: () => cookieStore }, {
        supabaseUrl: url,
        supabaseKey: key
    });
};
