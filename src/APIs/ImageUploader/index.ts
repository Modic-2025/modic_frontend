const UploadImage = async (
  file: File,
  callback: (r: [string, string], e?) => {}
) => {
  const { name } = file;
  // const formData = new FormData();
  // formData.append("imageUsagePurpose", "PROFILE");
  // formData.append("fileName", file);

  const res_save_url = await fetch(
    `http://13.124.44.90:8080/api/posts/images/save-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON 전송 시 필수
      },
      body: JSON.stringify({
        imageUsagePurpose: "PROFILE",
        fileName: name,
      }),
    }
  );

  if (!res_save_url.ok) {
    return false;
  }

  const data = await res_save_url.json();
  console.log("data :>> ", data);
  const { imagePath, imageSaveUrl } = data.data;

  const res_put_image = await fetch(imageSaveUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  console.log("res_put_image :>> ", res_put_image);

  // callback API
  if (!res_put_image.ok) {
    console.error("Error on callback API");
    return false;
  }
  const res_callback = await fetch(
    `http://13.124.44.90:8080/api/posts/images/save-url/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON 전송 시 필수
      },
      body: JSON.stringify({
        fileName: name,
        imagePath: imagePath,
        imageUsagePurpose: "PROFILE",
      }),
    }
  );
  console.log("res_callback :>> ", res_callback);
  if (res_callback.ok) {
    const data = await res_callback.json();
    const { imageId } = data.data;
    const res_img_url = await fetch(
      `http://13.124.44.90:8080/api/posts/images/${imageId}/get-url`
    );
    if (res_img_url.ok) {
      const data = await res_img_url.json();
      const { imageGetUrl } = data.data;
      callback([imageGetUrl, imageId]);
    } else {
      callback("", "error");
    }
  }

  return data;
};

export default UploadImage;
