import { useFutureSelf } from '@/hooks/useFutureSelf';
import { useTimeline } from '@/hooks/useTimeline';
import IdentitySetup from '@/components/future-self/IdentitySetup';
import AchievementsGallery from '@/components/future-self/AchievementsGallery';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shared/Tabs';
import ProgressVisualization from '@/components/future-self/ProgressVisualization';

const FutureProgressPage = () => {
  const { identity, hasIdentity } = useFutureSelf();

  if (!hasIdentity) {
    return <IdentitySetup currentAge={14} />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <ProgressVisualization />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FutureProgressPage;
