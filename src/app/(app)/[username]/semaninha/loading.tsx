import { PageContainer } from '@/components/shell/PageContainer';
import { SemaninhaGridSkeleton, SemaninhaLoader } from '@/components/semaninha/SemaninhaLoader';

export default function SemaninhaLoading() {
    return (
        <PageContainer title="Semaninha" description="Grade de álbuns exportável.">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div className="space-y-5 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
                    <div className="h-3 w-16 bg-neutral-800 rounded" />
                    <div className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-9 w-14 bg-neutral-800 rounded-lg" />
                        ))}
                    </div>
                    <div className="h-3 w-20 bg-neutral-800 rounded mt-4" />
                    <div className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-9 w-12 bg-neutral-800 rounded-lg" />
                        ))}
                    </div>
                </div>

                <div className="relative flex flex-col items-center gap-6">
                    <SemaninhaGridSkeleton gridSize={5} />
                    <SemaninhaLoader message="Carregando semaninha" size="lg" className="absolute inset-0 bg-neutral-950/55 backdrop-blur-[2px] rounded-xl" />
                </div>
            </div>
        </PageContainer>
    );
}
