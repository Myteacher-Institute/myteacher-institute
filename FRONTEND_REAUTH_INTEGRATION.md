# Frontend YouTube Re-Authentication Integration

## Overview
This document describes the frontend changes made to handle automatic YouTube re-authentication when the session expires during video uploads in the create-course and edit-course flows.

## Changes Made

### 1. Create Course Page (`app/instructor/create-course/page.tsx`)

#### Enhanced Video Upload Error Handling (Lines 915-937)
Modified the video upload error handling to detect re-authentication requirements:

```typescript
} catch (err: any) {
  const responseData = err?.response?.data;
  const msg = responseData?.message || err?.message || "Upload failed";
  
  // Check if re-authentication is required
  if (responseData?.status === "reauth_required" && responseData?.authUrl) {
    setVideoUploadState(prev => ({
      ...prev,
      [videoIndex]: { uploading: false, progress: 0, error: msg }
    }));
    
    // Store the auth URL and video index for retry after auth
    (window as any).pendingReauth = {
      authUrl: responseData.authUrl,
      videoIndex,
      video,
      retryCount: ((window as any).pendingReauth?.retryCount || 0) + 1
    };
    
    // Trigger YouTube authentication with the provided auth URL
    (window as any).youtubeAuthUrl = responseData.authUrl;
    setShowYouTubeAuthModal(true);
    
    throw new Error(`Re-authentication required for video ${video.videoTitle}`);
  }

  setVideoUploadState(prev => ({
    ...prev,
    [videoIndex]: { uploading: false, progress: 0, error: msg }
  }));

  throw new Error(`Failed to upload video ${video.videoTitle}: ${msg}`);
}
```

#### Enhanced Auth Confirmation Handler (Lines 1195-1253)
Modified `handleConfirmYouTubeAuth` to automatically retry video uploads after successful re-authentication:

```typescript
const handleConfirmYouTubeAuth = async (formData: any) => {
  await confirmYouTubeAuth(formData);

  // Check if there's a pending video upload retry
  const pendingReauth = (window as any).pendingReauth;
  if (pendingReauth && pendingReauth.videoIndex !== undefined) {
    // Wait a moment for tokens to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const { videoIndex, video } = pendingReauth;
      
      setVideoUploadState(prev => ({
        ...prev,
        [videoIndex]: { uploading: true, progress: 0, error: "" }
      }));

      const formDataForUpload = new FormData();
      formDataForUpload.append("video", video.file!);
      formDataForUpload.append("title", video.videoTitle || video.file!.name);
      formDataForUpload.append("description", video.videoDescription || "");
      formDataForUpload.append("privacyStatus", "unlisted");
      formDataForUpload.append("tags", "course");

      const res = await axiosInstance.post("/api/youtube/upload", formDataForUpload, {
        timeout: 0,
        onUploadProgress: (e) => {
          const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
          setVideoUploadState(prev => ({
            ...prev,
            [videoIndex]: { uploading: true, progress: pct, error: "" }
          }));
        },
      });

      if (res.data.status === "success" && res.data.videoUrl) {
        const updatedVideos = [...videos];
        updatedVideos[videoIndex] = { ...video, videoUrl: res.data.videoUrl, file: undefined };
        setVideos(updatedVideos);
        setVideoUploadState(prev => ({
          ...prev,
          [videoIndex]: { uploading: false, progress: 100, error: "" }
        }));
      } else {
        throw new Error(res.data.message || "Upload failed");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Upload failed";
      setVideoUploadState(prev => ({
        ...prev,
        [pendingReauth.videoIndex]: { uploading: false, progress: 0, error: msg }
      }));
    } finally {
      // Clear the pending reauth
      (window as any).pendingReauth = null;
    }
  }

  if (shouldRetryAfterAuth) {
    // Wait a moment for tokens to be saved
    await new Promise(resolve => setTimeout(resolve, 500));
    await handleRetryDeletion();
  }
};
```

#### Updated VideosStep Prop (Line 1497)
Modified the `onYouTubeAuth` prop to accept an optional `authUrl` parameter:

```typescript
onYouTubeAuth={(authUrl?: string) => handleYouTubeAuth(undefined, authUrl)}
```

### 2. OAuth Hook (`app/instructor/create-course/hooks/useOAuth.ts`)

#### Enhanced handleYouTubeAuth Function (Lines 30-61)
Modified to accept an optional `authUrl` parameter for direct use from upload error responses:

