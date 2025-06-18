import ContentViewer from "@/components/ContentViewer";
import MasterLayout from "@/Layouts/MasterLayout";
import UserHeader from "../UserHeader";

const Page = async ({ params }: { params: Promise<{ user_id: number }> }) => {
  const { user_id } = await params;
  console.log("user_id :>> ", user_id);
  const res = await fetch(
    `${process.env.API_HOST}/api/profiles?userId=${user_id}`,
    { method: "GET" }
  );
  console.log("res :>> ", res);
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch user info");
  }
  const custom_response = await res.json();
  console.log("custom_response :>> ", custom_response);
  if (!custom_response.isSuccess) {
    return <p> failed to load user {user_id}</p>;
  }
  const user = custom_response.data;
  console.log("user :>> ", user);
  return (
    <MasterLayout option={{ title: user.nickname }}>
      <UserHeader user={user} />
      <section>
        <ContentViewer grid={2} />
      </section>
    </MasterLayout>
  );
};

export default Page;
