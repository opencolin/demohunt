import { VideoFeed } from "@/components/video-feed";
import {
  founders,
  getDemosForTab,
  type Founder,
  FEED_TABS,
} from "@/lib/data";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { tab } = await searchParams;
  const valid = FEED_TABS.some((t) => t.key === tab);
  const currentTab = valid && tab ? tab : "for-you";
  const demos = getDemosForTab(currentTab);
  const founderMap: Record<string, Founder> = Object.fromEntries(
    founders.map((f) => [f.slug, f]),
  );

  return (
    <VideoFeed demos={demos} founderMap={founderMap} currentTab={currentTab} />
  );
}
