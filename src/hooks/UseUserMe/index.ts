import useSWR from "swr";

const useUserMe = (token: string) => {
  return useSWR(
    ["http://api.modic.kr:8080/api/users/me", token],
    (url: string, token: string) => {
      console.log("token :>> ", token);
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    }
  );
};

export default useUserMe;
