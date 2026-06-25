import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function MonthRedirectPage({ params }: PageProps) {
    const { username } = await params;
    redirect(`/${encodeURIComponent(username)}/wrapped?period=1month`);
}
