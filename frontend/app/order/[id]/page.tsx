import Link from 'next/link';

type OrderPageProps = {
    params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
    const { id } = await params;

    return (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg text-green-600 dark:bg-green-950 dark:text-green-400">
                    ✓
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">
                    Order confirmed!
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Your order #{id} has been placed.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-block rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                    Continue shopping
                </Link>
            </div>
        </main>
    );
}
