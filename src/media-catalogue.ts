import type { VideoAsset } from "./responsive-video";

// Approved project walkthroughs keyed by existing project slug. Leave empty until supplied.
// Each entry requires src and poster; add captions and a transcript for spoken content.
export const projectVideos: Record<string, VideoAsset> = {};

// Approved service videos in the same order as the four existing service work cards.
export const serviceVideos: Record<string, VideoAsset[]> = {};
