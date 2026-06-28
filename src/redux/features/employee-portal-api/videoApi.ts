import { employee_portalSlice } from "../api/employee-portalSlice";

export interface VideoEpisode {
  _id: string;
  title: string;
  description?: string;
  episodeNumber: number;
  s3Key?: string;
  cloudfrontUrl?: string;
  thumbnailS3Key?: string;
  thumbnailUrl?: string;
  duration?: number;
  status: "coming_soon" | "published";
  publishedAt?: string;
  notificationSent: boolean;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export const videoApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    listEpisodes: builder.query<{ success: boolean; data: VideoEpisode[] }, { search?: string }>({
      query: ({ search } = {}) => ({
        url: `/video/episodes${search ? `?search=${encodeURIComponent(search)}` : ""}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["VideoEpisode"],
    }),

    getLatestEpisode: builder.query<{ success: boolean; data: VideoEpisode | null }, void>({
      query: () => ({
        url: "/video/latest",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["VideoEpisode"],
    }),

    getPresignedUploadUrl: builder.mutation<
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

    getThumbnailPresignedUrl: builder.mutation<
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

    createEpisode: builder.mutation<{ success: boolean; data: VideoEpisode }, Partial<VideoEpisode>>({
      query: (body) => ({
        url: "/video/episodes",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["VideoEpisode"],
    }),

    updateEpisode: builder.mutation<{ success: boolean; data: VideoEpisode }, { id: string } & Partial<VideoEpisode>>({
      query: ({ id, ...body }) => ({
        url: `/video/episodes/${id}`,
        method: "PATCH",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["VideoEpisode"],
    }),

    deleteEpisode: builder.mutation<{ success: boolean; message: string }, string>({
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
  useListEpisodesQuery,
  useGetLatestEpisodeQuery,
  useGetPresignedUploadUrlMutation,
  useGetThumbnailPresignedUrlMutation,
  useCreateEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
} = videoApi;
