import _fetch from "@/APIs/fetcher/ClientSide";

const ALERT_400 =
  "이미 삭제된 게시물이거나, 오류가 발생했습니다.\n 잠시 후 다시 시도해주세요.";
const ALERT_403 = "이 그림체에 대해 삭제할 수 있는 권한이 없습니다.";
const ALERT_404 = "삭제하려는 게시물을 찾을 수 없습니다.";

// return type
// false: success, true: fail
const DeleteArt = async (artId: number) => {
  const response = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${artId}`,
    true,
    {
      method: "DELETE",
    }
  );
  const { status } = response;
  // Success with no-contents
  if (status === 204) return false;

  const _response = await response.json();
  const _status = _response.status;
  switch (_status) {
    case 400:
      alert(ALERT_400);
      return true;
    case 403:
      alert(ALERT_403);
      return true;
    case 404:
      alert(ALERT_404);
      return true;
  }
  return false;
};

export default DeleteArt;