```typescript
const handleYouTubeAuth = async (onSuccess?: () => void, authUrl?: string) => {
  try {
    // If authUrl is provided directly (from re-auth response), use it
    if (authUrl) {
      (window as any).youtubeAuthUrl = authUrl;
      if (onSuccess) {
        onYouTubeAuthSuccessRef.current = onSuccess;
      }
      setShowYouTubeAuthModal(true);
      return;
    }
    
    // force=true ensures we always get an authUrl back, even if tokens exist
    const res = await axiosInstance.get("/api/youtube/auth?force=true");
    if (res.data.status === "success" && res.data.authUrl) {
      (window as any).youtubeAuthUrl = res.data.authUrl;
      if (onSuccess) {
        onYouTubeAuthSuccessRef.current = onSuccess;
      }
      setShowYouTubeAuthModal(true);
    } else {
      alert("Failed to get YouTube authentication URL. Please try again.");
    }
  } catch (err: any) {
    console.error("YouTube auth error:", err);
    alert("Failed to initiate YouTube authentication. Please try again.");
  }
};
```

#### Exported onYouTubeAuthSuccessRef (Lines 121-131)
Added the ref to the return value for external access:

```typescript
return {
  showYouTubeAuthModal,
  setShowYouTubeAuthModal,
  showDriveAuthModal,
  setShowDriveAuthModal,
  handleYouTubeAuth,
  confirmYouTubeAuth,
  handleDriveAuth,
  confirmDriveAuth,
  onYouTubeAuthSuccessRef
};
```

### 3. VideosStep Component (`app/instructor/create-course/components/steps/VideosStep.tsx`)

#### Updated Interface (Lines 8-16)
Modified the `onYouTubeAuth` prop to accept an optional `authUrl` parameter:

```typescript
interface VideosStepProps {
  videos: CourseVideo[];
  setVideos: (value: CourseVideo[]) => void;
  videoUploadState: Record<number, { uploading: boolean; progress: number; error: string }>;
  setVideoUploadState: (value: Record<number, { uploading: boolean; progress: number; error: string }>) => void;
  fieldErrors: Record<string, string>;
  onFileSelect: (i: number, file: File) => void;
  onYouTubeAuth: (authUrl?: string) => void;
}
```

#### Enhanced Error Detection (Lines 142-173)
Updated the error detection to also check for "re-authentication" messages:

```typescript
{(us.error.includes("YouTube authentication") || us.error.includes("re-authentication")) && (
  <button
    type="button"
    onClick={onYouTubeAuth}
    className="mt-2 flex items-center gap-2 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
  >
    <FiYoutube size={12} /> Authenticate with YouTube
  </button>
)}
```

## How It Works

### Re-Authentication Flow

1. **Video Upload Attempt**: User attempts to upload a video
2. **Session Expiry Detection**: Backend detects expired session and returns `status: "reauth_required"` with `authUrl`
3. **Error Handling**: Frontend catches the error and stores the pending upload info:
   ```typescript
   (window as any).pendingReauth = {
     authUrl: responseData.authUrl,
     videoIndex,
     video,
     retryCount: ((window as any).pendingReauth?.retryCount || 0) + 1
   };
   ```
4. **Auth Modal Trigger**: Shows YouTube authentication modal with the provided auth URL
5. **User Authentication**: User completes authentication in popup
6. **Automatic Retry**: After successful auth, the system automatically retries the failed upload
7. **State Cleanup**: Pending reauth info is cleared after retry attempt

### Edit Course Integration

The edit course page (`app/instructor/edit-course/[courseId]/page.tsx`) redirects to the create course page with pre-filled data, so it automatically inherits all the re-authentication functionality.

## Benefits

- **Seamless User Experience**: Automatic re-authentication without manual navigation
- **Context Preservation**: Failed upload info is preserved and automatically retried
- **Better Error Handling**: More specific error detection for re-authentication scenarios
- **Consistent Flow**: Works the same way in both create and edit course flows
- **Retry Support**: Automatically retries failed uploads after successful re-authentication

## Testing Recommendations

1. **Test Expired Session**: Upload a video with an expired YouTube session
2. **Test Missing Refresh Token**: Upload with missing refresh token
3. **Test Revoked Token**: Upload with a revoked refresh token
4. **Test Automatic Retry**: Verify upload retry after successful re-authentication
5. **Test Error Recovery**: Verify error handling if retry still fails
6. **Test Edit Course**: Verify the same flow works in edit course mode

## Future Enhancements

- Add retry limit to prevent infinite retry loops
- Show more detailed progress during re-authentication
- Add support for multiple failed uploads in a single re-auth flow
- Consider adding a manual "retry all failed uploads" button
