import _fetch from "../fetcher/ClientSide";

interface SaveUrlResponse {
  data: {
    imagePath: string;
    imageSaveUrl: string;
  };
}

interface CallbackResponse {
  data: {
    imageId: string;
  };
}

interface GetUrlResponse {
  data: {
    imageGetUrl: string;
  };
}

type UploadType = "PROFILE" | "AI_REQUEST" | "POST";

const UploadImage = async (
  file: File,
  callback: (r: [string, string, string], e?: unknown) => void,
  type: UploadType,
  postId?: number // For AI purpose upload
): Promise<SaveUrlResponse | false> => {
  const { name } = file;
  let pathByType = "";
  switch (type) {
    case "PROFILE":
      pathByType = "users";
      break;
    case "POST":
      pathByType = "posts";
      break;
    case "AI_REQUEST":
      if (!postId) {
        return false;
      } // AI purpose upload는 postId parameter가 필요합니다.
      pathByType = "ai";
      break;
    default:
      pathByType = "posts";
  }
  const res_save_url = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/${pathByType}/images/save-url`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUsagePurpose: type,
        fileName: name,
      }),
    }
  );

  if (!res_save_url.ok) {
    return false;
  }

  const data = await res_save_url.json();
  const { imagePath, imageSaveUrl } = data.data;

  const res_put_image = await fetch(imageSaveUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  // callback API
  if (!res_put_image.ok) {
    console.error("Error on callback API");
    return false;
  }

  const queryParamsOfCallback = new URLSearchParams();
  queryParamsOfCallback.append("postId", String(postId));
  const res_callback = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/${pathByType}/images/save-url/callback?${queryParamsOfCallback.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: name,
        imagePath: imagePath,
        imageUsagePurpose: type,
      }),
    }
  );

  if (res_callback.ok) {
    const data = await res_callback.json();
    const { imageId } = data.data;
    try {
      const res_img_url = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/${pathByType}/images/${imageId}/get-url`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res_img_url.ok) {
        const data = await res_img_url.json();
        const { imageGetUrl } = data.data;
        callback([imageGetUrl, imagePath, imageId]);
      } else {
      }
    } catch (e: unknown) {
      callback(["", "", ""], e);
    }
  }

  return data;
};

const UploadImageAI = (
  file: File,
  callback: (r: [string, string], e?: unknown) => void,
  type: UploadType
): Promise<{ r: [string, string]; e?: unknown } | false> => {
  const response_saveUrl = _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/images/save-url`,
    true,
    {
      body: JSON.stringify({
        imageUsagePurpose: type,
        fileName: name,
      }),
    }
  );

  return false;
};

export default UploadImage;
