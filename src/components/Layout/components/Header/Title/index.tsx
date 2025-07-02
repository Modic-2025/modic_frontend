"use client";
import { getUser } from "@/APIs/UserAPI";
import { User } from "@/types/User";
import { useEffect, useState } from "react";

const Title = ({ specificValue }: { specificValue?: string }) => {
  const [title, setTitle] = useState<string>(specificValue ?? "");
  const [userId, setUserId] = useState<string>(); // long -> string으로 관리
  const [user, setUser] = useState<User>();

  // 지정된 title이 없고, /users/[user_id] 일 때 수행
  useEffect(() => {
    const { pathname } = window.location;
    if (!specificValue || /^\/users\/(\d+)/.test(window.location.pathname)) {
      const match = pathname.match(/^\/users\/(\d+)/);
      if (!match) {
        // ERROR REPORT 필요
        window.alert("프로필을 조회하는 도중 에러가 발생하였습니다.");
        return;
      }
      setUserId(match[1] ?? undefined); // ERROR REPORT 필요
    }
  }, []);

  // userId가 set되면, fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const _user = await getUser(userId);
      if (_user) {
        setUser(_user);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    setTitle(user?.nickname ?? specificValue ?? "");
  }, [user]);

  return (
    <div className="w-full text-center">
      <h1 className="text-lg font-bold text-center">{title}</h1>
    </div>
  );
};

export default Title;
