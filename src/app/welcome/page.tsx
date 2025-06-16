// app/welcome/page.tsx

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">환영합니다 🎉</h1>
      <p className="text-lg">구글 로그인에 성공했습니다.</p>
    </div>
  );
}
