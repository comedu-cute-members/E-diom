"use client";

import Navigation from "../../components/navigation";
import Study from "../../components/study";
import { useState } from "react";

export default function Conversation() {
  return (
    <div className="flex flex-col">
      <Navigation />
      <div className="h-[calc(100vh-65px)]">
        <Study />
      </div>
    </div>
  );
}
