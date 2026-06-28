import { revenueSlice } from "../api/revenueSlice";
import type { VideoEpisode } from "../employee-portal-api/videoApi";

export const adminVideoApi = revenueSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminListEpisodes: builder.query<{ success: boolean; data: VideoEpisode[] }, { search?: string }>({
      query: ({ search } = {}) => ({
        url: `/video/episodes${search ? `?search=${encodeURIComponent(search)}` : ""}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["VideoEpisode"],
    }),

    adminGetPresignedUploadUrl: builder.mutation<
      { success: boolean; presignedUrl: string; s3Key: string; playbackUrl: string },
      { filename: string; contentType: string; episodeNumber: number }
    >({
      query: (body) => ({
        url: "/video/presigned-url",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
    }),

    adminGetThumbnailPresignedUrl: builder.mutation<
      { success: boolean; presignedUrl: string; s3Key: string; thumbnailUrl: string },
      { filename: string; contentType: string; episodeNumber: number }
    >({
      query: (body) => ({
        url: "/video/thumbnail-presigned-url",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
    }),

    adminCreateEpisode: builder.mutation<{ success: boolean; data: VideoEpisode }, Partial<VideoEpisode>>({
      query: (body) => ({
        url: "/video/episodes",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["VideoEpisode"],
    }),

    adminUpdateEpisode: builder.mutation<
      { success: boolean; data: VideoEpisode },
      { id: string } & Partial<VideoEpisode>
    >({
      query: ({ id, ...body }) => ({
        url: `/video/episodes/${id}`,
        method: "PATCH",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["VideoEpisode"],
    }),

    adminDeleteEpisode: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/video/episodes/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["VideoEpisode"],
    }),
  }),
});

export const {
  useAdminListEpisodesQuery,
  useAdminGetPresignedUploadUrlMutation,
  useAdminGetThumbnailPresignedUrlMutation,
  useAdminCreateEpisodeMutation,
  useAdminUpdateEpisodeMutation,
  useAdminDeleteEpisodeMutation,
} = adminVideoApi;
