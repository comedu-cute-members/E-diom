"use client";

import Navigation from "../../components/navigation";
import Study from "../../components/study";
import { useState } from "react";

export default function Conversation() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-cyan-500 to-blue-300">
      <Navigation />
      <div className="h-[calc(100vh-65px)]">
        <Study maxTest={3}/>
      </div>
    </div>
  );
}
