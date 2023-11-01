import Quiz from "@/components/Quiz/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="w-screen h-full" style={{ overflowY: 'auto', overflowX: 'auto' }}>
    <Avatar className="flex justify-end items-center mt-12 float-right">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <h1 className="text-4xl text-yellow-600 font-medium flex justify-center items-center mt-12 uppercase">
      Quiz APP
    </h1>
    <Quiz />
  </div>  
  );
}
