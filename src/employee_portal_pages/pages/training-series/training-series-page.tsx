import { useState, useRef } from "react";
import { Input, Card, Tag, Skeleton, Typography, Empty, Modal, Progress } from "antd";
import {
  SearchOutlined,
  PlayCircleFilled,
  ClockCircleOutlined,
  CalendarOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  useListEpisodesQuery,
  type VideoEpisode,
} from "@/redux/features/employee-portal-api/videoApi";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function EpisodeCard({ ep, onPlay }: { ep: VideoEpisode; onPlay: () => void }) {
  const isPublished = ep.status === "published";

  return (
    <Card
      hoverable={isPublished}
      className={`relative overflow-hidden transition-all duration-200 ${isPublished ? "cursor-pointer" : "cursor-default opacity-80"}`}
      styles={{ body: { padding: 0 } }}
      onClick={isPublished ? onPlay : undefined}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full overflow-hidden bg-gradient-to-br from-green-900 to-green-700"
        style={{ paddingTop: "56.25%" }}
      >
        {ep.thumbnailUrl ? (
          <img
            src={ep.thumbnailUrl}
            alt={ep.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircleFilled style={{ fontSize: 48, color: "rgba(255,255,255,0.3)" }} />
          </div>
        )}

        {/* Overlay for coming_soon */}
        {!isPublished && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <LockOutlined style={{ fontSize: 28, color: "rgba(255,255,255,0.7)" }} />
            <span className="text-white text-xs font-bold mt-2 tracking-widest uppercase">
              Coming Soon
            </span>
          </div>
        )}

        {/* Play button overlay for published */}
        {isPublished && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
            <PlayCircleFilled style={{ fontSize: 48, color: "white" }} />
          </div>
        )}

        {/* Episode number badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            EP. {ep.episodeNumber}
          </span>
        </div>

        {/* Duration badge */}
        {ep.duration && isPublished && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
              <ClockCircleOutlined />
              {formatDuration(ep.duration)}
            </span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Text strong className="text-sm leading-tight line-clamp-2 flex-1">
            {ep.title}
          </Text>
          {isPublished ? (
            <Tag color="green" className="flex-shrink-0 text-[10px]">
              Published
            </Tag>
          ) : (
            <Tag color="default" className="flex-shrink-0 text-[10px]">
              Soon
            </Tag>
          )}
        </div>

        {ep.description && (
          <Paragraph
            className="text-gray-500 text-xs mb-2 line-clamp-2"
            ellipsis={{ rows: 2 }}
          >
            {ep.description}
          </Paragraph>
        )}

        {ep.publishedAt && isPublished && (
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <CalendarOutlined />
            <span>{dayjs(ep.publishedAt).format("DD MMM YYYY")}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card styles={{ body: { padding: 0 } }}>
      <div
        className="w-full bg-gray-200 animate-pulse"
        style={{ paddingTop: "56.25%" }}
      />
      <div className="p-3 space-y-2">
        <Skeleton.Input active size="small" className="w-3/4" />
        <Skeleton.Input active size="small" className="w-full" />
      </div>
    </Card>
  );
}

export default function TrainingSeriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeEpisode, setActiveEpisode] = useState<VideoEpisode | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useListEpisodesQuery({ search: debouncedSearch });
  const episodes: VideoEpisode[] = data?.data || [];

  const published = episodes.filter((e) => e.status === "published");
  const comingSoon = episodes.filter((e) => e.status === "coming_soon");

  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(val), 350);
  };

  const getPlaybackUrl = (ep: VideoEpisode) => ep.cloudfrontUrl || ep.s3Key || "";

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-green-900/20"
          style={{ background: "linear-gradient(135deg, #006400, #15803d)" }}
        >
          <PlayCircleFilled style={{ fontSize: 24, color: "#fbbf24" }} />
        </div>
        <Title level={3} className="!mb-1 !font-black tracking-tight uppercase">
          EPA Staff Training Series
        </Title>
        <Text className="text-gray-500 text-sm max-w-md">
          Access professional development content and essential training videos for EPA staff.
        </Text>
      </div>

      {/* Search bar */}
      <div className="mb-10 max-w-xl mx-auto">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search episodes by title or description..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          size="large"
          className="shadow-sm rounded-full"
        />
      </div>

      {isLoading ? (
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Episodes</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      ) : episodes.length === 0 ? (
        <Empty description="No episodes found" className="mt-12" />
      ) : (
        <>
          {/* Published episodes */}
          {published.length > 0 && (
            <section className="mb-8">
              <p className="text-xs font-extrabold text-gray-600 uppercase tracking-widest mb-3">
                Available Episodes ({published.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {published.map((ep) => (
                  <EpisodeCard key={ep._id} ep={ep} onPlay={() => setActiveEpisode(ep)} />
                ))}
              </div>
            </section>
          )}

          {/* Coming soon placeholders */}
          {comingSoon.length > 0 && !debouncedSearch && (
            <section>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                Coming Soon
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {comingSoon.map((ep) => (
                  <EpisodeCard key={ep._id} ep={ep} onPlay={() => {}} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Video player modal */}
      <Modal
        open={!!activeEpisode}
        onCancel={() => setActiveEpisode(null)}
        footer={null}
        width={900}
        title={
          activeEpisode ? (
            <div>
              <span className="text-xs text-gray-400 font-normal mr-2">
                Episode {activeEpisode.episodeNumber}
              </span>
              <span className="font-bold">{activeEpisode.title}</span>
            </div>
          ) : null
        }
        destroyOnClose
        centered
      >
        {activeEpisode && (
          <div className="space-y-3">
            <div className="w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <video
                src={getPlaybackUrl(activeEpisode)}
                controls
                autoPlay
                className="w-full h-full"
                controlsList="nodownload"
              />
            </div>
            {activeEpisode.description && (
              <p className="text-sm text-gray-600">{activeEpisode.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {activeEpisode.duration && (
                <span className="flex items-center gap-1">
                  <ClockCircleOutlined /> {formatDuration(activeEpisode.duration)}
                </span>
              )}
              {activeEpisode.publishedAt && (
                <span className="flex items-center gap-1">
                  <CalendarOutlined /> {dayjs(activeEpisode.publishedAt).format("DD MMM YYYY")}
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
