"use client";
import ChatBot from "@/components/ChatBot";
import LanguageProvider from "@/components/LanguageProvider";

export default function SiteProviders({children}:{children:React.ReactNode}){
  return <LanguageProvider>{children}<ChatBot/></LanguageProvider>;
}
